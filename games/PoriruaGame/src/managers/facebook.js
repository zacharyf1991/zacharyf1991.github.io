var PoriruaGame = PoriruaGame || {};
PoriruaGame.Managers = PoriruaGame.Managers || {};


PoriruaGame.Managers.Facebook = function( game ) {
	this.game = game;

	this.id = '';

	this.friendIDs = [];
}

PoriruaGame.Managers.Facebook.prototype.login = function( callback, context ) {

	//Already logged into facebook?
	if(this.game.facebook.loggedIn) { //Currently does not exist and will never run.

		//Execute the callback
		callback.call(context, true, '');

	} else {

		//Attempt to log the user in.
		this.game.facebook.login(function(loggedIn) {	

			callback.call(context, loggedIn);

		}, this, { scope: 'public_profile, email, user_friends' } );

	}

}


PoriruaGame.Managers.Facebook.prototype.logout = function() {

	this.game.facebook.logout();

}


PoriruaGame.Managers.Facebook.prototype.me = function( callback, context ) {

	//Already logged into facebook?
	//Need check for already logged in

	this.game.facebook.userInformation( function(resp) {

		if(!resp.error) {
			this.id = resp.id;
		}

		callback.call( context, resp );
	
	}, this);

}

