function Game()
{

	// enable strict mode
	"use strict";


	var
	end = false, 
	game = this,
	raf = requestAnimationFrame ||
	      webkitRequestAnimationFrame ||
	      mozRequestAnimationFrame || 
	      msRequestAnimationFrame || null;


	// reference to the game canvas
	this.canvas = new Canvas();


	// current map ref?
	this.currentMap = null;


	// game clock object
	// stores timing objects for cycles and frames individually
	// has methods for animating and clocking against current times
	this.clock = new function()
	{

		// private
		var gamestart = Date.now();


		// properties
		this.cycles = new Timing();

		this.frames = new Timing();


		// Timing constructor
		function Timing()
		{
			
			var 
			last = 0,
			tick = 0;

			// prototype definition
			this.__proto__ = {

				// getters
				get last(){ return last; },

				get tick(){ return tick; },

				get fps()
				{
					return Math.round( 1 / ( ( tick || 10 ) / 1000 ) );
				},

				// update the tick and last frame calculations
				update: function()
				{

					tick = Date.now() - last;
					
					last = Date.now();

				}

			}

		}


		// prototype definition
		this.__proto__ = {

			// over a given duration, execute a loop callback with argument 0 < t < 1
			// when time exceeds duration, endCallback is fired with t = 1 argument
			animation: function( duration, loopCallback, endCallback )
			{

				var 
				begin = Date.now(),
				t = function()
				{ 

				    	return ( this.timing.latest - begin ) / duration;

				}.bind( this );


				( function timeloop()
				{

					if( t() < 1 )
					{
						( loopCallback || function(){} ).call( this, t() );

						raf( timeloop );
					}
					else
					{
						( endCallback || function(){} ).call( this, 1 )
					}

				}() );

			}, 

			delayTime: function( duration, callback )
			{

				var begin = Date.now();

				setTimeout( duration, callback );

			}

		}

	};


	var gameLoop = new function()
	{

		var
		// frames per second display value
		fps = 0,
		// fps update delay amount
		fpsdelay = 300,
		// boolean pause flag 
		pause = false,
		// set timeout for logic loop
		logicTimeout = setInterval(
			logicLoop,
			10 );

		renderLoop();
		// logic loop
		function logicLoop()
		{

			// game hasn't ended or been paused
			if( !end )
			{

				game.clock.cycles.update();

				
			}
			// end game - cease all logic loops
			else
			{

				clearTimeout( logicTimeout );

			}

		}


		// rendering loop
		function renderLoop()
		{

			// update the FPS
			game.clock.frames.update();

			// clear the canvas
			game.canvas.clear();

			// 
			renderStack( game.canvas.context )

			// delay fps value update
			Debug.render.fps.cycle( 
				fpsdelay,
				function()
				{
					fps = game.clock.frames.fps;
				} );

			// render fps
			game.canvas.renderFPS( fps );

			// continue loop
			raf( renderLoop.bind( game ) );


		}


		function renderStack( context )
		{

			if( game.maps && game.maps.current ){
 
				context.drawImage( game.maps.current.stage.canvas, 0, 0 );

			}

		}


		// define prototype methods
		this.__proto__ = {

			pause: function()
			{
				pause = true;
			},
			resume: function()
			{

			}

		};

	};


	this.maps = new function()
	{

		var current = null;


		this.__proto__ = {

			get current() { return current; },

			load: function( name, callback )
			{

				if( current )
				{

					// fade current map out

				}
				else
				{

					createNew();

				}

				function createNew()
				{

					current = new Map();

					current.load( 
						name, 
						callback.bind(
							game,
							current ) );

				}

			}

		};

	}


	this.__proto__ = {

		begin: function(){}

	}

}




var Debug = new function()
{

	var debug = this;


	this.render = {

		fps: new function()
		{

			var 
			cycleTimeout = null,
			fpsclear = true;


			this.__proto__ = {

				end: function()
				{

					clearTimeout( cycleTimeout );

					fpsclear = false;

				},

				cycle: function( duration, callback )
				{

					if( fpsclear )
					{

						fpsclear = false;

						cycleTimeout = setTimeout(
							function()
							{

								callback();

								this.reset();

							}.bind( this ),
							duration );

					}

				},

				reset: function()
				{

					fpsclear = true;

				}

			}

		}

	}

}