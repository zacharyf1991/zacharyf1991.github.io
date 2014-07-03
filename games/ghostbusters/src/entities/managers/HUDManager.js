HUDManager = function(state){
	this.state = state;

	/////////////////////////////
    //HUD
    this.playersHealth = new Kiwi.HUD.Widget.Bar(this.state.game, 6, 10, 130, 13, 80, 9);
    
    this.playersHealth.style.backgroundColor = "#transparent";
    this.playersHealth.style.boxShadow="2px 2px 2px 0px #000000, 0px 0px 2px 2px #FF0000 inset ";

    this.playersHealth.bar.style.backgroundColor = "#FF0000";
    this.playersHealth.bar.style.boxShadow=" 2px 2px 2px 0px #777777 inset";

    this.playersEnergy = new Kiwi.HUD.Widget.Bar(this.state.game, 100, 100, 130, 27, 80, 9);
    ////////
    //BACK BAR
    this.playersEnergy.style.backgroundColor = "#transparent";
    this.playersEnergy.style.boxShadow="2px 2px 2px 0px #000000, 0px 0px 2px 2px #3c8fdc inset";
    
    ////////////////
    //FRONT BAR
    this.playersEnergy.bar.style.backgroundColor = "#3c8fdc";
    this.playersEnergy.bar.style.boxShadow="2px 2px 2px 0px #999999 inset";



    ////////////////////////////
    //SCORE

    this.hudScore = new Kiwi.HUD.Widget.TextField(this.state.game, '$6500', 150, 42);
    
    this.hudScore.style.fontFamily = 'myFirstFont';
    this.hudScore.style.color = '#FFB674';
    this.hudScore.style.textShadow ="2px 2px #000000";
    this.hudScore.style.fontSize ="12px";
    this.hudScore.style.letterSpacing ="1px";


    this.state.game.huds.defaultHUD.addWidget(this.playersHealth);
    this.state.game.huds.defaultHUD.addWidget(this.playersEnergy);
    this.state.game.huds.defaultHUD.addWidget(this.hudScore);

    this.energy = 100;
    this.health = 10;
    this.score = 0;


    ////////////////////////////////
    //FACE
    this.faceIcon = new Kiwi.HUD.Widget.Icon(this.state.game, this.state.textures.UI, 10, 10);
    this.state.game.huds.defaultHUD.addWidget(this.faceIcon);





}


HUDManager.prototype.update = function(){

	this.energy = this.state.gameManager.playersEnergy;

    this.health = this.state.gameManager.playersHealth;
    this.score  = this.state.gameManager.score;

	this.playersEnergy.counter.current = this.energy;
    this.playersHealth.counter.current = this.health;

    this.hudScore.text = "$"+this.score;


}
HUDManager.prototype.endState = function() {
    this.state.game.huds.defaultHUD.removeAllWidgets();
};

