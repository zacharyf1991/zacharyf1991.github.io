var EnvironmentManager = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.buildings = new Kiwi.Group(state);


	this.background = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures.background, 0, 0);
	this.state.addChild(this.background);
	this.state.addChild(this.buildings);

	this.platformStartX = game.stage.width - 100;

	this.createBuildings();

	this.activateBuildingTimer = this.game.time.clock.createTimer('activateBuildingTimer', 1, 0, false);
	this.activateBuildingTimer.clear();
    this.activateBuildingTimer.stop();
    this.activateBuildingTimer.delay = 1;
    this.activateBuildingTimer.repeatCount = 0;
    this.activateBuildingTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.activateBuilding, this);
   // this.activateBuildingTimer.start();

}
Kiwi.extend(EnvironmentManager, Kiwi.Group);




EnvironmentManager.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	
	this.background.x = this.state.player.x - this.state.playerInitialX;
	var buildMembers = this.buildings.members;

	for (var i = buildMembers.length - 1; i >= 0; i--) {
		buildMembers[i].updateMovement();
	};

}








EnvironmentManager.prototype.createBuildings = function(){
	var p = new Cloud(this.state);
	this.buildings.addChild(p);
	var p = new Cloud(this.state);
	this.buildings.addChild(p);
	var p = new Cloud(this.state);
	this.buildings.addChild(p);
	var p = new Cloud(this.state);
	this.buildings.addChild(p);
	var p = new Cloud(this.state);
	this.buildings.addChild(p);
	var p = new Cloud(this.state);
	this.buildings.addChild(p);


	var p = new Crane(this.state);
	this.buildings.addChild(p);
	var p = new Crane(this.state);
	this.buildings.addChild(p);
	var p = new Crane(this.state);
	this.buildings.addChild(p);
	var p = new Crane(this.state);
	this.buildings.addChild(p);
	var p = new Crane(this.state);
	this.buildings.addChild(p);
	var p = new Crane(this.state);
	this.buildings.addChild(p);


	var p = new Gear(this.state);
	this.buildings.addChild(p);
	var p = new Gear(this.state);
	this.buildings.addChild(p);
	var p = new Gear(this.state);
	this.buildings.addChild(p);
	var p = new Gear(this.state);
	this.buildings.addChild(p);
	var p = new Gear(this.state);
	this.buildings.addChild(p);
	var p = new Gear(this.state);
	this.buildings.addChild(p);

	var p = new Skyscraper(this.state);
	this.buildings.addChild(p);
	var p = new Skyscraper(this.state);
	this.buildings.addChild(p);
	var p = new Skyscraper(this.state);
	this.buildings.addChild(p);
	var p = new Skyscraper(this.state);
	this.buildings.addChild(p);
	var p = new Skyscraper(this.state);
	this.buildings.addChild(p);
	var p = new Skyscraper(this.state);
	this.buildings.addChild(p);


	//console.log(this.platforms.members);
	

}

EnvironmentManager.prototype.activateBuilding = function(){
	var buildMembers = this.buildings.members;
	var n = Math.random() * (buildMembers.length-1);
	n = Math.round(n);
	if(buildMembers[n].x > this.state.player.x - 1500){
		this.activateBuilding();
		return;
	} else {
		buildMembers[n].activate();
		


	}
	

}











