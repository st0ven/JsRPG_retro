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

function Map()
{



}


function Room()
{

	var tileData = [];

	this.dimensions = {

		width: MathExt.randomBetween( [ 6, 20 ] ),
		height: MathExt.randomBetween( [ 4, 12 ])

	};

	this.__proto__ = {

		constructor: Room,

		generate: function()
		{

		}

	}

}


function Tile( type ){

	var img = null;

	this.flags = {};

	this.properties = {

		color: 'black'

	};

	this.type = "";

	this.__proto__ = {

		constructor: Tile,

		create: function( type, callback ){

			// reference to tile options
			var options = TILE_OPTIONS.types[ type ];

			// set tile properties
			this.type = type;
			this.flags.visible = true;
			this.flags.collide = options.flags.collide;
			this.properties.color = options.color;

			// create our binary data for the image associated with this tile
			img = new Image();
			img.width = this.dimensions.width;
			img.height = this.dimensions.height;

			// branch depending on whether an src is explicitly defined
			// note this should change to a much more complex scheme later
			// where tilesets are pre-loaded and chunks of those tilesets are cached and
			// utilized as tile image data
			if( options.src )
			{
				img.addEventListener( 
					"load", 
					( callback || function(){} ).bind( this ) );

				img.src = options.src;
			}
			else
			{
				img.style.backgroundColor = this.properties.color;
				( callback || function(){} ).call( this );
			}

		},

		dimensions: TILE_OPTIONS.dimensions

	};

	if( type )
	{
		this.create( type );
	}

}