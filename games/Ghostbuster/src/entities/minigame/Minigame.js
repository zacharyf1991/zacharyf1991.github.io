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
	this.center;

	this.radius = 80;

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
	this.center = new Kiwi.Geom.Point( target.x, target.y ); // += target.centerPoint.x, target.y += target.centerPoint.y );
	this.createRedCircle();
	this.createSkulls( health );
	//this.resetHealth();
	this.createBlueCircle();

	this.startMiniGame();
};

MiniGame.prototype.createRedCircle = function( ){
	this.redCircle = new Kiwi.GameObjects.Sprite( this.state, this.state.textures.redCircle, this.center.x, this.center.y );
	this.state.addChild(this.redCircle);
};
MiniGame.prototype.createSkulls = function ( amount ) {
	var i, rot, tempSkull,tempSkullGroup;
	this.skullGroup = new Kiwi.Group(this.state);
	for( i = amount - 1 ;  i >= 0;  i-- ) {
		tempSkull = new Skull( this.state, this.center.x, this.center.y, this.radius );

		// Calculates the rotation of the skull 
		rot = ((2 * Math.PI) / amount * i);
		tempSkull.rotation = rot;
		this.skullGroup.addChild(tempSkull);
	}
	this.addChild( this.skullGroup );
};

MiniGame.prototype.resetHealth = function(){

	// Health should equal the current amount of skulls
};

MiniGame.prototype.getHealth = function() {
	return this.skullGroup.members.length();
};

MiniGame.prototype.createBlueCircle = function() {
	this.blueCircle = new Kiwi.GameObjects.Sprite( this.state, this.state.textures.blueCircle, this.center.x , this.center.y -this.radius);
	this.blueCircle.anchorPointX += this.radius
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
	var circRot, skullRot;

	circRot = this.getAngle(this.blueCircle.rotation);
	skullRot = this.getAngle(this.skull.rotation);

	return this.calculateDifference( circRot, skullRot ) < this.hitRange;
}

MiniGame.prototype.getAngle = function(angle){
	while (angle < 0 ){
		angle += ( Math.PI * 2 );
	}
	return angle % (Math.PI * 2);
}

MiniGame.prototype.calculateDifference = function(a, b){
	return Math.abs(a - b);
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


}

MiniGame.prototype.stageUp = function() {
	this.myParent.beamStage += 1;
	this.myParent.beamNeedsUpdating = true;
	this.myParent.updateBeamStage();
	this.myParent.damageEnemy();
};