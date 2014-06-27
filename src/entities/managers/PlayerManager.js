//PlayerManager / Player
var PlayerManager = function (state, x, y){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures['egonSprite'], x, y);
    this.state = state;


    //DIRECTIONS
    //based of numpad
    this.RIGHT = 6;
    this.RIGHTDOWN = 3;
    this.DOWN = 2;
    this.LEFTDOWN = 1;
    this.LEFT = 4;
    this.LEFTUP = 7;
    this.UP = 8;
    this.RIGHTUP = 9;

    
    this.keyboard = this.state.game.input.keyboard;
    this.mouse = this.state.game.input.mouse;

    this.animation.add('idle', [24], 0.1, true);
    this.animation.add('walk', [5, 11, 17, 23, 29, 30,  31, 32], 0.05, true);
    this.animation.add('jump', [0, 1], 0.1, true);
    this.animation.add('roll', [2, 2, 3, 3, 4, 4, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 12, 13, 14, 15, 16, 18, 19, 20], 0.005, false);
    this.animation.add('shoot', [21, 22, ], 0.05, true);
    this.animation.add('readyShoot', [25, 26, 27, 28], 0.1, false);
    this.animation.play('idle');    

    this.box.hitbox = new Kiwi.Geom.Rectangle(25, 20, 35, 80); 
    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
    
    this.physics.acceleration.y = 30;
    //this.physics.velocity.y = 15;

    this.force = 4;
    this.maxRunVelo = 26;
    this.beamStage = 0;
    this.jumpHeight = 40;

    ///////////////////
    //KEYBOARD
    this.rightKeyDown = false;
    this.leftKeyDown = false;
    this.jumpKeyDown = false;


    ////////////////////////
    //MOUSE
    // this.state.game.input.onUp.add(this.mouseUp, this);
    // this.state.game.input.onDown.add(this.mouseDown, this);



    /////////////////////////
    //BOOLEANS
    this.currDir = this.RIGHT;
    this.jumping = false;

    this.takeDamageTimer = this.game.time.clock.createTimer('takeDamageTimer', 0.25, 0, false);





    this.animation.getAnimation('roll').onStop.add(this.finishedRoll, this);
    this.animation.getAnimation('readyShoot').onStop.add(this.state.weaponManager.createBeam, this);




}
Kiwi.extend(PlayerManager, Kiwi.GameObjects.Sprite);



PlayerManager.prototype.takeDamage = function() {
    //console.log("I'M HERE")
    this.state.cameraManager.takeDamage();

    this.takeDamageTimer.clear();
    this.takeDamageTimer.stop();
    this.takeDamageTimer.delay = 0.14;
    this.takeDamageTimer.repeatCount = 6;
    this.takeDamageTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.flash, this);
    this.takeDamageTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.stopFlash, this);
    this.takeDamageTimer.start();
    
};

PlayerManager.prototype.flash = function() {
    if(this.alpha == 0.75){
        this.alpha = 1;
    } else {
        this.alpha = 0.75;
    }
};
PlayerManager.prototype.stopFlash = function() {
    
    this.alpha = 1;
    
};


PlayerManager.prototype.update = function(){
    //console.log(this.physics.velocity.x, this.x, this.physics.last.x);

    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    if(this.x > 2200){
        this.x = -50;
    } else if(this.x < -50){
        this.x = 2200;
    }

    //if(this.state.enemyManager.checkCollision(this)){
        //console.log("Hit Enemy");
    //}

    //this.physics.update();
    this.updateMovement();


    
    

    if(this.y > 1000){
        this.y = 50;
    }

    //CHECK TILES
    //round the player position to make tile calculation easier
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    
}








PlayerManager.prototype.jump = function(){

    if(this.jumpKeyDown && !this.jumping){
        if(this.physics.velocity.x == 0){
            this.physics.velocity.x += (this.maxRunVelo * 1.25) * -this.scaleX;
            //this.scaleX *= -1;
        }
        this.physics.velocity.y = -this.jumpHeight;
        this.physics.velocity.x = this.maxRunVelo * 2 * -this.scaleX;
        this.jumping = true;

        if(this.state.weaponManager.sparkGroup.members.length > 0){
            this.state.weaponManager.sparkGroup.removeFirstAlive();
        }

        if (this.animation.currentAnimation.name != 'jump'){
            
               this.animation.play('jump');
       }
    } 

}

PlayerManager.prototype.roll = function(){
    if (this.animation.currentAnimation.name != 'roll'){
        
        this.animation.play('roll');
    }
}
PlayerManager.prototype.finishedRoll = function(){

    this.jumping = false;
   
}

PlayerManager.prototype.updateMovement = function(direction){

    //BOTH MOVE KEYS UP
    if((!this.rightKeyDown && !this.leftKeyDown) && !this.jumping ){
        if(this.physics.velocity.x > 6 || this.physics.velocity.x < -6){
            this.physics.velocity.x *= 0.92;
        } else {this.physics.velocity.x = 0;}
    }

    //EITHER MOVE KEYS DOWN
    if(this.leftKeyDown || this.rightKeyDown){
        if (this.animation.currentAnimation.name != 'walk' && !this.jumping && !this.state.weaponManager.shooting)
               this.animation.play('walk');
    } else {
        if (this.animation.currentAnimation.name != 'idle' && !this.jumping&& !this.state.weaponManager.shooting){
               this.animation.play('idle');
            
        };
               
       }


    if(this.rightKeyDown && !this.state.weaponManager.shooting){
        this.scaleX = -1;
        if(this.physics.velocity.x < this.maxRunVelo){
            
            this.physics.velocity.x += this.force;
        } else if(!this.jumping){
            this.physics.velocity.x = this.maxRunVelo
        }

    } else if(this.leftKeyDown && !this.state.weaponManager.shooting){
        this.scaleX = 1;
        //this.physics.velocity.x -= this.force;
        if(this.physics.velocity.x > -this.maxRunVelo){
            //console.log(this.physics.velocity.x);
            this.physics.velocity.x -= (this.force);
        } else if(!this.jumping){
            this.physics.velocity.x = -this.maxRunVelo
        }

    }
}







PlayerManager.prototype.updateKeyDown = function(key) {
    if(key == 'RIGHT'){
        this.rightKeyDown = true;
    }else if(key == 'LEFT'){
        this.leftKeyDown = true;
    }

    if(key == 'JUMP'){
        this.jumpKeyDown = true;
        this.jump();
    }


};

PlayerManager.prototype.readyShoot = function() {
    this.animation.play('readyShoot');
};


PlayerManager.prototype.updateKeyUp = function(key) {
    if(key == 'RIGHT'){
        this.rightKeyDown = false;
    }else if(key == 'LEFT'){
        this.leftKeyDown = false;
    }

    if(key == 'JUMP'){
        this.jumpKeyDown = false;
    }
};

PlayerManager.prototype.hitByEnemy = function() {
    if(!this.jumping){
        this.state.gameManager.playerHitByEnemy();
    }
};















    // //on stage movement controls
    // this.controllerActive = true;
    // if (this.controllerActive) this.generateController();
    // console.log('CREATE GAME')




// /**
// * The generateController method displays control buttons onto the stage, and uses the TouchButton plugin
// * @method generateController
// * @public
// */
// PlatformBlueprint.Play.generateController = function () {
//     this.upButton = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['upButton'], 81, 300);
//     this.upButton.posX = this.upButton.x;
//     this.upButton.posY = this.upButton.y;
//     //this.addChild(this.upButton);

//     this.downButton = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['downButton'], 81, 441);
//     this.downButton.posX = this.downButton.x;
//     this.downButton.posY = this.downButton.y;
//     //this.addChild(this.downButton);

//     this.leftButton = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['leftButton'], 26, 360);
//     this.leftButton.posX = this.leftButton.x;
//     this.leftButton.posY = this.leftButton.y;
//     //this.addChild(this.leftButton);

//     this.rightButton = new Kiwi.Plugins.GameObjects.TouchButton(this, this.textures['rightButton'], 162, 360);
//     this.rightButton.posX = this.rightButton.x;
//     this.rightButton.posY = this.rightButton.y;
//     //this.addChild(this.rightButton);
// }



// /**
// * The updateController method moves the controller graphics to stay in position.
// * @method updateController
// * @public
// */
// PlatformBlueprint.Play.updateController = function () {
//     this.upButton.x = this.upButton.posX - this.camera.transform.x;
//     this.upButton.y = this.upButton.posY - this.camera.transform.y;

//     this.downButton.x = this.downButton.posX - this.camera.transform.x;
//     this.downButton.y = this.downButton.posY - this.camera.transform.y;

//     this.leftButton.x = this.leftButton.posX - this.camera.transform.x;
//     this.leftButton.y = this.leftButton.posY - this.camera.transform.y;

//     this.rightButton.x = this.rightButton.posX - this.camera.transform.x;
//     this.rightButton.y = this.rightButton.posY - this.camera.transform.y;
// }