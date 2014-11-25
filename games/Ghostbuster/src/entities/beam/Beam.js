var Beam = function( state, x, y, angle, beamLength ){
	Kiwi.Group.call( this, state );

	this.x = x;
	this.y = y;


	this.origin = new Kiwi.Geom.Point( 0, 0);

	this.desiredLength;

	this.beamVelo = 25;

	this.maxLength = 1000;

	this.beamLength = 0;

	this.beamLocked = false;
	this.impact = {exists: false}


	// this.spawnPoint = new Kiwi.Geom.Point ( 0, 0 );
	this.impactPoint;

	this.beamLine;
	this.beamSprite;

	this.sparkSprite;
	this.impactSprite;

	this.targets = [];

	this.haveHitTarget = false;
	this.currentlyShooting;

	this.beamStage = 0;
	this.animationCell = 0;

	this.beamLength = beamLength;
	this.angle = angle;

	this.spark = new Spark( this.state, this.x, this.y );
	this.spark.anchorPointY = this.spark.height / 2;
	// this.spark.anchorPointX = 0;
	//this.spark.anchorPointX = -24;
	this.state.addChild( this.spark );

	this.beamRep = new Kiwi.Plugins.GameObjects.Repetition(this.state, this.state.textures.beam, 0, 0);
	this.beamRep.anchorPointY = this.beamRep.height * 0.5;
	
	this.state.addChild(this.beamRep);



	


}


Kiwi.extend(Beam, Kiwi.Group);

Beam.prototype.encase = function( entity ) {
	var group = new Kiwi.Group( this.state );

	group.addChild( entity );
	group.x = entity.x;
	group.y = entity.y;
	entity.x = 0;
	entity.y = 0;

	return group;
};

Beam.prototype.removeBeam = function() {
	// console.log("REMOVE BEAM");
	if(this.spark){
		this.spark.exists = false;
	}
	if(this.impact){
		this.impact.exists = false;
	}
	if(this.primLine){
		this.primLine.destroy();
	}
	if(this.beamRep){
		this.beamRep.exists = false;
	}
};
Beam.prototype.moveBeam = function( x, y ) {
	// console.log("REMOVE BEAM");
	// console.log( "Moving Beam" );
	this.x = x;
	this.y = y;

};
Beam.prototype.getLine = function(){
	return this.beamLine;
}
Beam.prototype.setImpactPoint = function( impactPoint ){
	this.desiredLength = impactPoint;
}
Beam.prototype.addTarget = function( ghost ){
	this.targets.push( ghost );
}
Beam.prototype.getTargets = function(){
}
Beam.prototype.positionTargets = function(){
}


Beam.prototype.update = function(){
    Kiwi.Group.prototype.update.call(this);
    // this.x = this.state.player.x;
    // this.y = this.state.player.y;


    this.updateLength();

    this.updateLines();
    // this.drawLines();
    this.updateAnimation();
    this.drawRepBeam();
    this.updateSpark();
    this.updateImpact();

    // console.log( this.beamLine.length );
    // console.log (this.beamLine);
    // console.log( this.primLine.x, this.primLine.y );
    
}

Beam.prototype.drawRepBeam = function() {
	this.beamRep.rotation = this.rotation;
	this.beamRep.transform.x = this.x + 480;
	this.beamRep.transform.y = this.y + 246;
	this.beamRep.width = this.beamLength;
	// console.log("Beam Rep", this.beamRep.x, this.beamRep.y, this.x, this.y);
}

Beam.prototype.updateSpark = function() {
	if( !this.spark.exists || !this.state.weaponManager.beamManager.sparkPoint) {
		return;
	}
    this.spark.x = this.state.weaponManager.beamManager.sparkPoint.x - this.spark.width/2;
    this.spark.y = this.state.weaponManager.beamManager.sparkPoint.y - this.spark.height/2;
    this.spark.rotation = this.rotation;
}

Beam.prototype.updateImpact = function() {
	if( !this.impact.exists ) {
		return;
	}
    this.impact.x = this.desiredLength.x - this.impact.width/2 + this.x;
    this.impact.y = this.desiredLength.y - this.impact.height/2 + this.y;
}
Beam.prototype.updateLength = function() {
    this.beamLength += this.beamVelo;
    if( this.beamLength > this.maxLength ){
    	this.beamLength = this.maxLength;
    }
}
Beam.prototype.updateLines = function() {

	var pointX,
		pointY;

	pointX = this.origin.x + this.beamLength * Math.cos( this.rotation );
	pointY = this.origin.y + this.beamLength * Math.sin( this.rotation );


	this.desiredLength = new Kiwi.Geom.Point( pointX, pointY );

	this.beamLine = new Kiwi.Geom.Line( this.origin.x + this.x, this.origin.y + this.y,
				this.desiredLength.x + this.x, this.desiredLength.y + this.y );

	// console.log ( this.beamLine );

	
}

Beam.prototype.setLength = function( point ) {

	var num1 = Math.pow( this.origin.x - point.x, 2 ) 
			+ Math.pow( this.origin.y - point.y, 2 );

	var num2 = Math.sqrt(num1);
	this.beamLength = num2;
}

Beam.prototype.createImpact = function() {
	this.impact = new Impact( this.state, this.x + this.desiredLength.x, this.y + this.desiredLength.y);
	this.updateImpact();
	this.state.addChild(this.impact);
	// console.log("My Impact", this.impact);
}

Beam.prototype.drawLines = function() {

	// Demo linesjjj
	params = {
		state: this.state,
		strokeColor: [ 0.94,  0.67, 0.45 ],
		strokeWidth: 5,
		points: [ [ 0 , 0 ],
		 		[ this.beamLength , 0 ] ]
	};

	if(this.primLine){
		this.primLine.destroy();
	}
	
	this.primLine = new Kiwi.Plugins.Primitives.Line( params );

	// this.primLine.x = this.state.player.x;
	// this.primLine.y = this.state.player.y;
	
	this.addChild( this.encase( this.primLine ) );

	// // console.log( this.primLine, "Zach Line" );
}

Beam.prototype.updateAnimation = function( stage ) {

	//console.log( "Inside update Animation");
	switch ( this.beamStage ) {
		case 0:
			if(this.beamRep.cellIndex >= 11) {
				this.animationCell = 0;
			}
			this.beamRep.cellIndex = this.animationCell;
			break;
		case 1:
			if(this.beamRep.cellIndex >= 23 || this.beamRep.cellIndex < 12) {
				this.animationCell = 12;
			}
			this.beamRep.cellIndex = this.animationCell;
			break;
		case 2:
			if(this.beamRep.cellIndex >= 35 || this.beamRep.cellIndex < 24) {
				this.animationCell = 24;
			}
			this.beamRep.cellIndex = this.animationCell;
			break;
		default:
			console.error( stage, ": Stage was undefined")
			if(this.beamRep.cellIndex >= 11) {
				this.animationCell = 0;
			}
			this.beamRep.cellIndex = this.animationCell;
	};
	// console.log(this.beamStage);
	this.animationCell ++;

	// console.log( this.animation.currentAnimation.name, "Animation current Animation :", stage, "Stage upgrade passed");
};

