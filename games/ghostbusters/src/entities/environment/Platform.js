//Platform / Player
var Platform = function (state, x, y){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures['platform'], x, y);
    this.state = state;
     

    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
    this.physics.immovable = true;
    //this.physics.acceleration.y = 15;
    //this.physics.velocity.y = 15;




}
Kiwi.extend(Platform,Kiwi.GameObjects.Sprite);

    
   

    Platform.prototype.update = function(){
        Kiwi.GameObjects.Sprite.prototype.update.call(this);

        this.physics.update();
        



    }

   

