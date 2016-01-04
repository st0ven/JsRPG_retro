var Utils = 
{
	
	mixin: function( toObj, fromObj )
	{

		Object.getOwnPropertyNames( fromObj ).forEach( 
			function( property )
			{

				toObj[ property ] = fromObj[ property ];

			}.bind( this ) );

	}

};