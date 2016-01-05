var AssetManager = new function(){


        // import a collection of textures from an assetList array
        // triggers a callback supplied as an optional argument
        // upon load success of all textures
        // TODO: build in a timeout feature
        function importAssets( assetList, progressReport, callback )
        {

                var collection = [],
                    loadCount = 0,
                    maxWait = 30000,
                    startTime = Date.now();

                // iterate through assetList
                ( assetList || [] ).forEach( 
                        function( sourceUrl )
                        {

                                // push new texture instance to the collection
                                var newTexture = collection[ 
                                        collection.push( 
                                                new Texture() ) - 1 ];

                                // load the texture from item's source url
                                newTexture.load( sourceUrl, progressReport, loadSuccess );

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

        this.__proto__ = {

                constructor: AssetLoader,

                importFrom: function( assetInstance, progressCallback, completeCallback )
                {

                        var group = assetInstance.class,
                            name = assetInstance.name,
                            list = AssetDict[ group ][ name ].assets;

                        importAssets( 
                                list, 
                                progressCallback,
                                completeCallback );

                },

                importFromGroup: function( assetGroup, progressCallback, completeCallback )
                {

                        var progress,
                            total = 0,
                            initiated = [];


                        Array.prototype.slice( assetGroup ).forEach(
                                function( asset )
                                {

                                        this.importFrom( asset, checkProgress, completeCallback )

                                }.bind( this ) );


                        function checkProgress( texture, e ){

                                progress = 0;

                                if( initiated.contains( texture ) )
                                {
                                        texture.loaded = e.loaded || 0;
                                }
                                else
                                {
                                        initiated.push( texture );
                                        total += e.total || 0;
                                }

                                if( total )
                                {       
                                        progress = 0;

                                        initiated.forEach( 
                                                function( item )
                                                {

                                                        progress += item.loaded;

                                                } );
                                }

                                progressCallback( progress, total );

                        }

                }

        };

};


function Texture( sourceUrl )
{

        // reference to the texture's image
        var img = null,
            source = "";


        this.__proto__ = {

                // getters
                get img() { return img; },
                get source() { return source; },

                // constructor reference
                constructor: Texture,

                // loads a texture from a specified url
                // applies state-based callbacks optionally
                load: function( sourceUrl, progressCallback, completeCallback )
                {

                        // create new image instance
                        img = new Image();
                        

                        // add progress event listener
                        img.addEventListener(
                                "progress",
                                reportProgress.bind( this ) );


                        // add load complete event listener
                        img.addEventListener( 
                                "load", 
                                callback.bind( this ) );


                        // set a reference to the source url to begin the asset load
                        img.src = sourceUrl;


                        // updates the progress and triggers a progressCallback to handle additional tasks
                        function reportProgress( e )
                        {

                                if( e.lengthComputable )
                                {

                                        // callback trigger with progress arguments
                                        ( progressCallback || function(){} )(
                                                this, 
                                                e );
                               
                                }
                                else
                                {
                                        // progress is not reportable, remove the listener
                                        img.removeEventListener( "progress" );

                                        // report back with unknown progress
                                        ( progressCallback || function(){} )( 
                                                this,
                                                null );
                              
                                }

                        }


                        // called when the load is complete, triggers a completion callback
                        function complete()
                        {

                                completeCallback.call( this );

                        }

                }

        };

}