var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.GameOver = new Kiwi.State('GameOver');



PlatformBlueprint.GameOver.create = function (params) {
	this.gameOverKeyboard = this.game.input.keyboard;
    this.mouse = this.game.input.mouse;
    this.score = params;
    this.game.stage.color = "000000";



	// this.keyboard.onKeyUp.add(this.startGame, this);
	// this.game.input.onUp.add(this.mouseUp, this);
	// this.menuBackground = new Kiwi.GameObjects.Sprite(this, this.textures.menu, 0, 0);
	// this.menuBackground.animation.add('play', [0, 1, 2, 2, 1], 0.075, true);
	// this.menuBackground.animation.play('play'); 
	// this.addChild(this.menuBackground);


    //BEAM
    this.beam = new Kiwi.GameObjects.Sprite( this, this.textures.GOBeam, 0, 0 );
    this.beam.animation.add('play', [0, 1, 2, 3, 3, 2, 1, 0], 0.075, true);
    this.beam.animation.play('play');

    this.beam.x = this.game.stage.width * 0.5 - this.beam.width * 0.5;
    this.addChild( this.beam ); 

    //EGON

    this.egon = new Kiwi.GameObjects.Sprite( this, this.textures.GOEgon, 430, 300 );
    this.egon.animation.add('standUp', [ 2, 3, 4, 5, 6, 7, 8 ], 0.075, false);
    this.egon.animation.getAnimation('standUp').onStop.add(this.exitState, this);
    // this.egon.animation.play('play');
    this.addChild( this.egon ); 

    //GOText

    this.GOText = new Kiwi.GameObjects.Sprite( this, this.textures.GOText, 0, 125 );
    this.GOText.x = this.game.stage.width * 0.5 - this.GOText.width * 0.5;
    this.addChild( this.GOText );

    //GOContinueQuit
    this.GOContinueQuit = new Kiwi.GameObjects.Sprite( this, this.textures.GOContinueQuit, 0, 190 );
    this.GOContinueQuit.x = this.game.stage.width * 0.5 - this.GOContinueQuit.width * 0.5;
    this.addChild( this.GOContinueQuit );

    this.rightKey = this.gameOverKeyboard.addKey(Kiwi.Input.Keycodes.D);
    this.leftKey = this.gameOverKeyboard.addKey(Kiwi.Input.Keycodes.A);
    this.selectKey = this.gameOverKeyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);

	

    this.game.cameras.defaultCamera.transform.x = 0;
    this.game.cameras.defaultCamera.transform.y = 0;
    //this.keyboard.onKeyDown.add(this.restartGame, this);

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

    this.gameOverKeyboard.onKeyDownOnce.add(this.keyDownOnce, this);

    this.shareTwitter = new Kiwi.GameObjects.Sprite( this, this.textures.twitterShare, 360,  510 );
    this.addChild ( this.shareTwitter );

    this.shareTwitter.input.onUp.add(this.share, this);



    //this.shareB = new Kiwi.Plugins.GameObjects.ShareButton(this, this.textures['shareButton'], game.stage.width/2 - 125 ,405);
    //this.shareB.enable();
    //this.addChild(this.shareB);

    
}
PlatformBlueprint.GameOver.update = function(){
    Kiwi.State.prototype.update.call(this);
}

PlatformBlueprint.GameOver.share = function(){
    console.log("Share");
    this.tweetWindow("http://bit.ly/1xGBN0s", "Happy Halloween, #Ghostbusters! Kick ectoplasmic ass in the new game by @secretbaseSG, powered by @kiwijsengine!");

}

PlatformBlueprint.GameOver.tweetWindow = function(url, text) {
  window.open( "http://twitter.com/share?url=" + 
    encodeURIComponent(url) + "&text=" + 
    encodeURIComponent(text) + "&count=none/", 
    "tweet", "height=300,width=550,resizable=1" ) 
}

// PlatformBlueprint.GameOver.restartGame = function(){
// 	this.gameOverKeyboard.onKeyUp.remove(this.restartGame, this);
// 	game.huds.defaultHUD.removeAllWidgets();

// 	game.states.switchState("Intro");

// }


PlatformBlueprint.GameOver.keyDownOnce = function(keyCode, key) {
    // body...
    //console.log(keyCode, key);

    if(keyCode == this.rightKey.keyCode){
        this.GOContinueQuit.animation.switchTo( 1 );
    } 

    if(keyCode == this.leftKey.keyCode){

        this.GOContinueQuit.animation.switchTo( 0 );
    } 
    /////////////////////
    //Capture
    if(keyCode == this.selectKey.keyCode){
        if( this.GOContinueQuit.animation.currentCell == 0 ) {
            this.continueGame();
            
        } else {
            this.exitState();
        }
    }



};

PlatformBlueprint.GameOver.continueGame = function(){
    this.egon.animation.play('standUp');

}


PlatformBlueprint.GameOver.exitState = function(){
    this.gameOverKeyboard.onKeyDownOnce.remove(this.keyDownOnce, this);
    this.gameOverKeyboard.onKeyUp.remove(this.keyDownOnce, this);
    // this.keyboard.onKeyUp.remove(this.restartGame, this);
    game.huds.defaultHUD.removeAllWidgets();

    game.states.switchState("Credits");

}