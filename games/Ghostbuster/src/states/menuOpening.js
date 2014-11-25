var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.MenuOpening = new Kiwi.State('MenuOpening');



PlatformBlueprint.MenuOpening.create = function (params) {
    this.open1 = new Kiwi.GameObjects.Sprite ( this, this.textures.open1, 0, 0 );
    this.open1.alpha = 0;
    this.open1.x = this.game.stage.width * 0.5 - this.open1.width * 0.5;
    this.open1.y = this.game.stage.height * 0.5 - this.open1.height * 0.5;

    this.open2 = new Kiwi.GameObjects.Sprite ( this, this.textures.open2, 0, 0 );
    this.open2.alpha = 0;
    this.open2.x = this.game.stage.width * 0.5 - this.open2.width * 0.5;
    this.open2.y = this.game.stage.height * 0.5 - this.open2.height * 0.5;

    this.open3 = new Kiwi.GameObjects.Sprite ( this, this.textures.open3, 0, 0 );
    this.open3.alpha = 0;
    this.open3.x = this.game.stage.width * 0.5 - this.open3.width * 0.5;
    this.open3.y = this.game.stage.height * 0.5 - this.open3.height * 0.5;

    this.open4 = new Kiwi.GameObjects.Sprite ( this, this.textures.open4, 0, 0 );
    this.open4.alpha = 0;
    this.open4.x = this.game.stage.width * 0.5 - this.open4.width * 0.5;
    this.open4.y = this.game.stage.height * 0.5 - this.open4.height * 0.5;

    this.menuBackground = new Kiwi.GameObjects.Sprite(this, this.textures.menu, 0, 0);
    this.menuBackground.animation.add('play', [0, 1, 2, 2, 1], 0.075, true);
    this.menuBackground.animation.play('play'); 
    this.menuBackground.alpha = 0;
    this.addChild(this.menuBackground);


    this.addChild( this.open4 );
    this.addChild( this.open3 );
    this.addChild( this.open2 );
    this.addChild( this.open1 );

    this.tweenTime = 500;
    this.tweenHoldTime = 1000;
    this.tweenInTime = 500;
    this.delayTime = 200;



    //create the tweens
  this.tween1In = this.game.tweens.create(this.open1);
  this.tween1Hold = this.game.tweens.create(this.open1);  
  this.tween1Out = this.game.tweens.create(this.open1);

  this.tween2In = this.game.tweens.create(this.open2); 
  this.tween2Hold = this.game.tweens.create(this.open2); 
  this.tween2Out = this.game.tweens.create(this.open2); 

  this.tween3In = this.game.tweens.create(this.open3);
  this.tween3Hold = this.game.tweens.create(this.open3); 
  this.tween3Out = this.game.tweens.create(this.open3);

  this.tween4In = this.game.tweens.create(this.open4);
  this.tween4Hold = this.game.tweens.create(this.open4);
  // this.tween4Out = this.game.tweens.create(this.open4);
  
  //set the tweens up
  this.tween1In.to({ alpha: 1 }, this.tweenInTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween1Hold.to({ alpha: 1 }, this.tweenHoldTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween1Out.to({ alpha: 0 }, this.tweenTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);

  this.tween2In.to({ alpha: 1 }, this.tweenInTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween2Hold.to({ alpha: 1 }, this.tweenHoldTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween2Out.to({ alpha: 0 }, this.tweenTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);

  this.tween3In.to({ alpha: 1 }, this.tweenInTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween3Hold.to({ alpha: 1 }, this.tweenHoldTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween3Out.to({ alpha: 0 }, this.tweenTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);

  this.tween4In.to({ alpha: 1 }, this.tweenInTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween4Hold.to({ alpha: 1 }, this.tweenHoldTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);


  this.tween1In.delay(this.delayTime);
  this.tween2In.delay(this.delayTime);
  this.tween3In.delay(this.delayTime);
  this.tween4In.delay(this.delayTime);

  //set the order that they will execute one after the other in.
  this.tween1In.chain(this.tween1Hold);
  this.tween1Hold.chain(this.tween1Out);
  this.tween1Out.chain(this.tween2In);

  this.tween2In.chain(this.tween2Hold);
  this.tween2Hold.chain(this.tween2Out);
  this.tween2Out.chain(this.tween3In);

  this.tween3In.chain(this.tween3Hold);
  this.tween3Hold.chain(this.tween3Out);
  this.tween3Out.chain(this.tween4In);

  this.tween4In.chain(this.tween4Hold);

  this.tween4Hold.onComplete( this.startFlash, this );

  this.tween1In.start();

    
}
PlatformBlueprint.MenuOpening.startFlash = function(){

    // console.log ( "Start Flash" );

    this.menuBackground.alpha = 1;

    this.timer  = this.game.time.clock.createTimer('flash', 0.125, 16, false);
    this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.flash, this);  //create a new timer event on that timer
    this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.exitState, this);  //create a new timer event on that timer
    this.timer.start();
}

PlatformBlueprint.MenuOpening.flash = function(){

    // console.log ( "Flash" , this.open4.alpha );

    if( this.open4.alpha == 1 ) {
        this.open4.alpha = 0;
    } else {
        this.open4.alpha = 1;
    }
}



PlatformBlueprint.MenuOpening.exitState = function(){

    game.states.switchState("Intro");

}
