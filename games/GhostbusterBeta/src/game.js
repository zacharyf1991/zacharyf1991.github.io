
/**
* The core PlatformBlueprint game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 

var gameOptions = {
	renderer: Kiwi.RENDERER_CANVAS, 
	width: 960,
	height: 540,
	plugins: ['ShareButton']
}

var game = new Kiwi.Game('content', 'PlatformBlueprint', null, gameOptions);


//Add all the States we are going to use.
game.states.addState(PlatformBlueprint.Loading);
game.states.addState(PlatformBlueprint.HowToPlay);
game.states.addState(PlatformBlueprint.SplashState);
game.states.addState(PlatformBlueprint.Intro);
game.states.addState(PlatformBlueprint.Play);
game.states.addState(PlatformBlueprint.GameOver);

game.states.switchState("Loading");

