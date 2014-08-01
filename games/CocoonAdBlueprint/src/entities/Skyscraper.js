//PlayerManager / Player
var Skyscraper = function (state){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.buildingAni, state.player.x + Math.random() * 7000, 100, false);
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
    // this.physics.moves = false;

    
    this.platformActive = false;
    this.nextActivated = true;
    //this.reset();

    this.physics.velocity.x = 35;

}
Kiwi.extend(Skyscraper, Kiwi.GameObjects.Sprite);





Skyscraper.prototype.update = function(){

    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    this.physics.velocity.x = this.state.player.physics.velocity.x * 0.5;
   
  
    this.physics.update();
    if(this.x < this.state.player.x - 1500){
        this.reset();
    }
    
}









Skyscraper.prototype.updateMovement = function(){
    
    if(!this.platformActive){
        //this.physics.velocity.x = this.state.player.playersVelocityAfter;
    } else {
        //this.physics.velocity.x = 0;
    }
    // if(this.x <= this.state.player.x - (this.width + 500))
    //     this.reset();


}



Skyscraper.prototype.reset = function(){
    // this.platformActive = false;
    this.x  = this.state.player.x + Math.random() * 7000 + 1500;
    

}

Skyscraper.prototype.activate = function(plat){
    this.nextActivated = false;
    this.x = this.state.player.x + 1300;
    //this.physics.velocity.x = 0;

    //////////////////
    // y > 80 y < 480 

    
    this.y = 100;

    this.state.objectManager.createObject(this);

}
