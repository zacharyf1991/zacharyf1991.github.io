var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.Credits = new Kiwi.State('Credits');



PlatformBlueprint.Credits.create = function (params) {
	this.keyboard = this.game.input.keyboard;
	this.mouse = this.game.input.mouse;
	this.score = params;

	
	this.credits = new Kiwi.GameObjects.Sprite(this, this.textures.credits, 0, 0);

	// this.logo = new Kiwi.GameObjects.Sprite( this, this.textures.secretBaseLogo, 0, 0 );
	this.addChild( this.credits );

	this.keyboard.onKeyDownOnce.add(this.changeFrame, this);
	this.mouse.onDown.add(this.openURL, this);

	
}
PlatformBlueprint.Credits.changeFrame = function(){
	// Kiwi.State.prototype.update.call(this);
	if (this.credits.cellIndex < 0){
		this.credits.cellIndex ++;

	} else {
		this.exitState();
	}
}


PlatformBlueprint.Credits.exitState = function(){
	this.mouse.onDown.remove(this.openURL, this);

	game.states.switchState("Intro");

}

PlatformBlueprint.Credits.openURL = function(){

	window.open("http://store.steampowered.com/app/279580/");

}

