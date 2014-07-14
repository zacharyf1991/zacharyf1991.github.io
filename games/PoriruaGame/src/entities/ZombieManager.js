var ZombieManager = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.enemies = new Kiwi.Group(state);
	this.deathGroup = new Kiwi.Group(state);

	this.addChild(this.enemies);
	this.state.addChild(this.deathGroup);
	this.enemiesLength = 0;

	this.damage = new Kiwi.Sound.Audio(this.state.game, 'damage', 0.3, false);

	// Spawn difficulty
	this.framesToZombie = 100;
	this.spawnFrames = 0;
}
Kiwi.extend(ZombieManager, Kiwi.Group);


ZombieManager.prototype.addZombie = function(x, y){
		var tempZombie = new Zombie(this.state, x, y);
        this.enemies.addChild(tempZombie);
        this.enemiesLength ++;
}

ZombieManager.prototype.addRandomZombie = function() {
	// Adds a zombie at a random junction
	// If it's too close to the player, it'll try again elsewhere
	var player = this.state.player;
	var juncs = this.state.junctionPointManager.junctionPoints;
	var target = Math.floor( Math.random() * juncs.length );
	var spawnCandidate = juncs[target];
	var distToPlayer = Math.sqrt( Math.pow(player.x - spawnCandidate.x, 2) + Math.pow(player.y - spawnCandidate.y, 2));
	if(512 < distToPlayer)
		this.addZombie(spawnCandidate.x, spawnCandidate.y);
	else
		this.addRandomZombie();
}


ZombieManager.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	
	// Spawn zombies
	this.spawnFrames++;
	if(this.framesToZombie <= this.spawnFrames)
	{
		this.spawnFrames = 0;
		this.addRandomZombie();
	}
	
	// Depth sort zombies
	this.enemies.members = this.quicksortByDepth(this.enemies.members);
	
	var enemiesMem = this.enemies.members;
	this.enemiesLength = enemiesMem.length;
	this.checkPlayerCollision();

	// Update alphas
	var flashAlpha = 1.0;
	if(this.state.player.canKillZombie)
		flashAlpha = 0.5;
	for (var i = this.enemiesLength - 1; i >= 0; i--) {
		if(this.enemies.members[i] != undefined)
			this.enemies.members[i].alpha = flashAlpha;
	}
}


ZombieManager.prototype.quicksortByDepth = function(array) {
	if(array.length < 2) return( array );
	
	var low = [];
	var high = [];
	var iMid = Math.floor(array.length / 2)
	var mid = array[ iMid ];
	for(var i = 0;  i < array.length;  i++)
	{
		if(i != iMid)
		{
			if( array[i].y < mid.y )	low.push(array[i]);
			else	high.push(array[i]);
		}
	}
	// Recurse sort
	low = this.quicksortByDepth(low);
	high = this.quicksortByDepth(high);
	// Compile output
	low.push(mid);
	low = low.concat(high);
	return( low );
}


ZombieManager.prototype.killEnemy = function(enemy, x, y) {
	var temp = this.enemies.members;
	this.enemies.removeChild(enemy, true);
	this.damage.play();

	// Score up
	this.state.zombieCounter++;

	//var tempDeath = new Death(this.state, x, y);
	//this.deathGroup.addChild(tempDeath);
	
};


ZombieManager.prototype.checkPlayerCollision = function(){
	Kiwi.Group.prototype.update.call(this);
	var enemiesMem = this.enemies.members;
	this.enemiesLength = enemiesMem.length;

	for (var i = this.enemiesLength - 1; i >= 0; i--) {

		//////////////////////////
		//Update enemies here
		if(enemiesMem[i].physics.overlaps(this.state.player)) {
			if(this.state.player.canKillZombie) {
				this.killEnemy(enemiesMem[i], enemiesMem[i].x, enemiesMem[i].y);
			}
			else
			{
				this.state.player.hitByEnemy();
			}
		}
	};
}