var BeamManager = function (state) {
	"use strict";
	this.state = state;
	this.beams = [];
	this.targetEnemy;
};



BeamManager.prototype.update = function () {
	"use strict";
	if (this.state.weaponManager.currentlyShooting()) {
		// Create beams inside of active beam.
		this.shoot();
		
	}
	this.updateActiveBeamPosition();
	this.updateBeams();
	this.removeOldBeams();
	// console.log( this.beams.length, "Beam Length" );

	// if(this.beams[0] != undefined){
	// 	this.drawCollisionBoxes();
	// }
	

};



BeamManager.prototype.updateActiveBeamPosition = function(){
	if( this.beams[0] != undefined ){
		//if( this.state.weaponManager.shootKeyIsDown ){
			this.beams[0].x = this.state.player.x + this.state.player.width / 2;
			this.beams[0].y = (this.state.player.y + this.state.player.height / 2) - 12;


		//}
	}
}

BeamManager.prototype.drawCollisionBoxes = function(){
	game.stage.clearDebugCanvas();
	for (var i = this.beams.length - 1; i >= 0; i--) {
		for( var j = this.beams[i].members.length - 1; j >= 0; j--){
			this.beams[i].members[j].box.draw(game.stage.dctx);
		};
	};
}

BeamManager.prototype.removeOldBeams = function () {
	for (var i = this.beams.length - 1; i >= 0; i--) {

		// console.dir(this.beams);
		if(this.beams[i].members.length <= 1 ){
			if( !this.beams[i].members[0].objType ){
				if( this.beams[i].members[0].objType != 'beam' ){
					this.removeBeamGroup( this.beams[i] );
					this.beams.splice( i, 1 );
				}
			} else {
				this.removeBeamGroup(this.beams[i])
				this.beams.splice(i, 1);
			}
			
		}
	};
}

BeamManager.prototype.removeBeamGroup = function (beamGroup) {
	for (var i = beamGroup.members.length - 1; i >= 0; i--) {
		// console.log("REMOVE GROUP");
		beamGroup.members[i].exists = false;
		beamGroup.exists = false;
	};
}
//
BeamManager.prototype.updateBeams = function () {
	"use strict";
	var i,
		j;
	for (i = this.beams.length - 1; i >= 0; i -= 1) {
		for (j = 0; j <= this.beams[i].members.length - 1; j += 1) {
			//should the beams update themselves making it so I don't have to worry about non active array collisions 
			this.updateBeamSegment(this.beams[i].members[j], this.beams[i]);
			this.finishedColliding(this.beams[i]);

		}
	}
};


//Checks if beam seg is colliding. 
	//if yes then check if it is part of active beam and isn't colliding
		//starts collision
	//then if not active beam collide into anything
BeamManager.prototype.updateBeamSegment = function (beam, beamGroup) {
	"use strict";
	if ( beam.objType != 'beam' ) {
		return;
	}
	if (this.checkCollision(beam)) {

		// console.log("Is active group ", this.isActiveGroup(beamGroup))
		if (this.isActiveGroup(beamGroup) && !this.activeGroupColliding()) {

			//Should I check if the leader is colliding here before 'splitting' the group
			this.activeBeamCollision(this.isLeader(beam, beamGroup), beam);
			//console.log("Hello beam is leader");

			//this.startColliding(beam, beamGroup);
			return;
		} else { 

			// Non active beam collides (Still undeterminded what it hit)
			// Check if hit 'impact' if not return
			if( this.hittingImpactPoint( beam, beamGroup ) ){
				this.collideBeam(beam, beamGroup);
				return;
			} else {
				this.updateBeamMovement(beam);
				return;
			}
			
		}
	} else {
		//update Movement
		//console.log( "Update Beam Movement" );
		this.updateBeamMovement(beam);
	}
};

BeamManager.prototype.hittingImpactPoint = function ( beam, beamGroup){
	var value =  this.state.collisionManager.collidesWithImpact( beam, beamGroup );
	// console.log( value, "This is the 'collides with impact value" );
	return value;
}
BeamManager.prototype.beamVelocity = function (beam) {
	//var dir = this.getDirection();
	var xVel = 12;
	var yVel = 0;


	return [xVel, yVel]
}

BeamManager.prototype.getDirection = function() {
	var keysDown = this.state.inputManager.getKeysDown();
	if(keysDown.upKey){
		if (keysDown.leftKey){

			// console.log( "Up Left" );
			return -( Math.PI / 4 );
		} else if (keysDown.rightKey){

			// console.log( "Up Right");
			return Math.PI / 4;
		} else {

			// console.log("Up");
			return 0;
		}
	} else if(keysDown.leftKey){

		// Left
		return -( Math.PI / 2 );
	} else if (keysDown.rightKey) {

		//Right
		return Math.PI / 2;
	} else {
		console.log("No direction was selected when shooting")
		if(this.state.player.scaleX < 0){
			return Math.PI / 2;
		} else {
			return -(Math.PI / 2);
		}
	}
}
BeamManager.prototype.updateBeamMovement = function(beam){
	var vel = this.beamVelocity(beam);
	beam.x += vel[0];
	beam.y += vel[1];
	
}

BeamManager.prototype.isActiveGroup = function (beamGroup) {
	"use strict";
	return beamGroup === this.beams[0];
};
BeamManager.prototype.activeGroupColliding = function (beamGroup) {
	"use strict";
	return this.beams[0].members[0].objType == 'impact';
};
BeamManager.prototype.isLeader = function (beam, beamGroup) {
	"use strict";
	return beam == beamGroup.members[0];
};

BeamManager.prototype.createNewActiveBeam = function () {
	"use strict";
	//console.log("Creating New Active Beam")
	var activeBeam = new Kiwi.Group(this.state);
	this.state.addChild(activeBeam);
	return this.beams.unshift(activeBeam);

};

BeamManager.prototype.activeBeamExists = function(){
	if(this.beams[0].members[0]){
		return true;
	} else {
		return false;
	}
}

// Leader is a boolean which is true if the beam being collided
// This beam is part of the active group and is the leader. 
// If it is not then the laser group will split and it will become the leader
BeamManager.prototype.activeBeamCollision = function (leader, beam) {
	"use strict";
	var beamGroup = this.beams[0];
	//  console.log('Collision Started ', leader, beam);
	if(!this.activeBeamExists()){
		return;
	}
	if(leader){
		//get target
		this.startColliding(beam, beamGroup);
		this.setTargetEnemy(beam)

	} else if (beam.objType === 'beam') {
		//If leader beam is not impacting break beam, otherwise nothing should happen
		if(this.beams[0].members[0].objType == 'impact' || this.beams[0].members[0] == undefined){
			return;
		}

		//BREAK BEAM HERE
		var newBeamGroup = this.breakActiveBeam(beam);
		this.activeBeamCollision(this.isLeader(newBeamGroup[0], newBeamGroup[1]), newBeamGroup[0])
	}

};

BeamManager.prototype.setTargetEnemy = function( beam ){
	var beamTemp = beam;
	var hit = this.state.collisionManager.beamCollision(beam);

	if( hit === false ) {
		return false;
	} else {
		this.targetEnemy = hit;
	}
};

// Checks what pos beam collision is at
// Then takes all of the members after it (The new beams) and add it to a group
// returns group
BeamManager.prototype.breakActiveBeam = function (beam) {
	var index = this.beams[0].getChildIndex(beam);
	var tempGroup = new Kiwi.Group(this.state);
	console.log ( "Break Active Beam");
	for (var i = this.beams[0].members.length - 1; i >= 0; i--) {
		if(i >= index){
			tempGroup.addChild(this.beams[0].members[i]);

		}
	}
	//console.log("a lot");
	console.log( index, "Index", this.beams.length, "Length", tempGroup );
	this.beams.unshift(tempGroup);
	this.state.addChild( this.beams[0] );
	var myObj = [tempGroup.members[0], tempGroup];
	return myObj;
}

BeamManager.prototype.collideBeam = function ( beam, beamGroup ) {

	// Beam disapear / die / explode / create impact
	// Only 'collides' if front beam or front beam is colliding
	if( beam == beamGroup.members[0] ) {

		// Start collide here
	} else if ( beam == beamGroup.members[1] ) {


		// Disappear and replace slot in array (Or add to queue to be removed)
		this.destroyBeam( beam, beamGroup );
		return;
	} else { 

	// Not front beam or not next in line to get destroyed
	}
	"use strict";
};


BeamManager.prototype.startColliding = function (beam, beamGroup) {
	"use strict";
	var pointX, pointY,
		collider = beam,
		impact = new Impact(this.state, collider.x, collider.y),
		impactCollisionBounds,
		impactBoundSize = 4,
		pushDistance = 60,
		pushSegments = 8;

		this.state.miniGameManager.createMiniGame( this.state.player, 3 );


	pointX = collider.x + ( collider.width / 2 ) - ( impact.width / 2 );
	pointY = collider.y + ( collider.width / 2 ) - ( impact.width / 2 );
	
	this.impact = new Kiwi.Geom.Point( pointX, pointY );
	impact.box.hitbox = new Kiwi.Geom.Rectangle ( 500, 10, 1000, 1000);

	// Checks to see if the beamgroup is too close to player
	// If so move impact away from player
	if(beamGroup.members.length < pushSegments){
		this.impact.x =+ pushDistance;
	}

	impact.x = this.impact.x;
	impact.y = this.impact.y;
	beamGroup.addChildAt(impact, 0);
};
BeamManager.prototype.finishedColliding = function(beamGroup) {
	//console.log(beamGroup, " Beam Group");
	if(beamGroup.members[0].objType == 'impact' && beamGroup.length === 1){
		beamGroup.exists = false;
	}
}
BeamManager.prototype.destroyBeam = function ( beam, beamGroup ) {
	beam.exists = false;
	beamGroup.removeChild(beam);

}

BeamManager.prototype.shoot = function () {
	"use strict";
	if ( !this.state.weaponManager.currentlyShooting() ) {
		this.state.weaponManager.shooting = true;
		this.createNewActiveBeam();

		// Set the rotation
		// Added half pi because beam velocity is to the right ( x += 12 )
		this.beams[0].rotation = this.getDirection() - (Math.PI/2);
		this.createBeam();
	} else {

		//continue shooting
		//Add beam to active beam array
	   if( this.activeGroupExists() ){
	   		this.createBeam();
	   }
		
		return true;
	}
};

BeamManager.prototype.createBeam = function () {
	var beamSegment = new Beam( this.state, 0, 0, 0, 0 );

	this.beams[0].addChild(beamSegment);
	
	

}

BeamManager.prototype.activeGroupExists = function () {
	if( this.beams[0] == undefined) {

		// This occurs when firing on top of an enemy. 
		// I assume this is to do with creating a collision before the group exists
		return false;
	}
	if( this.beams[0].objType != "Group" ) {
		return true;
		
	} else {

		// This has occured when firing started as group was being removed
		return false;
		console.error("Active Beam Group does not exist as a Kiwi.Group");
	}
}

BeamManager.prototype.checkCollision = function (beam) {
	var beamTemp = beam;
	var hit = this.state.collisionManager.beamCollision(beam);

	if( hit === false ) {
		return false;
	} else {
		switch ( hit.collision.objType ) {
			case "Ghost":
				this.state.enemyManager.trap( hit.collision );
				break;
			default:
				break;
		}

		// console.log('Collision with',  hit.collision);
		return true;
	}
	
}

BeamManager.prototype.canTrap = function (){
	return this.state.weaponManager.shootKeyIsDown;
}

