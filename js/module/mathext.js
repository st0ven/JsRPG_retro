//
function ExtendedMath()
{

	// Math keys are not traversable, this allows us to copy our math functions
	// without having to overload the original object
	Utils.mixin( this, Math );

	// Extended prototype methods
	this.__proto__ = {

		constructor: ExtendedMath,

		// return a random integer between 0 and range
		randomBetween: function( range ){

			return this.floor( ( range + 1 ) * this.random() );

		}

	};

}
