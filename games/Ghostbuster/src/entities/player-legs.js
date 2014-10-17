//PlayerManager / Player
var PlayersLegs = function (state, x, y){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['egonSprite'], x, y);
	this.state = state;

	// Bottom half animations
	
	this.animation.add('walk', [ 34, 35, 36, 37, 38, 39, 40, 41 ], 0.05, true);
	this.animation.add('idle', [42], 0.1, false);
	this.animation.play('idle'); 



	///////////////////
	//KEYBOARD
	this.rightKeyDown = false;
	this.leftKeyDown = false;
	this.jumpKeyDown = false;


}
Kiwi.extend(PlayersLegs, Kiwi.GameObjects.Sprite);

PlayersLegs.prototype.updateLegs = function(){
	//console.log(this.physics.velocity.x, this.x, this.physics.last.x);

	this.x = this.state.player.x;
	this.y = this.state.player.y;

	this.scaleX = this.state.player.scaleX;

	if( this.state.player.jumping ) {
		this.alpha = 0;
	} else {
		this.alpha = this.state.player.alpha;
	}
	
}

