var GameManager = function(state){
	this.state = state;
	this.playersEnergy = 100;
    this.playersHealth = 10;
    this.playerDamage = 1;
    //this.damageTimer = 0;
    this.DAMAGE_TIMER = 70;
    this.canTakeDamage = true;
    this.score = 0;

    this.damageTimer = this.state.game.time.clock.createTimer('damageTimer', 0.45, 0, false);

}

GameManager.prototype.update = function(){
    //this.damageTimer --;
    // console.log(this.damageTimer);
    if(this.playersHealth <= 0){
        this.state.player.die();
        // this.state.levelManager.gameOver();
    }



    if(this.state.weaponManager.shooting){
        if(this.playersEnergy > 0 ){
            this.playersEnergy -= 0.1;
        } else {
            this.state.weaponManager.stopShooting();
        }

    } else if(this.playersEnergy <= 100){
        this.playersEnergy += 0.5;
    }

}

GameManager.prototype.addScore = function(amount){
   this.score += amount

}

GameManager.prototype.playersEnergy = function() {
	return this.playersEnergy;
	// body...
};

GameManager.prototype.playerHitByEnemy = function() {
    //console.log(this);

    if(this.canTakeDamage){
        this.startDamageTimer();
        this.state.player.takeDamage();
        this.state.cameraManager.shakeCamera();
        this.playersHealth -= this.playerDamage;
        //this.damageTimer = this.DAMAGE_TIMER;
    }
};

GameManager.prototype.startDamageTimer = function() {
    
    this.damageTimer.clear();
    this.damageTimer.stop();
    this.damageTimer.delay = 0.45;
    this.damageTimer.repeatCount = 1;
    this.damageTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.damageReset, this);
    this.damageTimer.start();
    this.canTakeDamage = false;
};
GameManager.prototype.damageReset = function() {
    //console.log("RESET");
    this.canTakeDamage = true;
};

GameManager.prototype.gameOver = function() {
    var params = {
        score: this.score

    }

    return params;
};