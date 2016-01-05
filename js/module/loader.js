/**
  *
  * Asset management module
  *
  * -----------------------
  *
  * Manages loading assets from classes of objects which maintain properties
  * defining that objects 'class' and 'name'. References a global asset
  * dictionary definition to pull corresponding asset URLs and loads them asyncrhonously.
  * Supports progress and completion callbacks
  * Supports importing assets for a single object or an array of objects
  *
  * -----------------------
  *
  * JsRPG - 2016
  *
  * -----------------------
  * 
  * Dependencies:
  *     Utils.js
  */
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
                function loadSuccess( e, evt )
                {

                        if( ++loadCount >= assetList.length )
                        {

                                ( callback || function(){} ).call( this, collection, e, evt );

                        }

                }

        }

        // prototype methods and properties
        this.__proto__ = {

                // set constructor
                constructor: AssetManager,

                // import image assets for a specific object instance
                // trigger optional callbacks to report status and completion
                importFrom: function( instance, progressCallback, completeCallback )
                {

                        // get key names for AssetDict lookup
                        var group = instance.class,
                            name = instance.name,
                            list = AssetDict[ group ][ name ].assets.slice();


                        // modify urls to include class's base location from root
                        list.forEach( 
                                function( string, index ){
                                        list[ index ] = AssetDict[ group ].baseUrl.concat( string )
                                } );


                        // trigger asset import function with optional callbacks
                        importAssets( 
                                list, 
                                progressCallback,
                                completeCallback );

                },

                // import image assets for a group of object instances
                // trigger optional callbacks to report status and completion
                importFromGroup: function( group, progressCallback, completeCallback )
                {

                        // progress references
                        var progress,
                            total = 0,
                            initiated = [];


                        // assure assetGroup is an array, iterate through it
                        Array.prototype.slice.call( group ).forEach(
                                function( asset )
                                {

                                        // import from assets individually
                                        this.importFrom( asset, checkProgress, completeCallback )

                                }.bind( this ) );


                        // use a unique progressCallback method to check the groups progress
                        // which requires knowing the status of progression of all items in the group.
                        function checkProgress( texture, e ){

                                // reset progress to zero for the summation pass
                                progress = 0;

                                // this is the first report, add texture to initiated array and increment total size
                                if( !initiated.indexOf( texture ) >= 0 )
                                {
                                        initiated.push( texture );
                                        total += e.total || 0;
                                }

                                // set the textures load point if this texture has already reported once
                                texture.loaded = e.loaded || 0;

                                // if a total is reported, calculations are computable
                                if( total )
                                {       

                                        // iterate through each initiated item and sum the progress
                                        initiated.forEach( 
                                                function( item )
                                                {

                                                        progress += item.loaded;

                                                } );

                                }

                                // trigger progress callback
                                progressCallback( progress, total, e );

                        }

                }

        };

};



// Texture object 
// stores an image instance within the texture
// prototype provides interface to interact with texture 
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

                        // create new load request for the sourceUrl binary data
                        // include some options parameters with responseType and handlers
                        Utils.asyncLoad(
                                sourceUrl,
                                {
                                        responseType: "blob",
                                        onprogress: reportProgress.bind( this ),
                                        onreadystatechange: handleStateChange.bind( this )
                                } );


                        // handle readystatechange event from the async load request
                        function handleStateChange( e )
                        { 

                                // reference the original event target
                                var xhr = e.target;

                                // if our readystate has completed
                                if( xhr.readyState === 4 ){

                                        // convert our blob response to an image
                                        Utils.convertBlobToImage(
                                                xhr.response,
                                                function( image, evt )
                                                {

                                                        img = image;
                                                
                                                        complete.call( this, e, evt );

                                                }.bind( this ) );

                                }

                        }


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
                        function complete( xhrEvent, filereaderEvent )
                        {

                                completeCallback.call( this, xhrEvent, filereaderEvent );

                        }

                }

        };

}