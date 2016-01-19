function Animation( data )
{

	// strict mode module
	"use strict"


	var 
	frames = [],
	frameSpeeds = [],
	duration = 0,
	reverse = false;


	this.__proto__ = {

		constructor: Animation,

		cycle: function(){}

	};

}


var testAnimationData = {

	name: "testanim1",
	duration: 800,
	frames:
	[
		{
			asset: "",
			duration: 200
		},
		{
			asset: "",
			duration: 100
		},
		{
			asset: "",
			duration: 300
		},
		{
			asset: "",
			duration: 200
		}
	]

};