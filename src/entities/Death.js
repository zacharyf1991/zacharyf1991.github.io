var Death = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['ghost'], x, y);
	this.state = state;
	this.box.hitbox = new Kiwi.Geom.Rectangle(60, 65, 60, 55); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));

	var animationSpeed = 0.1;
	//var animationSpeed = (Math.random() * 0.1) + 0.05;
	this.animation.add('invis', [30], 0.1, false);
	this.animation.add('appear', [00, 01, 02, 03, 04, 06, 07, 08, 09, 10, 12, 13, 14, 15], 0.06, false);
	this.animation.add('death', [16, 18, 19, 20, 21, 23, 24, 25, 26, 27], animationSpeed, false);
	
	this.animation.play('death');


	//this.animation.getAnimation('appear').onStop.add(this.dash, this);
	this.animation.getAnimation('death').onStop.add(this.die, this);






	





}
Kiwi.extend(Death, Kiwi.GameObjects.Sprite);

Death.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);


    

    
}

Death.prototype.die = function() {
	this.state.itemManager.addItem('cash', this.x, this.y);
	this.state.weaponManager.stopShooting();
	this.destroy();
};







