/**
* The Loading State is going to be used to load in all of the in-game assets that we need in game.
*
* Because in this blueprint there is only a single "hidden object" section we are going to load in all of 
* the asset's at this point.
*
* If you have multiple states however, I would recommend have loading the other graphics as they are required by their states, 
* Otherwise the loading times maybe a bit long and it is not the most optimal solution.
*
*/

/**
* Since we want to use the custom Kiwi.JS loader with the bobing kiwi/html5 logo and everything. We need to extend the KiwiLoadingScreen State.  
* The KiwiLoadingScreen State is an extentsion of a normal State but it has some custom code to handle the loading/bobbing/fading of all the items, so if you override a method (like the preload) for example just make sure you call the super method.
* 
* The parameters we are passing into this method are as ordered.
* 1 - name {String} Name of this state.
* 2 - stateToSwitch {String} Name of the state to switch to AFTER all the assets have loaded. Note: The state you want to switch to should already have been added to the game.
* 3 - dimensions {Object} A Object containing the width/height that the game is to be. For example {width: 1024, height: 768}
* 4 - subfolder {String} The folder that the loading graphics are located at. 
*/

var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.Loading = new KiwiLoadingScreen('Loading', 'Intro', 'assets/img/loading/');

PlatformBlueprint.Loading.preload = function () {
    
    //Make sure to call the super at the top.
    //Otherwise the loading graphics will load last, and that defies the whole point in loading them. 
    KiwiLoadingScreen.prototype.preload.call(this);

    this.addImage('background1', 'assets/img/environment/background.jpg');
    ////////////////////////
    //PLAYER
    this.addSpriteSheet('egonSprite', 'assets/img/sprites/egon-sprite.png', 100, 100);
    this.addImage('UI', 'assets/img/UI/UI.png');
    this.addImage('cashUI', 'assets/img/UI/cashUI.png');

    ///////////////////////////
    //PROTON BEAM
    this.addSpriteSheet('beam', 'assets/img/beam/beam.png', 24 , 24);
    this.addSpriteSheet('beamSpark', 'assets/img/beam/beamSpark.png', 48, 48);
    this.addSpriteSheet('impact', 'assets/img/beam/impact.png', 68, 68);

    //////////////////////
    //ENEMIES

    this.addSpriteSheet('ghost', 'assets/img/enemies/ghost2.png', 160, 160);
    this.addSpriteSheet('boss', 'assets/img/enemies/boss.png', 300, 200);
    this.addSpriteSheet('books', 'assets/img/enemies/books.png', 200, 200);
    this.addSpriteSheet('shield', 'assets/img/enemies/shield.png', 300, 220);

    /////////////////////
    //MINIGAME 
    this.addSpriteSheet('blueCircle', 'assets/img/minigame/blue3.png', 70, 70);
    this.addImage('redCircle', 'assets/img/minigame/redCircle.png');
    this.addImage('skull', 'assets/img/minigame/skull70.png');
    this.addSpriteSheet('confirm', 'assets/img/minigame/confirm.png', 66, 14);

    //////////////////////
    //ITEMS
    this.addSpriteSheet('cash', 'assets/img/items/cash.png', 160, 160);
    this.addSpriteSheet('gem', 'assets/img/items/diamond.png', 32, 32);
    this.addSpriteSheet('bookPile', 'assets/img/items/bookPiles.png', 248, 72);





    ////////////////////////////
    //BUTTONS
    this.addSpriteSheet('shareButton', 'assets/img/buttons/Share.png', 250, 70);

    ////////////////////////////
    //MENU
    this.addSpriteSheet('menu', 'assets/img/menu/MenuAnimation.png', 960, 540);
    this.addImage('startText', 'assets/img/menu/PressStart1.png');



    ////////////////////////
    //TEXTURE ATLASES
    //this.addTextureAtlas('environmentTiles', 'assets/img/tiles.png', 'environmentJSON', 'src/json/environment.json');
    


    //optional on screen controller assets
    this.addSpriteSheet('leftButton', 'assets/img/controller/leftButton.png', 51, 73);
    this.addSpriteSheet('rightButton', 'assets/img/controller/rightButton.png', 51, 73);
    this.addSpriteSheet('upButton', 'assets/img/controller/upButton.png', 73, 51);
    this.addSpriteSheet('downButton', 'assets/img/controller/downButton.png', 73, 51);

    this.addSpriteSheet('tiles', 'assets/img/tiles2.png', 32, 32);

    //Test
    //this.addJSON('tilemap', 'assets/map/map.json');
    this.addJSON('tilemap', 'assets/map/BossLevel.json');

};
