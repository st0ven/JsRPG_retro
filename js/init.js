
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
					options: "options"
				}

			} 
		);

		// integrate required scripts
		requirejs( 
			[
				// main script components
				"game",
				"utils",
				// modules
				"module/animation",
				"module/canvas",
				"module/sprite",
				"module/mathext",
				"module/map",
				// options in object form
				"options/gameopts",
				"options/tileopts"
			], 
			importComplete 
		);


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

		var RPG = new Game();

		RPG.canvas.setCanvasEl( 
			document.querySelector( "canvas" ) );

		RPG.canvas.resize( 
			GAME_OPTIONS.window.width, 
			GAME_OPTIONS.window.height );

		RPG.loop.begin(); 

	}


}() );