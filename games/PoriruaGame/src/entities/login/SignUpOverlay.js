var SignUpOverlay = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;

	this.stopCalls = false;
	game.huds.defaultHUD.removeAllWidgets();
	this.state.noOverlay = false;

	this.background = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures.overlay, 0, 0);
	this.overlaySignUp = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures.overlaySignUp, 172, 37);



	////////////
	//Create Four buttons to be pressed.
	this.confirmSignUp = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.confirmSignUp, 457, 409);
	this.backSignUp = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.backSignUp, 182, 409);
	this.termsOfUse = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.termsOfUseSignUp, 353, 288);
	this.facebookSignUp = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.facebookSignUp, 535, 342);

	//////////////////
	//Create two HUDinput objects
	this.usernameText = new HUDInput(game, "text", 288, 113);
    this.usernameText.input.style.backgroundColor = "#b0d9e6";
    this.usernameText.input.style.width = "280px";
    this.usernameText.input.style.height = "24px";

    this.emailText = new HUDInput(game, "email", 288, 150);
    this.emailText.input.style.backgroundColor = "#b0d9e6";
    this.emailText.input.style.width = "280px";
    this.emailText.input.style.height = "24px";


	this.passwordText = new HUDInput(game, "password", 288, 187);
	this.passwordText.input.style.backgroundColor = "#b0d9e6";
    this.passwordText.input.style.width = "280px";
    this.passwordText.input.style.height = "24px";

	this.passwordConfirmText = new HUDInput(game, "password", 288, 223);
	this.passwordConfirmText.input.style.backgroundColor = "#b0d9e6";
    this.passwordConfirmText.input.style.width = "280px";
    this.passwordConfirmText.input.style.height = "24px";
	////////////////////
	//Create checkbox terms of use
	this.checkbox = new HUDInput(game, "checkbox", 284, 267);
	this.checkbox.input.style.backgroundColor = "#b0d9e6";
    this.checkbox.input.style.width = "18px";
    this.checkbox.input.style.height = "18px";

	this.state.addChild(this.background);
	this.state.addChild(this.overlaySignUp);
	this.state.addChild(this.confirmSignUp);
	this.state.addChild(this.backSignUp);
	this.state.addChild(this.termsOfUse);
	this.state.addChild(this.facebookSignUp);

	game.huds.defaultHUD.addWidget(this.usernameText);
	game.huds.defaultHUD.addWidget(this.emailText);

	game.huds.defaultHUD.addWidget(this.passwordText);
	game.huds.defaultHUD.addWidget(this.passwordConfirmText);
	game.huds.defaultHUD.addWidget(this.checkbox);

	this.confirmSignUp.input.onUp.add(this.confirmSignUpHit, this);
	this.backSignUp.input.onUp.add(this.backSignUpHit, this);
	this.termsOfUse.input.onUp.add(this.termsOfUseHit, this);
	this.facebookSignUp.input.onUp.add(this.facebookSignUpHit, this);



}
Kiwi.extend(SignUpOverlay , Kiwi.Group);

SignUpOverlay.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);

}

SignUpOverlay.prototype.remove = function() {
	this.background.exists = false;
	this.overlaySignUp.exists = false;



	////////////
	//Create Four buttons to be pressed.
	this.confirmSignUp.exists = false;
	this.backSignUp.exists = false;
	this.termsOfUse.exists = false;
	this.facebookSignUp.exists = false;

	//////////////////
	//Create two HUDinput objects
	this.state.game.huds.defaultHUD.removeAllWidgets();

	////////////////////
	//Create checkbox terms of use
	this.checkbox.exists = false;
	this.confirmSignUp.input.onUp.remove(this.confirmSignUpHit, this);
	this.backSignUp.input.onUp.remove(this.backSignUpHit, this);
	this.termsOfUse.input.onUp.remove(this.termsOfUseHit, this);
	this.facebookSignUp.input.onUp.remove(this.facebookSignUpHit, this);
};


SignUpOverlay.prototype.confirmSignUpHit = function(){
	if(this.stopCalls) return;

	if(!this.checkbox.input.checked) {
		//Error management here... ZACH
		alert('You must agree to the terms and conditions.');

	} else {
		this.stopCalls = true;
		console.log("confirmSignUpHit");

		var data = {
			"username": this.usernameText.input.value,
			"password": this.passwordText.input.value,
			"email": this.emailText.input.value,
			"passrepeat": this.passwordConfirmText.input.value
		}

		this.state.game.user.register(data, function(success, data) {


			if(success) {
				//You have successfully registered
				this.remove();
				this.state.submitScore();

			} else {	
				//Failed to register!!!!!! ZACH
				switch(data.reason) {
					case 'email':
					case 'emai':
						alert('That email has already been used.');
						break;

					case 'confirm':
						alert('Your passwords do not match.');
						break;

					case 'username':
					case 'user':
						alert('A user with this username already exists.');
						break;
				}
			}

			this.stopCalls = false;

		}, this);

	}
}

SignUpOverlay.prototype.backSignUpHit = function(){
	if(this.stopCalls) return;

	console.log("backSignUpHit");
	this.stopCalls = true;
	this.remove();
	this.state.submitScore();
}

SignUpOverlay.prototype.termsOfUseHit = function(){
	if(this.stopCalls) return;

	console.log("termsOfUseHit");
	this.remove();
}

SignUpOverlay.prototype.facebookSignUpHit = function(){

	if(this.stopCalls) return;

	console.log("facebookSignUpHit");
	this.stopCalls = true;

	this.game.user.facebookLogin( function(loggedIn) {

		if(loggedIn) {
			this.remove();
			this.state.submitScore();
		} else {
			//
			alert('Could not log you in.');	
		}

		this.stopCalls = false;

	}, this);

}
