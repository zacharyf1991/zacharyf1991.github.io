var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.Play = new Kiwi.State('Play');


/**
* The Play in the core state that is used in the game. 
*
* It is the state where the majority of the functionality occurs 'in-game'.
* 
*
* @class Play
* @extends State
* @constructor
*/

/**
* This create method is executed when Kiwi Game reaches the boot stage of the game loop.
* @method create
* @public
*/
PlatformBlueprint.Play.create = function () {
    //camera to follow movement of player
    this.camera = this.game.cameras.defaultCamera;
    //game.stage.resize(800, 600);

    this.game.input.keyboard.onKeyDown.removeAll();
    this.game.input.keyboard.onKeyDownOnce.removeAll();
    this.game.input.keyboard.onKeyUp.removeAll();
    

    //game.stage.createDebugCanvas();

    
    this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.background1, 0, -57);
    this.addChild(this.background);
    this.background.scaleX = 1;
    this.background.scaleY = 1;
    this.width = this.game.stage.width;

    //Switch the background colour back to white from purple
    this.game.stage.color = 'ffffff';

    //this.generateTileMap();

    this.gameManager = new GameManager(this);
    this.inputManager = new InputManager(this);

    
    //////////////////////////
    //enemy manager


    this.levelManager = new LevelManager(this);
    this.levelManager.generateTileMap();

    this.enemyManager = new EnemyManager(this);
    this.addChild(this.enemyManager);

    this.itemManager = new ItemManager(this);
    this.addChild(this.itemManager);

    
    this.hudManager = new HUDManager(this);

    this.collisionManager = new CollisionManager(this);
    this.cameraManager = new CameraManager(this);

    this.bookPileL = new Kiwi.GameObjects.Sprite( this, this.textures.bookPile, 1100, 475 );
    this.bookPileL.animation.add( 'left', [0], 1, false, true );
    this.bookPileL.scaleX = -1;

    this.bookPileR = new Kiwi.GameObjects.Sprite( this, this.textures.bookPile, 2150, 480 );
    this.bookPileR.animation.add( 'right', [1], 1, false, true );
    this.bookPileR.scaleX = -1;

    this.addChild( this.bookPileR );
    this.addChild( this.bookPileL );


    this.playersLegs = new PlayersLegs( this, 0, 0 );
    this.addChild( this.playersLegs );
    this.player = new PlayerManager(this, 100, 444);
    this.addChild(this.player);
    this.weaponManager = new WeaponManager(this);

    

    // this.boss = new Boss( this, 1625, 200 );
    // this.addChild(this.boss);

    // this.swapChildren( this.boss, this.boss.shield );

    this.miniGameManager = new MiniGame( this );
    this.addChild( this.miniGameManager );



    //////////////////////
    //Swap Children
    //this.swapChildren(this.weaponManager.sparkGroup, this.player);
    //this.swapChildren(this.enemyManager.deathGroup, this.weaponManager.myMiniGame.ring);

    //individual tile dimensions
    this.tileWidth = 32;
    this.tileHeight = 32;

    //////////////////
    //ITEMS
    this.cashGroup = new Kiwi.Group(this);
    this.addChild(this.cashGroup);


    

    //this.enemyManager.addEnemies(1);

    //Add to the screen.
    this.sloping = true;


    this.px = this.player.x + this.player.box.bounds.width / 2;
    this.py = this.player.y + this.player.height;

    this.levelManager.generateForegroundTileMap();
    console.log('CREATE GAME');

    /////////////////
    //Add level assets
    this.levelManager.gemsLevelOne();
    this.levelManager.ghostsLevelOne();


}

/**
* This method is the main update loop. Move scrolling items and update player here
* @method update
* @public
*/
PlatformBlueprint.Play.update = function () {
    this.cameraManager.update();
    this.gameManager.update();
    this.hudManager.update();
    this.weaponManager.update();
    this.enemyManager.update();

    this.player.update();
    this.player.physics.update();

    this.updateCash();
    
    Kiwi.State.prototype.update.call(this);

    

    //check sloping collisions
    this.sloping = false;

    
    //bottom middle point of player to check against sloping tiles
    this.px = Math.round(this.player.x + this.player.box.bounds.width / 2);
    this.py = this.player.y + this.player.height;

    //check sloping tiles
    this.collisionManager.checkLeftSlope();
    this.collisionManager.checkRightSlope();
    
    this.collisionManager.update();
    
    
   // this.updateController();
}


PlatformBlueprint.Play.updateCash = function(){
    for (var i = this.cashGroup.members.length - 1; i>= 0; i--) {
        //console.log("test");
        this.cashGroup.members[i].physics.update();
    };
}

PlatformBlueprint.Play.createBoss = function(){
    this.boss = new Boss( this, 1625, 200 );
    this.addChild(this.boss);

    this.swapChildren( this.boss, this.boss.shield );
    this.swapChildren( this.boss, this.miniGameManager )
}

