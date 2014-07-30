var EnvironmentManager = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.enemies = new Kiwi.Group(state);

	this.addChild(this.enemies);

	this.background = new Kiwi.GameObjects.StaticImage(this.state, this.state.textures.background, 0, 0);
	this.state.addChild(this.background);

	this.platformStartX = game.stage.width - 100;


}
Kiwi.extend(EnvironmentManager, Kiwi.Group);




EnvironmentManager.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	
	this.background.x = this.state.player.x - this.state.playerInitialX;

}








