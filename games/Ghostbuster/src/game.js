
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
	plugins: ['ShareButton', 'Repetition'],
	scaleType : Kiwi.Stage.SCALE_FIT
}

var game = new Kiwi.Game('content', 'PlatformBlueprint', null, gameOptions);

Kiwi.Geom.Intersect.lineToRawSegment = function (line, x1, y1, x2, y2, output) {
	if (typeof output === "undefined") { output = new Geom.IntersectResult; }
	var denom = (line.x1 - line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 - x2);
	if (denom !== 0) {
		output.x = ((line.x1 * line.y2 - line.y1 * line.x2) * (x1 - x2) - (line.x1 - line.x2) * (x1 * y2 - y1 * x2)) / denom;
		output.y = ((line.x1 * line.y2 - line.y1 * line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 * y2 - y1 * x2)) / denom;

		var maxX = Math.max(x1, x2);
		var minX = Math.min(x1, x2);
		var maxY = Math.max(y1, y2);
		var minY = Math.min(y1, y2);

		if ((output.x <= maxX && output.x >= minX) === true && (output.y <= maxY && output.y >= minY) === true) {
			output.result = true;
		}
	}

	return output;
};


//Add all the States we are going to use.
game.states.addState(PlatformBlueprint.Loading);
game.states.addState(PlatformBlueprint.MenuOpening);
game.states.addState(PlatformBlueprint.HowToPlay);
game.states.addState(PlatformBlueprint.Credits);
game.states.addState(PlatformBlueprint.SplashState);
game.states.addState(PlatformBlueprint.Intro);
game.states.addState(PlatformBlueprint.Play);
game.states.addState(PlatformBlueprint.GameOver);

game.states.switchState("Loading");

