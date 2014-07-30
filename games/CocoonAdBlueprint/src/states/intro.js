var CocoonAdBlueprint = CocoonAdBlueprint || {};

CocoonAdBlueprint.Intro = new Kiwi.State('Intro');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/


CocoonAdBlueprint.Intro.create = function () {

	game.input.onUp.add(this.mouseUp, this);
	this.background = new Kiwi.GameObjects.Sprite(this, this.textures.introBackground, 0 , 0);
	this.addChild(this.background);
    
}

CocoonAdBlueprint.Intro.mouseUp = function(keyCode, key) {
    //console.log(this.mouse.x, this.mouse.y);
	game.input.onUp.remove(this.mouseUp, this);
    game.states.switchState("Play");

    

};