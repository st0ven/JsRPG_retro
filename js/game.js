function Game()
{

	// enable strict mode
	"use strict";


	var self = this,
	    raf = requestAnimationFrame ||
		  webkitRequestAnimationFrame ||
		  mozRequestAnimationFrame || 
		  msRequestAnimationFrame || null;


	this.canvas = new Canvas();


	this.loop = new function()
	{

		// boolean pause flag
		var pause = false,
		// timing properties
		    timing = {

			start: Date.now(),
			latest: Date.now(),
			tick: 0

		    },
		// define main game loop
		    GameLoop = function()
		    {

			// calculate timing of current loop
			timing.tick = Date.now() - timing.latest;
			timing.latest = Date.now();

			this.logic();

			this.render();

			// iterate loop if no pause state
			if( !pause )
			{
				
				raf( GameLoop.bind( this ) );

			}

		    }.bind( this );


		this.logic = function(){

			// draw FPS on canvs ( temporary code placement )
			self.canvas.clear();
			self.canvas.context.fillStyle = "black";
			self.canvas.context.font = 10 * self.canvas.pixelRatio + "px sans-serif";
			self.canvas.context.fillText( 
				this.fps(), 
				5 * self.canvas.pixelRatio, 
				15 * self.canvas.pixelRatio );

		}.bind( this );


		this.render = function(){};


		// prototype methods
		this.__proto__ = {

			begin: GameLoop,

			fps: function()
			{ 
				return Math.round( 1 / ( this.timing.tick / 1000 ) ); 
			},

			pause: function()
			{ 
				pause = true; 
			},

			resume: function()
			{ 
				pause = false; 
			},

			timing: timing

		};


	};


	// game prototype methods
	this.__proto__ = {

		constructor: Game

	};

}