/**
  *
  * Map module
  *
  * -----------------------
  *
  * The map module stores information defining a connection of Room objects
  * meshed together to comprise a larger explorable area.
  * Maps can have multiple Levels which denote separate areas within a map
  *
  * -----------------------
  *
  * JsRPG - 2016
  *
  */

function Map( )
{

	var
	stage = new Canvas(),
	currentArea = null,
	levels = [],
	textures = [],
	tilesetDict = {};


	stage.resize(
		GAME_OPTIONS.window.width,
		GAME_OPTIONS.window.height );


	this.__proto__ = {

		get stage() { return stage; },

		load: function( mapName, callback )
		{

			var 
			assetCollection = [],
			data = MapDict[ mapName ];


			try
			{

				// import all assets associated with this map
				// as defined within the MapDict data
				_importAssets(
					_importComplete.bind( this ) );

			}
			// error thrown: likely invalid map reference
			catch( e )
			{

				console.log( "Map load error: " + e );

			}


			// import function
			// collects all sprite and texture aliases and
			// uses AssetManager to import the combined collection of
			// asset names based on the type of asset
			function _importAssets( callback )
			{

				// iterate through assets property to collect all resources
				Object.keys( data.assets ).forEach(
					_iterateResources );


				// load the group of assets
				AssetManager.import( 
					assetCollection, 
					null, 
					callback );


				// iterate through the resources of an asset type
				// push the lookup information to the asset collection
				function _iterateResources( assetType )
				{
					data.assets[ assetType ].forEach(
						_addToCollection.bind(
							this,
							assetType ) );
				}

				// helper function
				// pushes an asset object to collection to import
				function _addToCollection( assetType, assetID )
				{ 
					assetCollection.push( 
						{ 
							class: assetType,
							name: assetID 
						} );
				}

			}


			// import complete handler populates key Map collections
			// with the texture instance collection information
			function _importComplete( textureCollection )
			{

				// create tilesets from textures
				textureCollection.forEach(

					function( texture )
					{

						switch( texture.class )
						{

							// create tileset collection from terrain textures
							case "terrain":

								var tileset = new Tileset();

								tileset.populate( texture );

								tilesetDict[ texture.group ] = tileset;

								break;

						}

						textures = textureCollection;

					} );


				// populate levels selection from the data
				data.levels.forEach( 

					function( levelData )
					{

						levels.push( new Level( levelData ) );

					}.bind( this ) );


				// trigger callback
				callback.call( this );

			}

		},

		areas:
		{
 
 			get current() { return currentArea; },

			// finds an area given a specific search query
			// returns a matched instance of an area if query 
			// matches the instance found or matches the name property of the instance
			find: function( query )
			{

				// set reference to possible matched query
				var matchedQuery = null;

				// iterate through levels
				this._iterateAll( queryMatch );

				// return result
				return matchedQuery;


				// perform query on an area
				function queryMatch( area )
				{

					// perform query comparison
					if( area === query ||
					    area.name === query ){

						// match
						matchedQuery = area;

						// break loop
						return true;

					}

				}

			},

			// iterates through all areas on all levels
			_iterateAll: function( callback )
			{
				// iterate through all levels
				levels.some( 
					function iterateAreas( level )
					{
						// iterate through all areas with provided callback
						return level.areas.some( callback );
					} );

			},

			// activates an area within the Map.
			set: function( areaName )
			{

				// find the area instance and keep reference to it
				currentArea = this.find( areaName );

				// if reference exists, prepare the area
				if( currentArea )
				{

					renderBackdrop();

					currentArea.iterate( renderTiles );

				}
				// otherwise, no area was found, throw a warning to the console
				else
				{

					console.log( "failed to load map \"" + areaName + "\": no area by that name found in map" );

				}


				function renderBackdrop()
				{

					stage.context.fillStyle = currentArea.backdrop || "black";

					stage.context.fillRect( 
						0,
						0,
						GAME_OPTIONS.window.width,
						GAME_OPTIONS.window.height );

				}

				function renderTiles( tileinfo, layer, index )
				{

					var 
					data = tileinfo.split( "," ),
					def = data[ 0 ].split( ":"),
					alias = def[ 0 ],
					tileindex = def[ 1 ],
					height = data[ 1 ],
					tileset = tilesetDict[ currentArea.aliases[ alias ] ];


					if( tileset )
					{
						
						var
						texture = tileset.texture,
						tile = tileset.tiles[ tileindex ],
						width = tile.dimensions.width,
						height = tile.dimensions.height,
						oX = tile.col * width,
						oY = tile.row * height,
						dX = index % layer.cols * width,
						dY = Math.floor( index / layer.rows ) * width;

						stage.context.drawImage(
							texture.img,
							oX,
							oY,
							width,
							height,
							dX,
							dY,
							width,
							height );


					}

				}

			}

		}

	};

}


// Level Object
// A level stores a collection of areas that are on the same
// 'floor' within a Map location
function Level( data )
{

	// 2d array?
	var 
	areas = [],
	dimensions = {};


	// populate the area collection from the level data
	Object.keys( data ).forEach( 

		function( key )
		{
			var area = new Area();
			
			area.name = key;

			Utils.mixin( 
				area, 
				data[ key ] );

			areas.push( area );

		}.bind( this ) );


	// define prototype
	this.__proto__ = {

		get areas() { return areas; }

	}

}


function Area()
{

	this.aliases;
	this.entities;
	this.layers;

	
	var _iterateLayerData = function( callback )
	{

		this.layers.forEach( 

			function( layer )
			{

				layer.tiles.forEach( 

					function( tiledata, index )
					{

						tiledata.forEach(

							function( tileinfo, index )
							{

								callback( tileinfo, layer, index );

							}.bind( this ) );

					}.bind( this ) );

			}.bind( this ) );

	}.bind( this );

	this.__proto__ = {

		iterate: _iterateLayerData,

		generate: function()
		{

		},

		prepare: function()
		{

			_iterateLayerData();

		}

	}

}




function Tileset()
{

	this.name;

	this.texture = null;

	this.tiles = [];

	this.__proto__ = {

		populate: function( texture )
		{

			var 
			// determine dimensions and index calculations
			tilewidth = Tile.prototype.dimensions.width,
			tileheight = Tile.prototype.dimensions.height,
			texturewidth = texture.img.width,
			textureheight = texture.img.height,
			cols = Math.floor( texturewidth / tilewidth ),
			rows = Math.floor( textureheight/ tileheight );

			// store reference to the texture;
			this.texture = texture;

			// reference to texture name
			this.name = texture.name;

			// iterate through columns
			for( var i = 0; i < rows; i ++ )
			{

				// iterate through rows
				for( var j = 0; j < cols; j++ )
				{

					// create new tile instance and set properties
					var newTile = new Tile();

					newTile.row = i;

					newTile.col = j;

					newTile.index = i * cols + j;

					// add tile instance to the tile collection
					this.tiles.push( newTile );

				}

			}

		},

	};

}


var Tile = function( type )
{

	this.flags = {};
	this.row;
	this.col;
	this.index;

}; 
Tile.prototype = {

	dimensions: TILE_OPTIONS.dimensions

};
