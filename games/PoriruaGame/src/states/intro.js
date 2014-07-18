var PoriruaGame = PoriruaGame || {};

PoriruaGame.Intro = new Kiwi.State('Intro');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/


PoriruaGame.Intro.init = function() {
    this.game.facebook.init("475189252617071");
    this.backgroundMusic = new Kiwi.Sound.Audio(this.game, 'loop', 0.3, true);
    this.backgroundMusic.play();
}


PoriruaGame.Intro.create = function () {
    this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.startBackground, 0, 0);
    this.addChild(this.background);


    this.soundToggleButton = new Kiwi.GameObjects.Sprite(this, this.textures.soundToggleButton, 515, 460);
    this.addChild(this.soundToggleButton);
    this.soundToggleButton.input.onRelease.add(this.soundToggleButtonHit, this);
    this.soundToggleButton.animation.add('on', [0], 0.1, false);
    this.soundToggleButton.animation.add('off', [1], 0.1, false);
    this.soundToggleButton.animation.play('on');

    
    this.startButton = new Kiwi.GameObjects.Sprite(this, this.textures.startButtons, 495, 270);
    this.addChild(this.startButton);
    this.startButton.input.onRelease.add(this.mouseUp, this);
    this.highScoreButton = new Kiwi.GameObjects.Sprite(this, this.textures.highScoreButton, 495, 365 );
    this.addChild(this.highScoreButton);

    this.howToPlay = new Kiwi.GameObjects.StaticImage(this, this.textures.howToPlay, 100, 40);
    this.howToPlay.alpha = 0;
    this.addChild(this.howToPlay);

    this.okButton = new Kiwi.GameObjects.Sprite(this, this.textures.okButton, 540, 420);
    this.addChild(this.okButton);
    this.okButton.input.onRelease.add(this.okUp, this);
    this.okButton.alpha = 0;

    this.hashTag = new Kiwi.GameObjects.Sprite(this, this.textures.hashTag, 28, 460);
    this.addChild(this.hashTag);
    this.hashTag.input.onRelease.add(this.hashTagHit, this);


    this.highScoreButton.input.onUp.add(this.highScoreHit, this);

    Kiwi.Plugins.GamefrootAccount.create(game);


    game.audioIsOn = true;




}

PoriruaGame.Intro.soundToggleButtonHit = function () {
    if(game.audio.mute){
        game.audio.mute = false;
        this.soundToggleButton.animation.play('on');

    } else {
        game.audio.mute = true;
        this.soundToggleButton.animation.play('off');
    }
    

}

PoriruaGame.Intro.mouseUp = function () {
	if(this.howToPlay.alpha == 1){
    	//game.states.switchState("Play");
		
	} else {
		this.howToPlay.alpha = 1;
		this.okButton.alpha = 1;
	}

}
PoriruaGame.Intro.okUp = function () {
	if(this.okButton.alpha == 1){
        this.okButton.input.onRelease.remove(this.okUp, this);
        this.startButton.input.onRelease.remove(this.mouseUp, this);
        this.highScoreButton.input.onRelease.remove(this.highScoreHit, this);
    	game.states.switchState("Play");
		
	} 

}

PoriruaGame.Intro.hashTagHit = function () {
    console.log("hashTagHit");
        
    var myText = "Fight off zombies & light up Porirua! Play the game, get a highscore, win FREE Whittaker's Chocolate bit.ly/1jDf43r #gigatownporirua"
    var myURL = "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fkiwijs.org%2F2048%2F&text="+encodeURIComponent(myText)
    window.open(myURL);

}

PoriruaGame.Intro.highScoreHit = function () {
    if(this.okButton.alpha == 0){
        this.okButton.input.onRelease.remove(this.okUp, this);
        this.startButton.input.onRelease.remove(this.mouseUp, this);
        this.highScoreButton.input.onRelease.remove(this.highScoreHit, this);

    

    game.states.switchState("HighscoreState");
        
    } 

}