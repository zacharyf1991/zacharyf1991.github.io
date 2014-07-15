//ChocBar
var ChocBar = function (state, x, y){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.chocBar, x, y);
    this.state = state;


    // this.animation.add('off', [0], 0.1, false);
    // this.animation.add('on', [1], 0.1, false);
    // //this.animation.add('walkLeft', [34, 35, 36, 37, 38, 39], 0.1, true);

    // this.animation.play('off');  
    this.collisionDistance = 40;

    this.x -= this.width/2;
    this.y -= this.width/2;
    this.collisionPoint = new Kiwi.Geom.Point(this.x + this.width/2, this.y +this.height/2); // == this.x + this.width/2 && y

    this.eatChocSound = new Kiwi.Sound.Audio(this.game, 'eatChoc', 0.3, false);
    



}
Kiwi.extend(ChocBar, Kiwi.GameObjects.Sprite);





ChocBar.prototype.update = function(){
    //console.log(this.physics.velocity.x, this.x, this.physics.last.x);

    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    //this.updateMovement();

    
}


ChocBar.prototype.checkCollision = function(col) {
    var colPoint = new Kiwi.Geom.Point(col.x + col.width/2, col.y + col.height/2);
    if(this.collisionPoint.distanceTo(colPoint) < this.collisionDistance){
        //this.alpha = 0;
        this.pickedUp();
        // console.log("Hit me!", this.x, this.y);
        return true;
    }
    


};

ChocBar.prototype.pickedUp = function() {
    this.alpha = 0;
    this.eatChocSound.play();
    //console.log(this.state.chocBarManager);
    this.state.chocBarManager.chocBarCollected();
    //this.destroy();
};






