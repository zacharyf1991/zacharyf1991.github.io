//PlayerManager / Player
var Crate = function (state, platform){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.crate, -1500, 100, false);
    this.state = state;
    this.myPlatform = platform;


    this.animation.add('idle', [0], 0.1, true);
    this.animation.add('hit', [1, 2, 3], 0.05, false);

    this.animation.play('idle');  
    var myX = Math.random() * (this.myPlatform.width - this.width);
    var myY = this.myPlatform.y - (this.height);
    this.x = myX + this.myPlatform.x;
    this.y = myY;

    this.box.hitbox = new Kiwi.Geom.Rectangle(40, 26, 49, 97); 
    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
    this.physics.immovable = true;
    this.physics.moves = false;

    // this.scaleX = 0.5;
    // this.scaleY = 0.5;   
    
    
    this.platformActive = false;
    this.nextActivated = true;
    this.collidable = true;

    this.animation.getAnimation('hit').onStop.add(this.eradicate, this);
    //this.reset();

}
Kiwi.extend(Crate, Kiwi.GameObjects.Sprite);





Crate.prototype.update = function(){

    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    if(!this.nextActivated){
        if(this.x + this.width <= this.state.player.x + 1000){
            this.nextActivated = true;
            this.state.platformManager.activatePlatform(this);
        }

    }
    if(this.x < this.state.player.x - 500){
        this.exists = false;
    }
    this.physics.update();
}




Crate.prototype.eradicate = function(){
    this.animation.getAnimation('hit').onStop.remove(this.eradicate, this);
    this.exist = false;
}




Crate.prototype.updateMovement = function(){
    
    if(!this.platformActive){
        this.physics.velocity.x = this.state.player.playersVelocityAfter;
    } else {
        this.physics.velocity.x = 0;
    }
}



Crate.prototype.reset = function(){
    this.x  = this.state.player.x + game.stage.width -400;
}


Crate.prototype.hitPlayer = function() {
    this.collidable = false;
    this.animation.play("hit");
    this.state.player.slowPlayer();

};

