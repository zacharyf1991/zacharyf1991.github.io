
/**
* The core CocoonAdBlueprint game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 

var gameOptions = {
	renderer: Kiwi.RENDERER_WEBGL, 
	width: 1136,
	height: 640//,
	// deviceTarget: Kiwi.TARGET_COCOON,
	// scaleType: Kiwi.Stage.SCALE_FIT
}

var game = new Kiwi.Game('content', 'CocoonAdBlueprint', null, gameOptions);

//Add all the States we are going to use.
game.states.addState(CocoonAdBlueprint.Loading);
game.states.addState(CocoonAdBlueprint.Intro);
game.states.addState(CocoonAdBlueprint.Play);

game.states.switchState("Loading");