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
	levels = [],
	tilesets = [];


	this.__proto__ = {

		load: function( mapName )
		{

			var 
			assetCollection = [],
			data = MapDict[ mapName ];


			// is our mapName a valid definition in dictionary?
			try
			{

				_importAssets(
					function( textureArray )
					{

						textureArray.forEach(
							function( texture )
							{
								var tileset = new Tileset();
								    tileset.populate( texture );

								tilesets.push( tileset );

							} );

						data.levels.forEach( 
							function( levelData )
							{

								levels.push( new Level( levelData ) );

							}.bind( this ) ); console.log( tilesets );

					}.bind( this ) );

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

				// collect textures into asset collection
				data.textures.forEach(
					function( assetName )
					{

						assetCollection.push( { class: "texture", name: assetName } );

					} );

				// load sprites into asset collection
				data.sprites.forEach(
					function( assetName )
					{

						assetCollection.push( { class: "sprite", name: assetName } );

					} );

				// load the group of assets
				AssetManager.importFromGroup( 
					assetCollection, 
					null, 
					callback );

			}

		},

	};

}


function Level( data )
{

	// 2d array?
	var 
	areas = [],
	dimensions = {};


	Object.keys( data ).forEach( 
		function( key )
		{
			var area = new Area( data[ key ] );
			    area.name = key;

			areas.push( area );

		}.bind( this ) );


	this.__proto__ = {

		get areas() { return areas; }

	}

}


function Area( data )
{

	var 
	entities = data.entities,
	layers = data.layers;
	

	this.__proto__ = {

		get layers() { return layers; },

		generate: function()
		{

		},

		load: function( name )
		{



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
