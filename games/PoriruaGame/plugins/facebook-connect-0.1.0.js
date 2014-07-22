/**
* @module Kiwi
* @submodule Kiwi.Plugins
* @namespace Kiwi.Plugins
* @class FacebookConnect
* @main
*/
Kiwi.Plugins.FacebookConnect = {
  
    /**
    * The name of this plugin.
    * @property name
    * @type String
    * @public
    */
    name: 'FacebookConnect',   

    /**
    * The version of this plugin in semver (semantic versioning) format
    * @property version
    * @type String
    * @public
    */
    version: '0.1.0',
    
    /**
    * The minimum version of Kiwi.js required to run this plugin in semver (semantic versioning) format
    * @property minimumKiwiVersion
    * @type String
    * @public
    */
    minimumKiwiVersion:'1.0.0'
};


Kiwi.PluginManager.register( Kiwi.Plugins.FacebookConnect );


/**
* ---------------------------------
* Gamefroot Account Plugin.
* ---------------------------------
* 
* This plugin handles the communcation to the gamefroot server inorder to register and login users.
* The way this is achieved is through XHR requests, so make sure before you   
* 
**/

Kiwi.Plugins.FacebookConnect.create = function(game) {

    game.facebook = new Kiwi.Plugins.FacebookConnect.FB( game );

}


Kiwi.Plugins.FacebookConnect.FB = function( game ) {

    this.game = game;

    this._facebook = FB;
}

Kiwi.Plugins.FacebookConnect.FB.prototype.init = function(appId) {


    this._facebook.init( {
        appId: appId,
        status: true,
        version: 'v2.0'
    } );

    console.log('Facebook Initialised.');

}

Kiwi.Plugins.FacebookConnect.FB.prototype.login = function(callback, context, options) {

    options = options || {};

    this._facebook.login( function( resp ) {

        var loggedIn = false;

        if( resp.status == "connected") {
            loggedIn = true;
        } 

        callback.call(context, loggedIn);

    }, options );

}


Kiwi.Plugins.FacebookConnect.FB.prototype.userInformation = function(callback, context) {

    this._facebook.api('/me', function( resp ) {

        callback.call(context, resp);

    });

    return true;

}