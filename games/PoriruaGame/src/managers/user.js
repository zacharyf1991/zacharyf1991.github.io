var PoriruaGame = PoriruaGame || {};
PoriruaGame.Managers = PoriruaGame.Managers || {};

PoriruaGame.Managers.User = function( game ) {

	this.loggedIn = false;
	this.userData = {};

	this.game = game;

}  

PoriruaGame.Managers.User.prototype.login = function(username, password, callback, context) {

	if(this.loggedIn) {
		console.warn('You are already logged in');
		return false;
	}


	return this.game.gf.login({ username: username, password: password }, function(transError, data) {

		if( transError == false && data.result !== "fail" && data.id) {

			//User successfully logged in.
			//Save their information
			this.userData = data;
			this.loggedIn = true;

		}

		callback.call( context, this.loggedIn, data );

	}, this); 

}


PoriruaGame.Managers.User.prototype.logout = function(callback, context) {

	if(!this.loggedIn) {
		console.warn('You are not logged in');
		return false;
	}


	return this.game.gf.logout( function(transError, data) {

		if(transError == false) {
			this.loggedIn = false;
			this.userData = {};
		}

	}, this);

}


PoriruaGame.Managers.User.prototype.register = function(data, callback, context) {
	
	if(this.loggedIn) {
		console.warn('You cannot register while logged in.');
		return false;
	}

	return this.game.gf.register( {

		"username": data.username,
		"password": data.password,
		"email": data.email,
		"passwordrepeat": data.passrepeat

	}, function( transerror, data ) {

		if(transerror == true || data.result !== "success") {
			callback.call(context, false, data);
		} else {
			callback.call(context, true, data);
		}

	}, this);

}