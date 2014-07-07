var PoriruaGame = PoriruaGame || {};

PoriruaGame.Intro = new Kiwi.State('Intro');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/


PoriruaGame.Intro.create = function () {
    this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.startBackground, 0, 0);
    this.addChild(this.background);

    this.startButton = new Kiwi.GameObjects.Sprite(this, this.textures.startButtons, 450, 300);
    this.addChild(this.startButton);
    this.startButton.input.onRelease.add(this.mouseUp, this);

    this.howToPlay = new Kiwi.GameObjects.StaticImage(this, this.textures.howToPlay, 100, 40);
    this.howToPlay.alpha = 0;
    this.addChild(this.howToPlay);

    this.okButton = new Kiwi.GameObjects.Sprite(this, this.textures.okButton, 540, 420);
    this.addChild(this.okButton);
    this.okButton.input.onRelease.add(this.okUp, this);
    this.okButton.alpha = 0;


}

PoriruaGame.Intro.mouseUp = function () {
	if(this.howToPlay.alpha == 1){
    	game.states.switchState("Play");
		
	} else {
		this.howToPlay.alpha = 1;
		this.okButton.alpha = 1;
	}

}
PoriruaGame.Intro.okUp = function () {
	if(this.okButton.alpha == 1){
    	game.states.switchState("Play");
		
	} 

}