//PlayerManager / Player
var Boss = function (state, x, y){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['boss'], x, y);
	this.state = state;

	this.health = 3;
	this.phase = 1;
	this.timerDelay = 2;
	this.books = new Kiwi.Group(this.state);
	this.trappedBooks = new Kiwi.Group( this.state );
	this.state.addChild( this.books );
	this.state.addChild( this.trappedBooks );

	this.objType = 'Boss'
	this.bossMiniGame = false;

	this.vulnerable = false;

	// Top half animations
	this.animation.add('idle', [ 6, 7, 8, 9, 10, 11 ], 0.0625, true);
	this.animation.add('leftThrow', [ 24, 25, 26, 26, 26, 27, 28 ], 0.0625, false);
	this.animation.add('rightThrow', [ 30, 31, 32, 32, 32, 33, 34 ], 0.0625, false);
	this.animation.add('appear', [ 12, 13, 14, 13, 15, 13 ], 0.0625, false);
	this.animation.add('disappear', [ 18, 19, 20, 21, 22 ], 0.0625, false);
	this.animation.add('damage', [ 0, 1, 2 ], 0.0625, false);
	this.animation.add('death', [ 3, 4, 5 ], 0.0625, false);
	//this.animation.play('idle'); 


	this.box.hitbox = new Kiwi.Geom.Rectangle(25, 20, 35, 80); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));


	this.animation.getAnimation('leftThrow').onStop.add(this.switchToIdle, this);
	this.animation.getAnimation('rightThrow').onStop.add(this.switchToIdle, this);
	//this.animation.getAnimation('appear').onStop.add(this.switchToIdle, this);
	this.animation.getAnimation('disappear').onStop.add(this.switchToIdle, this);
	this.animation.getAnimation('damage').onStop.add(this.switchToIdle, this);

	this.animation.getAnimation('death').onStop.add(this.bossDead, this);
	this.animation.getAnimation('appear').onStop.add(this.finishedAppearing, this);

	
	// this.physics.acceleration.y = 30;

	this.centerPoint = new Kiwi.Geom.Point( this.x + this.width * 0.5, this.y + this.height * 0.5 );

	this.shield = new Shield(this.state, x, y);
	this.state.addChild(this.shield);

	//this.nextTimer();
	this.currentPhase = 'throwBooks';
	this.timer = this.game.time.clock.createTimer('spawn', this.timerDelay, 0, false);  
    this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.nextTimer, this);

    //this.timer.start();
    this.appear();


}
Kiwi.extend(Boss, Kiwi.GameObjects.Sprite);

Boss.prototype.appear = function () {
	this.animation.play('appear');

}

Boss.prototype.finishedAppearing = function () {
	console.log( "Started Boss");
	this.currentPhase = 'throwBooks';
	this.timer.start();
	this.switchToIdle();
}



Boss.prototype.update = function () {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	this.updateTrappedBooks();
	this.checkIfHit();

	if( this.health <= 0 ) {
		this.shield.alpha = 0;
		this.nextPhase = null;
		this.currentPhase = null;
		if(this.animation.currentAnimation.name != 'death'){
			this.animation.play('death');
		}
		this.game.tweens.removeAll();
		//this.updateDamage();
	}

	//console.log(this.vulnerable)
}



Boss.prototype.bossHitWithBeam = function () {
	if ( !this.bossMiniGame && this.vulnerable){
		this.bossMiniGame = true;
		this.state.miniGameManager.createMiniGame( this.centerPoint , this.health );
		
	}
}

Boss.prototype.hurtByBeam = function () {
	if( this.animation.currentAnimation != 'damage' ){
		this.animation.play( 'damage', false );
	}
	this.health -= 1;


	//this.state.enemyManager.killTrapped();
	this.state.weaponManager.stopShooting();

	this.state.weaponManager.beamManager.enemyKilled();
	// this.bossMiniGame;
	// this.updatePhase();
}

Boss.prototype.updateDamage = function () {
	this.state.collisionManager.checkBossHit();
}

Boss.prototype.checkIfHit = function () {
	for (var i = this.trappedBooks.members.length - 1; i >= 0; i--) {
		if( this.trappedBooks.members[i].type == 'bible'){
			if ( this.state.collisionManager.checkShieldBossHit( this/*.shield*/, this.trappedBooks.members[i] ) ){
				//console.log ( "Shield Hit!");
				this.shield.takeDamage();
				this.shieldDown();
			}

			
		}
	};
}
Boss.prototype.shieldDown = function (){
	this.vulnerable = true;
	if( this.animation.currentAnimation != 'damage' ){
		this.animation.play( 'damage', false );
	}


}

Boss.prototype.shieldUp = function (){
	this.vulnerable = false;
	this.bossMiniGame = false;

}

Boss.prototype.updateTrappedBooks = function () {
	for (var i = this.trappedBooks.members.length - 1; i >= 0; i--) {
		this.moveToImpact( this.trappedBooks.members[i] );
		this.updateBookAnimations( this.trappedBooks.members[i] );
	};
}
Boss.prototype.updateBookAnimations = function (book) {
	if( book.animation.currentAnimation != 'hold' && this.animation.currentAnimation.name != 'disappear'){
		book.animation.play( 'hold', false );
	}
}
Boss.prototype.moveToImpact = function ( book ) {
	if (!book.exists || !book.targetImpact.exists) {
		// console.log ( "no book or impact");
		return;
	}
	var impact = book.targetImpact,
		tar = this.getDist( book, impact );
	// console.log( "temp point", tar );
	book.x += tar.x - book.width * 0.5 + impact.width * 0.5;
	book.y += tar.y - book.height * 0.5 + impact.height * 0.5;
	
}


Boss.prototype.getDist = function ( book, impact ) {
	var myPoint = new Kiwi.Geom.Point( 0, 0);
	myPoint.x = impact.worldX - book.worldX;
	myPoint.y = impact.worldY - book.worldY;


	return myPoint;
	
}
//Boss.prototype.getImpact

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


    if(this.nextPhase){
		this.timer = this.game.time.clock.createTimer('spawn', this.timerDelay, 0, false);  
	    this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.nextTimer, this);
    	this.timer.start();
    }

	this.currentPhase = this.nextPhase;
	//console.log("PHASE:", this.currentPhase)
};

Boss.prototype.bookAmount = function () {
	return this.books.members.length
}

Boss.prototype.pickUpBooks = function() {
	if(this  == undefined){
		return;
	}
	if( this.health > 1 ) {
		this.createBooks( 2 );
	} else if ( this.health === 1 ){
		this.createBooks( 4 );
	}
};

Boss.prototype.createBooks = function ( num ) {

	if( num == 2 ){




		var tempBook1, tempBook2, pos, startPos, hand;

		hand = this.spawnOrder( 2 );

		pos = this.bookPos( hand[0] );
		startPos = this.bookStartPos();
		tempBook1 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook1 );

		startPos = this.bookStartPos();
		pos = this.bookPos( hand[1] );
		tempBook2 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook2 );
	}

	if( num == 4 ){




		var tempBook1, tempBook2, tempBook3, tempBook4, pos, startPos, hand;

		hand = this.spawnOrder( 4 );

		pos = this.bookPos( hand[0] );
		startPos = this.bookStartPos();
		tempBook1 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook1 );

		startPos = this.bookStartPos();
		pos = this.bookPos( hand[1] );
		tempBook2 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook2 );

		startPos = this.bookStartPos();
		pos = this.bookPos( hand[2] );
		tempBook3 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook3 );

		startPos = this.bookStartPos();
		pos = this.bookPos( hand[3] );
		tempBook4 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook4 );
	}

}


//Returns array of length num in random order from 1 - num
// E.g spawnOrder( 2 ) can return either [ 1, 2 ] or [ 2, 1 ]
Boss.prototype.spawnOrder = function( num ) {
	var myArray = [],
		tempArray = [];
	for ( var i = 0 ; i < num; i++ ) {
		tempArray[i] = i + 1;
	};


	while ( tempArray.length > 0 ){
		var j = Math.floor( Math.random() * tempArray.length );
		myArray[myArray.length] = tempArray[j];
		tempArray.splice( j , 1 );
	}
	return myArray;
};

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
	console.log("Boss Dead");
	this.game.tweens.removeAll();
	this.state.miniGameManager.beamTarget = this.state.player;
	this.state.weaponManager.beamManager.targetEnemy = this.state.player;
	this.shield.alpha = 0;
	this.books.alpha = 0;
	this.trappedBooks.alpha = 0;
	// this.books.removeChildren();
	// this.trappedBooks.removeChildren();
	//this.exists = false;
	this.alpha = 0;
	this.state.levelManager.gameOver();
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
	} else if (num == 3){
		pos = new Kiwi.Geom.Point( this.x + this.width + 200, this.y  + 100);
	} else if (num == 4){
		pos = new Kiwi.Geom.Point( this.x - 400, this.y  + 100);
	}
	return pos;
}

Boss.prototype.bookStartPos = function () {
	var num, pos;
	num = Math.floor(Math.random() * 2);
	if ( num == 1 ){
		pos = new Kiwi.Geom.Point( this.state.bookPileL.x, this.state.bookPileL.y );
	} else {
		pos = new Kiwi.Geom.Point( this.state.bookPileR.x, this.state.bookPileR.y );
	}
	
	return pos;
}

Boss.prototype.endState = function () {
	this.shield.destroy();
	this.stopAllTweens();
	this.currentPhase = null;
	this.nextPhase = null;
	this.timer.stop();
}

Boss.prototype.trapBook = function ( book, beamGroup ) {
	this.trappedBooks.addChild( book );
	book.trapped();
	book.targetImpact = beamGroup.getChildAt( 0 );
}

Boss.prototype.stopAllTweens = function () {
	this.game.tweens.removeAll();
}