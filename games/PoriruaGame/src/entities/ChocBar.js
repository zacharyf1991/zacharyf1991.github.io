//ChocBar
var ChocBar = function (state, x, y){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.chocBar, x, y);
    this.state = state;
    this.collisionDistance = 40;

    this.x -= this.width/2;
    this.y -= this.width/2;
    this.collisionPoint = new Kiwi.Geom.Point(this.x + this.width/2, this.y +this.height/2);

    this.eatChocSound = new Kiwi.Sound.Audio(this.game, 'eatChoc', 0.3, false);
    
}
Kiwi.extend(ChocBar, Kiwi.GameObjects.Sprite);

ChocBar.prototype.checkCollision = function(col) {
    var colPoint = new Kiwi.Geom.Point(col.x + col.width/2, col.y + col.height/2);
    if(this.collisionPoint.distanceTo(colPoint) < this.collisionDistance){
        this.pickedUp();
        return true;
    }

};

ChocBar.prototype.pickedUp = function() {
    this.alpha = 0;
    this.eatChocSound.play();
    this.state.chocBarManager.chocBarCollected();
};






