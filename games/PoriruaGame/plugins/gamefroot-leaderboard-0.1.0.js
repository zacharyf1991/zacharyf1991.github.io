/**
* @module Kiwi
* @submodule Kiwi.Plugins
* @namespace Kiwi.Plugins
* @class GamefrootLeaderboard
* @main
*/
Kiwi.Plugins.GamefrootLeaderboard = {
  
    /**
    * The name of this plugin.
    * @property name
    * @type String
    * @public
    */
    name: 'GamefrootLeaderboard',   

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


Kiwi.PluginManager.register( Kiwi.Plugins.GamefrootLeaderboard );


/**
* ---------------------------------
* Gamefroot Leaderboard Plugin.
* ---------------------------------
* 
* This plugin handles the communcation to the gamefroot server in-order to access leaderboards.
*
* 
**/

Kiwi.Plugins.GamefrootLeaderboard.create = function(game) {

    game.gfleaderboard = new Kiwi.Plugins.GamefrootLeaderboard.GF( game );

}


Kiwi.Plugins.GamefrootLeaderboard.GF = function( game ) {

    this.game = game;

    this.serverURL = 'http://staging.gamefroot.com:8081/api/';

    this.requestAvaliable = true;
    this.currentRequest = 0;

    this.callback = null;
    this.context = null;


}


/**
* -----------------------
* GET LEADERBOARDS
* -----------------------
**/

Kiwi.Plugins.GamefrootLeaderboard.GF.prototype.get = function( callback, context, order) {

    if(!this.requestAvaliable) {
        return false;
    }

    //leaderboards/get

    this.callback = callback;
    this.context = context;
    this.currentRequest = 1;

    var data = {
        'game': this.game.stage.name
    }

    //Valid orders are 
    // score
    // date
    if( order ) {
        data.order = order;
    } 

    //Send Request
    this.XHRRequest(this.serverURL + 'leaderboards/get', data);

    return true;
}


Kiwi.Plugins.GamefrootLeaderboard.GF.prototype.post = function( score, user, callback, context ) {

    if(!this.requestAvaliable) {
        return false;
    }

    //leaderboards/set

    this.callback = callback;
    this.context = context;
    this.currentRequest = 2;

    var data = {
        'game': this.game.stage.name,
        'score': score,
        'user': JSON.stringify( user )
    }


    this.XHRRequest(this.serverURL + 'leaderboards/set', data, true);

}





/**
* XHR Requests / Responses
**/

// URL to send the data
// Data to send to the url
// If it is a post request, defaults to get
Kiwi.Plugins.GamefrootLeaderboard.GF.prototype.XHRRequest = function( url, rawdata, post ) {
 
    //Stringify the data
    var data = null;
    for(var index in rawdata) {
        if(data === null) {
            data = index + '=' + encodeURIComponent(rawdata[index]);
        } else {
            data += '&' + index + '=' + encodeURIComponent(rawdata[index]);
        }
    }

    //Create request
    if(post) {
        this._xhr = this.createCORSRequest('POST', url);
        this._xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    } else {

        this._xhr = this.createCORSRequest('GET', url+'?'+data);
        data = null;
    }

    //Assignment of callbacks
    this._xhr.timeout = 0;
    this._xhr.ontimeout = this._timeout.bind(this);
    this._xhr.onabort = this._abort.bind(this);
    this._xhr.onerror = this._error.bind(this);
    this._xhr.onreadystatechange =  this.XHRResponse.bind(this);

    //Go!
    this._xhr.send(data);

    this.requestAvaliable = false;
}

Kiwi.Plugins.GamefrootLeaderboard.GF.prototype.XHRResponse = function( event ) {


    if(event.target.readyState !== 4) {
        return;
    }

    //Get the data

    if(this._xhr.response) {
        data = JSON.parse( this._xhr.response );

        this.callback.call(this.context, false, data);
        this.currentRequest = null;
        this.requestAvaliable = true;
    }
}


Kiwi.Plugins.GamefrootLeaderboard.GF.prototype.XHRError = function( error ) {

    //Data
    this.callback.call(this.context, true, data);

    this.callback = null;
    this.context = null;
    this.currentRequest = null;
    this.requestAvaliable = true;

}


/**
* XHR Callbacks
**/
Kiwi.Plugins.GamefrootLeaderboard.GF.prototype._error = function( event ) {
    console.log('Request has errored.');
    this.XHRError('Request has errored.');
}


Kiwi.Plugins.GamefrootLeaderboard.GF.prototype._timeout = function( event ) {
    console.log('Request Timed out.');
    this.XHRError('Request Timed out.');
}


Kiwi.Plugins.GamefrootLeaderboard.GF.prototype._abort = function() {
    console.log('Request was Aborted.');
    this.XHRError('Request was Aborted.')
}


/**
* Generic Methods
**/

Kiwi.Plugins.GamefrootLeaderboard.GF.prototype.createCORSRequest = function(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // Otherwise, CORS is not supported by the browser.
    xhr = null;
  }
  return xhr;
}