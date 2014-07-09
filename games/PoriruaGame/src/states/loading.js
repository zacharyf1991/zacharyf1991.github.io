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

var PoriruaGame = PoriruaGame || {};

PoriruaGame.Loading = new KiwiLoadingScreen('Loading', 'Intro', 'assets/img/loading/');

PoriruaGame.Loading.preload = function () {
    
    //Make sure to call the super at the top.
    //Otherwise the loading graphics will load last, and that defies the whole point in loading them. 
    KiwiLoadingScreen.prototype.preload.call(this);

    /**
    * Replace with your own in-assets to load.
    **/
    this.addImage('kiwiName', 'assets/img/kiwijs-name.png');
    this.addSpriteSheet('icons', 'assets/img/kiwijs-icons.png', 100, 90);

    this.addImage('startBackground', 'assets/img/start-screen-bg.jpg');
    this.addSpriteSheet('startButtons', 'assets/img/start-screen-buttons.png', 258, 91);
    this.addImage('howToPlay', 'assets/img/how-to-play.png');
    this.addSpriteSheet('okButton', 'assets/img/ok-button.png', 128, 49);

    this.addImage('heart', 'assets/img/hud/heart.png');
    this.addImage('heartGray', 'assets/img/hud/heartGray.png');
    this.addImage('zombieHead', 'assets/img/hud/zombie-head.png');
    this.addImage('santeBarCounter', 'assets/img/hud/sante-bar-counter.png');



    this.addImage('background', 'assets/img/porirua-map.jpg');
    this.addSpriteSheet('player', 'assets/img/player.png', 57, 79);
    this.addSpriteSheet('junctionPoint', 'assets/img/junction-point.png', 62, 63);


    this.addImage('gameOverBackground', 'assets/img/gameover/leaderboard-preview-1.png');


    ///////////////////////////////
    //Buildings

    this.addImage('roadblock1', 'assets/img/buildings/0000s_0000_roadblock-1.png');
    this.addImage('roadblock2', 'assets/img/buildings/_0000s_0001_roadblock-2.png');
    this.addImage('roadblock3', 'assets/img/buildings/_0000s_0002_roadblock-3.png');
    this.addImage('roadblock4', 'assets/img/buildings/_0000s_0003_roadblock-4.png');
    this.addImage('roadblock5', 'assets/img/buildings/_0000s_0004_roadblock-5.png');
    this.addImage('roadblock6', 'assets/img/buildings/_0000s_0005_roadblock-6.png');
    this.addImage('roadblock7', 'assets/img/buildings/_0000s_0006_roadblock-7.png');
    this.addImage('roadblock8', 'assets/img/buildings/_0000s_0007_roadblock-8.png');
    this.addImage('boatShed', 'assets/img/buildings/_0002s_0001_boat-sheds.png');
    this.addImage('houses1', 'assets/img/buildings/_0002s_0002_houses-1.png');
    this.addImage('arena', 'assets/img/buildings/_0002s_0003_arena.png');
    this.addImage('skate', 'assets/img/buildings/_0002s_0004_skate.png');
    this.addImage('pataka', 'assets/img/buildings/_0002s_0005_pataka.png');
    this.addImage('cbdShops', 'assets/img/buildings/_0002s_0006_cbd-shops.png');
    this.addImage('fitness', 'assets/img/buildings/_0002s_0007_fitness.png');
    this.addImage('tower', 'assets/img/buildings/_0002s_0008_tower.png');
    this.addImage('council', 'assets/img/buildings/_0002s_0009_council.png');
    this.addImage('rugby', 'assets/img/buildings/_0002s_0010_rugby.png');
    this.addImage('playground', 'assets/img/buildings/_0002s_0011_playground.png');
    this.addImage('lighthouse', 'assets/img/buildings/_0002s_0012_lighthouse.png');
    this.addImage('houses12', 'assets/img/buildings/_0002s_0013_houses-12.png');
    this.addImage('newWorld', 'assets/img/buildings/_0002s_0014_new-world.png');
    this.addImage('houses11', 'assets/img/buildings/_0002s_0015_houses-11.png');
    this.addImage('bottleCreek', 'assets/img/buildings/_0002s_0016_bottle-creek.png');
    this.addImage('plimmertonStation', 'assets/img/buildings/_0002s_0017_plimmerton-station.png');
    this.addImage('houses13', 'assets/img/buildings/_0002s_0018_houses-13.png');
    this.addImage('cruisingClub', 'assets/img/buildings/_0002s_0019_cruising-club.png');
    this.addImage('manaStation', 'assets/img/buildings/_0002s_0020_mana-station.png');
    this.addImage('houses10', 'assets/img/buildings/_0002s_0021_houses-10.png');
    this.addImage('policeCollege', 'assets/img/buildings/_0002s_0022_police-college.png');
    this.addImage('houses9', 'assets/img/buildings/_0002s_0023_houses-9.png');
    this.addImage('waitangaruaPark', 'assets/img/buildings/_0002s_0024_waitangarua-park.png');
    this.addImage('adrenalineForest', 'assets/img/buildings/_0002s_0025_adrenaline-forest.png');
    this.addImage('cannonCreek', 'assets/img/buildings/_0002s_0026_cannons-creek.png');
    this.addImage('houses8', 'assets/img/buildings/_0002s_0027_houses-8.png');
    this.addImage('houses5', 'assets/img/buildings/_0002s_0028_houses-5.png');
    this.addImage('houses6', 'assets/img/buildings/_0002s_0029_houses-6.png');
    this.addImage('houses4', 'assets/img/buildings/_0002s_0030_houses-4.png');
    this.addImage('houses7', 'assets/img/buildings/_0002s_0031_houses-7.png');
    this.addImage('poriruaStation', 'assets/img/buildings/_0002s_0032_porirua-station.png');
    this.addImage('esr', 'assets/img/buildings/_0002s_0033_esr.png');
    this.addImage('kenepuru', 'assets/img/buildings/_0002s_0034_kenepuru.png');
    this.addImage('teRito', 'assets/img/buildings/_0002s_0035_te-rito.png');
    this.addImage('teWanaga', 'assets/img/buildings/_0002s_0036_te-wananga.png');
    this.addImage('northCity', 'assets/img/buildings/_0002s_0037_north-city.png');
    this.addImage('police', 'assets/img/buildings/_0002s_0038_police.png');
    this.addImage('whittakers', 'assets/img/buildings/_0002s_0039_whittakers.png');
    this.addImage('mega', 'assets/img/buildings/_0002s_0040_mega.png');
    this.addImage('whitireia', 'assets/img/buildings/_0002s_0041_whitireia.png');
    this.addImage('marae', 'assets/img/buildings/_0002s_0042_marae.png');
    this.addImage('houses2', 'assets/img/buildings/_0002s_0043_houses-2.png');
    this.addImage('houses3', 'assets/img/buildings/_0002s_0044_houses-3.png');
    this.addImage('tiki', 'assets/img/buildings/_0002s_0045_tiki.png');
    this.addImage('golf', 'assets/img/buildings/_0002s_0046_golf.png');

    



};
