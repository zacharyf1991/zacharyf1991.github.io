var PlatformManager = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.platforms = new Kiwi.Group(state);

	this.state.addChild(this.platforms);
	this.createPlatforms();


}
Kiwi.extend(PlatformManager, Kiwi.Group);




PlatformManager.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	

	var platMemebers = this.platforms.members;

	for (var i = platMemebers.length - 1; i >= 0; i--) {
		platMemebers[i].updateMovement();
	};

}

PlatformManager.prototype.createPlatforms = function(){
	var p = new Platform(this.state, this.state.textures.platformLarge);
	this.platforms.addChild(p);
	var p = new Platform(this.state, this.state.textures.platformLarge);
	this.platforms.addChild(p);
	var p = new Platform(this.state, this.state.textures.platformLarge);
	this.platforms.addChild(p);


	var p = new Platform(this.state, this.state.textures.platformLarge);
	this.platforms.addChild(p);
	var p = new Platform(this.state, this.state.textures.platformLarge);
	this.platforms.addChild(p);
	var p = new Platform(this.state, this.state.textures.platformLarge);
	this.platforms.addChild(p);


	var p = new Platform(this.state, this.state.textures.platformLarge);
	this.platforms.addChild(p);
	var p = new Platform(this.state, this.state.textures.platformLarge);
	this.platforms.addChild(p);
	p.x = this.state.player.x + 700;
	p.y = 380;
	p.activatePlatform = true;
	p.nextActivated = false;
	var p = new Platform(this.state, this.state.textures.platformLarge);
	p.x = this.state.player.x;
	p.y = 380;
	p.nextActivated = true;
	p.activatePlatform = true;
	this.platforms.addChild(p);


	console.log(this.platforms.members);
	

}

PlatformManager.prototype.activatePlatform = function(plat){
	var platMemebers = this.platforms.members;
	var n = Math.random() * 8;
	n = Math.round(n);
	if(platMemebers[n].x > this.state.player.x - 1500){
		this.activatePlatform(plat);
		return;
	} else {
		platMemebers[n].activate(plat);

	}
	

}







