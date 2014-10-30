var Impact = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['impact'], x, y);

	this.animation.add('impact', [00, 01, 02, 03, 04, 05, 06, 07, 08], 0.06, true, true);

	//this.animation.getAnimation('impact').onStop.add(this.startLoop, this);
	this.objType = 'impact';

	//console.log(this.width, this.height, "Zach the width and Height");
	var centerX = this.width * 0.5;
	var centerY = this.height * 0.5;
	this.centerPoint = new Kiwi.Geom.Point(centerX, centerY);





}
Kiwi.extend(Impact, Kiwi.GameObjects.Sprite);

Impact.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);

    this.centerPoint.x = this.worldX + this.width * 0.5;
    this.centerPoint.y = this.worldY + this.height * 0.5;

}

Impact.prototype.startLoop = function(){
	this.animation.play('shoot');
}
