var Confirm = function(state,  x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['confirm'], x, y);
	this.state = state;
	this.animation.add('one', [00, 00, 01, 00, 01, 00, 01, 00, 01], 0.1, false, true);
	this.animation.add('two', [02, 02, 03, 02, 03, 02, 03, 02, 03], 0.1, false);
	this.animation.add('three', [04, 04, 05, 04, 05, 04, 05, 04, 05], 0.1, false);
	this.animation.play('one');

	console.log("Here");

	var temp = Math.random()*3;
	Math.floor(temp);
	 
	// switch(Math.floor(temp)){
	// 	case 0:
	// 		this.animation.play('one');
	// 		break;
	// 	case 1:
	// 		this.animation.play('two');
	// 		break;
	// 	case 2:
	// 		this.animation.play('three');
	// 		break;
	// }



}
Kiwi.extend(Confirm, Kiwi.GameObjects.Sprite);

Confirm.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);

}