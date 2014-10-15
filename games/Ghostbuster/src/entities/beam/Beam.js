var Beam = function(state, x, y, beamStage, direction){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['beam'], x, y);

	var animationSpeed = 0.1;

	this.beamStage = 0;
	this.objType = 'beam';
	this.direction = direction;

	//console.log(this.width, this.height, "Zach the width and Height");
	var centerX = this.width * 0.5;
	var centerY = this.height * 0.5;
	this.centerPoint = new Kiwi.Geom.Point(centerX, centerY);

	//this.removeBeam = false;
	this.shouldRemove = false;

	//this timer will fire when the beam has existed for it's lifetime duration
	this.timer = this.game.time.clock.createTimer('removeBeam', 3, 0, false);
	//this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.removeBeam, this);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.removeBeam, this); 
	this.timer.start();

	this.beamStage = beamStage;
	//this.animation.play('stage1');


	this.animation.add('stage1', [00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11], animationSpeed, true);
	this.animation.add('stage2', [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], animationSpeed, true);
	this.animation.add('stage3', [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35], animationSpeed, true);

	maximumFrames = 12;
	this.playFrom = Math.floor( Math.random() * maximumFrames );

	this.modFrame = game.time.now() % maximumFrames;


	if(this.beamStage <= 0){
		if(this.animation.currentAnimation.name != 'stage1'){
			this.animation.playAt(this.playFrom, 'stage1');
			// this.animation.playAt(this.modFrame, 'stage1');

		} 

	} else if(this.beamStage = 1){
		if(this.animation.currentAnimation.name != 'stage2'){
			this.animation.play('stage2');
		} 
	} else if(this.beamStage >=2){
		 if(this.animation.currentAnimation.name != 'stage3'){
			this.animation.play('stage3');
		}
	}

	


}
Kiwi.extend(Beam, Kiwi.GameObjects.Sprite);

Beam.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);

    this.centerPoint.x = this.worldX + this.width * 0.5;
    this.centerPoint.y = this.worldY + this.height * 0.5;

}

Beam.prototype.updateAnimation = function() {
	if(this.beamStage <= 0){
		if(this.animation.currentAnimation.name != 'stage1'){
			this.animation.play('stage1');
			
		} 

	} 
	 if(this.beamStage == 1){
		if(this.animation.currentAnimation.name != 'stage2'){
			this.animation.play('stage2');
		} 
	} 
	 if(this.beamStage >= 2){
		 if(this.animation.currentAnimation.name != 'stage3'){
			this.animation.play('stage3');
		}
	}
	
};

Beam.prototype.removeBeam = function () {
	//console.log("Destroy");
	this.stopTimers();
	this.exists = false;
	
}
Beam.prototype.stopTimers = function () {
	if(this.timer || this.timer.running()){
		this.timer.stop();
	}
	
}