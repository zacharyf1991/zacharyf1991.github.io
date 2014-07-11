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

    this.addImage('chocBar', 'assets/img/items/sante-whittakers-chocolate-bar.png');

    this.addImage('heart', 'assets/img/hud/heart.png');
    this.addImage('heartGray', 'assets/img/hud/heartGray.png');
    this.addImage('zombieHead', 'assets/img/hud/zombie-head.png');
    this.addImage('santeBarCounter', 'assets/img/hud/sante-bar-counter.png');



    this.addImage('background', 'assets/img/porirua-map.jpg');
    this.addSpriteSheet('player', 'assets/img/player.png', 57, 79);
    this.addSpriteSheet('junctionPoint', 'assets/img/junction-point.png', 62, 63);


    this.addImage('gameOverBackground', 'assets/img/leaderboard/leaderboard-screen.png');


    ///////////////////////////////
    //Buildings

    this.addImage('roadblock1', 'assets/img/buildings/0000s0000roadblock-1.png');
    this.addImage('roadblock2', 'assets/img/buildings/0000s0001roadblock-2.png');
    this.addImage('roadblock3', 'assets/img/buildings/0000s0002roadblock-3.png');
    this.addImage('roadblock4', 'assets/img/buildings/0000s0003roadblock-4.png');
    this.addImage('roadblock5', 'assets/img/buildings/0000s0004roadblock-5.png');
    this.addImage('roadblock6', 'assets/img/buildings/0000s0005roadblock-6.png');
    this.addImage('roadblock7', 'assets/img/buildings/0000s0006roadblock-7.png');
    this.addImage('roadblock8', 'assets/img/buildings/0000s0007roadblock-8.png');
    this.addImage('boatShed', 'assets/img/buildings/0002s0001boat-sheds.png');
    this.addImage('houses1', 'assets/img/buildings/0002s0002houses-1.png');
    this.addImage('arena', 'assets/img/buildings/0002s0003arena.png');
    this.addImage('skate', 'assets/img/buildings/0002s0004skate.png');
    this.addImage('pataka', 'assets/img/buildings/0002s0005pataka.png');
    this.addImage('cbdShops', 'assets/img/buildings/0002s0006cbd-shops.png');
    this.addImage('fitness', 'assets/img/buildings/0002s0007fitness.png');
    this.addImage('tower', 'assets/img/buildings/0002s0008tower.png');
    this.addImage('council', 'assets/img/buildings/0002s0009council.png');
    this.addImage('rugby', 'assets/img/buildings/0002s0010rugby.png');
    this.addImage('playground', 'assets/img/buildings/0002s0011playground.png');
    this.addImage('lighthouse', 'assets/img/buildings/0002s0012lighthouse.png');
    this.addImage('houses12', 'assets/img/buildings/0002s0013houses-12.png');
    this.addImage('newWorld', 'assets/img/buildings/0002s0014new-world.png');
    this.addImage('houses11', 'assets/img/buildings/0002s0015houses-11.png');
    this.addImage('bottleCreek', 'assets/img/buildings/0002s0016bottle-creek.png');
    this.addImage('plimmertonStation', 'assets/img/buildings/0002s0017plimmerton-station.png');
    this.addImage('houses13', 'assets/img/buildings/0002s0018houses-13.png');
    this.addImage('cruisingClub', 'assets/img/buildings/0002s0019cruising-club.png');
    this.addImage('manaStation', 'assets/img/buildings/0002s0020mana-station.png');
    this.addImage('houses10', 'assets/img/buildings/0002s0021houses-10.png');
    this.addImage('policeCollege', 'assets/img/buildings/0002s0022police-college.png');
    this.addImage('houses9', 'assets/img/buildings/0002s0023houses-9.png');
    this.addImage('waitangaruaPark', 'assets/img/buildings/0002s0024waitangarua-park.png');
    this.addImage('adrenalineForest', 'assets/img/buildings/0002s0025adrenaline-forest.png');
    this.addImage('cannonCreek', 'assets/img/buildings/0002s0026cannons-creek.png');
    this.addImage('houses8', 'assets/img/buildings/0002s0027houses-8.png');
    this.addImage('houses5', 'assets/img/buildings/0002s0028houses-5.png');
    this.addImage('houses6', 'assets/img/buildings/0002s0029houses-6.png');
    this.addImage('houses4', 'assets/img/buildings/0002s0030houses-4.png');
    this.addImage('houses7', 'assets/img/buildings/0002s0031houses-7.png');
    this.addImage('poriruaStation', 'assets/img/buildings/0002s0032porirua-station.png');
    this.addImage('esr', 'assets/img/buildings/0002s0033esr.png');
    this.addImage('kenepuru', 'assets/img/buildings/0002s0034kenepuru.png');
    this.addImage('teRito', 'assets/img/buildings/0002s0035te-rito.png');
    this.addImage('teWanaga', 'assets/img/buildings/0002s0036te-wananga.png');
    this.addImage('northCity', 'assets/img/buildings/0002s0037north-city.png');
    this.addImage('police', 'assets/img/buildings/0002s0038police.png');
    this.addImage('whittakers', 'assets/img/buildings/0002s0039whittakers.png');
    this.addImage('mega', 'assets/img/buildings/0002s0040mega.png');
    this.addImage('whitireia', 'assets/img/buildings/0002s0041whitireia.png');
    this.addImage('marae', 'assets/img/buildings/0002s0042marae.png');
    this.addImage('houses2', 'assets/img/buildings/0002s0043houses-2.png');
    this.addImage('houses3', 'assets/img/buildings/0002s0044houses-3.png');
    this.addImage('tiki', 'assets/img/buildings/0002s0045tiki.png');
    this.addImage('golf', 'assets/img/buildings/0002s0046golf.png');

    this.addLeaderboardAssets();
};

PoriruaGame.Loading.addLeaderboardAssets = function () {
    this.addImage('overlay', 'assets/img/leaderboard/leaderboardfromstartmenu/black-overlay-70pc.png');


    this.addImage('leaderboardBackground', 'assets/img/leaderboard/leaderboardfromstartmenu/leaderboard-background.png');
    this.addImage('LeaderboardImage', 'assets/img/leaderboard/leaderboardfromstartmenu/leaderboard-title-image.png');


    /////////////////////
    //Login 
    this.addSpriteSheet('backLogin', 'assets/img/leaderboard/loginoverlay/back.png', 128, 49);
    this.addSpriteSheet('okLogin', 'assets/img/leaderboard/loginoverlay/ok.png', 128, 49);
    this.addSpriteSheet('createAccountLogin', 'assets/img/leaderboard/loginoverlay/create-account.png', 145, 16);
    this.addSpriteSheet('facebookLogin', 'assets/img/leaderboard/loginoverlay/facebook.png', 35, 36);
    this.addImage('overlayLogin', 'assets/img/leaderboard/loginoverlay/login-overlay.png');


    //////////////////////////
    ///Sign Up
    this.addSpriteSheet('backSignUp', 'assets/img/leaderboard/signupoverlay/back.png', 128, 49);
    this.addSpriteSheet('confirmSignUp', 'assets/img/leaderboard/signupoverlay/confirm.png', 128, 49);
    this.addSpriteSheet('termsOfUseSignUp', 'assets/img/leaderboard/signupoverlay/terms-of-use.png', 110, 16);
    this.addSpriteSheet('facebookSignUp', 'assets/img/leaderboard/signupoverlay/facebook.png', 35, 36);
    this.addImage('overlaySignUp', 'assets/img/leaderboard/signupoverlay/sign-up-overlay.png');

    ////////////////////
    //GAME OVER
    this.addSpriteSheet('againGameOver', 'assets/img/leaderboard/again.png', 260, 93);
    this.addSpriteSheet('submitGameOver', 'assets/img/leaderboard/submit.png', 102, 52);
    this.addSpriteSheet('gPlusGameOver', 'assets/img/leaderboard/gplus.png', 41, 44);
    this.addSpriteSheet('facebookGameOver', 'assets/img/leaderboard/facebook.png', 41, 44);
    this.addSpriteSheet('twitterGameOver', 'assets/img/leaderboard/facebook.png', 41, 44);

    this.addImage('winGameOver', 'assets/img/leaderboard/win.png');
    this.addImage('loseGameOver', 'assets/img/leaderboard/lose.png');
    this.addImage('leaderboardBackgroundGameOver', 'assets/img/leaderboard/leaderboard-screen.png');
    this.addImage('scrollerGameOver', 'assets/img/leaderboard/scroller.png');
    





}