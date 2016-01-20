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
        function importAssets( lookup, progressReport, callback )
        {

                var 
                collection = [],
                loadCount = 0,
                maxWait = 30000,
                startTime = Date.now(),
                assetClass = AssetDict[ lookup.class ],
                assetList = assetClass[ lookup.name ].assets;


                // iterate through assetList
                Object.keys( assetList || {} ).forEach( _createTexture );
                

                // uses asset list key to create a new texture
                // adds texture to a texture collection
                // sets some properties to texture and triggers load method
                function _createTexture( key )
                {

                         // get full relative url to asset source url
                        var sourceUrl = assetClass.baseUrl + assetList[ key ],

                        // push new texture instance to the collection
                        newTexture = collection[ 
                                collection.push( 
                                        new Texture() ) - 1 ];

                        // set texture name
                        newTexture.id = key;

                        // set texture group to reflect asset group
                        newTexture.group = lookup.name;

                        // set the asset classType to the texture
                        newTexture.class = lookup.class;

                        // load the texture from item's source url
                        newTexture.load( sourceUrl, progressReport, _loadSuccess );

                }


                // increments load count and triggers import callback upon
                // successful load of all textures in the list
                function _loadSuccess( e, evt )
                {

                        if( ++loadCount >= Object.keys( assetList ).length )
                        {

                                ( callback || function(){} ).call( this, collection, e, evt );

                        }

                }

        }

        // prototype methods and properties
        this.__proto__ = {

                // set constructor
                constructor: AssetManager,


                // import image assets for a group of object instances
                // trigger optional callbacks to report status and completion
                import: function( group, progressCallback, completeCallback )
                {

                        // progress references
                        var 
                        progress,
                        total = 0,
                        assetCount = 0,
                        completed = 0,
                        initiated = [],
                        textures = [];


                        // normalize group to be of type array
                        group = group instanceof Array ?
                                group:
                                [ group ];


                        // assure assetGroup is an array, iterate through it
                        group.forEach(
                                function( assetDetails )
                                {
                                        // increment asset counter
                                        assetCount++;

                                        // import from assets individually
                                        importAssets( 
                                                assetDetails,
                                                _checkProgress,
                                                _checkComplete );

                                }.bind( this ) );


                        // use a unique progressCallback method to check the groups progress
                        // which requires knowing the status of progression of all items in the group.
                        function _checkProgress( texture, e ){

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
                                ( progressCallback || function(){} )( 
                                        progress, 
                                        total, 
                                        e );

                        }


                        // checks to see if all asset definitions within the group have been loaded
                        // triggers the completeCallback method to further handle the resulting texture collection
                        function _checkComplete( collection, e, evt )
                        { 

                                // append resulting texture collection
                                textures = Array.prototype.concat.call( 
                                        textures, 
                                        collection );


                                // test if all asset definitions are accounted for
                                if( ++completed >= assetCount )
                                {

                                        ( completeCallback || function(){} ).call( this, textures, e, evt );

                                }

                        }

                }

        };

};



// Texture object 
// stores an image instance within the texture
// prototype provides interface to interact with texture 
function Texture( sourceUrl )
{

        // private variables
        var 
        img = null,
        source = "";


        // define prototype
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

                                        // only proceed if there was a response
                                        if( xhr.response )
                                        {

                                                // convert our blob response to an image
                                                Utils.convertBlobToImage(
                                                        xhr.response,
                                                        function( image, evt )
                                                        {

                                                                if( image )
                                                                {

                                                                        img = image;
                                                                
                                                                        complete.call( this, e, evt );

                                                                }

                                                        }.bind( this ) );

                                        }

                                }

                        }


                        // updates the progress and triggers a progressCallback to handle additional tasks
                        function reportProgress( e )
                        {

                                // remove listener if there is no computable length
                                if( !e.lengthComputable &&
                                    img ){

                                       img.removeEventListener( "progress" );
                               
                                }

                                // report back with unknown progress
                                ( progressCallback || function(){} )( 
                                        this,
                                        e );
                              
                        }


                        // called when the load is complete, triggers a completion callback
                        function complete( xhrEvent, filereaderEvent )
                        {

                                completeCallback.call( 
                                        this, 
                                        xhrEvent, 
                                        filereaderEvent );

                        }

                }

        };

}