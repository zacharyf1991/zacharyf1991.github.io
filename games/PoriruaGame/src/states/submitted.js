var PoriruaGame = PoriruaGame || {};

PoriruaGame.Submitted = new Kiwi.State('Submitted');

/**
* The SubmittedState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/


PoriruaGame.Submitted.create = function () {
    this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.startBackground, 0, 0);
    this.addChild(this.background);

    this.overLay = new Kiwi.GameObjects.Sprite(this, this.textures.scoreSubmit, 0, 0);
    this.addChild(this.overLay);
    this.overLay.input.onRelease.add(this.okUp, this);


    Kiwi.Plugins.GamefrootAccount.create(game);


    game.audioIsOn = true;




}

PoriruaGame.Submitted.okUp = function () {
        this.overLay.input.onRelease.remove(this.okUp, this);
    	game.states.switchState("Intro");
		

}

