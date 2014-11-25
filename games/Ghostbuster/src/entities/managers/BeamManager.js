var BeamManager = function (state) {
	"use strict";
	this.state = state;

	//this.gunPoint = new Kiwi.Geom.Point( 0, 0 );

	this.currentlyShooting = false;
	this.spawnPoint = new Kiwi.Geom.Point ( 0, 0 );

	// this.beams;
	this.beam;
	this.nonActiveBeams = [];
	this.sparkPoint = new Kiwi.Geom.Point( 0, 0 );

};


// This method is continuiously called when the shoot key is down. 
BeamManager.prototype.shoot = function () {
	"use strict";

	if(this.state.player.alpha == 0){
		return;
	}

	if( this.currentlyShooting ){


		//returns an object with an enemy and an intersect reulst. (only returns if it is not already hit.)
		var collideWith = this.state.collisionManager.checkBeamIntersectsEnemy();
		// console.log(collideWith);

		if ( collideWith ){
			for (var k = collideWith.length - 1; k >= 0; k--) {
				//collideWith[i]dd
				collideWith[k].enemy.hit = true;
				var matched = false;
				for (var i = this.beam.targets.length - 1; i >= 0; i--) {
					if ( this.beam.targets[i] == collideWith[k].enemy ) {
						matched = true;
					}
				};
				if( !matched ){
					// console.log( "Hit New Enemy" );
					collideWith[k].enemy.canEscape = true;
					this.state.survivalGame.resetSpawn(true);
					var index = this.beam.targets.length;
					this.beam.targets.push(collideWith[k].enemy);

					collideWith[k].enemy.targetIndex = index;

					// If minigame exists add to it instead of creating a new one.
					this.state.miniGameManager.createMiniGame( null , 3 );

					if( !this.beam.impact.exists ){
						this.beam.createImpact();
						
					}

					var colPoint = new Kiwi.Geom.Point( collideWith[k].intersectResult.x, collideWith[k].intersectResult.y );

					// this.beam.desiredLength.x = colPoint.x - this.beam.x;
					// this.beam.desiredLength.y = colPoint.y - this.beam.y;

					var tempLine = new Kiwi.Geom.Line(this.beam.x, this.beam.y, colPoint.x, colPoint.y)

					if( !this.beam.beamLocked ){
						this.beam.beamLocked = true;
						this.beam.beamLength = tempLine.length;
						this.beam.maxLength = tempLine.length;

						
					}
					// console.log(tempLine.length, this.beam.beamLength, "Line Length");;

					this.beam.beamVelo = 0;
					
				}
			};
			
		}

		// Continue Shooting
	} else {

		// Start Shooting

		// Create Beam

		this.removeOldBeam();

		var rotation = this.getDirection() - Math.PI / 2;
		var beam = new Beam ( this.state, this.state.player.centerPoint.x, this.state.player.centerPoint.y,  rotation, 0 );


		this.state.addChild( beam );

		
		beam.rotation = rotation;

		this.beam = beam;

		// console.dir ( this.beam, "New Beam" );

		// Reset Everything (MiniGame / Targets)?;
		this.currentlyShooting = true;
	}

};


// This method is called when the shoot key has been lifted
BeamManager.prototype.stopShooting = function () {
	"use strict";
	// console.log( "Stop Shooting" );
	this.currentlyShooting = false;

	this.releaseGhosts();

	this.removeOldBeam();
	this.targets = [];
	
};

BeamManager.prototype.removeOldBeam = function ( x, y ) {
	"use strict";
	if ( this.beam ){
		this.beam.removeBeam();
		this.beam.exists = false;
	}
	if(this.state.miniGameManager.active){
		this.state.miniGameManager.removeOldGame();
	}
};


BeamManager.prototype.moveBeam = function (  ) {
	"use strict";
	if( this.beam != undefined ){
		if( this.beam.exists ){
			var offX, offY;
			switch ( this.beam.rotation + Math.PI * 0.5 ){
				case (-( Math.PI / 2 )): // Left
					offX = -50;
					offY = 15;
					break;
				case (-( Math.PI / 4 )): // Up Left
					offX = -35;
					offY = -25;
					break;
				case 0: // Up
					offX = 0;
					offY = -50;
					break
				case Math.PI / 4: // Up Right
					offX = 35;
					offY = -25;
					break;
				case  Math.PI / 2: //Right
					offX = 50;
					offY = 15;
					break;
				default:
					offX = 0;
					offY = 0;
			}
			
			this.sparkPoint = new Kiwi.Geom.Point(  this.state.player.centerPoint.x + offX, this.state.player.centerPoint.y + offY  )
			this.beam.moveBeam(  this.sparkPoint.x, this.sparkPoint.y );
		}
	}	
};

BeamManager.prototype.getHoldPos = function ( index ) {
	"use strict";
	var myPoint, offX, offY,
		offset = 20;
	if( this.beam.targets.length <= 1 ){
		return this.beam.desiredLength;
	} else if ( this.beam.targets.length == 2 ) {
		if( index == 0 ){
			offX = offset * 0.5;
			offY = -offset;
		} else {
			offX = -offset * 0.5;
			offY = offset;
		}

	} else if ( this.beam.targets.length >= 3 ) {
		if( index == 0 ){
			offX = 0;
			offY = -offset;

		} else if( index == 1 ){
			// console.log("INDEX IS ONE");
			offX = -offset;
			offY = offset;
		} else {
			offX = offset;
			offY = offset;
		}

	} 
	myPoint = new Kiwi.Geom.Point ( this.beam.desiredLength.x + offX, this.beam.desiredLength.y + offY );
	// console.log( "My POint", myPoint );
	return myPoint;
};

BeamManager.prototype.releaseGhosts = function () {
	"use strict";
	this.state.enemyManager.releaseGhosts();	
};

BeamManager.prototype.update = function () {
	this.updateSpawnPoint();
	this.moveBeam();
}
BeamManager.prototype.updateSpawnPoint = function () {
	if( this.state.player ){
		this.spawnPoint.x = this.state.player.x;
		this.spawnPoint.y = this.state.player.y;
	}
};

BeamManager.prototype.updateBeamStage = function () {
	// console.log("UPDATE BEAM");
	if(this.beam){
		if(this.beam.beamStage < 2){
		this.beam.beamStage += 1;
			
		}
		// console.log("INSIDE", this.beam.beamStage);
	}
}


BeamManager.prototype.getDirection = function() {
	var keysDown = this.state.inputManager.getKeysDown();
	if(keysDown.upKey){
		if (keysDown.leftKey){

			// console.log( "Up Left" );
			if(this.state.player.scaleX == 1){
				return -( Math.PI / 4 );
			} else {
				return Math.PI / 4;
			}
		} else if (keysDown.rightKey){

			// console.log( "Up Right");
			return Math.PI / 4;
		} else {

			// console.log("Up");
			return 0;
		}
	} else if(keysDown.leftKey){

		// Left
		// return -( Math.PI / 2 );
		if(this.state.player.scaleX == 1){
			return -( Math.PI / 2 );
		} else {
			return Math.PI / 2;
		}
	} else if (keysDown.rightKey) {

		//Right
		return Math.PI / 2;
	} else {

		// console.log("No direction was selected when shooting")
		if(this.state.player.scaleX < 0){
			return Math.PI / 2;
		} else {
			return -(Math.PI / 2);
		}
	}
}

BeamManager.prototype.enemyKilled = function() {
		this.stopShooting();
}
