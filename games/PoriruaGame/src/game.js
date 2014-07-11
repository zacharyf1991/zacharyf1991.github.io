
/**
* The core PoriruaGame game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 

var gameOptions = {
	renderer: Kiwi.RENDERER_CANVAS, 
	width: 768,
	height: 512,
	plugins: ['Lines', 'GamefrootAccount', 'GamefrootLeaderboard', 'SaveGame', 'FacebookConnect'],
	bootCallback: function( game ) {

		game.user = new PoriruaGame.Managers.User( game );
	
	}
}

var game = new Kiwi.Game('content', 'PoriruaGame', null, gameOptions);


//Add all the States we are going to use.
game.states.addState(PoriruaGame.Loading);
game.states.addState(PoriruaGame.Intro);
game.states.addState(PoriruaGame.Play);
game.states.addState(PoriruaGame.GameOver);

game.states.switchState("Loading");