var SurvivalGame = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;

	this.wave = 1;
	this.waveLimit = 1;
	this.waveCounter = 0;
	this.attempt = 0;
	this.maxWave = 5;

	this.spawnTimer  = this.game.time.clock.createTimer('shoot', 2, -1, false);
    this.spawnEvent = this.spawnTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.attemptSpawn, this);  //create a new timer event on that timer
    this.spawnTimer.start();

	//Timers



	//On Enemy Die check if wave limit reached if so Wave ++;

	
	//Start Timer
	//On TimerTick Check if spawn
		// Spawn
		// or Wait


		//REWORK GHOST SPAWN POINTS

}
Kiwi.extend(SurvivalGame , Kiwi.Group);

SurvivalGame.prototype.attemptSpawn = function() {
	// console.log( "Attepmt Spawn", this.wave, this.waveLimit, this.waveCounter );
	
	
	var enemiesAlive = this.state.enemyManager.enemiesAlive();

	if ( this.waveCounter < this.waveLimit && enemiesAlive < this.waveLimit) {
		this.spawnEnemy();
		this.waveCounter ++;
	} else if ( this.state.enemyManager.enemiesAlive() == 0 ) {
		this.newWave();
	} else {
		this.attempt += 1;
		if ( this.attempt > ( 10 ) ){
			this.newWave();
			this.attempt = 0;
			this.removeAllEnemies();
		}
	}

}

SurvivalGame.prototype.spawnEnemy = function() {
	this.state.enemyManager.spawnSurvivalGhost();
}

SurvivalGame.prototype.newWave = function() {
	this.wave += 1;
	this.attempt = 0;
	if( this.wave < this.maxWave ){
		this.waveLimit += 1;
		this.waveCounter = 0;
		
	} else {
		this.waveLimit = Math.floor( Math.random() * (this.maxWave + 1) ) + 1;
		this.waveCounter = 0;
	}
}

SurvivalGame.prototype.removeAllEnemies = function() {
	this.state.enemyManager.killAll();
}