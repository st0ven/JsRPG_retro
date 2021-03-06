/**
  *
  * JsRPG canvas script object
  *
  */

function Canvas( el, width, height )
{

	// strict mode
	"use strict";


	// object private variables
	var 
	canvas,
	context,
	pixelRatio,
	defaultWidth = 480,
	defaultHeight = 320;


	// prototype methods
	this.__proto__ = {

		// getters
		get el() { return canvas; },
		get context() { return context; },
		get pixelRatio() { return pixelRatio; },

		// clear the canvas entirely
		clear: function()
		{

			context.clearRect( 
				0, 
				0, 
				canvas.width, 
				canvas.height );

		},

		// resize the canvas element given optional arguments
		resize: function( width, height, scale )
		{

			// normalize the width/height arguments to a valid value
			width = width || defaultWidth;
			height = height || defaultHeight;
			scale = scale || 1;

			// calculate the dimensions and styling of canvas element
			canvas.width = width * pixelRatio * scale;
			canvas.height = height * pixelRatio * scale;
			canvas.style.width = width * scale + "px";
			canvas.style.height = height * scale + "px";

		},

		// render the fps value on the top/left hand corner of screen
		renderFPS: function( value )
		{

			this.context.fillStyle = "white";

			this.context.font = 10 * pixelRatio + "px sans-serif";
			
			this.context.fillText( 
				"fps: " + value, 
				5 * pixelRatio, 
				15 * pixelRatio );

		},

		screenCapture: function()
		{

			return context.getImageData( 
				0, 
				0, 
				canvas.width, 
				canvas.height );

		},

		// target the canvas element to be a specific reference to a node
		setCanvasEl: function( el )
		{

			canvas = el instanceof Node ? 
				el: 
				document.querySelector( el ) || 
				document.createElement( "canvas" );

			context = canvas.getContext( "2d" );

			pixelRatio = window.devicePixelRatio || 1 * context.webkitBackingStorePixelRatio || 1;

		},

		// set context smoothing properties based on boolean value
		smooth: function( bool )
		{

			context.imageSmoothingEnabled = bool;
			context.webkitImageSmoothingEnabled = bool;
			context.mozImageSmoothingEnabled = bool;
			context.msImageSmoothingEnabled = bool;

		}

	};


	// link the canvas/context vars
	this.setCanvasEl( el );


	// set the new canvas size 
	this.resize( width, height );


}