var LoginOverlay = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.game = this.state.game;

	this.background = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures.overlay, 0, 0);
	this.overlayLogin = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures.overlayLogin, 305, 112);

	this.stopCalls = false;


	////////////
	//Create Four buttons to be pressed.
	this.okButton = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.okLogin, 590, 442);
	this.backLogin = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.backLogin, 315, 442);
	this.createAccountLogin = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.createAccountLogin, 558, 268);
	this.facebookLogin = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.facebookLogin, 671, 317);


	//////////////////
	//Create two HUDinput objects
	this.usernameText = new HUDInput(game, "text", 420, 188);
    this.usernameText.input.style.backgroundColor = "#b0d9e6";
    this.usernameText.input.style.width = "280px";
    this.usernameText.input.style.height = "24px";


	this.passwordText = new HUDInput(game, "password", 420, 221);
	this.passwordText.input.style.backgroundColor = "#b0d9e6";
    this.passwordText.input.style.width = "280px";
    this.passwordText.input.style.height = "24px";


	this.state.addChild(this.background);
	this.state.addChild(this.overlayLogin);
	this.state.addChild(this.okButton);
	this.state.addChild(this.backLogin);
	this.state.addChild(this.createAccountLogin);
	this.state.addChild(this.facebookLogin);

	this.game.huds.defaultHUD.addWidget(this.usernameText);
	this.game.huds.defaultHUD.addWidget(this.passwordText);



	this.createAccountLogin.input.onUp.add(this.createAccount, this);
	this.okButton.input.onUp.add(this.okButtonHit, this);
	this.backLogin.input.onUp.add(this.backLoginHit, this);
	this.facebookLogin.input.onUp.add(this.facebookLoginHit, this);



}
Kiwi.extend(LoginOverlay , Kiwi.Group);

LoginOverlay.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);

}

LoginOverlay.prototype.remove = function() {
	this.background.exists = false;
	this.overlayLogin.exists = false;



	////////////
	//Create Four buttons to be pressed.
	this.okButton.exists = false;
	this.backLogin.exists = false;
	this.createAccountLogin.exists = false;
	this.facebookLogin.exists = false;


	//////////////////
	//Create two HUDinput objects
	this.state.game.huds.defaultHUD.removeAllWidgets();


	this.createAccountLogin.input.onUp.remove(this.createAccount, this);
	this.okButton.input.onUp.remove(this.okButtonHit, this);
	this.backLogin.input.onUp.remove(this.backLoginHit, this);
	this.facebookLogin.input.onUp.remove(this.facebookLoginHit, this);
};

LoginOverlay.prototype.createAccount = function(){

	if(this.stopCalls) return;

	console.log("createAccount");
	this.stopCalls = true;
	this.remove();
	this.state.startSignUp();
}


LoginOverlay.prototype.okButtonHit = function(){
	console.log("okButtonHit");

	if(this.stopCalls) return;

	this.game.user.login( this.usernameText.input.value, this.passwordText.input.value, function(loggedIn) {

		if(loggedIn) {

			//Logged in G
			this.remove();
			this.state.submitScore();


		} else {
			//Error management code here...
			console.log('Yo zach, error code goes here for failing to login.')

		}

		this.stopCalls = false;

	}, this);

}


LoginOverlay.prototype.backLoginHit = function(){

	if(this.stopCalls) return;

	console.log("backLoginHit");
	this.stopCalls = true;
	this.remove();
}


LoginOverlay.prototype.facebookLoginHit = function(){

	if(this.stopCalls) return;

	console.log("facebookLoginHit");
	this.stopCalls = true;
	this.remove();
}