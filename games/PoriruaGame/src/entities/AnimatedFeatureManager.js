var AnimatedFeatureManager = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;

	this.createAnimations();






}
Kiwi.extend(AnimatedFeatureManager , Kiwi.Group);

AnimatedFeatureManager.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);

}



AnimatedFeatureManager.prototype.createAnimations = function() {
	this.animBeachball1 = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.animBeachball1, 809, 245);
	this.animBeachball1.animation.add('play', [0, 1, 2, 3, 3, 2, 1, 0], 0.25, true);
	this.animBeachball1.animation.play('play');
	this.state.addChild(this.animBeachball1);


	this.animBoat = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.animBoat, 1590, 515);
	this.animBoat.animation.add('play', [0, 1, 2], 0.25, true);
	this.animBoat.animation.play('play');
	this.state.addChild(this.animBoat);

	this.animBoat_2 = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.animBoat, 797, 58);
	this.animBoat_2.animation.add('play', [0, 1, 2], 0.25, true);
	this.animBoat_2.animation.play('play');
	this.state.addChild(this.animBoat_2);

	this.animPlane = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.animPlane, 868, 1124);
	this.animPlane.animation.add('play', [0, 1, 2], 0.25, true);
	this.animPlane.animation.play('play');
	this.state.addChild(this.animPlane);


	this.animFish = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.animFish, -05, 346);
	this.animFish.animation.add('play', [0, 1, 2, 3, 4, 5, 6, 7], 0.15, true);
	this.animFish.animation.play('play');
	this.state.addChild(this.animFish);

	this.animFish_2 = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.animFish, 1276, 391);
	this.animFish_2.animation.add('play', [0, 1, 2, 3, 4, 5, 6, 7], 0.15, true);
	this.animFish_2.animation.play('play');
	this.state.addChild(this.animFish_2);

	this.animWaka = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.animWaka, 718, 705);
	this.animWaka.animation.add('play', [0, 1, 2, 3], 0.25, true);
	this.animWaka.animation.play('play');
	this.state.addChild(this.animWaka);


};

