var PoriruaGame = PoriruaGame || {};

PoriruaGame.GameOver = new Kiwi.State('GameOver');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/


PoriruaGame.GameOver.create = function (params) {
    game.cameras.defaultCamera.transform.x = 0;
    game.cameras.defaultCamera.transform.y = 0;
    game.cameras.defaultCamera.transform.scale = 1;
    this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.gameOverBackground, 0, 0);
    this.addChild(this.background);
    this.params = params;

    this.chocBars = this.params.bars;
    console.log(this.chocBars);

    this.scores = this.getHighScore();

    // this.startButton = new Kiwi.GameObjects.Sprite(this, this.textures.startButtons, 450, 300);
    // this.addChild(this.startButton);
    // this.startButton.input.onRelease.add(this.mouseUp, this);

    // this.howToPlay = new Kiwi.GameObjects.StaticImage(this, this.textures.howToPlay, 100, 40);
    // this.howToPlay.alpha = 0;
    // this.addChild(this.howToPlay);

    // this.okButton = new Kiwi.GameObjects.Sprite(this, this.textures.okButton, 540, 420);
    // this.addChild(this.okButton);
    // this.okButton.input.onRelease.add(this.okUp, this);
    // this.okButton.alpha = 0;

    game.input.onUp.add(this.gameOverUp, this);


}

PoriruaGame.GameOver.gameOverUp = function () {
    game.input.onUp.remove(this.gameOverUp, this);
    	game.states.switchState("Intro");
	

}

PoriruaGame.GameOver.getHighScore = function () {
    

}
PoriruaGame.GameOver.setHighScore = function () {



}


// PoriruaGame.GameOver.shareGame = function () {
//     var myText = "I scored " + this.currHighScore + " points at -90, can you last longer? %20%23negativeNinety via @kiwijsengine"
//     var myURL = "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fkiwijs.org%2F2048%2F&text="+myText
//     window.open(myURL);
// }