/**
  *
  * Extended Math
  *
  * -----------------------
  *
  * Instead of overloading Math object, copies properties of Math into a new object instance
  * Extends support for more specific functions within its prototype
  *
  * -----------------------
  *
  * JsRPG - 2016
  *
  */

var MathExt = new function()
{

	// Math keys are not traversable, this allows us to copy our math functions
	// without having to overload the original object
	Utils.mixin( this, Math );

	// Extended prototype methods
	this.__proto__ = {

		constructor: MathExt,

		// return a random integer between 0 and range
		// range indicates an array of 2 Number values
		// which denote the bounds of the random number generation
		// returns an integer within the range
		randomBetween: function( range ){

			if( range instanceof Array &&
			    range.length > 1 )
			{

				var min = range[ 0 ] || 0,
				    max = range[ 1 ]

				return this.floor( ( max + 1 ) * this.random() ) + min;

			}

		}

	};

}
