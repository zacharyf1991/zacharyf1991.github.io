var Skull = function(state, x, y, radius){
	Kiwi.Group.call(this, state);
	this.x = x;
	this.y = y;

	//, state.textures['skull'], x, y);
	this.state = state;

	var mySkull = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.skull, 0, -radius)
	this.addChild(mySkull);


	//this.animation.getAnimation('roll').onStop.add(this.finishedRoll, this);




}
Kiwi.extend(Skull, Kiwi.Group);


Skull.prototype.update = function(){
    Kiwi.Group.prototype.update.call(this);
    this.members[0].rotation = -this.rotation;

}