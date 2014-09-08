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
var LoadingState = new KiwiLoadingScreen('LoadingState', 'IntroState', 'assets/img/loading/');

LoadingState.preload = function () {
    
    //Make sure to call the super at the top.
    //Otherwise the loading graphics will load last, and that defies the whole point in loading them. 
    KiwiLoadingScreen.prototype.preload.call(this);

    // this.addSpriteSheet('spriteSheet', 'assets/img/spriteSheet.png', 100, 70);
    // this.addImage('image', 'assets/img/image.png');
    game.stage.color = "00000";
    this.addImage('webGLError', 'assets/img/no-webgl-message.png');
    this.addImage('marker', 'assets/img/marker.png')
    this.addSpriteSheet('particle', 'assets/img/particle_01.png', 128, 128);
    this.addSpriteSheet('star', 'assets/img/star.png', 128, 128);

    this.addTextureAtlas('tiles', 'assets/AtlasSheet2.png', 'tileJSON', 'assets/textureAtlas.json');
    this.addSpriteSheet('FlameSprite', 'assets/img/FlameSprite.png', 300, 300);
    this.addSpriteSheet('particlePack2SpriteSheet', 'assets/particlepack2_128.png', 128, 128, true, 8, 5, 5, 27, 27, 54, 54);
    this.addSpriteSheet('particlePack2SpriteSheet_16', 'assets/particlepack2_16.png', 16, 16, true, 8, 5, 5, 4, 4, 8, 8);

    game.stage.resize(766, 450);
};