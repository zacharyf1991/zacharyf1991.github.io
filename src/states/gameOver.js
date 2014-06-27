var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.GameOver = new Kiwi.State('GameOver');



PlatformBlueprint.GameOver.create = function (params) {
	this.keyboard = this.game.input.keyboard;
    this.mouse = this.game.input.mouse;
    this.score = params;



	// this.keyboard.onKeyUp.add(this.startGame, this);
	// this.game.input.onUp.add(this.mouseUp, this);
	this.menuBackground = new Kiwi.GameObjects.Sprite(this, this.textures.menu, 0, 0);
	this.menuBackground.animation.add('play', [0, 1, 2, 2, 1], 0.075, true);
	this.menuBackground.animation.play('play'); 
	this.addChild(this.menuBackground);

	

    this.game.cameras.defaultCamera.transform.x = 0;
    this.game.cameras.defaultCamera.transform.y = 0;
    this.keyboard.onKeyUp.add(this.restartGame, this);

    ////////////////////////////
    //SCORE

    this.hudScore = new Kiwi.HUD.Widget.TextField(game, 'GAME OVER - YOUR SCORE IS: ' + this.score, 0, 480);
    
    this.hudScore.style.fontFamily = 'myFirstFont';
    this.hudScore.style.color = '#FFEAD1';
    this.hudScore.style.fontSize ="16px";
    this.hudScore.style.letterSpacing ="1px";
    this.hudScore.style.width ="100%";
    this.hudScore.style.textAlign ="center";

    game.huds.defaultHUD.addWidget(this.hudScore);



    this.shareB = new Kiwi.Plugins.GameObjects.ShareButton(this, this.textures['shareButton'], game.stage.width/2 - 125 ,405);
    //this.shareB.enable();
    this.addChild(this.shareB);

    
}
PlatformBlueprint.GameOver.update = function(){
    Kiwi.State.prototype.update.call(this);
}


PlatformBlueprint.GameOver.restartGame = function(){
	this.keyboard.onKeyUp.remove(this.restartGame, this);
	game.huds.defaultHUD.removeAllWidgets();

	game.states.switchState("Intro");

}
