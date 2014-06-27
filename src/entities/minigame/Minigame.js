var Minigame = function(state, myParent, x, y){
	Kiwi.Group.call(this, state);
	this.myParent = myParent;
	this.state = state;
	this.alpha = 0;
	this.keyboard = this.game.input.keyboard;

	this.stage = 0;
	this.hit = false;
	this.myActive = false;
	this.hitRange = (Math.PI*2 / 360) * 15 ;

	this.rotBlue = 0;
	this.rotSkull = Math.PI*2;
	this.rotBlueSpeed = 0.0376
	this.rotSkullSpeed = 0.0427;
	this.skullGroup = new Kiwi.Group(state);
	this.blueCircleGroup = new Kiwi.Group(state);
	//this.blueCircleGroup = new Kiwi.Group(state);
	this.confirmGroup = new Kiwi.Group(state);
	

	

	this.ring = new Kiwi.GameObjects.Sprite(this.state, this.state.textures['redCircle'], -300, -300);
	this.ring.x = this.x;
	this.ring.y = this.y;

	this.addChild(this.skullGroup);
	this.addChild(this.blueCircleGroup);
	this.addChild(this.confirmGroup);


	var mySkull = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.skull, 0, -87);
	this.skullGroup.addChild(mySkull);

	var blueCircle = new BlueCircle(this.state, this, 0, -87);
	this.blueCircleGroup.addChild(blueCircle);

	this.state.addChild(this.ring);


}
Kiwi.extend(Minigame , Kiwi.Group);

Minigame.prototype.checkRange = function(){

	if(this.state.weaponManager.enemyTargeted){
		if(this.rotSkull < this.hitRange){
			if((this.rotSkull + Math.PI*2) < (this.rotBlue + this.hitRange)){
				this.skullGroup.members[0].alpha = 0;
				this.blueCircleGroup.members[0].animation.play('fade');
				this.hit = true;

			} 

		} else if(this.rotBlue < this.hitRange){
			if((this.rotBlue + Math.PI*2) < (this.rotSkull + this.hitRange)){
				this.skullGroup.members[0].alpha = 0;
				this.blueCircleGroup.members[0].animation.play('fade');
				this.hit = true;

			}

		} else if((this.rotSkull > this.rotBlue - this.hitRange)  && (this.rotSkull < this.rotBlue + this.hitRange)){
			this.skullGroup.members[0].alpha = 0;
			this.blueCircleGroup.members[0].animation.play('fade');
			this.hit = true;


		} else {
			var tempNum = this.blueCircleGroup.members[0].timesMissed;
			if( tempNum == 3){
				this.state.weaponManager.stopShooting();
			} else{
				this.missedHit()
				this.skullGroup.members[0].alpha = 0;
				this.hit = true;
			}
		}


	}
}
Minigame.prototype.missedHit = function() {
	this.timesMissed = this.blueCircleGroup.members[0].missedHit();
};

Minigame.prototype.startNextStage = function(){

	this.stage += 1;
	this.hit = false;
	this.skullGroup.members[0].alpha = 1;
	}

Minigame.prototype.updateRotation = function(){
	this.rotBlue += this.rotBlueSpeed;
	this.rotSkull -= this.rotSkullSpeed;


	//console.log(this.rotSkull);

	if(this.rotSkull <= 0){
		this.rotSkull = Math.PI*2;
	}
	if(this.rotBlue >= Math.PI*2){
		this.rotBlue = 0;
	}

	this.skullGroup.rotation = this.rotSkull;
	this.skullGroup.members[0].rotation = -this.rotSkull;

	this.blueCircleGroup.rotation = this.rotBlue;
	this.blueCircleGroup.members[0].rotation = -this.rotBlue;


	//this.animation.play('dash');
}


Minigame.prototype.capture = function(){
	this.animation.play('shoot');
}
Minigame.prototype.update = function(){
    Kiwi.Group.prototype.update.call(this);
    if(!this.hit){
    	this.updateRotation();
    }

    this.skullGroup.x = 64;
    this.skullGroup.y = 64;
    this.blueCircleGroup.x = 64;
    this.blueCircleGroup.y = 64;
    this.ring.x = this.x;
	this.ring.y = this.y;

}



Minigame.prototype.moveTo = function(x, y) {
	this.x = x;
	this.y = y;
};

Minigame.prototype.stageUp = function() {
	this.myParent.beamStage += 1;
	this.myParent.beamNeedsUpdating = true;
	this.myParent.updateBeamStage();
	this.myParent.damageEnemy();
};