/**
* @module Kiwi
* @submodule Kiwi.Plugins
* @namespace Kiwi.Plugins
* @class GamefrootAccount
* @main
*/
Kiwi.Plugins.GamefrootAccount = {
  
    /**
    * The name of this plugin.
    * @property name
    * @type String
    * @public
    */
    name: 'GamefrootAccount',   

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


Kiwi.PluginManager.register( Kiwi.Plugins.GamefrootAccount );


/**
* ---------------------------------
* Gamefroot Account Plugin.
* ---------------------------------
* 
* This plugin handles the communcation to the gamefroot server inorder to register and login users.
* The way this is achieved is through XHR requests, so make sure before you   
* 
**/

Kiwi.Plugins.GamefrootAccount.create = function(game) {

    game.gf = new Kiwi.Plugins.GamefrootAccount.GF( game );

}


Kiwi.Plugins.GamefrootAccount.GF = function( game ) {

    this.game = game;

    this.serverURL = 'http://staging.gamefroot.com:8081/api/';

    this.requestAvaliable = true;
    this.currentRequest = 0;

    this.callback = null;
    this.context = null;


}


/**
* Logged In Section
**/

Kiwi.Plugins.GamefrootAccount.GF.prototype.loggedIn = function( callback, context ) {

    if(!this.requestAvaliable) return false;

    this.callback = callback;
    this.context = context;
    this.currentRequest = 0;

    //Send Request
    this.XHRRequest(this.serverURL + 'account/me', {});

    return true;
}


Kiwi.Plugins.GamefrootAccount.GF.prototype.loggedInResponse = function( data, error ) {

    if(this.callback == null && this.context == null) return;

    //XHR Error?
    if(error) {
        this.callback.call(this.context, true, data);
        return;
    } 

    //Get the data    
    this.callback.call(this.context, false, data);
    
}


/**
* Register Section
**/

Kiwi.Plugins.GamefrootAccount.GF.prototype.register = function( data, callback, context  ) {

    if(!this.requestAvaliable) return false;


    //Validate the data

    this.callback = callback;
    this.context = context;
    this.currentRequest = 1;

    //Send Request
    this.XHRRequest(this.serverURL + 'account/register', {
        'usrn': data.username,
        'psw': data.password,
        'email': data.email,
        'repsw': data.passwordrepeat
    }, true);

    return true;
}


Kiwi.Plugins.GamefrootAccount.GF.prototype.registerResponse = function( data, error ) {

    if(this.callback == null && this.context == null) return;

    //XHR Error?
    if(error) {
        this.callback.call(this.context, true, data);
        return;
    } 

    //Get the data    
    this.callback.call(this.context, false, data);

}


/**
* Login Section
**/

Kiwi.Plugins.GamefrootAccount.GF.prototype.login = function( data, callback, context  ) {

    if(!this.requestAvaliable) return false;


    //Facebook?
    if(data.fb && data.fullRes) {

        var obj = {
            "type": 'fb',
            "id": data.fullRes.id,
            "fullRes": JSON.stringify(data.fullRes)
        };

    } else {

        if(!data.username || !data.password) {
            return false;
        }

        var obj = {
            'usrn': data.username,
            'psw': data.password,
            'ref': this.game.stage.name
        }

    }

    this.callback = callback;
    this.context = context;
    this.currentRequest = 2;

    //Send request
    this.XHRRequest(this.serverURL + 'account/login', obj, true);

    return true;
}

Kiwi.Plugins.GamefrootAccount.GF.prototype.loginResponse = function( data, error ) {

                console.log('Stuff'); 

    if(this.callback == null && this.context == null) return;

    //XHR Error?
    if(error) {
        this.callback.call(this.context, true, data);
        return;
    } 

    //Get the data    
    this.callback.call(this.context, false, data);

}


/**
* Logout Section
**/
Kiwi.Plugins.GamefrootAccount.GF.prototype.logout = function( callback, context ) {

    if(!this.requestAvaliable) return false;

    this.callback = callback;
    this.context = context;
    this.currentRequest = 3;

    this.XHRRequest(this.serverURL + 'account/logout', {});

    return true;
}

Kiwi.Plugins.GamefrootAccount.GF.prototype.logoutResponse = function( data, error ) {

    if(this.callback == null && this.context == null) return;

    //XHR Error?
    if(error) {
        this.callback.call(this.context, true, data);
        return;
    } 

    //Get the data    
    this.callback.call(this.context, false, data);
}

/**
* XHR Requests / Responses
**/

// URL to send the data
// Data to send to the url
// If it is a post request, defaults to get
Kiwi.Plugins.GamefrootAccount.GF.prototype.XHRRequest = function( url, rawdata, post ) {
 
    //Stringify the data
    var data = null;
    for(var index in rawdata) {
        if(data === null) {
            data  = index + '=' + encodeURIComponent(rawdata[index]);
        } else {
            data += '&' + index + '=' + encodeURIComponent(rawdata[index]);
        }
    }

    //Create request
    if(post) {
        console.log('Post');
        this._xhr = this.createCORSRequest('POST', url);
        this._xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    } else {
        this._xhr = this.createCORSRequest('GET', url);
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

Kiwi.Plugins.GamefrootAccount.GF.prototype.XHRResponse = function( event ) {


    if(event.target.readyState !== 4) {
        return;
    }

    //Get the data

    if(this._xhr.response) {
        data = JSON.parse( this._xhr.response );
        console.log('Request Data ', data);

        switch(this.currentRequest) {
            case 0: //Logged In
                this.loggedInResponse( data );
                break;
            case 1: //Register
                this.registerResponse( data );
                break;
            case 2: //Login
                this.loginResponse( data );
                break;
            case 3:
                this.logoutResponse( data );
                break;
        }

        this.callback = null;
        this.context = null;
        this.currentRequest = null;
        this.requestAvaliable = true;
    }
}


Kiwi.Plugins.GamefrootAccount.GF.prototype.XHRError = function( error ) {

    //Data

    switch(this.currentRequest) {
        case 0: //Logged In
            this.loggedInResponse( error, true );
            break;
        case 1: //Register
            this.registerResponse( error, true );
            break;
        case 2: //Login
            this.loginResponse( error, true );
            break;
        case 3:
            this.logoutResponse( error, true );
            break;
    }

    this.callback = null;
    this.context = null;
    this.currentRequest = null;
    this.requestAvaliable = true;

}


/**
* XHR Callbacks
**/
Kiwi.Plugins.GamefrootAccount.GF.prototype._error = function(event) {
    console.log('Request has errored.');
    this.XHRError('Request has errored.');
}


Kiwi.Plugins.GamefrootAccount.GF.prototype._timeout = function(event) {
    console.log('Request Timed out.');
    this.XHRError('Request Timed out.');
}


Kiwi.Plugins.GamefrootAccount.GF.prototype._abort = function() {
    console.log('Request was Aborted.');
    this.XHRError('Request was Aborted.')
}


/**
* Generic Methods
**/

Kiwi.Plugins.GamefrootAccount.GF.prototype.createCORSRequest = function(method, url) {
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