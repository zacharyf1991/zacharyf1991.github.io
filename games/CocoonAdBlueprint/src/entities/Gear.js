//PlayerManager / Player
var Gear = function (state){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.gearAni, state.player.x + Math.random() * 7000, 522, false);
    this.state = state;
    

    this.animation.add('ani1', [0], 0.1, true);
    this.animation.add('ani2', [1], 0.1, true);
    this.rotSpeed = Math.random() * 0.2 - 0.1;

    
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

    this.physics.velocity.x = 10;

}
Kiwi.extend(Gear, Kiwi.GameObjects.Sprite);





Gear.prototype.update = function(){

    Kiwi.GameObjects.Sprite.prototype.update.call(this);

    this.physics.velocity.x = this.state.player.physics.velocity.x * 0.15;
   
  
    this.physics.update();
    if(this.x < this.state.player.x - 1500){
        this.reset();
    }
    this.rotation += this.rotSpeed;
    
}









Gear.prototype.updateMovement = function(){
    
    if(!this.platformActive){
        // this.physics.velocity.x = this.state.player.playersVelocityAfter;
    } else {
        // this.physics.velocity.x = 0;
    }
    // if(this.x <= this.state.player.x - (this.width + 500))
    //     this.reset();


}



Gear.prototype.reset = function(){
    // this.platformActive = false;
    this.x  = this.state.player.x + Math.random() * 7000 + 1500;
    this.rotSpeed = Math.random() * 0.2 - 0.1;

    

}

Gear.prototype.activate = function(){
  this.nextActivated = false;
    this.x = this.state.player.x + 1300;
    // this.physics.velocity.x = 0;

    //////////////////
    // y > 80 y < 480 

    
    this.y = 100;

    this.state.objectManager.createObject(this);
}
