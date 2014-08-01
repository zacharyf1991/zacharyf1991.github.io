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

var CocoonAdBlueprint = CocoonAdBlueprint || {};

CocoonAdBlueprint.Loading = new KiwiLoadingScreen('Loading', 'Intro', 'assets/img/loading/');

CocoonAdBlueprint.Loading.preload = function () {
    
    //Make sure to call the super at the top.
    //Otherwise the loading graphics will load last, and that defies the whole point in loading them. 
    KiwiLoadingScreen.prototype.preload.call(this);

    /**
    * Replace with your own in-assets to load.
    **/
    this.addImage('kiwiName', 'assets/img/kiwijs-name.png');
    this.addSpriteSheet('icons', 'assets/img/kiwijs-icons.png', 100, 90);

    this.characterSprites();
    this.environmentAssets();
    this.platformAssets();
    this.objectAssets();
    this.introAssets();
    this.animatedFeatures();

};


CocoonAdBlueprint.Loading.characterSprites = function(){
	this.addSpriteSheet('player', 'assets/img/characterSprites/player.png', 150, 120);
    this.addSpriteSheet('player75', 'assets/img/characterSprites/player75.png', 111, 87);
    this.addSpriteSheet('player50', 'assets/img/characterSprites/player50.png', 74, 58);
    this.addSpriteSheet('player25', 'assets/img/characterSprites/player25.png', 37, 29);

}

CocoonAdBlueprint.Loading.environmentAssets = function(){
	this.addImage('background', 'assets/img/environment/background.jpg');
    this.addImage('introBackground', 'assets/img/environment/background.jpg');
	// this.addImage('rock', 'assets/img/environment/rock-tile.png');
	// this.addImage('tree', 'assets/img/environment/tree.png');

}

CocoonAdBlueprint.Loading.platformAssets = function(){
    this.addSpriteSheet('platformLarge', 'assets/img/platforms/long-platforms.png', 532, 96);
    this.addSpriteSheet('platformMedium', 'assets/img/platforms/medium-platforms.png', 308, 96);
    this.addSpriteSheet('platformSmall', 'assets/img/platforms/short-platforms.png', 145, 96);
}

CocoonAdBlueprint.Loading.objectAssets = function(){
    this.addSpriteSheet('crate', 'assets/img/objects/crate-spritesheet.png', 153 , 73);
    this.addSpriteSheet('kiwi', 'assets/img/objects/kiwi-spritesheet.png', 89, 87);
}

CocoonAdBlueprint.Loading.introAssets = function(){
    // this.addSpriteSheet('crate', 'assets/img/objects/crate-spritesheet.png', 153 , 73);
    // this.addSpriteSheet('kiwi', 'assets/img/objects/kiwi-spritesheet.png', 89, 87);

    this.addImage('bannerAdContainer', 'assets/img/scenes/startScreen/banner-ad-container.png');
    this.addImage('bigCloud', 'assets/img/scenes/startScreen/big-cloud.png');
    this.addImage('bigCrane', 'assets/img/scenes/startScreen/big-crane.png');
    this.addImage('bigGear', 'assets/img/scenes/startScreen/big-gear.png');
    this.addImage('description', 'assets/img/scenes/startScreen/description.png');
    this.addImage('download', 'assets/img/scenes/startScreen/download.png');
    this.addImage('play', 'assets/img/scenes/startScreen/play.png');
    this.addImage('playHoverClick', 'assets/img/scenes/startScreen/play-hover-click.png');
    this.addImage('smallCould1', 'assets/img/scenes/startScreen/small-cloud-1.png');
    this.addImage('smallCloud2', 'assets/img/scenes/startScreen/small-cloud-2.png');
    this.addImage('smallCould3', 'assets/img/scenes/startScreen/small-cloud-3.png');
    this.addImage('smallGear', 'assets/img/scenes/startScreen/small-gear.png');
    this.addImage('title', 'assets/img/scenes/startScreen/title.png');



}


CocoonAdBlueprint.Loading.animatedFeatures = function(){
    this.addSpriteSheet('buildingAni', 'assets/img/animatedFeatures/buildings-spritesheet.png', 232 , 598);
    this.addSpriteSheet('cloudAni', 'assets/img/animatedFeatures/cloud-spritesheet.png', 340 , 200);
    this.addSpriteSheet('craneAni', 'assets/img/animatedFeatures/crane-spritesheet.png', 267 , 728);
    this.addSpriteSheet('gearAni', 'assets/img/animatedFeatures/gear-spritesheet.png', 235 , 233);
}

