CollisionManager = function(state){
    this.state = state;



}



/**
* This method checks to see if a player is on a leftSlope.
*
* Please note, "leftSlope" is refering to a slope that when the player is standing on the tile, facing away from the tile, the player is facing left.
* Also note, this function checks for the outward edges of the sloping tile and calculates those points too for a more polished slope interaction
*
* @method checkLeftSlope
* @public
*/

CollisionManager.prototype.update = function(){
    var onGround = false;

    //if the player is not on a slope, check for regular tile collision
    if (!this.state.sloping) {
        //overlap ground
        this.state.levelManager.groundLayer.physics.overlapsTiles(this.state.player, true);
        //Are we on the ground?
        if (this.state.player.physics.isTouching(Kiwi.Components.ArcadePhysics.DOWN)) {
            this.jumps = 0;
            if(this.state.player.jumping){
                this.state.player.roll();
            }
            onGround = true;
        }
    } else {
        //on ground anyway, so reset jumps
        if (this.state.player.physics.velocity.y >= 0) {
            this.state.jumps = 0;
            if(this.state.player.jumping){
                this.state.player.roll();
            }
            onGround = true;
        }
    }
    
    //set animation
    if (onGround) {
        if (this.state.player.physics.velocity.x == 0) {
            //this.animatePlayer('idle');
        } else {
           // this.animatePlayer('walking');
        }
    }



}
CollisionManager.prototype.checkLeftSlope = function () {
    var tx = Math.floor(this.state.px / this.state.tileWidth);
    var ty = Math.floor(this.state.py / this.state.tileHeight);

    //basic slope tile collision, entering a slope from the top
    var slope = this.state.levelManager.slopeLeftLayer.getTileFromXY(tx, ty);
    if (slope != null) {
        //if a tile exists, check collision
        if (slope.index != 0) {
            //get the slope postion
            var slopeX = tx * this.state.tileWidth;
            var slopeY = ty * this.state.tileHeight;
            this.state.sloping = true;

            //get the difference of player position ad slope 0,0 co-ordinates
            var diffX = this.state.px - slopeX;
            var diffY = this.state.py - slopeY;

            //if you're within the solid part of a sloping tile
            //OR if youve just entered a tile from the right, snap down into the tile
            if ((diffY >= this.state.tileHeight - diffX)
            || (this.state.px - (this.state.player.physics.velocity.x / 10) >= slopeX + this.tileWidth)) {
                var destY = slopeY + this.state.tileHeight - diffX;

                this.state.player.y = Math.ceil(destY - this.state.player.height);
                //this.player.physics.velocity.y = 40;

                //already sloping, so no need for further checking
                return;
            }
        }
    }

    //check when entering onto a sloping tile, and also when between two, or when you'ce fallen "into" the tile
    var aboveSlope = this.state.levelManager.slopeLeftLayer.getTileFromXY(tx, ty-1);
    if (aboveSlope != null) {
        //if a tile exists, check collision
        if (aboveSlope.index != 0) {
            var aboveSlopeX = tx * this.state.tileWidth;
            var aboveSlopeY = (ty-1) * this.state.tileHeight;

            //flag to ignore remaining map collision in the update loop
            this.state.sloping = true;

            var diffX = this.state.px - aboveSlopeX;
            var destY = (aboveSlopeY + this.state.tileHeight) - diffX;

            this.state.player.y = destY - this.state.player.height;
            //this.player.physics.velocity.y = 40;
        }
    }
}

/**
* This method checks to see if a player is on a rightSlope.
*
* Please note, "rightSlope" is refering to a slope that when the player is standing on the tile, facing away from the tile, the player is facing right.
* Also note this function checks for the outward edges of the sloping tile and calculates those points too for a more polished slope interaction
*
* @method checkRightSlope
* @public
*/
CollisionManager.prototype.checkRightSlope = function () {
    if (this.sloping) {
        //console.log('Already sloping on left slope')
        return;
    }
    //get the bottom centre point ofthe character to calculate position from
    //tile based location
    var tx = Math.floor(this.state.px / this.state.tileWidth);
    var ty = Math.floor(this.state.py / this.state.tileHeight);

    var slope = this.state.levelManager.slopeRightLayer.getTileFromXY(tx, ty);
    if (slope != null) {
        //if a tile exists, check collision
        if (slope.index != 0) {
            //get the slope postion
            var slopeX = tx * this.state.tileWidth;
            var slopeY = ty * this.state.tileHeight;

            //flag to ignore remaining map collision in the update loop
            this.state.sloping = true;

            //get the difference of player position ad slope 0,0 co-ordinates
            var diffX = this.state.px - slopeX;
            var diffY = this.state.py - slopeY;

            //if you're within the solid part of a sloping tile
            //OR if youve just entered a tile from the left, snap down into the tile
            if ((diffY >= diffX)
            || (this.state.px - (this.state.player.physics.velocity.x / 10) <= slopeX)) {
                this.state.player.y = Math.ceil(slopeY + diffX - this.state.player.height);
                //this.player.physics.velocity.y = 40;

                //already sloping, so no need for further checking
                return;
            }
        }
    }

    //check when entering onto a sloping tile, or when you've fallen "into" the tile
    var aboveSlope = this.state.levelManager.slopeRightLayer.getTileFromXY(tx, ty - 1);
    if (aboveSlope != null) {
        //if a tile exists, check collision
        if (aboveSlope.index != 0) {
            //flag to ignore remaining map collision in the update loop
            this.state.sloping = true;

            var aboveSlopeX = tx * this.state.tileWidth;
            var aboveSlopeY = (ty - 1) * this.state.tileHeight;
            var diffX = this.state.px - aboveSlopeX;

            this.state.player.y = Math.ceil(aboveSlopeY + diffX - this.state.player.height);
            //this.player.physics.velocity.y = 40;
        }
    }
}
