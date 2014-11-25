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
	this.rotChanged = false;

	




}
Kiwi.extend(EnemyManager , Kiwi.Group);

EnemyManager.prototype.checkCollision = function(entity) {

	// check if entity collides with enemygroup
	
	var enemiesMem = this.enemies.members;
	this.enemiesLength = this.enemies.members.length;
	var myEnemy = null;
	//console.log(this.enemiesLength)

	for (var i = this.enemiesLength - 1; i >= 0; i--) {

		if(enemiesMem[i].physics.overlaps(entity)){
			myEnemy =  enemiesMem[i];
			//console.log('setting hit!');
			this.enemies.members[i].hit = true;
		} else {
			//console.log("Hello")
		}


	};
	return myEnemy;
}

EnemyManager.prototype.releaseGhosts = function(entity) {

	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		this.enemies.members[i].targetIndex = 0;
		this.enemies.members[i].hit = false; 
	};
}


EnemyManager.prototype.enemiesAlive = function() {
	return this.enemies.members.length;
}


EnemyManager.prototype.resetHit = function() {
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		this.enemies.members[i].hit = false;
	};
};

EnemyManager.prototype.resetEnemies = function() {
	this.resetHit();
};




EnemyManager.prototype.trap = function ( ghost ) {
	var tempHealth;

	// console.log("TRAPPED", ghost.hit , this.state.miniGameManager.miniGameActive);

	if(!ghost.hit && this.state.miniGameManager.miniGameActive){
		console.log ( "INSIDE" );
		ghost.hit = true;
		tempHealth = this.state.miniGameManager.getHealth();
		this.state.miniGameManager.skullGroup.clear();

		this.state.miniGameManager.createSkulls (tempHealth + 3);

		
	}
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


EnemyManager.prototype.spawnSurvivalGhost = function(){
	//add 'num' enemies to group

	//x = 1255 y 2164 range = 909
	var xPos = Math.floor( Math.random() * this.state.game.stage.width ),
		yPos = 220 + Math.random() * 440;

	var tempGhost = new Ghost(this.state, xPos, yPos);
	tempGhost.survival = true;

    this.enemies.addChild(tempGhost);
    this.enemiesLength ++;
}
EnemyManager.prototype.getTrappedEnemies = function () {
	var trappedEnemies = [];
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		if( this.enemies.members[i].hit ){
			trappedEnemies.push( this.enemies.members[i] );
		}
	};
	return trappedEnemies;
}


EnemyManager.prototype.updateTrappedAnimation = function () {
	var rand,
		enemies = this.getTrappedEnemies();
		// console.log(enemies, "ZACH?")

	for (var i = enemies.length - 1; i >= 0; i--) {
		rand = Math.floor( Math.random() * 3 );
		enemies[i].health -=1;
		switch ( rand ){
			case 0:
				enemies[i].animation.play('damage1');
				break;
			case 1:
				enemies[i].animation.play('damage2');
				break;
			case 2:
				enemies[i].animation.play('damage3');
				break;
			default:
				enemies[i].animation.play('damage3');
		}
		// console.log( enemies[i].animation.currentAnimation.name , "Animation Switched To")
	};
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
	//this.state.egon.stopShooting();
};

EnemyManager.prototype.changeRotPoint = function() {
	var en = this.getTrappedEnemies();
	
	for (var i = en.length - 1; i >= 0; i--) {
		if(en[i].rotPointX == 0 ){
			en[i].rotPointX = Math.random() * 30 -15;
			en[i].rotPointY = Math.random() * 30 -15;

		}
	};
};


EnemyManager.prototype.restoreRotPoint = function(){
	var en = this.getTrappedEnemies();
	this.rotChanged = false;
	
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		if ( this.enemies.members[i].rotPointX != 0 ){
			this.enemies.members[i].rotPointX = 0;
			this.enemies.members[i].rotPointY = 0;
		}
	};
};


EnemyManager.prototype.killTrapped = function(enemy) {
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		if( this.enemies.members[i].hit ) {
			// console.log( "Hello!" )
			this.killEnemy( this.enemies.members[i]);
		}
	};

};

EnemyManager.prototype.killEnemy = function(enemy) {
	enemy.exists = false;

	var tempDeath = new Death(this.state, enemy.x, enemy.y);
	this.deathGroup.addChild(tempDeath);
	
};

EnemyManager.prototype.killAll = function(enemy) {
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		this.enemies.members[i].exists = false;
	};
	// console.log( "All enemies removed", this.enemies );
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