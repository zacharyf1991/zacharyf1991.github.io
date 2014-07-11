var PoriruaGame = PoriruaGame || {};

PoriruaGame.Play = new Kiwi.State('Play');

PoriruaGame.Play.init = function () {



  this.timer  = this.game.time.clock.createTimer('changeVisible', 3, -1, false);
  this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.addBar, this);

}


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

    this.chocBarManager = new ChocBarManager(this);
    this.timer.start();



    this.addChild(this.player);

    this.score = 0;
    this.linePointScore = 1;
    this.maxTime = 300;
    this.startTime = this.game.time.clock.elapsed();
    this.visibleTime = 0;

    this.backgroundMusic = new Kiwi.Sound.Audio(this.game, 'loop', 0.3, true);
    this.backgroundMusic.play();


  
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
  this.chocBarManager.update();
  this.hudManager.update();
  this.updateTime();

  //console.log(this.rect1.checkAllOn(), this.junctionPointManager.allPointsOn());
  if(this.rect1.checkAllOn() && this.junctionPointManager.allPointsOn()){
    this.gameOver('win');
  }
}


PoriruaGame.Play.gameOver = function(condition){
  console.log("Game Over!");
  this.inputManager.endState();
  this.hudManager.endState();
  this.timer.stop();
  this.backgroundMusic.stop();

  var params = { thing: {
        bars: this.chocBarManager.barsCollected,
        time: Math.floor(this.game.time.clock.elapsed() - this.startTime),
        zombies: 5,
        condition: condition,
        visibleTime: this.visibleTime
      }


    }

  game.states.switchState("GameOver", null, null, params);

}


PoriruaGame.Play.addBar = function(){
  this.chocBarManager.addBar();
}

PoriruaGame.Play.updateTime = function(){
  var raw = this.game.time.clock.elapsed() - this.startTime;

  var rawSec = this.maxTime - Math.floor(raw);
  if (rawSec <= 0) {
      this.gameOver('lose');
      return;
  }

  var t = '';
  var sec = 0;
  if (rawSec > 60) {
      var min = Math.floor(rawSec / 60);
      sec = rawSec - min * 60;
      if(min>9){
          //this.topText.text = '9:59';
          return;
      }
      t += min + ':';
  }else{
      t += '0:';
      sec = rawSec;
  }

  if (sec > 9) {
      t += sec;
  } else {
      t += '0'+sec
  }
  //this.topText.text = t;
  //console.log(t);
  this.visibleTime = t;
  this.hudManager.updateTime(t);
}






