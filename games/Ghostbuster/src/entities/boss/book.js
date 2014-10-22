//PlayerManager / Player
var Book = function ( state, type, x, y, toX, toY ){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['books'], x, y);
	this.state = state;

	this.health = 3;
	this.phase = 1;
	this.objType = "Book";
	this.targetImpact = null;
	this.type = type;

	// This is duration the throw tween plays in milliseconds. 
	this.throwSpeed = 1500;
	this.maxHoldTime = 5;

	this.moving = true;

	this.moveTo(toX, toY);


	// Top half animations

	

	switch (type) {
		case 'bible':
			this.animation.add('disappear', [ 0, 1, 2, 3, 4, 5, 6, 7 ], 0.05, false);
			this.animation.add('hold', [ 8, 9 ], 0.05, true);
			this.animation.add('idle', [ 10, 11, 12 ], 0.7, true);
			// console.log(type, "Type of book");
			break;
		case 'book1':
			this.animation.add('disappear', [ 16, 17, 18, 19, 20 /*, 21, 22 */ ], 0.05, false);
			this.animation.add('hold', [ 13, 14 ], 0.05, true);
			this.animation.add('idle', [ 24, 25, 26 ], 0.7, true);
			break;
		case 'book2':
			this.animation.add('disappear', [ 27, 28, 29, 30, 31 ], 0.05, false);
			this.animation.add('hold', [ 32, 33 ], 0.05, true);
			this.animation.add('idle', [ 34, 35, 36 ], 0.7, true);
			break;
		case 'book3':
			this.animation.add('disappear', [ 40, 41, 42, 43, 44 ], 0.05, false);
			this.animation.add('hold', [ 37, 38 ], 0.05, true);
			this.animation.add('idle', [ 45, 46, 47 ], 0.7, true);
			break;
		default:
			console.error("Book type did not match any given case");
			// this.animation.add('disappear', [ 16, 17, 18, 19, 20 /*, 21, 22 */ ], 0.05, true);
			// this.animation.add('hold', [ 13, 14 ], 0.05, false);
			// this.animation.add('idle', [ 24, 25, 26 ], 0.05, false);

			// code
	}
	








	this.animation.play('idle'); 


	this.box.hitbox = new Kiwi.Geom.Rectangle(25, 20, 35, 80); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));


	this.animation.getAnimation('disappear').onStop.add(this.removeBook, this);

	//this.animation.getAnimation('death').onStop.add(this.bossDead, this);

	
	// this.physics.acceleration.y = 30;

	this.centerPoint = new Kiwi.Geom.Point( this.x + this.width * 0.5, this.y + this.height * 0.5 );
	


}
Kiwi.extend(Book, Kiwi.GameObjects.Sprite);


Book.prototype.update = function () {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	this.updateCenterPoint();
	this.checkCollisions();



}


Book.prototype.switchToIdle = function() {
	if( this.animation.currentAnimation != 'idle' ) {
		this.animation.play( 'idle' );
	}
};

Book.prototype.removeBook = function() {
	this.alpha = 0;
	this.exists = false;
};

Book.prototype.grabbed = function( amount ) {

}


Book.prototype.moveTo = function (x, y) {

	var currX = this.x,
		currY = this.y;
	this.tween = this.game.tweens.create(this);

	var tweenObj = {};
	tweenObj.x = x;
	tweenObj.y = y;

	this.moving = true;

	this.tween.to(tweenObj, 1000, Kiwi.Animations.Tweens.Easing.Linear.None); 
	this.tween.onComplete(this.finishedMoving, this);
	//this.tween.delay(2000); //delays the tween after starting. In milliseconds.
	this.tween.start();     //start the tween
}

Book.prototype.checkCollisions = function () {

}

Book.prototype.collideWithBoss = function () {
	
}

Book.prototype.updateCenterPoint = function () {
	this.centerPoint.x = this.worldX + this.width * 0.5;
    this.centerPoint.y = this.worldY + this.height * 0.5;
}

Book.prototype.throwAt = function ( target ) {
	this.moving = true;

	var diffY, diffX,
		currX = this.x,
		currY = this.y;


	diffX = target.x - this.x;
	diffY = target.y - this.y;



	var throwTween = this.game.tweens.create(this);

	var tweenObj = {};
	tweenObj.x = target.x + diffX * 2;
	tweenObj.y = target.y + diffY * 2;

	// console.log(tweenObj);

	throwTween.to(tweenObj, this.throwSpeed, Kiwi.Animations.Tweens.Easing.Linear.None); 
	throwTween.onComplete(this.finishedThrow, this);
	//throwTween.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.finishedThrow, this);
	throwTween.delay(100); //delays the tween after starting. In milliseconds.
	throwTween.start();     //start the tween

}

Book.prototype.finishedThrow = function () {
	this.exists = false;
}

Book.prototype.trapped = function () {
	/*this.exists = false;*/
	this.deathTimer = this.game.time.clock.createTimer('spawn', this.maxHoldTime, 0, false);  
    this.deathTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.disappear, this);

    this.deathTimer.start();


}
Book.prototype.disappear = function () {
	if(this.exists){
		this.animation.play('disappear'); 
	}

}

Book.prototype.finishedMoving = function () {
	//this.animation.play('disappear'); 
	this.moving = false;

}