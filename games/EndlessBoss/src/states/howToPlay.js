var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.HowToPlay = new Kiwi.State('HowToPlay');



PlatformBlueprint.HowToPlay.create = function (params) {
	this.keyboard = this.game.input.keyboard;
	this.mouse = this.game.input.mouse;
	this.score = params;

	
	this.howTo = new Kiwi.GameObjects.Sprite(this, this.textures.howTo, 0, 0);

	// this.logo = new Kiwi.GameObjects.Sprite( this, this.textures.secretBaseLogo, 0, 0 );
	this.addChild( this.howTo );

	this.keyboard.onKeyDownOnce.add(this.changeFrame, this);

	
}
PlatformBlueprint.HowToPlay.changeFrame = function(){
	// Kiwi.State.prototype.update.call(this);
	if (this.howTo.cellIndex < 2){
		this.howTo.cellIndex ++;

	} else {
		this.exitState();
	}
}


PlatformBlueprint.HowToPlay.exitState = function(){

	game.states.switchState("Play");

}
