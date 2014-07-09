HUDManager = function(state){
	this.state = state;

	/////////////////////////////
    //HUD
    this.playersHealth = new Kiwi.HUD.Widget.IconBar(game, this.state.textures.heart, 3, 3, 20, 10);
    this.playersGrayHealth = new Kiwi.HUD.Widget.IconBar(game, this.state.textures.heartGray, 3, 3, 20, 10);
   



    ////////////////////////////
    //TIME

    this.hudTime = new Kiwi.HUD.Widget.TextField(this.state.game, '3:10', 450, 5);
    
    this.hudTime.style.fontFamily = 'myFirstFont';
    this.hudTime.style.color = '#ffffff';
    this.hudTime.style.textShadow ="1.5px 1.5px  #000, -1.5px 1.5px  #000, 1.5px -1.5px  #000, -1.5px -1.5px  #000";
    this.hudTime.style.fontSize ="32px";
    this.hudTime.style.letterSpacing ="1px";
    // this.hudTime.style.fontWeight="bold"

    ////////////////////////////
    //ZOMBIE COUNT

    this.hudZombieCount = new Kiwi.HUD.Widget.TextField(this.state.game, '5', 665, 5);
    
    this.hudZombieCount.style.fontFamily = 'myFirstFont';
    this.hudZombieCount.style.color = '#ffffff';
    this.hudZombieCount.style.textShadow ="1.5px 1.5px  #000, -1.5px 1.5px  #000, 1.5px -1.5px  #000, -1.5px -1.5px  #000";
    this.hudZombieCount.style.fontSize ="32px";
    this.hudZombieCount.style.letterSpacing ="1px";
    // this.hudZombieCount.style.fontWeight="bold"

    ////////////////////////////
    //Choco COUNT

    this.hudChocCount = new Kiwi.HUD.Widget.TextField(this.state.game, '15', 275, 5);
    
    this.hudChocCount.style.fontFamily = 'myFirstFont';
    this.hudChocCount.style.color = '#FC0';
    this.hudChocCount.style.textShadow="1.5px 1.5px  #000, -1.5px 1.5px  #000, 1.5px -1.5px  #000, -1.5px -1.5px  #000";
    this.hudChocCount.style.fontSize ="32px";
    this.hudChocCount.style.letterSpacing ="1px";
    // this.hudChocCount.style.fontWeight="bold"





    ////////////////////////////////
    //Bar
    this.barIcon = new Kiwi.HUD.Widget.Icon(this.state.game, this.state.textures.santeBarCounter, 200, 13);


    ////////////////////////////////
    //Zombie
    this.zombieIcon = new Kiwi.HUD.Widget.Icon(this.state.game, this.state.textures.zombieHead, 600, 5);


    this.state.game.huds.defaultHUD.addWidget(this.barIcon);
    this.state.game.huds.defaultHUD.addWidget(this.zombieIcon);

    this.state.game.huds.defaultHUD.addWidget(this.playersGrayHealth);
    this.state.game.huds.defaultHUD.addWidget(this.playersHealth);

    this.state.game.huds.defaultHUD.addWidget(this.hudTime);
    this.state.game.huds.defaultHUD.addWidget(this.hudZombieCount);
    this.state.game.huds.defaultHUD.addWidget(this.hudChocCount);


}


HUDManager.prototype.update = function(){

	// this.energy = this.state.gameManager.playersEnergy;

 //    this.health = this.state.gameManager.playersHealth;
 //    this.score  = this.state.gameManager.score;

	// this.playersEnergy.counter.current = this.energy;
 //    this.playersHealth.counter.current = this.health;

 //    this.hudScore.text = "$"+this.score;


}
HUDManager.prototype.endState = function() {
    this.state.game.huds.defaultHUD.removeAllWidgets();
};

