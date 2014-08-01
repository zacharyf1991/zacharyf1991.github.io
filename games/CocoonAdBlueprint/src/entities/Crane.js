//PlayerManager / Player
var Crane = function (state){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.craneAni, state.player.x + Math.random() * 7000, 100, false);
    this.state = state;
    

    this.animation.add('ani1', [0], 0.1, true);
    this.animation.add('ani2', [1], 0.1, true);

    
    var num = Math.floor(Math.random()* 2)
    if(num ==0){
        this.animation.play('ani1');  
    }  else if(num == 1){
        this.animation.play('ani2');  
    } 

    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
    this.physics.immovable = true;
    // this.physics.moves = false;

    
    this.platformActive = false;
    this.nextActivated = true;
    //this.reset();
    this.physics.velocity.x = 20;

}
Kiwi.extend(Crane, Kiwi.GameObjects.Sprite);





Crane.prototype.update = function(){

    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    this.physics.velocity.x = this.state.player.physics.velocity.x * 0.25;
  
    this.physics.update();
    
}









Crane.prototype.updateMovement = function(){
    
    if(!this.platformActive){
        // this.physics.velocity.x = this.state.player.playersVelocityAfter;
    } else {
        // this.physics.velocity.x = 0;
    }
    // if(this.x <= this.state.player.x - (this.width + 500))
    //     this.reset();


}



Crane.prototype.reset = function(){
    // this.platformActive = false;
    this.x  = this.state.player.x + Math.random() * 7000 + 1500;
    

}

Crane.prototype.activate = function(plat){
    this.nextActivated = false;
    this.x = this.state.player.x + 1300;
    // this.physics.velocity.x = 0;

    //////////////////
    // y > 80 y < 480 

    
    this.y = 100;

    this.state.objectManager.createObject(this);

}
