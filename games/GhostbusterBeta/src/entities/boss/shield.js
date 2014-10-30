//PlayerManager / Player
var Shield = function ( state, x, y ){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['shield'], x, y);
	this.state = state;

	this.damageTimer;
	this.timerDelay = 4;
	this.vulnerable = false;

	// Top half animations

	
	this.animation.add('damage', [ 0, 1, 0, 1, 0, 1, 2, 3 ], 0.05, false);
	this.animation.add('idle', [ 4, 5, 6, 7, 7, 6, 5, 4 ], 0.25, true);
	this.animation.add('recharge', [ 8, 9, 10, 11 ], 0.5, false);








	this.animation.play('idle'); 


	this.box.hitbox = new Kiwi.Geom.Rectangle(25, 20, 35, 80); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));


	this.animation.getAnimation('recharge').onStop.add(this.playIdle, this);

	//this.animation.getAnimation('death').onStop.add(this.bossDead, this);

	
	// this.physics.acceleration.y = 30;

	this.centerPoint = new Kiwi.Geom.Point( this.x + this.width * 0.5, this.y + this.height * 0.5 );
	


}
Kiwi.extend(Shield, Kiwi.GameObjects.Sprite);


Shield.prototype.update = function () {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	

}

Shield.prototype.playIdle = function () {
	//this.vulnerable = false;
	if ( this.animation.currentAnimation != 'idle' ){
		this.animation.play('idle');
	}

	this.state.boss.shieldUp();
	

};

Shield.prototype.bossMiniGameStarted = function () {

}

Shield.prototype.takeDamage = function () {
	var damageTimer;
	if ( this.animation.currentAnimation != 'damage' ){
		this.animation.play('damage');
	}
	//this.vulnerable = true;

	this.damageTime = this.game.time.clock.createTimer('spawn', this.timerDelay, 0, false);  
    this.damageTime.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.recharge, this);

    this.damageTime.start();



};

Shield.prototype.recharge = function () {
	if( !this.exists ){
		return;
	}
	if ( this.animation.currentAnimation != 'recharge'  ){
		this.animation.play('recharge');
	}
};