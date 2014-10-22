//PlayerManager / Player
var PlayerManager = function (state, x, y){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['egonSprite'], x, y);
	this.state = state;



	// Top half animations
	this.animation.add('idle', [15], 0.1, true);
	this.animation.add('walk', [ 8, 9, 10, 11, 12, 13, 14, 15 ], 0.05, true);
	this.animation.add('shootHorz', [ 8, 9, 10, 11, 12, 13, 14, 15 ], 0.05, true);
	this.animation.add('shootVert', [ 16, 17, 18, 19, 20, 21, 22, 23 ], 0.05, true);
	this.animation.add('shootDiagonal', [ 0, 1, 2, 3, 4, 5, 6, 7 ], 0.05, true);
	this.animation.add('jump', [ 24, 25], 0.1, false);
	this.animation.add('roll', [ 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33 ], 0.005, false);
	this.animation.play('idle'); 

	// Bottom half animations
	
	// this.members[1].animation.add('walk', [ 34, 35, 36, 37, 38, 39, 40, 41 ], 0.05, true);
	// this.members[1].animation.add('idle', [42], 0.1, false);
	// this.members[1].animation.play('idle'); 


	this.box.hitbox = new Kiwi.Geom.Rectangle(25, 20, 35, 80); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	
	this.physics.acceleration.y = 30;
	//this.physics.velocity.y = 15;

	this.force = 4;
	this.maxRunVelo = 26;
	this.beamStage = 0;
	this.jumpHeight = 40;

	this.centerPoint = new Kiwi.Geom.Point( 0, 0 );

	///////////////////
	//KEYBOARD
	this.rightKeyDown = false;
	this.leftKeyDown = false;
	this.upKeyDown = false;
	this.jumpKeyDown = false;


	////////////////////////
	//MOUSE
	// this.state.game.input.onUp.add(this.mouseUp, this);
	// this.state.game.input.onDown.add(this.mouseDown, this);



	/////////////////////////
	//BOOLEANS
	this.currDir = this.RIGHT;
	this.jumping = false;

	this.takeDamageTimer = this.game.time.clock.createTimer('takeDamageTimer', 0.25, 0, false);




	this.animation.getAnimation('roll').onStop.add(this.finishedRoll, this);



}
Kiwi.extend(PlayerManager, Kiwi.GameObjects.Sprite);



PlayerManager.prototype.takeDamage = function() {
	//console.log("I'M HERE")
	this.state.cameraManager.takeDamage();

	this.takeDamageTimer.clear();
	this.takeDamageTimer.stop();
	this.takeDamageTimer.delay = 0.14;
	this.takeDamageTimer.repeatCount = 6;
	this.takeDamageTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.flash, this);
	this.takeDamageTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.stopFlash, this);
	this.takeDamageTimer.start();
	
};

PlayerManager.prototype.flash = function() {
	if(this.alpha == 0.75){
		this.alpha = 1;
	} else {
		this.alpha = 0.75;
	}
};
PlayerManager.prototype.stopFlash = function() {
	
	this.alpha = 1;
	
};


PlayerManager.prototype.update = function(){
	//console.log(this.physics.velocity.x, this.x, this.physics.last.x);

	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	if(this.x > 2200){
		this.x = -50;
	} else if(this.x < -50){
		this.x = 2200;
	}

	//if(this.state.enemyManager.checkCollision(this)){
		//console.log("Hit Enemy");
	//}

	//this.physics.update();
	this.updateMovement();

	// Checks if boss exists
	if(this.state.boss){
		this.updateBookCollisions();
		
	}



	
	

	if(this.y > 1000){
		this.y = 50;
	}

	//CHECK TILES
	//round the player position to make tile calculation easier
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);

	this.state.playersLegs.updateLegs();

	if( this.state.weaponManager.shooting ) {
		this.animation.play( this.shootAnimation, false );
		if(this.scaleX != this.shootScaleX){
			this.state.playersLegs.animation.currentAnimation.reverse = true;
		} else {
			this.state.playersLegs.animation.currentAnimation.reverse = false;
		}

		this.scaleX = this.shootScaleX;
		this.state.playersLegs.scaleX = this.shootScaleX;
	}
		
	
}

PlayerManager.prototype.updateBookCollisions = function() {
	if ( this.state.collisionManager.bookHitPlayer() ){
		this.hitByEnemy();
	}
}
PlayerManager.prototype.setAnimation = function () {
	var dir = this.state.weaponManager.beamManager.getDirection();


		switch ( dir ) {

			// Left up
			case -( Math.PI / 4 ):
				this.shootAnimation = 'shootDiagonal';
			// this.animation.play( 'shootDiagonal', false );
				break;

			// Right Up
			case Math.PI / 4:
				this.shootAnimation = 'shootDiagonal';
				// this.animation.play( 'shootDiagonal', false );
				break;

			// Up
			case 0:
				this.shootAnimation = 'shootVert';
				// this.animation.play( 'shootVert', false );
				break;

			// Left
			case -( Math.PI / 2 ):
				this.shootAnimation = 'shootHorz';
				// this.animation.play( 'shootHorz', false );
				break;

			// Right
			case Math.PI / 2:
				this.shootAnimation = 'shootHorz';
				// this.animation.play( 'shootHorz', false );
				break;
			default:
				break;
		}

		this.shootScaleX = this.scaleX;


}

// This get the animation if the player is not shooting
PlayerManager.prototype.setNormalAnimation = function () {
	var dir = this.state.weaponManager.beamManager.getDirection();


		switch ( dir ) {

			// Left up
			case -( Math.PI / 4 ):
				this.normalAnimation = 'shootDiagonal';
			// this.animation.play( 'shootDiagonal', false );
				break;

			// Right Up
			case Math.PI / 4:
				this.normalAnimation = 'shootDiagonal';
				// this.animation.play( 'shootDiagonal', false );
				break;

			// Up
			case 0:
				this.normalAnimation = 'shootVert';
				// this.animation.play( 'shootVert', false );
				break;

			// Left
			case -( Math.PI / 2 ):
				this.normalAnimation = 'shootHorz';
				// this.animation.play( 'shootHorz', false );
				break;

			// Right
			case Math.PI / 2:
				this.normalAnimation = 'shootHorz';
				// this.animation.play( 'shootHorz', false );
				break;
			default:
				break;
		}

		//this.shootScaleX = this.scaleX;


}

PlayerManager.prototype.jump = function(){

	if(this.jumpKeyDown && !this.jumping){
		if(this.physics.velocity.x == 0){
			this.physics.velocity.x += (this.maxRunVelo * 1.25) * -this.scaleX;
			//this.scaleX *= -1;
		}
		this.physics.velocity.y = -this.jumpHeight;
		this.physics.velocity.x = this.maxRunVelo * 2 * -this.scaleX;
		this.jumping = true;

		if (this.animation.currentAnimation.name != 'jump'){
			
			   this.animation.play('jump');
	   }
	} 

}

PlayerManager.prototype.roll = function(){
	if (this.animation.currentAnimation.name != 'roll'){
		
		this.animation.play('roll');
	}
}
PlayerManager.prototype.finishedRoll = function(){

	this.jumping = false;
   
}

PlayerManager.prototype.updateAnimations = function () {
	//EITHER MOVE KEYS DOWN
	this.setNormalAnimation();
	if(this.leftKeyDown || this.rightKeyDown){
		//console.log("Animation", this.shootAnimation );
		if (this.animation.currentAnimation.name != this.normalAnimation && !this.jumping ){
				// this.animation.play('walk');

				this.animation.play(this.normalAnimation);
				this.state.playersLegs.animation.play('walk', false);
			}
	} else if(this.upKeyDown) {
		
		//console.log( "INSIDE UP KEY DOWN");
		if (this.animation.currentAnimation.name != this.normalAnimation && !this.jumping ){
				this.animation.play( this.normalAnimation );
			}
	} else {
		if (this.animation.currentAnimation.name != 'idle' && !this.jumping ){
			   this.animation.play('idle');
			   this.state.playersLegs.animation.play('idle', false);
			
		};
			   
	}
}


// If no movement keys are down it eases the players velocity by 92%
PlayerManager.prototype.negativeAccel = function () {

	//BOTH MOVE KEYS UP
	if((!this.rightKeyDown && !this.leftKeyDown) && !this.jumping ){
		if(this.physics.velocity.x > 6 || this.physics.velocity.x < -6){
			this.physics.velocity.x *= 0.92;
		} else {this.physics.velocity.x = 0;}
	}

}

// This is used to slowdown / speed up player if jumping or shooting
PlayerManager.prototype.modifyVelocity = function () {

	if (this.jumping){
		return 2;// this.maxRunVelo * 2;
	} else if (this.state.weaponManager.shooting){
		//
		//console.log("Shooting Mod")
		return 0.5;//this.maxRunVelo * 0.5;
	} else {
		return  1//this.maxRunVelo;
	}

}

PlayerManager.prototype.updateMovement = function(direction){
	this.negativeAccel();
	this.updateAnimations();

	var veloMod = this.modifyVelocity();

	if(this.rightKeyDown){
		this.scaleX = -1;
		if(this.physics.velocity.x < this.maxRunVelo * veloMod){
			
			this.physics.velocity.x += this.force;
		} else if(!this.jumping){
			this.physics.velocity.x = this.maxRunVelo  * veloMod;
		}

	} else if(this.leftKeyDown){
		this.scaleX = 1;
		//this.physics.velocity.x -= this.force;
		if(this.physics.velocity.x > -this.maxRunVelo * veloMod){
			//console.log(this.physics.velocity.x);
			this.physics.velocity.x -= (this.force);
		} else if(!this.jumping){
			this.physics.velocity.x = -this.maxRunVelo  * veloMod;
		}

	}
	this.centerPoint.x = this.worldX + this.width * 0.5;
	this.centerPoint.y = this.worldY + this.height * 0.5;
}







PlayerManager.prototype.updateKeyDown = function(key) {
	if(key == 'RIGHT'){
		this.rightKeyDown = true;
	}
	if(key == 'LEFT'){
		this.leftKeyDown = true;
	}

	if( key == 'UP'){
		this.upKeyDown = true;
	}

	if(key == 'JUMP'){
		this.jumpKeyDown = true;
		this.jump();
	}


};




PlayerManager.prototype.updateKeyUp = function(key) {
	if(key == 'RIGHT'){
		this.rightKeyDown = false;
	}
	if(key == 'LEFT'){
		this.leftKeyDown = false;
	}
	if( key == 'UP'){
		this.upKeyDown = false;
	}


	if(key == 'JUMP'){
		this.jumpKeyDown = false;
	}
};

PlayerManager.prototype.hitByEnemy = function() {
	if(!this.jumping){
		this.state.gameManager.playerHitByEnemy();
	}
};






