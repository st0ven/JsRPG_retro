
// Main init IIFE
( function init()
{


	// enable strict mode
	"use strict";


	// run requirejs config and import IIFE
	( function requireInit()
	{


		// requirejs config setup with path definitions and base url
		requirejs.config(
			{

				baseUrl: "js",
				paths: 
				{
					modules: "module",
					options: "options",
					dictionary: "dict"
				}

			} );

		// integrate required scripts
		requirejs( 
			[
				//
				"utils",
				// dictionaries
				"dictionary/assets",
				"dictionary/areas",
				// options in object form
				"options/gameopts",
				"options/tileopts",
				// modules
				"module/animation",
				"module/canvas",
				"module/sprite",
				"module/mathext",
				"module/map",
				"module/loader",
				// main script components
				"game",
			], 
			importComplete );

	}() );


	// post script load callback
	function importComplete()
	{

		if( document.readyState === "complete" )
		{
			DOMReady();
		} 
		else 
		{
			Window.addEventListener( "load", DOMReady );
		}

	}


	// page has loaded
	function DOMReady()
	{

		// new game instance
		var RPG = new Game();

		// set game canvas element reference to our main canvas on page
		RPG.canvas.setCanvasEl( 
			document.querySelector( "canvas" ) );

		// set the canvas size according to our game window options
		RPG.canvas.resize( 
			GAME_OPTIONS.window.width, 
			GAME_OPTIONS.window.height );


		RPG.maps.set( "testMap" );

		/*AssetManager.importFromGroup(
			[
				{
					class: "sprite",
					name: "mech"
				},
				{
					class: "sprite",
					name: "imp"
				}
			],
			function( progress, total )
			{
				console.log( total );
			},
			function( collection, e )
			{
				console.log( e );
			} );*/

	}


}() );