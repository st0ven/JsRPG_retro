/**
  *
  * JsRPG canvas script object
  *
  */

function Canvas( el, width, height )
{

	// object private variables
	var 
	canvas,
	context,
	pixelRatio,
	defaultWidth = 480,
	defaultHeight = 320;


	// prototype methods
	this.__proto__ = {

		get el() { return canvas; },
		get context() { return context; },
		get pixelRatio() { return pixelRatio; },

		constructor: Canvas,

		// clear the canvas entirely
		clear: function()
		{

			context.clearRect( 
				0, 
				0, 
				canvas.width, 
				canvas.height );

		},

		resize: function( width, height )
		{

			// normalize the width/height arguments to a valid value
			width = width || defaultWidth;
			height = height || defaultHeight;

			// calculate the dimensions and styling of canvas element
			canvas.width = width * pixelRatio;
			canvas.height = height * pixelRatio;
			canvas.style.width = width + "px";
			canvas.style.height = height + "px";

		},

		renderFPS: function( value )
		{

			this.context.fillStyle = "black";

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

		setCanvasEl: function( el )
		{

			canvas = el instanceof Node ? el : document.querySelector( el ) || document.createElement( "canvas" );
			context = canvas.getContext( "2d" );
			pixelRatio = window.devicePixelRatio || 1 * context.webkitBackingStorePixelRatio || 1;

		}

	};


	// link the canvas/context vars
	this.setCanvasEl( el );


	// set the new canvas size 
	this.resize( width, height );


};