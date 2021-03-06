//PlayerManager / Player
var Platform = function (state, texture){
    Kiwi.GameObjects.Sprite.call(this, state, texture, -1500, 100, false);
    this.state = state;
    

    this.animation.add('ani1', [0], 0.1, true);
    this.animation.add('ani2', [1], 0.1, true);
    this.animation.add('ani3', [2], 0.1, true);

    
    var num = Math.floor(Math.random()* 3)
    if(num ==0){
        this.animation.play('ani1');  
    }  else if(num == 1){
        this.animation.play('ani2');  
    } else if(num == 2){
        this.animation.play('ani3');  
    } 

    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
    this.physics.immovable = true;
    this.physics.moves = false;

    
    this.platformActive = false;
    this.nextActivated = true;
    //this.reset();

}
Kiwi.extend(Platform, Kiwi.GameObjects.Sprite);





Platform.prototype.update = function(){

    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    if(!this.nextActivated){
        //console.log("Inside");
        if(this.x + this.width <= this.state.player.x + 1000){
            this.nextActivated = true;
            this.state.platformManager.activatePlatform(this);
        }

    }
  
    this.physics.update();
    
}









Platform.prototype.updateMovement = function(){
    
    if(!this.platformActive){
        this.physics.velocity.x = this.state.player.playersVelocityAfter;
    } else {
        this.physics.velocity.x = 0;
    }
    // if(this.x <= this.state.player.x - (this.width + 500))
    //     this.reset();


}



Platform.prototype.reset = function(){
    // this.platformActive = false;
    this.x  = this.state.player.x + game.stage.width -400;
    

}

Platform.prototype.activate = function(plat){
    // console.log("ACTIVATED");
    // this.platformActive = true;
    this.nextActivated = false;
    this.x = this.state.player.x + 1300;
    this.physics.velocity.x = 0;

    //////////////////
    // y > 80 y < 480 

    var myY = plat.y+(Math.random() * 300) - 100;
    if(myY <= 200){
        myY = 200;
    } else if(myY >= 480){
        myY = 480;
    }
    this.y = myY;

    this.state.objectManager.createObject(this);

}
