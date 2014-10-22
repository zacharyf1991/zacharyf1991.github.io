var MiniGame = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;

	this.hitRange = (Math.PI*2 / 360) * 15 ;

	this.rotBlue = 0;
	this.rotSkull = Math.PI*2;
	this.rotBlueSpeed = -0.0376
	this.rotSkullSpeed = 0.0427;

	this.redCircle;
	this.blueCircle;
	this.skullGroup;
	this.center = new Kiwi.Geom.Point( 0, 0 ); 

	this.radius = 84;

	this.miniGameActive = false;


	// Groups
		// Skull Group
			// Amount = health
	// Blue Circle Sprite (adjust rot point to center)
	// Red Circle Sprite


	// METHODS:

	// Update MiniGame
	// CreateNewMiniGame
	// MiniGameActive
	// Check Overlapping




}
Kiwi.extend(MiniGame , Kiwi.Group);




MiniGame.prototype.createMiniGame = function ( target, health ) {
	this.beamTarget = this.state.weaponManager.beamManager.targetEnemy;
	//console.log( this.beamTarget, "Beam Target" );

	this.removeOldGame();
	// this.center = new Kiwi.Geom.Point( target.worldX, target.worldY ); // += target.centerPoint.x, target.y += target.centerPoint.y );
	// this.center.x += target.width * 0.5;
	// this.center.y += target.height * 0.5;
	// console.log( "Center x and y 1 ", this.center.x, this.center.y);
	this.updateMiniGamePos();
	this.moveMiniGame;
	this.createRedCircle();
	this.createSkulls( health );
	//this.resetHealth();
	this.createBlueCircle();

	this.startMiniGame();
};

MiniGame.prototype.updateMiniGamePos = function(){
	// console.log(this.beamTarget);
	if(this.beamTarget != undefined && this.beamTarget.exists ){
		
		this.center.x = this.beamTarget.worldX + this.beamTarget.width * 0.5;
		this.center.y = this.beamTarget.worldY +  this.beamTarget.height * 0.5;
		// console.log( "Center x and y 2 ", this.center.x, this.center.y);
	}

}
MiniGame.prototype.moveMiniGame = function(){
	this.redCircle.x = this.center.x - this.redCircle.width * 0.5;
	this.redCircle.y = this.center.y - this.redCircle.width * 0.5;

	this.blueCircle.x = this.center.x; // - this.blueCircle.width * 0.5;
	this.blueCircle.y = this.center.y - this.radius; // - this.blueCircle.width * 0.5;

	this.skullGroup.x = this.center.x;
	this.skullGroup.y = this.center.y;
}

MiniGame.prototype.removeOldGame = function () {
	this.miniGameActive = false;
	if ( this.redCircle ) {
		this.redCircle.exists = false;
	}
	if( this.blueCircle ) {
		this.blueCircle.exists = false;
	}
	if( this.skullGroup ) {
		this.skullGroup.exists = false;
	}
}

MiniGame.prototype.createRedCircle = function( ){
	this.redCircle = new Kiwi.GameObjects.Sprite( this.state, this.state.textures.redCircle, this.center.x, this.center.y );

	this.redCircle.x -= this.redCircle.width * 0.5;
	this.redCircle.y -= this.redCircle.height * 0.5;
	this.addChild(this.redCircle);
};
MiniGame.prototype.createSkulls = function ( amount ) {
	var i, rot, tempSkull,tempSkullGroup;
	this.skullGroup = new Kiwi.Group(this.state);
	for( i = amount - 1 ;  i >= 0;  i-- ) {
		// tempSkull = new Skull( this.state, this.center.x, this.center.y, this.radius );
		tempSkull = new Skull( this.state, 0, 0, this.radius );

		// Calculates the rotation of the skull 
		rot = ((2 * Math.PI) / amount * i);
		tempSkull.rotation = rot;
		this.skullGroup.addChild(tempSkull);
	}
	this.skullGroup.x = this.center.x;
	this.skullGroup.y = this.center.y;
	this.addChild( this.skullGroup );
};

MiniGame.prototype.resetHealth = function(){

	// Health should equal the current amount of skulls
};

MiniGame.prototype.getHealth = function() {
	return this.skullGroup.members.length;
};

MiniGame.prototype.createBlueCircle = function() {
	this.blueCircle = new Kiwi.GameObjects.Sprite( this.state, this.state.textures.blueCircle, this.center.x , this.center.y -this.radius);
	this.blueCircle.anchorPointY += this.radius - this.blueCircle.height * 0.5;
	this.blueCircle.anchorPointX -= this.blueCircle.width * 0.5;
	this.state.addChild(this.blueCircle);
};

MiniGame.prototype.startMiniGame = function() {
	this.miniGameActive = true;

};


MiniGame.prototype.missedHit = function() {
	this.timesMissed = this.blueCircleGroup.members[0].missedHit();
};

MiniGame.prototype.startNextStage = function(){

	this.stage += 1;
	this.hit = false;
	this.skullGroup.members[0].alpha = 1;
	}

MiniGame.prototype.updateRotation = function(){
	this.updateSkullRotation();
	this.updateBlueCircleRotation();


	//this.animation.play('dash');
}
MiniGame.prototype.updateSkullRotation = function () {
	for (var i = this.skullGroup.members.length - 1; i >= 0; i--) {
		this.skullGroup.members[i].rotation += this.rotSkullSpeed;
	};
}
MiniGame.prototype.updateBlueCircleRotation = function () {
	this.blueCircle.rotation += this.rotBlueSpeed;
}

MiniGame.prototype.catchSkull = function (skull){
	var circRot, diffAngel, skullRot;

	circRot = this.getAngle(this.blueCircle.rotation);
	skullRot = this.getAngle(skull.rotation);

	
	return this.calculateDifference( circRot, skullRot ) < this.hitRange;

}

MiniGame.prototype.getAngle = function(angle){
	while (angle < 0 ){
		angle += ( Math.PI * 2 );
	}
	return angle % (Math.PI * 2);
}

MiniGame.prototype.calculateDifference = function(a, b){

	var diffAngle = Math.abs(a - b);

	if( diffAngle > Math.PI ){
		return  Math.PI * 2 - diffAngle; 
	} else {
	return diffAngle; 

	}
}
MiniGame.prototype.capture = function(){
	this.animation.play('shoot');
}


MiniGame.prototype.update = function(){
    Kiwi.Group.prototype.update.call(this);
    if( !this.miniGameActive ) {
    	return;
    }

    // If !player.shooting set minigame to inactive.

    this.updateRotation();
    this.updateMiniGamePos();
    this.moveMiniGame();


}

MiniGame.prototype.updatePosition = function() {

	console.log("Update Circle Pos");
	var temp = this.state.weaponManager.beamManager.beams[0];
	this.center.x = temp.worldX + temp.width * 0.5;
	this.center.y = temp.worldY + temp.height * 0.5;
	this.updateObjectPos( this.redCircle );
	this.updateObjectPos( this.blueCircle );
	this.updateObjectPos( this.skullGroup );
};

MiniGame.prototype.updateObjectPos = function( obj ) {
	obj.x = this.center.x;
	obj.y = this.center.y;
	console.log(this.center.x, this.center.y, "Update Circle Pos");
};




MiniGame.prototype.stageUp = function() {
	this.myParent.beamStage += 1;
	this.myParent.beamNeedsUpdating = true;
	this.myParent.updateBeamStage();
	this.myParent.damageEnemy();
};

MiniGame.prototype.stopMiniGame = function () {
	this.removeOldGame();
}


MiniGame.prototype.attemptMatch = function () {
	if(this.miniGameActive){
		for (var i = this.skullGroup.members.length - 1; i >= 0; i--) {
			if( this.catchSkull( this.skullGroup.members[i] ) ) {
				this.skullCaptured( this.skullGroup.members[i] );
				if(this.beamTarget.objType == 'Boss'){
					this.state.boss.hurtByBeam();
				}
			}
		};
	}
}

MiniGame.prototype.skullCaptured = function ( skull ) {
	skull.exists = false;
	
	if( this.getHealth() > 1 ){
		this.state.weaponManager.beamManager.beamUpgrade();
		return true;
	} else {
		this.killTarget();
	}
}
MiniGame.prototype.killTarget = function () {
	this.state.enemyManager.killTrapped();
	this.state.weaponManager.stopShooting();

	this.state.weaponManager.beamManager.enemyKilled();

}