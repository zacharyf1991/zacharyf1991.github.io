//JunctionPoint / Player
var JunctionPoint = function (state, x, y){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.junctionPoint, x, y);
    this.state = state;


    this.animation.add('off', [0], 0.1, false);
    this.animation.add('on', [1], 0.1, false);
    //this.animation.add('walkLeft', [34, 35, 36, 37, 38, 39], 0.1, true);

    this.animation.play('off');   
    this.connectedTo = [];
    this.visiblePoint = true;
    this.isOn = false; 
    this.collisionDistance = 40;

    this.collisionPoint = new Kiwi.Geom.Point(x + this.width/2, y +this.height/2); // == this.x + this.width/2 && y

    



}
Kiwi.extend(JunctionPoint, Kiwi.GameObjects.Sprite);





JunctionPoint.prototype.update = function(){
    //console.log(this.physics.velocity.x, this.x, this.physics.last.x);

    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    //this.updateMovement();

    
}

JunctionPoint.prototype.addConnected = function(con) {
    this.connectedTo[this.connectedTo.length] = con;
};

JunctionPoint.prototype.checkCollision = function(col) {
    if(!this.isOn){
        var colPoint = new Kiwi.Geom.Point(col.x + col.width/2, col.y + col.height/2);
        if(this.collisionPoint.distanceTo(colPoint) < this.collisionDistance){
            this.isOn = true;
            this.animation.play('on');
            this.alpha = 1;
            // console.log("Hit me!", this.x, this.y);
        }
    }


};






