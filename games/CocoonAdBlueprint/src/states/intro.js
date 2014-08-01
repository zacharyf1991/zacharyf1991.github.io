var CocoonAdBlueprint = CocoonAdBlueprint || {};

CocoonAdBlueprint.Intro = new Kiwi.State('Intro');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/


CocoonAdBlueprint.Intro.create = function () {

	
	//game.input.touch.touchUp.add(this.mouseUp, this);
	this.background = new Kiwi.GameObjects.Sprite(this, this.textures.introBackground, 0 , 0);
	this.addChild(this.background);


    this.bannerAdContainer = new Kiwi.GameObjects.Sprite(this, this.textures.bannerAdContainer, 0, 0);
    this.addChild(this.bannerAdContainer);

    this.bigCloud = new Kiwi.GameObjects.Sprite(this, this.textures.bigCloud, 373, 158);
    this.addChild(this.bigCloud);

    this.bigCrane = new Kiwi.GameObjects.Sprite(this, this.textures.bigCrane, 856, 317);
    this.addChild(this.bigCrane);

    this.bigGear = new Kiwi.GameObjects.Sprite(this, this.textures.bigGear, -53, 502);
    this.addChild(this.bigGear);

    this.description = new Kiwi.GameObjects.Sprite(this, this.textures.description, 313, 454);
    this.addChild(this.description);

    this.download = new Kiwi.GameObjects.Sprite(this, this.textures.download, 615, 546);
    this.addChild(this.download);

    this.play = new Kiwi.GameObjects.Sprite(this, this.textures.play, 378, 295);
    this.addChild(this.play);

    this.smallCould1 = new Kiwi.GameObjects.Sprite(this, this.textures.smallCould1, -61, 324);
    this.addChild(this.smallCould1);

    this.smallCloud2 = new Kiwi.GameObjects.Sprite(this, this.textures.smallCloud2, 868, 207);
    this.addChild(this.smallCloud2);

    this.smallCould3 = new Kiwi.GameObjects.Sprite(this, this.textures.smallCould3, 1050, 149);
    this.addChild(this.smallCould3);

    this.smallGear = new Kiwi.GameObjects.Sprite(this, this.textures.smallGear, 133, 579);
    this.addChild(this.smallGear);

    this.title = new Kiwi.GameObjects.Sprite(this, this.textures.title, 373, 158);
    this.addChild(this.title);

    this.play.input.onUp.add(this.mouseUp, this);
    // this.download.input.onUp.add(this.downloadHit(), this);

    

	this.myAdConfig = {
	  isHidden: false,
	    position: CocoonJS.Ad.BannerLayout.BOTTOM_CENTER,
	    x : 0,
	    y : 00,
	    width : 0,
	    height : 0,
	    ctx:null,
	    fullScreenAdvertisement : null,
	    fullScreenAlreadyDownloaded: false,
	    params: {
	        banner : {
	            "status" : "onBannerShown"
	        },
	        fullscreen : {
	            "status" : "Showing ad"
	        }
	    }

	}

	this.createAdBanners();
	// CocoonJS.Ad.preloadBanner();
 //    CocoonJS.Ad.showBanner();
    // CocoonJS.Ad.refreshFullScreen();
    CocoonJS.Ad.preloadFullScreen();
    CocoonJS.Ad.showFullScreen();
	this.myAdConfig.params.banner.status = "Downloading banner...";
    
}

CocoonAdBlueprint.Intro.mouseUp = function(x, y, timeDown, timeUp, duration, pointer) {
    //console.log(this.mouse.x, this.mouse.y);
	game.input.onUp.remove(this.mouseUp, this);
    game.states.switchState("Play");

    

};

CocoonAdBlueprint.Intro.downloadHit = function(x, y, timeDown, timeUp, duration, pointer) {
    //console.log(this.mouse.x, this.mouse.y);
    var u        = "",
            text     = "",
            hashtags = "";

        var path = "http://kiwijs.org"
        window.open(path);
    

    

};




CocoonAdBlueprint.Intro.createAdBanners = function(){
  console.log("BANNER STUFF LOADED 1 ")
    CocoonJS.Ad.onBannerShown.addEventListener(function()
    {
        console.log("onBannerShown");
        CocoonAdBlueprint.Intro.myAdConfig.params.banner.status = "onBannerShown";
        CocoonAdBlueprint.Intro.myAdConfig.isBannerHidden = false;
    });

    CocoonJS.Ad.onBannerHidden.addEventListener(function()
    {
        console.log("onBannerHidden");
        CocoonAdBlueprint.Intro.myAdConfig.params.banner.status = "onBannerHidden";
        CocoonAdBlueprint.Intro.myAdConfig.isBannerHidden = true;
    });

    CocoonJS.Ad.onBannerReady.addEventListener(function(width,height)
    {
        console.log("onBannerReady " + width, height);
        CocoonAdBlueprint.Intro.layoutBanner();
    });

}

CocoonAdBlueprint.Intro.createFullscreenAds = function(){
         // Pregame Fullscreen
         CocoonJS.Ad.onFullScreenShown.addEventListener(function()
         {
            CocoonAdBlueprint.Intro.params.fullscreen.status = "onFullScreenShown";
            CocoonAdBlueprint.Intro.params.fullscreen.sub_status = "";
            console.log("onFullScreenShown");
        });
        CocoonJS.Ad.onFullScreenHidden.addEventListener(function()
         {
            console.log("onFullScreenHidden");
            CocoonAdBlueprint.Intro.params.fullscreen.status = "Full screen hidden,";
            CocoonAdBlueprint.Intro.params.fullscreen.sub_status = "press CACHE AD to download another ad.";
        });
        CocoonJS.Ad.onFullScreenReady.addEventListener(function()
         {
            CocoonAdBlueprint.Intro.fullScreenAlreadyDownloaded = true;
            CocoonAdBlueprint.Intro.params.fullscreen.status = "Full screen ready,";
            CocoonAdBlueprint.Intro.params.fullscreen.sub_status = "press SHOW FULL SCREEN to watch the ad.";
        });
     }

CocoonAdBlueprint.Intro.layoutBanner = function() {
        var rect = CocoonJS.Ad.getRectangle();
    var dpr = window.devicePixelRatio;
    if (this.myAdConfig.position == CocoonJS.Ad.BannerLayout.TOP_CENTER) {
        rect.x = 50;
        rect.y = 50;

    } else {
        rect.x = 50;
        rect.y = 50;
    }

    CocoonJS.Ad.setRectangle(rect);
    if (!this.myAdConfig.isBannerHidden)
        CocoonJS.Ad.showBanner();
}

