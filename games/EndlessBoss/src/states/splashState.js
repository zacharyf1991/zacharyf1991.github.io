var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.SplashState = new Kiwi.State('SplashState');



PlatformBlueprint.SplashState.create = function (params) {
	this.keyboard = this.game.input.keyboard;
	this.mouse = this.game.input.mouse;
	this.score = params;

	

	this.game.cameras.defaultCamera.transform.x = 0;
	this.game.cameras.defaultCamera.transform.y = 0;

	this.game.stage.color = "000000";
	//create the tweens
	this.logo = new Kiwi.GameObjects.Sprite( this, this.textures.secretBaseLogo, 0, 0 );
	this.logo.x = this.game.stage.width * 0.5 - this.logo.width * 0.5;
	this.logo.alpha = 0;
	this.addChild( this.logo );
	this.tweenA = this.game.tweens.create(this.logo);  
	this.tweenB = this.game.tweens.create(this.logo); 
	this.tweenC = this.game.tweens.create(this.logo);

	//set the tweens up
	this.tweenA.to({ alpha: 1 }, 500, Kiwi.Animations.Tweens.Easing.Quintic.In, false);
	this.tweenB.to({ alpha: 1 }, 1000, Kiwi.Animations.Tweens.Easing.Circular.InOut, false);
	this.tweenC.to({ alpha: 0 }, 500, Kiwi.Animations.Tweens.Easing.Quintic.Out, false);
	this.tweenC.onComplete( this.splashFinished, this );

	//set the order that they will execute one after the other in.
	this.tweenA.chain(this.tweenB);
	this.tweenB.chain(this.tweenC);

	this.tweenA.start();

	
}
PlatformBlueprint.SplashState.update = function(){
	Kiwi.State.prototype.update.call(this);
}


PlatformBlueprint.SplashState.splashFinished = function(){

	game.states.switchState("Intro");

}
