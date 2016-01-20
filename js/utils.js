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


		// continue if browser supports async object
		try
		{

			// open the request
			xhr.open( "GET", sourceUrl, true );


			// set the expected response type or default to text
			xhr.responseType = options.responseType || "text";


			// add progress listener
			xhr.addEventListener( 
				"progress",
				options.onprogress );


			// add complete listener
			xhr.addEventListener(
				"readystatechange",
				options.onreadystatechange );


			// send request
			xhr.send();

		}
		catch( e )
		{

			console.log( "async request failed:", e );

		}

	},


	// converts a blob type to a usable image instance using FileReader
	convertBlobToImage: function( blob, callback ){

		// Read in our blob as a data URL
		// attach handler for load complete
		( function _convert()
		{

			// create FileReader instance
			var reader = new FileReader();


			// add a listener for load complete event
			reader.addEventListener( 
				"load",
				_loadComplete.bind( reader ) );


			// convert the blob to data URL
			reader.readAsDataURL( blob );

		}() );

		// post load handler
		function _loadComplete( e ) 
		{
			
			// create image instance	
			var img = new Image();


			// add a listener to trigger callback when load is complete
			img.addEventListener( 
				"load",
				( callback || function(){} ).bind( 
					this, 
					img, 
					e ) );


			// set the source property to our data URL
			img.src = this.result;

		}

	},


	// copies the properties of one object to another
	// returns a reference to the updated object
	mixin: function( toObj, fromObj, deepCopy )
	{

		Object.getOwnPropertyNames( fromObj ).forEach( 
			function( property )
			{

				toObj[ property ] = fromObj[ property ];

				if( deepCopy )
				{

					toObj[ property ] = this.mixin( 
						toObj[ property ], 
						fromObj[ property ] );

				}

			}.bind( this ) );

		return toObj;

	}

};