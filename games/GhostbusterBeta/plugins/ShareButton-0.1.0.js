/**
* 
* @model Kiwi
* @submodel Plugins
* @class ShareButton
*/
Kiwi.Plugins.ShareButton = {
	name: 'ShareButton',
	version: '1.0.0'
}
Kiwi.PluginManager.register(Kiwi.Plugins.ShareButton);

//Do Kiwi Plugin GameObjects Exist?
if( typeof Kiwi.Plugins.GameObjects == "undefined") {
    Kiwi.Plugins.GameObjects = {}; 
}

Kiwi.Plugins.GameObjects.ShareButton = function(state, atlas, x, y){

	Kiwi.GameObjects.Sprite.call(this, state, atlas, x, y);

	this.animation.add('up', [0], 0.1, false);
	this.animation.add('down', [1], 0.1, false);	
	this.animation.play('up');
	this.isDown = false;
	this.isUp = true;
	this.hitbox = new Kiwi.Geom.Rectangle(x, y, this.width, this.height);
	this.enabled = true;

}
Kiwi.extend(Kiwi.Plugins.GameObjects.ShareButton, Kiwi.GameObjects.Sprite);

Kiwi.Plugins.GameObjects.ShareButton.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	var hit = false;
    //bug w/game.input
	//if(this.game.input.isDown) console.log('DOWN')
	if(this.enabled){
	    if (this.game.input.isDown) {
	        //console.log('input:', this.game.input.pointers)
			for(var i = 0; i<this.game.input.pointers.length; i++){
				if(this.game.input.pointers[i].active){
					if(this.hitbox.containsPoint(this.game.input.pointers[i].point)){
						if(this.isUp){
							this.isDown = true;
							this.isUp = false;
							if(this.animation.currentAnimation.name!='down')
								this.animation.switchTo('down', true);
								this.buttonDown();
						}
						hit = true;
					}
				}
			}
		}
	}


	if(!hit){
		if(this.isDown){
			this.isDown = false;
			this.isUp = true;
			if(this.animation.currentAnimation.name!='up')
				this.animation.switchTo('up', true);
		}
	}

}

//Disables the use of this button 
Kiwi.Plugins.GameObjects.ShareButton.prototype.disable = function(){
	this.enabled = false;
}

//Enables the use of this button 
Kiwi.Plugins.GameObjects.ShareButton.prototype.enable = function(){
	this.enabled = true;
}

//Hides the button but still allows its use
Kiwi.Plugins.GameObjects.ShareButton.prototype.hide = function(){
	this.visibility = false;
}

//Shows the button if it was hidden
Kiwi.Plugins.GameObjects.ShareButton.prototype.show = function(){
	this.visibility = true;
}
Kiwi.Plugins.GameObjects.ShareButton.prototype.buttonDown = function(){
	/////////////////////////////////////
	//PUT SHARING CODE HERE
	console.log('Share button hit');





	//END SHARING CODE
	/////////////////////////////////////
	
}