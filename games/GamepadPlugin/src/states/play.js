var GamepadPlugin = GamepadPlugin || {};

GamepadPlugin.Play = new Kiwi.State('Play');

/**
* The PlayState in the core state that is used in the game. 
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
* 
*/


/**
* This create method is executed when a Kiwi state has finished loading any resources that were required to load.
*/
GamepadPlugin.Play.create = function () {

	/*
	* Replace with your own game creation code here...
	*/
  	this.name = new Kiwi.GameObjects.StaticImage(this, this.textures.kiwiName, 10, 10);
  		

  	this.heart = new Kiwi.GameObjects.Sprite(this, this.textures.icons, 10, 10);
  	this.heart.cellIndex = 8;
  	this.heart.y = this.game.stage.height - this.heart.height - 10;


  	this.sheild = new Kiwi.GameObjects.Sprite(this, this.textures.icons, 200, 200);
  	this.sheild.cellIndex = 9;
  	this.sheild.y = this.game.stage.height * 0.5 - this.sheild.height * 0.5;
  	this.sheild.x = this.game.stage.width * 0.5 - this.sheild.width * 0.5;


  	this.crown = new Kiwi.GameObjects.Sprite(this, this.textures.icons, 10, 10);
  	this.crown.cellIndex = 10; 
  	this.crown.x = this.game.stage.width - this.crown.width - 10;
  	this.crown.y = this.game.stage.height - this.crown.height - 10;


  	this.bomb = new Kiwi.GameObjects.Sprite(this, this.textures.icons, 0, 10);
  	this.bomb.x = this.game.stage.width - this.bomb.width  -10;

    this.game.gamepads.gamepads[0].buttonOnDownOnce.add( this.buttonOnDownOnce, this );
    this.game.gamepads.gamepads[0].buttonIsDown.add( this.buttonIsDown, this );
    this.game.gamepads.gamepads[0].buttonOnUp.add( this.buttonOnUp, this );

    this.game.gamepads.gamepads[0].thumbstickOnDownOnce.add( this.thumbstickOnDownOnce, this );
    this.game.gamepads.gamepads[0].thumbstickIsDown.add( this.thumbstickIsDown, this );
    this.game.gamepads.gamepads[0].thumbstickOnUp.add( this.thumbstickOnUp, this );


  	//Add the GameObjects to the stage
  	this.addChild(this.heart);
  	this.addChild(this.crown);
  	this.addChild(this.sheild);
  	this.addChild(this.bomb);
	  this.addChild(this.name);
  
}

GamepadPlugin.Play.buttonOnDownOnce = function( button ){
  console.log("DOWN:", button.name );

}

GamepadPlugin.Play.buttonIsDown = function( button ){
  // console.log("DOOOOWN", button.name );

}

GamepadPlugin.Play.buttonOnUp = function( button ){
  console.log("UP:  ", button.name);

}

GamepadPlugin.Play.thumbstickOnDownOnce = function( thumbstick ){
  // console.log( this.shorten( thumbstick.value ), thumbstick.name );

}

GamepadPlugin.Play.thumbstickIsDown = function( thumbstick ){
  console.log(this.shorten( thumbstick.value ), thumbstick.name);
}

GamepadPlugin.Play.thumbstickOnUp = function( thumbstick ){
  // console.log(this.shorten( thumbstick.value ), thumbstick.name);

}

GamepadPlugin.Play.shorten = function( num ){
  return Math.round(num * 1000) / 1000;

}

