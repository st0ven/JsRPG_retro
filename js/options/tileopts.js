/**
  *
  * Tile options
  *
  * -----------------------
  *
  * Defines basic types of tiles and properties that may be associated with that type
  *
  * -----------------------
  *
  * JsRPG - 2016
  *
  */

var TILE_OPTIONS = {

	dimensions: {

		width: 16,
		height: 16

	},

	types: 
	{
		empty:
		{
			color: "black",
			flags:
			{
				collide: false
			},
			src: ""
		},
		floor: 
		{
			color: "#ccc",
			flags: 
			{
				collide: false
			},
			src: ""
		},
		wall:
		{
			color: "#666",
			flags:
			{
				collide: true
			},
			src: ""
		},

	}

}