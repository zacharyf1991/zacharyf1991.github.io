CameraManager = function(state){
	this.state = state;
    this.shakeSize = 3;
    this.damageState = false;
    this.shakeDamage = this.state.game.time.clock.createTimer('shakeDamage', 0.005, 0, false);

    this.camera = game.cameras.defaultCamera;

    this.camera.transform.scaleX=0.75;
    this.camera.transform.scaleY=0.75;

    // this.camera.transform.scaleX=1.25;
    // this.camera.transform.scaleY=1.25;



}

/**
* This method moves the game camera dynamically via the player, but restrained on game borders
* @method updateCamera
* @public
*/
CameraManager.prototype.update = function () {
    this.updatePosition();
    //console.log(this.camera.transform.x * -1, this.camera.transform.y * -1);
    if(this.damageState){
        this.shakeCameraDamage();
    }


    
}


CameraManager.prototype.takeDamage = function() {
    //console.log("I'M HERE")

    this.shakeDamage.clear();
    this.shakeDamage.stop();
    this.shakeDamage.delay = 0.45;
    this.shakeDamage.repeatCount = 1;
    this.shakeDamage.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.damageReset, this);
    this.shakeDamage.start();
    this.damageState = true;
    
};

CameraManager.prototype.shakeCameraDamage = function() {

    this.state.camera.transform.x += Math.floor(Math.random() * 6 - 3);
    this.state.camera.transform.y += Math.floor(Math.random() * 6 - 3);
    
};

CameraManager.prototype.damageReset = function() {

    this.damageState = false;
};



CameraManager.prototype.updatePosition = function() {
    if (this.state.player.x < (this.state.game.stage.width/0.75) / 2) {
        this.state.camera.transform.x = -(game.stage.width * 1/8);
    } else if (this.state.player.x > (2098  - ((game.stage.width/ 0.75) / 2))) {
        this.state.camera.transform.x = -901;
    } else {
        this.state.camera.transform.x = (-this.state.player.x + this.state.game.stage.width / 2) * 0.75;
    }
    
    if (this.state.player.y < (this.state.game.stage.height / 0.75) / 2) {
        this.state.camera.transform.y = -(game.stage.height * 1/8);
    } else if (this.state.player.y > (2161 - ((game.stage.height/ 0.75) / 2))) {
        this.state.camera.transform.y = -1172;// - (game.stage.height/0.75)/2); 
    } else {
        this.state.camera.transform.y = (-this.state.player.y + this.state.game.stage.height / 2) * 0.75; // was 2
    }
};