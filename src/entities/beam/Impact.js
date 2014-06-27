var Impact = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['impact'], x, y);

	this.animation.add('impact', [00, 01, 02, 03, 04, 05, 06, 07, 08], 0.06, true, true);

	//this.animation.getAnimation('impact').onStop.add(this.startLoop, this);






}
Kiwi.extend(Impact, Kiwi.GameObjects.Sprite);

Impact.prototype.startLoop = function(){
	this.animation.play('shoot');
}
