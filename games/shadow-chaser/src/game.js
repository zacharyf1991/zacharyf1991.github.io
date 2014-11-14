
/**
* The core CocoonAdBlueprint game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 

var gameOptions = {
	renderer: Kiwi.RENDERER_CANVAS, 
	// width: 500,
	// height: 200,
	width: 1136,
	height: 640,
	// deviceTarget: Kiwi.TARGET_COCOON,
	plugins: [] //,
	// scaleType: Kiwi.Stage.SCALE_FIT
}


var game = new Kiwi.Game('content', 'ShadowChaser', null, gameOptions);


//Add all the States we are going to use.
game.states.addState(ShadowChaser.Loading);
game.states.addState(ShadowChaser.Intro);
game.states.addState(ShadowChaser.Play);
game.states.addState(ShadowChaser.GameOver);

game.states.switchState("Loading");