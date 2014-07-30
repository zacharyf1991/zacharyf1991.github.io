var CocoonAdBlueprint = CocoonAdBlueprint || {};

CocoonAdBlueprint.Play = new Kiwi.State('Play');

/**
* The PlayState in the core state that is used in the game. 
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
* 
*/


/**
* This create method is executed when a Kiwi state has finished loading any resources that were required to load.
*/
CocoonAdBlueprint.Play.create = function () {
  this.playerInitialX = 100;
  this.playerInitialY = 250;


  this.environmentManager = new EnvironmentManager(this);
  this.player = new PlayerManager(this,  this.playerInitialX, this.playerInitialY);
  this.player.alpha = 1;
  this.addChild(this.player);

  this.inputManager = new InputManager(this);



  this.cameraManager = new CameraManager(this);

  this.platformManager = new PlatformManager(this);
  this.addChild(this.platformManager);


  this.hudManager = new HUDManager(this);



	this.name = new Kiwi.GameObjects.StaticImage(this, this.textures.kiwiName, 10, 10);
  this.addChild(this.name);
  
}

CocoonAdBlueprint.Play.update = function() {
  Kiwi.State.prototype.update.call(this);
  this.cameraManager.update();
  this.environmentManager.update();
  this.hudManager.update();

};




