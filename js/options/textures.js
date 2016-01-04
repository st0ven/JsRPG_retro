/**
  *
  * Texture definitions
  *
  * -----------------------
  *
  * Define a series of textures to import and any properties associated with them
  *
  * -----------------------
  *
  * JsRPG - 2016
  *
  */

var TEXTURES = {

        testset1:{

                source: "",
                type: ""
        
        },

};

var TextureLoader = new function(){


        this.__proto__ = {

                constructor: TextureLoader,

                // import a collection of textures from an assetList array
                // triggers a callback supplied as an optional argument
                // upon load success of all textures
                // TODO: build in a timeout feature
                import: function( assetList, callback )
                {
                        
                        var collection = [],
                            loadCount = 0,
                            maxWait = 30000,
                            startTime = Date.now();

                        // iterate through assetList
                        ( assetList || [] ).forEach( 
                                function( textureID )
                                {

                                        // reference to texture lookup of the item name
                                        var item = TEXTURES[ textureID ] || null;

                                        if( item )
                                        {

                                                // push new texture instance to the collection
                                                var newTexture = collection[ 
                                                        collection.push( 
                                                                new Texture() ) - 1 ];

                                                // load the texture from item's source url
                                                newTexture.load( item.source, loadSuccess );

                                        }

                                } );

                        // increments load count and triggers import callback upon
                        // successful load of all textures in the list
                        function loadSuccess()
                        {
                                if( ++loadCount >= assetList.length )
                                {
                                        ( callback || function(){} ).call( this, collection );
                                }

                        }

                }

        };

};


function Texture( sourceUrl )
{
        var img;

        this.__proto__ = {

                constructor: Texture,

                load: function( sourceUrl, callback )
                {

                        img = new Image();
                        
                        img.addEventListener( 
                                "load", 
                                callback );

                        img.src = sourceUrl;

                }

        };

}