var WeaponManager = function(state){
	this.state = state;

    this.shooting = false;
    this.beamShooting = false;
    this.beamNeedsUpdating = false;
    this.enemyTargeted = false;


    ////////////////////////
    //GROUPS
    this.beamGroup = new Kiwi.Group(this.state);
    this.impactGroup = new Kiwi.Group(this.state);
    this.sparkGroup = new Kiwi.Group(this.state);


    ////////////////////////
    //MOUSE
    //this.state.game.input.onUp.add(this.mouseUp, this);
    //this.state.game.input.onDown.add(this.mouseDown, this);


    this.myMiniGame = new Minigame(this.state, this, -300, -300);


    this.state.addChild(this.beamGroup);
    this.state.addChild(this.impactGroup);
    this.state.addChild(this.sparkGroup);


    this.myMiniGame.moveTo(-200, -200);
    //this.state.addChild(this.myMiniGame);



    
}

WeaponManager.prototype.update = function() {


	if(this.beamShooting && !this.state.player.jumping){
        this.updateBeam();
        
    } else if(this.beamGroup.members.length > 0 ){
        this.beamGroup.removeFirstAlive();
    }

    if(!this.myMiniGame.myActive){
        this.myMiniGame.moveTo(-200, -200);
    }
    if(!this.shooting){

        this.state.enemyManager.resetHit();
        this.stopShooting();
    }


};


WeaponManager.prototype.stopShooting = function() {
    //this.animation.play('idle');
    //console.log("STOP");
    this.shooting = false;
    this.beamShooting = false;
    this.enemyTargeted = false
    this.beamStage = 0;
    this.myMiniGame.blueCircleGroup.members[0].timesMissed = 0;
    this.stopBeam();
    if(this.sparkGroup.members.length > 0){
        this.sparkGroup.removeFirstAlive();
        
    }

    if(this.impactGroup.members.length > 0){
        this.impactGroup.removeFirstAlive();
        
    }
   
    this.myMiniGame.myActive = false;
};


WeaponManager.prototype.startShooting = function(){

    
    
    //this.physics.velocity.x = 0;
    if(this.shooting == false && !this.state.player.jumping){
    	
        this.state.player.physics.velocity.x = 0;
        this.shooting = true;
        this.state.player.readyShoot();
        var tempSpark = new Spark(this.state, 1,1);
        tempSpark.rotPointX = 0;
        tempSpark.rotPointY = 0;
        if(this.state.player.scaleX > 0){
            tempSpark.x = this.state.player.x + 20;
        }
        if(this.state.player.scaleX < 0){
            tempSpark.x = this.state.player.x + (80);
        }   
        tempSpark.y = this.state.player.y + 44;
        tempSpark.scaleX = -this.state.player.scaleX;
        this.sparkGroup.addChild(tempSpark);
    }

}


WeaponManager.prototype.createBeam = function(){
    //this.player.animation.play('idle');
    this.state.player.animation.play('shoot');
    this.state.weaponManager.beamShooting = true;
    //console.log(this);
}

WeaponManager.prototype.updateBeam = function(){
    var beamMembers = this.beamGroup.members;

    this.beamGroup.y = this.state.player.y + 42;
    if(this.state.player.scaleX > 0){
        this.beamGroup.x = this.state.player.x - (this.state.player.scaleX * 22) + 25;
    }
    if(this.state.player.scaleX < 0){
        this.beamGroup.x = this.state.player.x + (95);
    }

    
    
    this.beamGroup.scaleX = -this.state.player.scaleX;
    var beamHit = null;
    var numHit = 0
    //this.updateBeamStage();

    //has beam collided (Check beams against enemies)
    this.beamCollided = false;
    for (var i = 0; i < beamMembers.length; i++) {
        if(!(this.state.enemyManager.checkCollision(beamMembers[i]) == null)){
            //console.log('setting hit!');
            beamHit = beamMembers[i];
            this.enemyHit = this.state.enemyManager.checkCollision(beamMembers[i]);
            numHit++;
            this.beamCollided = true; //
            //console.log("Hit Enemy");
            break;
        }
    };
    if(numHit > 0){
        this.enemyTargeted = true;
    } else {
        this.enemyTargeted = false;
    }

    if(this.beamCollided){
        //remove uneeded beams
        //if shooting == true

        if(this.state.player.scaleX > 0){
                var impactX = this.beamGroup.x + (-this.state.player.scaleX * (((this.beamGroup.members.length - 1)*24))) - 100;
            } else{
                var impactX = this.beamGroup.x + (-this.state.player.scaleX * (((this.beamGroup.members.length - 1)*24)));
            }
            var impactY = this.beamGroup.y-10; 
        if(this.impactGroup.members.length <= 0){
            //////////////////////
            //Create Impact
            var tempImpact = new Impact(this.state, impactX, impactY);
            this.impactGroup.addChild(tempImpact);

        } 
        if (!this.myMiniGame.myActive){
              //////////////////////
            //StartMiniGame
            var minigameX = impactX - 28;
            var minigameY = this.beamGroup.y - 40;
            this.myMiniGame.moveTo(minigameX, minigameY);
            this.myMiniGame.myActive = true;
        }

        //console.log("start Minigame");
            //has minigame started
                //start minigame
                //continue
    } else {
        var beamLength = beamMembers.length ;
        if(beamLength < 40){
            var tempBeam = new Beam(this.state,  beamLength * 24, 0, this.beamStage);
            tempBeam.rotPointX = 0;
            tempBeam.rotPointY = 0;
            this.beamGroup.addChild(tempBeam)
        }
    }

    this.beamCollided = false;
}

WeaponManager.prototype.updateBeamStage = function() {
    if(this.beamNeedsUpdating){
        var beamMem = this.beamGroup.members;
        for (var i = beamMem.length - 1; i >= 0; i--) {
            beamMem[i].beamStage = this.beamStage;
            beamMem[i].updateAnimation();
        };
        this.enemyHit.damageEnemy();
        this.beamNeedsUpdating = false;
            
        
    }
};


WeaponManager.prototype.damageEnemy = function() {
    
};

WeaponManager.prototype.stopBeam = function(){
    //var len = this.beamGroup.members.length;
    //this.state.enemyManager.resetHit();
}

WeaponManager.prototype.mouseUp = function(){

    this.stopShooting();
    this.state.enemyManager.resetHit();



}



WeaponManager.prototype.mouseDown = function(){

        this.startShooting();
}

WeaponManager.prototype.addMiniGame = function(){

        this.state.addChild(this.myMiniGame);
}