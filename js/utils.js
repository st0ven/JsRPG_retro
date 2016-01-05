var Utils = {

	// load content asynchronously
	// requires a sourceUrl argument
	// set additional options for specific request parameters
	// including responseType and progress/complete callbacks
	asyncLoad: function( sourceUrl, options )
	{

		// create a new request object
		var xhr = XMLHttpRequest ? 
			new XMLHttpRequest():
			null;

		// make sure options references an object
		options = options || {};


		// continue if browser supports
		if( xhr ){

			xhr.open( "GET", sourceUrl, true );

			xhr.responseType = options.responseType || "text";

			xhr.addEventListener( 
				"progress",
				options.onprogress );

			xhr.addEventListener(
				"readystatechange",
				options.onreadystatechange );

			xhr.send();

		}
		else
		{
			console.log( "This browser does not support XHMLHttpRequest object: async request unavailable for " + sourceUrl );
		}

	},

	convertBlobToImage: function( blob, callback ){

		var reader = new FileReader();

		reader.addEventListener( 
			"load",
			convert );

		reader.readAsDataURL( blob );


		function convert( e ) 
		{
			
			var img = new Image();

			img.addEventListener( 
				"load",
				( callback || function(){} ).bind( this, img, e ) );

			img.src = reader.result;

		}

	},

	// copies the properties of one object to another
	// returns a reference to the updated object
	mixin: function( toObj, fromObj )
	{

		Object.getOwnPropertyNames( fromObj ).forEach( 
			function( property )
			{

				toObj[ property ] = fromObj[ property ];

			}.bind( this ) );

		return toObj;

	}

};