//PlayerManager / Player
var Boss = function (state, x, y){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['boss'], x, y);
	this.state = state;

	this.health = 3;
	this.phase = 1;
	this.timerDelay = 2;
	this.books = new Kiwi.Group(this.state);
	this.state.addChild( this.books );

	// Top half animations
	this.animation.add('idle', [ 6, 7, 8, 9, 10, 11 ], 0.25, true);
	this.animation.add('leftThrow', [ 24, 25, 26, 26, 26, 27, 28 ], 0.05, false);
	this.animation.add('rightThrow', [ 30, 31, 32, 32, 32, 33, 34 ], 0.05, false);
	this.animation.add('appear', [ 12, 13, 14, 13, 15, 13 ], 0.5, false);
	this.animation.add('disappear', [ 18, 19, 20, 21, 22 ], 0.05, false);
	this.animation.add('damage', [ 0, 1, 2 ], 0.1, false);
	this.animation.add('death', [ 3, 4, 5 ], 0.05, false);
	this.animation.play('idle'); 


	this.box.hitbox = new Kiwi.Geom.Rectangle(25, 20, 35, 80); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));


	this.animation.getAnimation('leftThrow').onStop.add(this.switchToIdle, this);
	this.animation.getAnimation('rightThrow').onStop.add(this.switchToIdle, this);
	this.animation.getAnimation('appear').onStop.add(this.switchToIdle, this);
	this.animation.getAnimation('disappear').onStop.add(this.switchToIdle, this);
	this.animation.getAnimation('damage').onStop.add(this.switchToIdle, this);

	this.animation.getAnimation('death').onStop.add(this.bossDead, this);

	
	// this.physics.acceleration.y = 30;

	this.centerPoint = new Kiwi.Geom.Point( this.x + this.width * 0.5, this.y + this.height * 0.5 );

	//this.nextTimer();
	this.currentPhase = 'throwBooks'
	this.timer = this.game.time.clock.createTimer('spawn', this.timerDelay, 0, false);  
    this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.nextTimer, this);

    this.timer.start();


}
Kiwi.extend(Boss, Kiwi.GameObjects.Sprite);

//PickUpBooks(number)
//ThrowBook
//TakeDamage
//Teleport
//

Boss.prototype.nextTimer = function() {
	switch ( this.currentPhase ) {
		case 'pickBooksUp':
			this.pickUpBooks();
			this.nextPhase = 'throwBooks';
			// Pick up books
			break;
		case 'throwBooks':
			//this.nextPhase = 'throwBooks'; // <--- remove this when books are working (is temp)
			if(this.bookAmount() > 0 ){
				this.throwBook();
				this.nextPhase = 'throwBooks';
			} else {
				// Pick up books again
				this.nextPhase = 'pickBooksUp'
			}
			break;

		default:
			//code;

	}

	// start timer
	this.timer = this.game.time.clock.createTimer('spawn', this.timerDelay, 0, false);  
    this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.nextTimer, this);

    this.timer.start();

	this.currentPhase = this.nextPhase;
	console.log("PHASE:", this.currentPhase)
};

Boss.prototype.bookAmount = function () {
	return this.books.members.length
}

Boss.prototype.pickUpBooks = function() {
	if( this.phase < 3 ) {
		this.createBooks( 2 );
	} else if ( this.phase === 3 ){
		this.createBooks( 3 );
	}
};

Boss.prototype.createBooks = function ( num ) {

	if( num == 2 ){
		var tempBook1, tempBook2, pos, startPos;
		pos = this.bookPos( 1 );
		startPos = this.bookStartPos();
		tempBook1 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook1 );

		pos = this.bookPos( 2 );
		tempBook2 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook2 );
	}

}

Boss.prototype.throwBook = function() {
	this.throwAni();
	this.books.members[0].throwAt( this.state.player );
};
Boss.prototype.throwAni = function() {
	if ( this.books.members[0].x < this.x ) {
		this.animation.play('leftThrow');
	} else {
		this.animation.play('rightThrow');
	}
};

Boss.prototype.switchToIdle = function() {
	if( this.animation.currentAnimation != 'idle' ) {
		this.animation.play( 'idle' );
	}
};

Boss.prototype.bossDead = function() {
	if( this.animation.currentAnimation != 'idle' ) {
		this.animation.play( 'idle' );
	}
};

Boss.prototype.getBookType = function() {
	var num = Math.floor(Math.random() * 4);
	// console.log("Type of book: ", num );
	switch (num) {
		case 0:
			return 'bible';
			break;
		case 1:
			return 'book1';
			break;
		case 2:
			return 'book2';
			break;
		case 3: 
			return 'book3';
			break;
		default:
		console.error("Book type was not defined properly");
			return 'book3'
	}

}

Boss.prototype.bookPos = function ( num ) {
	var pos;
	if ( num == 1 ) {
		pos = new Kiwi.Geom.Point( this.x - 300, this.y );
	} else if (num == 2){
		pos = new Kiwi.Geom.Point( this.x + this.width + 100, this.y );
	}
	return pos;
}

Boss.prototype.bookStartPos = function () {
	var num, pos;
	num = Math.floor(Math.random() * 2);
	pos = new Kiwi.Geom.Point( this.state.player.x, this.state.player.y );
	return pos;
}

Boss.prototype.endState = function () {
	this.currentPhase = null;
	this.timer.stop();
}