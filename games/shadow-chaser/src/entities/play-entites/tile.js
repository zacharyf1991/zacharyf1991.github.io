var Tile = function (state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures.tile, x, y);
	this.state = state;


	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.physics.immovable = true;
	//this.physics.acceleration.y = 15;
	//this.physics.velocity.y = 15;




}
Kiwi.extend(Tile,Kiwi.GameObjects.Sprite);

	
   

Tile.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	this.physics.update();
	



}

   

