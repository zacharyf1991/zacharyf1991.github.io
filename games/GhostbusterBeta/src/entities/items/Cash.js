var Cash = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures.cash, x, y);
	this.state = state;
	this.box.hitbox = new Kiwi.Geom.Rectangle(60, 65, 60, 55); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));

	this.animation.add('drop', [0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 7, 7, 8, 8, 7, 7, 8, 8, 7, 7, 8, 8], 0.05, false, true);
	this.animation.play('drop');


	this.animation.getAnimation('drop').onStop.add(this.removeCash, this);
	this.hittable = false;
	this.state.gameManager.addScore(5000);


	





}
Kiwi.extend(Cash, Kiwi.GameObjects.Sprite);

Cash.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    
}

Cash.prototype.removeCash = function() {

	this.exists = false;
};


