var Spark = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['beamSpark'], x, y);

	var animationSpeed = 0.1;
	//var animationSpeed = (Math.random() * 0.1) + 0.05;
	this.animation.add('initiate', [00, 01, 02, 03, 04, 05, 06, 07, 08, 09], 0.06, false, true);
	this.animation.add('shoot', [11, 12, 13], animationSpeed, true);
	this.animation.getAnimation('initiate').onStop.add(this.startLoop, this);






}
Kiwi.extend(Spark, Kiwi.GameObjects.Sprite);

Spark.prototype.startLoop = function(){
	this.animation.play('shoot');
}