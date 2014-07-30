HUDManager = function(state){
	this.state = state;
    this.scoreText =  new Kiwi.GameObjects.Textfield(this.state, "0000 POINTS", this.state.player.x + 500, 10,  '#FFFFFF',  32,  'normal', 'Eurostile-Bold')
    this.state.addChild(this.scoreText);
    this.scoreText.textAlign = Kiwi.GameObjects.Textfield.TEXT_ALIGN_RIGHT;

    this.score =0;

}


HUDManager.prototype.update = function(){
    this.scoreText.x = this.state.player.x + 920;
    this.score ++;

    this.scoreText.text = this.score + " POINTS";



}
// HUDManager.prototype.endState = function() {
//     this.state.game.huds.defaultHUD.removeAllWidgets();
// };


// HUDManager.prototype.updateTime = function(t) {
//     this.hudTime.text = t;
// };

