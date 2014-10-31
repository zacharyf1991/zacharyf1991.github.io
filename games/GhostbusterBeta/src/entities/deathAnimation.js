//PlayerManager / Player
var DeathAnimation = function (state, x, y){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['egonSprite'], x, y);
	this.state = state;

	// Bottom half animations
	
	this.animation.add('death', [43], 0.1, false);
	this.animation.play('death'); 

	//this.scaleX = 10;
	//this.scaleY = 10;



	///////////////////
	//KEYBOARD
	this.rightKeyDown = false;
	this.leftKeyDown = false;
	this.jumpKeyDown = false;


	this.tweenA = this.game.tweens.create(this);  
	this.tweenB = this.game.tweens.create(this); 
	
	//set the tweens up
	this.tweenA.to({ y: this.y - 120 }, 400, Kiwi.Animations.Tweens.Easing.Cubic.Out, false);
	this.tweenB.to({ y: this.y + 400  }, 1600, Kiwi.Animations.Tweens.Easing.Cubic.Out, false);
	this.tweenB.onComplete( this.gameOver, this );

	this.tweenA.chain(this.tweenB);
	this.tweenA.start();


}
Kiwi.extend(DeathAnimation, Kiwi.GameObjects.Sprite);

DeathAnimation.prototype.gameOver = function(){

	//console.log( this.scaleX, this.scaleY, ":SCALE" );

	this.state.levelManager.gameOver();
	
}

