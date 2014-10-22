CollisionManager = function(state){
	this.state = state;
	this.beamCollideDistance = 12;

	this.ghostCollideDistance = 40;

	this.bookCollideDistance = 30;
	this.shieldHitDistance = 200;
	this.bossHitDistance = 70;
	this.bookHitDistance = 30;


}



/**
* This method checks to see if a player is on a leftSlope.
*
* Please note, "leftSlope" is refering to a slope that when the player is standing on the tile, facing away from the tile, the player is facing left.
* Also note, this function checks for the outward edges of the sloping tile and calculates those points too for a more polished slope interaction
*
* @method checkLeftSlope
* @public
*/

CollisionManager.prototype.update = function(){
	var onGround = false;

	//if the player is not on a slope, check for regular tile collision
	if (!this.state.sloping) {
		//overlap ground
		this.state.levelManager.groundLayer.physics.overlapsTiles(this.state.player, true);
		//Are we on the ground?
		if (this.state.player.physics.isTouching(Kiwi.Components.ArcadePhysics.DOWN)) {
			this.jumps = 0;
			if(this.state.player.jumping){
				this.state.player.roll();
			}
			onGround = true;
		}
	} else {
		//on ground anyway, so reset jumps
		if (this.state.player.physics.velocity.y >= 0) {
			this.state.jumps = 0;
			if(this.state.player.jumping){
				this.state.player.roll();
			}
			onGround = true;
		}
	}
	
	//set animation
	if (onGround) {
		if (this.state.player.physics.velocity.x == 0) {
			//this.animatePlayer('idle');
		} else {
		   // this.animatePlayer('walking');
		}
	}



}
CollisionManager.prototype.checkLeftSlope = function () {
	var tx = Math.floor(this.state.px / this.state.tileWidth);
	var ty = Math.floor(this.state.py / this.state.tileHeight);

	//basic slope tile collision, entering a slope from the top
	var slope = this.state.levelManager.slopeLeftLayer.getTileFromXY(tx, ty);
	if (slope != null) {
		//if a tile exists, check collision
		if (slope.index != 0) {
			//get the slope postion
			var slopeX = tx * this.state.tileWidth;
			var slopeY = ty * this.state.tileHeight;
			this.state.sloping = true;

			//get the difference of player position ad slope 0,0 co-ordinates
			var diffX = this.state.px - slopeX;
			var diffY = this.state.py - slopeY;

			//if you're within the solid part of a sloping tile
			//OR if youve just entered a tile from the right, snap down into the tile
			if ((diffY >= this.state.tileHeight - diffX)
			|| (this.state.px - (this.state.player.physics.velocity.x / 10) >= slopeX + this.tileWidth)) {
				var destY = slopeY + this.state.tileHeight - diffX;

				this.state.player.y = Math.ceil(destY - this.state.player.height);
				//this.player.physics.velocity.y = 40;

				//already sloping, so no need for further checking
				return;
			}
		}
	}

	//check when entering onto a sloping tile, and also when between two, or when you'ce fallen "into" the tile
	var aboveSlope = this.state.levelManager.slopeLeftLayer.getTileFromXY(tx, ty-1);
	if (aboveSlope != null) {
		//if a tile exists, check collision
		if (aboveSlope.index != 0) {
			var aboveSlopeX = tx * this.state.tileWidth;
			var aboveSlopeY = (ty-1) * this.state.tileHeight;

			//flag to ignore remaining map collision in the update loop
			this.state.sloping = true;

			var diffX = this.state.px - aboveSlopeX;
			var destY = (aboveSlopeY + this.state.tileHeight) - diffX;

			this.state.player.y = destY - this.state.player.height;
			//this.player.physics.velocity.y = 40;
		}
	}
}

/**
* This method checks to see if a player is on a rightSlope.
*
* Please note, "rightSlope" is refering to a slope that when the player is standing on the tile, facing away from the tile, the player is facing right.
* Also note this function checks for the outward edges of the sloping tile and calculates those points too for a more polished slope interaction
*
* @method checkRightSlope
* @public
*/
CollisionManager.prototype.checkRightSlope = function () {
	if (this.sloping) {
		//console.log('Already sloping on left slope')
		return;
	}
	//get the bottom centre point ofthe character to calculate position from
	//tile based location
	var tx = Math.floor(this.state.px / this.state.tileWidth);
	var ty = Math.floor(this.state.py / this.state.tileHeight);

	var slope = this.state.levelManager.slopeRightLayer.getTileFromXY(tx, ty);
	if (slope != null) {
		//if a tile exists, check collision
		if (slope.index != 0) {
			//get the slope postion
			var slopeX = tx * this.state.tileWidth;
			var slopeY = ty * this.state.tileHeight;

			//flag to ignore remaining map collision in the update loop
			this.state.sloping = true;

			//get the difference of player position ad slope 0,0 co-ordinates
			var diffX = this.state.px - slopeX;
			var diffY = this.state.py - slopeY;

			//if you're within the solid part of a sloping tile
			//OR if youve just entered a tile from the left, snap down into the tile
			if ((diffY >= diffX)
			|| (this.state.px - (this.state.player.physics.velocity.x / 10) <= slopeX)) {
				this.state.player.y = Math.ceil(slopeY + diffX - this.state.player.height);
				//this.player.physics.velocity.y = 40;

				//already sloping, so no need for further checking
				return;
			}
		}
	}

	//check when entering onto a sloping tile, or when you've fallen "into" the tile
	var aboveSlope = this.state.levelManager.slopeRightLayer.getTileFromXY(tx, ty - 1);
	if (aboveSlope != null) {
		//if a tile exists, check collision
		if (aboveSlope.index != 0) {
			//flag to ignore remaining map collision in the update loop
			this.state.sloping = true;

			var aboveSlopeX = tx * this.state.tileWidth;
			var aboveSlopeY = (ty - 1) * this.state.tileHeight;
			var diffX = this.state.px - aboveSlopeX;

			this.state.player.y = Math.ceil(aboveSlopeY + diffX - this.state.player.height);
			//this.player.physics.velocity.y = 40;
		}
	}
}



CollisionManager.prototype.beamCollision = function(beam) {
	if(beam == undefined){
		return false;
	}
	
	// Checks to see if beam exists
	if ( beam.box.bounds == undefined){
			//return false;
	}

	// Checks to see if beam has collided with enemy
	for (var i = this.state.enemyManager.enemies.members.length - 1; i >= 0; i--) {

		if( beam.centerPoint.distanceTo( this.state.enemyManager.enemies.members[i].centerPoint ) < this.ghostCollideDistance ) {
			//console.log( "Hitting Impact Point Zach");
				target = this.state.enemyManager.enemies.members[i];
			 	var temp = { collision: this.state.enemyManager.enemies.members[i] };
			 	return temp;
				// return true;
		}
		
	};

	// Check to see if beam hits a book (After Ghost)

	//Checks to see if boss exists
	if (this.state.boss != undefined) {
		// console.log("Boss does exist");
		for (var i = this.state.boss.books.members.length - 1; i >= 0; i--) {

			if( this.state.boss.books.members[i].moving ) {
				continue;
			}

			if( beam.centerPoint.distanceTo( this.state.boss.books.members[i].centerPoint ) < this.bookCollideDistance ) {
				//console.log( "Hitting Impact Point Zach");
					target = this.state.boss.books.members[i];
				 	var temp = { collision: this.state.boss.books.members[i] };
				 	return temp;
					// return true;
			}
			
		};
		for (var i = this.state.boss.trappedBooks.members.length - 1; i >= 0; i--) {

			if( this.state.boss.trappedBooks.members[i].moving ) {
				continue;
			}

			if( beam.centerPoint.distanceTo( this.state.boss.trappedBooks.members[i].centerPoint ) < this.bookCollideDistance ) {
				//console.log( "Hitting Impact Point Zach");
					target = this.state.boss.trappedBooks.members[i];
				 	var temp = { collision: this.state.boss.trappedBooks.members[i] };
				 	return temp;
					// return true;
			}
			
		};
	}
	return false;
	// this.beamCollideWithBook(beam);
	// this.beamCollideWithEnemy(beam);
	// this.beamCollideWithEnvironment(beam);

}


CollisionManager.prototype.collidesWithImpact = function(beam, beamGroup) {
	if(beam == undefined){
		console.log( "No beam" );
		return false;
	}
	// console.log ( "Distance between beam and impact:", beam.centerPoint.distanceTo( beamGroup.members[0].centerPoint ));
	if( beam.centerPoint.distanceTo( beamGroup.members[0].centerPoint ) < this.beamCollideDistance ) {
		// console.log( "Hitting Impact Point Zach");
		beam.exists = false;
		return true;
	}
	
		
	// if( beam.box.worldBounds.intersects( beamGroup.members[0].box.worldBounds ) ) {
	// 	console.log( "Hitting Impact Point Zach");
	// 	return true;
	// }
	return false;

}


CollisionManager.prototype.checkShieldBossHit = function ( shield, book) {
	if( shield.centerPoint.distanceTo( book.centerPoint ) < this.shieldHitDistance ) {
		// console.log( "Hitting Impact Point Zach");
		//beam.exists = false;
		return true;
	} else {
		return false;
	}
}

CollisionManager.prototype.checkBossHit = function(beam) {
	if(beam == undefined){
		return false;
	}
	
	// Checks to see if beam exists
	if ( beam.box.bounds == undefined){
			//return false;
	}

	// Checks to see if beam has collided with enemy
	if (this.state.boss == undefined) {
		// console.log("Boss does not exist");
		return;
	}

	if( beam.centerPoint.distanceTo( this.state.boss.centerPoint ) < this.bossHitDistance ) {
		//console.log( "Hitting Impact Point Zach");
			target = this.state.boss;
		 	var temp = { collision: this.state.boss };
		 	return temp;
			// return true;
	}
	

	return false;
	// this.beamCollideWithBook(beam);
	// this.beamCollideWithEnemy(beam);
	// this.beamCollideWithEnvironment(beam);

}

CollisionManager.prototype.bookHitPlayer = function() {

	var books = this.state.boss.books.members;


	// Checks to see if beam has collided with enemy
	for (var i = books.length - 1; i >= 0; i--) {

		if( this.state.player.centerPoint.distanceTo( books[i].centerPoint ) < this.bookHitDistance ) {
			//console.log( "Hitting Impact Point Zach");
			return true;
		}
		
	};

	return false;
	// this.beamCollideWithBook(beam);
	// this.beamCollideWithEnemy(beam);
	// this.beamCollideWithEnvironment(beam);

}