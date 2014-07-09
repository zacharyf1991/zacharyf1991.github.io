var PoriruaGame = PoriruaGame || {};

PoriruaGame.Play = new Kiwi.State('Play');
PoriruaGame.Play.create = function () {
  	this.name = new Kiwi.GameObjects.StaticImage(this, this.textures.kiwiName, 10, 10);
    this.camera = game.cameras.defaultCamera;
    this.cameraManager = new CameraManager(this);

    this.backgroundMap = new Kiwi.GameObjects.StaticImage(this, this.textures.background, 0, 0);
    this.addChild(this.backgroundMap);
    this.environmentManager = new EnvironmentManager(this);
    this.environmentManager.addBuildings();

    this.rect1 = new Kiwi.Plugins.GameObjects.Geom.Rectangle(this);
    this.addChild(this.rect1);
    this.addChild(this.name);
    //this.rect1.render();
    this.inputManager = new InputManager(this);
    this.player = new PlayerManager(this, 1400, 1000);
    this.junctionPointManager = new JunctionPointManager(this);

    this.junctionPointManager.createPoints();
    this.junctionPointManager.addConnected();

    this.hudManager = new HUDManager(this);



    this.addChild(this.player);


  
}

PoriruaGame.Play.update = function(){
  Kiwi.State.prototype.update.call(this);
  this.rect1.render();
  this.rect1.update();

  // this.player.update();
  // this.player.physics.update();

  this.cameraManager.update();
  this.junctionPointManager.update();
  this.environmentManager.update();

  //console.log(this.rect1.checkAllOn(), this.junctionPointManager.allPointsOn());
  if(this.rect1.checkAllOn() && this.junctionPointManager.allPointsOn()){
    this.gameOver();
  }
}


PoriruaGame.Play.gameOver = function(){
  console.log("Game Over!");
  this.inputManager.endState();
  this.hudManager.endState();
  game.states.switchState("GameOver");

}





