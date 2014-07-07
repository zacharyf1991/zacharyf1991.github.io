var PoriruaGame = PoriruaGame || {};

PoriruaGame.Play = new Kiwi.State('Play');
PoriruaGame.Play.create = function () {
  	this.name = new Kiwi.GameObjects.StaticImage(this, this.textures.kiwiName, 10, 10);
    this.camera = game.cameras.defaultCamera;
    this.cameraManager = new CameraManager(this);

    this.backgroundMap = new Kiwi.GameObjects.StaticImage(this, this.textures.background, 0, 0);
    this.addChild(this.backgroundMap);

    this.rect1 = new Kiwi.Plugins.GameObjects.Geom.Rectangle(this);
    this.addChild(this.rect1);
	  this.addChild(this.name);
    //this.rect1.render();
    this.inputManager = new InputManager(this);
    this.player = new PlayerManager(this, 400, 1500);
    this.addChild(this.player);




  
}

PoriruaGame.Play.update = function(){
  Kiwi.State.prototype.update.call(this);
  this.rect1.render();
  this.rect1.update();

  this.player.update();
  this.player.physics.update();

  this.cameraManager.update();
}




