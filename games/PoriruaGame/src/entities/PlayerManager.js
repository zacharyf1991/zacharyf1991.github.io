//PlayerManager / Player
var PlayerManager = function (state, x, y){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures['player'], x, y);
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

    this.animation.add('idle', [21], 0.1, true);
    this.animation.add('walkUp', [1, 2, 3, 4, 5,  6], 0.1, true);
    this.animation.add('walkDown', [12, 13, 14, 15,  16, 17], 0.1, true);
    this.animation.add('walkRight', [ 23, 24, 25,  26, 27, 28], 0.1, true);
    this.animation.add('walkLeft', [34, 35, 36, 37, 38, 39], 0.1, true);

    this.animation.play('idle');    

    this.box.hitbox = new Kiwi.Geom.Rectangle(28, 65, 1, 1); 
    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
    

    this.force = 3;
    this.maxRunVelo = 18;
    this.beamStage = 0;
    this.jumpHeight = 40;

    // Raw physics data
    // This is relative to TIME, not to FRAMES
    // It will be modulated by speed governance before being passed to physics
    this.velocityX = 0;
    this.velocityY = 0;

    ///////////////////
    //KEYBOARD
    this.rightKeyDown = false;
    this.leftKeyDown = false;
    this.jumpKeyDown = false;
    this.upKeyDown = false;
    this.downKeyDown = false;

    this.canKillZombie = false;
    this.invincible = false;

    this.takeDamageTimer = this.game.time.clock.createTimer('takeDamageTimer', 0.25, 0, false);
    this.chocPowerTime = this.game.time.clock.createTimer('chocPowerTime', 0.25, 0, false);

    this.damage = new Kiwi.Sound.Audio(this.game, 'damageZombie', 0.3, false);



    this.previousLocation = new Kiwi.Geom.Vector2(x, y);

    //hitByEnemy
    //canKillZombie




    /////////////////////////
    //BOOLEANS
    this.currDir = this.RIGHT;
    this.jumping = false;
    this.health = 3;
    this.damageFromZombie = 1;

    // this.takeDamageTimer = this.game.time.clock.createTimer('takeDamageTimer', 0.25, 0, false);

    // this.animation.getAnimation('roll').onStop.add(this.finishedRoll, this);
    // this.animation.getAnimation('readyShoot').onStop.add(this.state.weaponManager.createBeam, this);




}
Kiwi.extend(PlayerManager, Kiwi.GameObjects.Sprite);





PlayerManager.prototype.update = function(){
    //console.log(this.physics.velocity.x, this.x, this.physics.last.x);

    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    if(this.x > 2200){
        this.x = -50;
    } else if(this.x < -50){
        this.x = 2200;
    }

    if(this.y > 2200){
        this.y = -50;
    } else if(this.y < -50){
        this.y = 2200;
    }
    
    this.updateMovement();

    this.minDist = 1000;
    //var minPt = null;
    for (var i = this.state.rect1.allRoadPoints.length - 1; i >= 0; i--) {
        for (var j = this.state.rect1.allRoadPoints[i].length - 1; j >= 0; j--) {
            var tempDist = this.state.rect1.allRoadPoints[i][j].distanceToXY(this.x + 28  + this.physics.velocity.x, this.y + 79+ this.physics.velocity.y)
            if( tempDist < this.minDist){
                this.minDist = tempDist;
                //minPt = this.state.rect1.allRoadPoints[i][j];
                //console.log("Test");
            }
        };
    };
    if(this.minDist >= 40){
        // console.log("Hello?");

        /*
        // Some non-successful physics models
        var restitution = 0.25;
        // Bounce back a fraction of a frame along current trajectory
        var dx = this.physics.velocity.x * restitution;
        var dy = this.physics.velocity.y * restitution;
        this.x -= dx;
        this.y -= dy;
        // Bounce forward towards the nearest ideal point, CONSERVING momentum
        var d = Math.sqrt(dx*dx + dy*dy);
        var dx2 = minPt.x - this.x;
        var dy2 = minPt.y - this.y;
        var ang = Math.atan2(dy2, dx2);
        this.x += d * Math.cos(ang);
        this.y += d * Math.sin(ang);
        */

        this.physics.velocity.x = 0;
        this.physics.velocity.y = 0;
        
        /*
        // Direct the player towards the nearest point
        var dx = this.x - minPt.x;
        var dy = this.y - minPt.y;
        var ang = Math.atan2(dy, dx);
        var v = Math.sqrt( Math.pow( this.physics.velocity.x, 2 ) + Math.pow( this.physics.velocity.y, 2 ) );
        this.physics.velocity.setTo( v * Math.cos(ang) * restitution, v * Math.sin(ang) * restitution);
        */
        

        // this.x = this.previousLocation.x;
        // this.y = this.previousLocation.y;
        // this.x += -(this.physics.velocity.x * 0.5);
        // this.y += -(this.physics.velocity.y * 0.5);
    }
    this.physics.update();

    this.previousLocation.setTo(this.x, this.y);
    
}









PlayerManager.prototype.updateMovement = function(direction){

    // Govern speed
    var t = this.state.game.speedGovernor.timeScaleFactor();
    var friction = 0.08;
    var restitution = (1.0 - friction * t);
    this.velocityX = this.physics.velocity.x / t;
    this.velocityY = this.physics.velocity.y / t;

    //BOTH MOVE KEYS UP
    if(!this.rightKeyDown && !this.leftKeyDown){
        if(this.velocityX > 6 || this.velocityX < -6){
            this.velocityX *= restitution;
        } else {this.velocityX = 0;}
    }

    if(!this.upKeyDown && !this.downKeyDown){
        if(this.velocityY > 6 || this.velocityY < -6){
            this.velocityY *= restitution;
        } else {this.velocityY = 0;}
    }

    //EITHER MOVE KEYS DOWN
    if(this.rightKeyDown){
        if (this.animation.currentAnimation.name != 'walkRight' )
               this.animation.play('walkRight');
    }else if(this.leftKeyDown){
        if (this.animation.currentAnimation.name != 'walkLeft' )
               this.animation.play('walkLeft');
    }else if(this.downKeyDown){
        if (this.animation.currentAnimation.name != 'walkDown' )
               this.animation.play('walkDown');
    }else if(this.upKeyDown){
        if (this.animation.currentAnimation.name != 'walkUp' )
               this.animation.play('walkUp');
    } else {
        if (this.animation.currentAnimation.name != 'idle' ){
               this.animation.play('idle');
            
        };
               
    }


    if(this.rightKeyDown){
        if(this.velocityX < this.maxRunVelo){
            
            this.velocityX += this.force * t;
        } 

    } 
    if(this.leftKeyDown){
        //this.physics.velocity.x -= this.force;
        if(this.velocityX > -this.maxRunVelo){
            //console.log(this.physics.velocity.x);
            this.velocityX -= (this.force * t);
        } 

    } 
    if(this.downKeyDown){
        if(this.velocityY < this.maxRunVelo){
            
            this.velocityY += this.force * t;
        } 

    } 
     if(this.upKeyDown){
        if(this.velocityY > -this.maxRunVelo){
            this.velocityY -= (this.force * t);
        } 

    }

    // Govern max velocity
    if(this.velocityX < -this.maxRunVelo)
        this.velocityX = -this.maxRunVelo;
    if(this.maxRunVelo < this.velocityX)
        this.velocityX = this.maxRunVelo;
    if(this.velocityY < -this.maxRunVelo)
        this.velocityY = -this.maxRunVelo;
    if(this.maxRunVelo < this.velocityY)
        this.velocityY = this.maxRunVelo;

    // Pass to physics
    this.physics.velocity.x = this.velocityX * t;
    this.physics.velocity.y = this.velocityY * t;
}


PlayerManager.prototype.updateKeyDown = function(key) {
    if(key == 'RIGHT'){
        this.rightKeyDown = true;
    }else if(key == 'LEFT'){
        this.leftKeyDown = true;
    } else if(key == 'UP'){
        this.upKeyDown = true;
    }else if(key == 'DOWN'){
        this.downKeyDown = true;
    }

    if(key == 'JUMP'){
        this.jumpKeyDown = true;
        this.jump();
    }


};



PlayerManager.prototype.updateKeyUp = function(key) {
    if(key == 'RIGHT'){
        this.rightKeyDown = false;
    }else if(key == 'LEFT'){
        this.leftKeyDown = false;
    } 
    if(key == 'UP'){
        this.upKeyDown = false;
    }else if(key == 'DOWN'){
        this.downKeyDown = false;
    }

    if(key == 'JUMP'){
        this.jumpKeyDown = false;
    }
};

PlayerManager.prototype.hitByEnemy = function() {
    if(!this.invincible){
        this.invincible = true;
        this.health -= this.damageFromZombie;
        this.damage.play();

        this.takeDamageTimer.clear();
        this.takeDamageTimer.stop();
        this.takeDamageTimer.delay = 0.14;
        this.takeDamageTimer.repeatCount = 12;
        this.takeDamageTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.flash, this);
        this.takeDamageTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.stopFlash, this);
        this.takeDamageTimer.start();
        
    }



};

PlayerManager.prototype.flash = function() {
    if(this.alpha == 0.25){
        this.alpha = 1;
    } else {
        this.alpha = 0.25;
    }
};
PlayerManager.prototype.stopFlash = function() {
    
    this.alpha = 1;
    this.invincible = false;
    
};


PlayerManager.prototype.pickBarUp = function() {
    this.canKillZombie = true;

        this.chocPowerTime.clear();
        this.chocPowerTime.stop();
        this.chocPowerTime.delay = 8;
        this.chocPowerTime.repeatCount = 1;
        // this.chocPowerTime.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.flash, this);
        this.chocPowerTime.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.stopChocPower, this);
        this.chocPowerTime.start();
        
}

PlayerManager.prototype.stopChocPower = function() {
    this.canKillZombie = false;

    
};