var CocoonAdBlueprint = CocoonAdBlueprint || {};

CocoonAdBlueprint.Play = new Kiwi.State('Play');


CocoonAdBlueprint.Play.create = function () {
  this.playerInitialX = 100;
  this.playerInitialY = 250;


  this.player = new PlayerManager(this,  this.playerInitialX, this.playerInitialY);
  this.environmentManager = new EnvironmentManager(this);
  this.player.alpha = 1;
  this.addChild(this.player);

  this.inputManager = new InputManager(this);



  this.cameraManager = new CameraManager(this);

  this.platformManager = new PlatformManager(this);
  this.addChild(this.platformManager);


  this.hudManager = new HUDManager(this);



	this.name = new Kiwi.GameObjects.StaticImage(this, this.textures.kiwiName, 10, 10);
  this.addChild(this.name);

  this.objectManager = new ObjectManager(this);

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
                "status" : null
            }
        }

    }

    this.createAdBanners();
    CocoonJS.Ad.preloadBanner();
    CocoonJS.Ad.showBanner();
    this.myAdConfig.params.banner.status = "Downloading banner...";

  
  
}

CocoonAdBlueprint.Play.update = function() {
  Kiwi.State.prototype.update.call(this);
  this.cameraManager.update();
  this.environmentManager.update();
  this.hudManager.update();
  this.objectManager.update();

};


CocoonAdBlueprint.Play.createAdBanners = function(){
  console.log("BANNER STUFF LOADED 1 ")
    CocoonJS.Ad.onBannerShown.addEventListener(function()
    {
        console.log("onBannerShown");
        CocoonAdBlueprint.Play.myAdConfig.params.banner.status = "onBannerShown";
        CocoonAdBlueprint.Play.myAdConfig.isBannerHidden = false;
    });

    CocoonJS.Ad.onBannerHidden.addEventListener(function()
    {
        console.log("onBannerHidden");
        CocoonAdBlueprint.Play.myAdConfig.params.banner.status = "onBannerHidden";
        CocoonAdBlueprint.Play.myAdConfig.isBannerHidden = true;
    });

    CocoonJS.Ad.onBannerReady.addEventListener(function(width,height)
    {
        console.log("onBannerReady " + width, height);
        CocoonAdBlueprint.Play.layoutBanner();
    });

}

CocoonAdBlueprint.Play.layoutBanner = function() {
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




