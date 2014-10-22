var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.Intro = new Kiwi.State('Intro');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/
PlatformBlueprint.Intro.init = function(){
	this.timer  = this.game.time.clock.createTimer('changeVisible', .175, -1, false);
    this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.changeVisible, this);  //create a new timer event on that timer

}

PlatformBlueprint.Intro.create = function () {
	this.keyboard = this.game.input.keyboard;
    this.mouse = this.game.input.mouse;

    //game.timers.stopAllTimers()


    this.rightKey = this.keyboard.addKey(Kiwi.Input.Keycodes.D);

	this.keyboard.onKeyUp.add(this.startGame, this);
	this.menuBackground = new Kiwi.GameObjects.Sprite(this, this.textures.menu, 0, 0);
	this.menuBackground.animation.add('play', [0, 1, 2, 2, 1], 0.075, true);
	this.menuBackground.animation.play('play'); 
	this.addChild(this.menuBackground);

	this.startText = new Kiwi.GameObjects.StaticImage(this, this.textures.startText, 375, 440);
	this.addChild(this.startText);

	
    this.timer.start();
    this.counter = 0;

    this.game.cameras.defaultCamera.transform.x = 0;
    this.game.cameras.defaultCamera.transform.y = 0;

    
}
PlatformBlueprint.Intro.startGame = function(keyCode, key){

	if(keyCode == this.rightKey.keyCode){
	}
	this.keyboard.onKeyUp.remove(this.startGame, this);
	this.timer.stop();
	game.states.switchState("Play");

}


PlatformBlueprint.Intro.changeVisible = function(){
	if(this.startText.alpha == 1){
		if(this.counter == 1){
			this.startText.alpha = 0;
		} else {
			this.counter +=1;
		}
	} else {
		this.startText.alpha = 1;
		this.counter = 0;
	}

}