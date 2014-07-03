var Gem = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures.gem, x, y);
	this.state = state;
	//this.box.hitbox = new Kiwi.Geom.Rectangle(60, 65, 60, 55); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	var animationSpeed = Math.random()* 0.05 + 0.1;

	this.animation.add('idle', [0, 1, 2, 3, 4, 5, 6, 7,  8,  9], animationSpeed, true, true);
	this.animation.add('pickup', [10, 11, 12, 13, 14, 15, 16, 17], 0.1, false);
	this.animation.play('idle');


	this.animation.getAnimation('pickup').onStop.add(this.removeSelf, this);
	this.hittable = true;

	





}
Kiwi.extend(Gem, Kiwi.GameObjects.Sprite);

Gem.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    
}

Gem.prototype.removeSelf = function() {
	this.exists = false; //state.itemManager.removeItem(this);
};

Gem.prototype.hitPlayer = function() {
	this.hittable = false;
	this.state.gameManager.addScore(500);
	this.animation.play('pickup');
};