var PoriruaGame = PoriruaGame || {};
PoriruaGame.Managers = PoriruaGame.Managers || {};

PoriruaGame.Managers.User = function( game ) {

	this.loggedIn = false;
	this.userData = {};

	this.game = game;
	this.facebook = new PoriruaGame.Managers.Facebook( game );

/*
	if(this.game.saveManager.exists('userData') && this.game.saveManager.exists('password') ) {

		var tempData = this.game.saveManager.getData( 'userData' );
		var tempPass = this.game.saveManager.getData( 'password' ); // Save the password	

		var data = {
			username: tempData.name,
			password: tempPass
		}

		this.login( data, function(loggedIn, data) {
			
			console.log('User auto logged in');

		}, this );

	}*/


}  


/**
* Executed when the user wants to login via facebook.
**/
PoriruaGame.Managers.User.prototype.facebookLogin = function( callback, context ) {

	if(this.loggedIn == true) {
		console.warn('User is already logged in.');
		return false;
	}

	// Login the user via facebook.
	this.facebook.login( function(loggedIn) {

		//If he has logged in.
		if(loggedIn) {
			this.gamefrootLogin( callback, context );
		} else {
			callback.call( context, false, { result: 'fail' } );
		}

	}, this);


	return true;
}


PoriruaGame.Managers.User.prototype.gamefrootLogin = function(callback, context) {

	//Get the users information
	this.facebook.me( function(resp, error) {

		//If it didn't error
		if(!resp.error) {

			//Login to Gamefroot with that information
			var data = { fb: true, fullRes: resp };
			if(this.login( data, callback, context ) == false) {
				callback.call( context, false, { result: 'fail' });
			}

		} else {
			callback.call( context, false, { result: 'fail' });

		}
	
	}, this);

}


PoriruaGame.Managers.User.prototype.login = function(data, callback, context) {

	if(this.loggedIn) {
		console.warn('You are already logged in');
		return false;
	}


	return this.game.gf.login( data, function(transError, data) {

		if( transError == false && data.result !== "fail" && data.id) {

			//User successfully logged in.
			//Save their information
			this.userData = data;
			this.loggedIn = true;

			if(data.password) {
				this.game.saveManager.add( 'userData', this.userData );
				this.game.saveManager.add( 'password', password, true ); // Save the password	
			}

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
			this.game.saveManager.remove( 'userData' );
			this.game.saveManager.remove( 'password', true ); // Save the password	
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