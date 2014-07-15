//JunctionPoint / Player
var Building = function (state, texture, x, y){
    Kiwi.GameObjects.Sprite.call(this, state, texture, x, y);
    this.state = state;


   // this.animation.add('off', [0], 0.1, false);
    //this.animation.add('on', [1], 0.1, false);
    //this.animation.add('walkLeft', [34, 35, 36, 37, 38, 39], 0.1, true);

    //this.animation.play('off');   
    this.connectedTo = [];
    this.visiblePoint = true;
    this.isOn = false; 
    this.alpha = 0;
    this.collisionDistance = 50;



    this.box.hitbox = new Kiwi.Geom.Rectangle(this.width /8, this.height / 8, (this.width/8) * 6, (this.height/8) * 6);

    if(texture == this.state.textures.playground){
         this.box.hitbox = new Kiwi.Geom.Rectangle(0, 0, this.width, this.height);
    }
    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));

    this.collisionPoint = new Kiwi.Geom.Point(x + this.width/2, y +this.height/2); 

    



}
Kiwi.extend(Building, Kiwi.GameObjects.Sprite);





Building.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    this.physics.update();
    if(this.physics.overlaps(this.state.player)){
        this.alpha = 1;
    }

    
}

Building.prototype.addConnected = function(con) {
    this.connectedTo[this.connectedTo.length] = con;
};

Building.prototype.checkCollision = function(col) {
    if(!this.isOn){
        var colPoint = new Kiwi.Geom.Point(col.x + 27, col.y + 79);
        if(this.collisionPoint.distanceTo(colPoint) < this.collisionDistance){
            this.isOn = true;
            this.alpha = 1;
            // console.log("Hit me!", this.x, this.y);
        }
    }


};






