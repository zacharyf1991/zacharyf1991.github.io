var Beam = function(state, x, y, beamStage){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['beam'], x, y);

	var animationSpeed = 0.1;

	this.beamStage = 0;
	
	this.beamStage = beamStage;
	//this.animation.play('stage1');


	this.animation.add('stage1', [00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11], animationSpeed, true);
	this.animation.add('stage2', [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], animationSpeed, true);
	this.animation.add('stage3', [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35], animationSpeed, true);

	if(this.beamStage <= 0){
		if(this.animation.currentAnimation.name != 'stage1'){
			this.animation.play('stage1');
			
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