var EnemyManager = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.enemies = new Kiwi.Group(state);
	this.deathGroup = new Kiwi.Group(state);
	this.itemGroup = new Kiwi.Group(state);

	this.addChild(this.enemies);
	this.state.addChild(this.deathGroup);
	this.addChild(this.itemGroup);
	this.enemiesLength = 0;

	




}
Kiwi.extend(EnemyManager , Kiwi.Group);

EnemyManager.prototype.checkCollision = function(entity) {

	// check if entity collides with enemygroup
	
	var enemiesMem = this.enemies.members;
	this.enemiesLength = this.enemies.members.length;
	var myEnemy = null;
	//console.log(this.enemiesLength)

	for (var i = this.enemiesLength - 1; i >= 0; i--) {
		//this.enemies.members[i].hit = false;

		if(enemiesMem[i].physics.overlaps(entity)){
			myEnemy =  enemiesMem[i];
			//console.log('setting hit!');
			this.enemies.members[i].hit = true;
		} else {
			//console.log("Hello")
			//this.enemies.members[i].hit = false;
		}


	};
	return myEnemy;
}

EnemyManager.prototype.resetHit = function() {
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		this.enemies.members[i].hit = false;
		//this.enemies.members[i].hit = false;
	};
};

EnemyManager.prototype.resetEnemies = function() {
	this.resetHit();
};




EnemyManager.prototype.trap = function ( ghost ) {
	ghost.hit = true;
	//console.log("Ghost hit is:", ghost.hit)
}

EnemyManager.prototype.checkGroupCollision = function(targetGroup) {

	// check if entity collides with enemygroup
	
	var enemiesMem = this.enemies.members;
	this.enemiesLength = this.enemies.members.length;
	var targetMem = targetGroup.members;

	for (var i = this.enemiesLength - 1; i >= 0; i--) {

		if(enemiesMem[i].physics.overlaps(entity)){
			return true;
		}


	};
	return false;
}

EnemyManager.prototype.addEnemies = function(num){
	//add 'num' enemies to group
	for (var i = num - 1; i >= 0; i--) {
		var tempGhost = new Ghost(this.state, Math.random()*this.state.width * 0.5 + this.state.width * 0.5, 440);
        this.enemies.addChild(tempGhost);
        this.enemiesLength ++;
    }
}

EnemyManager.prototype.getTrappedEnemies = function () {
	var trappedEnemies = []
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		if( this.enemies[i].hit ){
			trappedEnemies.push( this.enemies[i] );
		}
	};
	return trappedEnemies;
}


EnemyManager.prototype.updateTrappedEnemies = function() {
	var playerVelX = this.state.player.physics.velocity.x,
		playerVelY = this.state.player.physics.velocity.y;

	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		if( this.enemies.members[i].hit ){
			console.log(playerVelX, playerVelY, "Updating Hit Ghost");
			this.enemies.members[i].x += playerVelX;
			this.enemies.members[i].y += playerVelY;
		}
	};
}

EnemyManager.prototype.addEnemy = function(type, x, y){
	//add 'num' enemies to group
	if(type == 'ghost'){
		var tempGhost = new Ghost(this.state, x, y);
        this.enemies.addChild(tempGhost);
        this.enemiesLength ++;

	}
		
}

EnemyManager.prototype.removeEnemies = function(){
	this.animation.play('shoot');
}


EnemyManager.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	var enemiesMem = this.enemies.members;
	this.enemiesLength = enemiesMem.length;
	this.checkPlayerCollision();

	//this.updateTrappedEnemies();

	for (var i = this.enemiesLength - 1; i >= 0; i--) {

		//////////////////////////
		//Update enemies here
		//enemiesMem[i].update();
		//enemies[i].
	};
}
EnemyManager.prototype.kill = function(enemy) {
	var temp = this.enemies.members

	this.enemies.removeChild(enemy, true); 
	this.state.egon.stopShooting();
};

EnemyManager.prototype.killEnemy = function(enemy, x, y) {
	var temp = this.enemies.members;
	this.enemies.removeChild(enemy, true); 

	var tempDeath = new Death(this.state, x, y);
	this.deathGroup.addChild(tempDeath);
	
};


EnemyManager.prototype.checkPlayerCollision = function(){
	Kiwi.Group.prototype.update.call(this);
	var enemiesMem = this.enemies.members;
	this.enemiesLength = enemiesMem.length;

	for (var i = this.enemiesLength - 1; i >= 0; i--) {

		//////////////////////////
		//Update enemies here
		if(enemiesMem[i].physics.overlaps(this.state.player)){
			this.state.player.hitByEnemy();
		}
	};
}