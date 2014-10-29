var BlueCircle = function(state, parent, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['blueCircleSprite'], x, y);
	this.state = state;
	this.myParent = parent;
	var animationSpeed = 0.1;
	//var animationSpeed = (Math.random() * 0.1) + 0.05;
	this.animation.add('loop', [00, 01], 0.06, true);
	this.animation.add('fade', [02, 03, 04, 05], 0.1, false);
	this.animation.add('missedOne', [06, 06, 01, 06, 01, 06, 06], 0.1, false);
	this.animation.add('missedTwo', [07, 07, 01, 07, 07, 01, 07, 07], 0.1, false);
	this.animation.add('missedThree', [08, 08, 01, 08, 08, 01, 08, 08], 0.1, false);


	this.animation.play('loop');
	this.timesMissed = 0;


	this.animation.getAnimation('fade').onStop.add(this.startNextStage, this);
	this.animation.getAnimation('missedTwo').onStop.add(this.resume, this);
	this.animation.getAnimation('missedThree').onStop.add(this.resume, this);
	this.animation.getAnimation('missedOne').onStop.add(this.resume, this);
	


	//this.animation.getAnimation('roll').onStop.add(this.finishedRoll, this);




}
Kiwi.extend(BlueCircle, Kiwi.GameObjects.Sprite);

BlueCircle.prototype.startLoop = function(){
	this.animation.play('shoot');
}

BlueCircle.prototype.startNextStage = function(){
	this.myParent.hit = false;
	this.myParent.skullGroup.members[0].alpha = 1;
	this.animation.play('loop');

	this.myParent.stageUp();
}
BlueCircle.prototype.resume = function(){
	// this.myParent.hit = false;
	// this.myParent.skullGroup.members[0].alpha = 1;
	this.animation.play('loop');

	this.state.miniGameManager.continueMiniGame();

}


BlueCircle.prototype.capture = function(){
	this.animation.play('shoot');
}
BlueCircle.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);

}
BlueCircle.prototype.missedHit = function() {
	if(this.timesMissed == 0){
		this.animation.play('missedThree');
	} else if(this.timesMissed == 1){
		this.animation.play('missedTwo');
	}else if(this.timesMissed == 2){
		this.animation.play('missedOne');
	} else {
		//do something bad
	}
	this.timesMissed += 1;
	return this.timesMissed;
};
