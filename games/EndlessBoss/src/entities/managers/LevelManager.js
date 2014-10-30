LevelManager = function (state){
	this.state = state



}


/**
* The generateTileMap method outputs and organizes tile map data in individual layers
* @method generateTileMap
* @public
*/
LevelManager.prototype.generateTileMap = function () {
    //Tile map
    this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this.state, 'tilemap', this.state.textures.tiles);



    //background
    this.backgroundLayer = this.tilemap.getLayerByName('Background');
    this.backgroundLayer.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;

    this.state.addChild(this.backgroundLayer);


    //ground
    this.groundLayer = this.tilemap.getLayerByName('Ground');
    this.groundLayer.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    this.state.addChild(this.groundLayer);

    this.objectLayer = this.tilemap.getLayerByName('Objects');
    this.objectLayer.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    this.state.addChild(this.objectLayer);

    this.slopeLeftLayer = this.tilemap.getLayerByName('SlopeLeft');
    this.slopeLeftLayer.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    this.state.addChild(this.slopeLeftLayer);

    this.slopeRightLayer = this.tilemap.getLayerByName('SlopeRight');
    this.slopeRightLayer.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    this.state.addChild(this.slopeRightLayer);

    //allow all tile layers to interact/not interact
    for (var i = 1; i < this.tilemap.tileTypes.length; i++) {
        this.tilemap.tileTypes[i].allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    }
}

/**
* The generateForegroundTileMap method generates tile map data in front of the player
* @method generateForegroundTileMap
* @public
*/
LevelManager.prototype.generateForegroundTileMap = function () {
    //foreground assets
    this.foregroundRightLayer = this.tilemap.getLayerByName('Foreground');
    this.state.addChild(this.foregroundRightLayer);

    /////////////////////
    //Test
    this.slopeRightForegroundLayer = this.tilemap.getLayerByName('SlopeRight');
    this.state.addChild(this.slopeRightForegroundLayer);
    this.slopeLeftForegroundLayer = this.tilemap.getLayerByName('SlopeLeft');
    this.state.addChild(this.slopeLeftForegroundLayer);
}

LevelManager.prototype.gemsLevelOne = function() {
    // this.state.itemManager.addItem('gem', 409, 569);
    // this.state.itemManager.addItem('gem', 672, 571);
    // this.state.itemManager.addItem('gem', 1160, 478);
    // this.state.itemManager.addItem('gem', 1529, 330);
    // this.state.itemManager.addItem('gem', 1708, 332);
    // this.state.itemManager.addItem('gem', 1727, 157);
    // this.state.itemManager.addItem('gem', 1507, 168);
    // this.state.itemManager.addItem('gem', 1325, 208);
    // this.state.itemManager.addItem('gem', 1259, 273);
    // this.state.itemManager.addItem('gem', 1230, 347);
};

LevelManager.prototype.ghostsLevelOne = function() {
    this.state.enemyManager.addEnemy('ghost', 992, 479);
    this.state.enemyManager.addEnemy('ghost', 1610, 320);
};

LevelManager.prototype.gameOver = function() {
    this.state.hudManager.endState();

    if(this.state.survivalGame){
        this.state.survivalGame.spawnTimer.stop();
    }
    var params = this.state.gameManager.gameOver();
    if( this.boss != undefined ) {
        this.state.boss.endState();
        
    }
    game.states.switchState("GameOver", null, null, params);
};

LevelManager.prototype.switchStates = function(){

        this.state.hudManager.endState();
        this.state.inputManager.switchStates();
    

        game.states.switchState("Intro");
}