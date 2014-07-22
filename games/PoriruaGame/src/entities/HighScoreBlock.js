//PlayerManager / Player
var HighScoreBlock = function (state, x, y, score, name, position){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures.scoreBlock, x, y);
    this.state = state;

    this.score = score;
    this.name = name;
    this.position = position;


    ////////////////////////////
    //Choco COUNT
    this.backgroundHighScore = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.scoreBlock, x, y);

    this.nameText = new Kiwi.GameObjects.Textfield(this.state, this.name, this.x + 60, this.y+ 22, '#ffffff', 16, 'normal', 'myFirstFont');
    this.scoreText = new Kiwi.GameObjects.Textfield(this.state, this.score + "", this.x + 332, this.y+ 18, '#ffffff', 24, 'normal', 'myFirstFont');
    this.scoreText.textAlign = Kiwi.GameObjects.Textfield.TEXT_ALIGN_CENTER;
    this.postitionText = new Kiwi.GameObjects.Textfield(this.state, this.position + "", this.x + 25, this.y+ 22, '#ffffff', 18, 'normal', 'myFirstFont');
    this.postitionText.textAlign = Kiwi.GameObjects.Textfield.TEXT_ALIGN_CENTER;
    
  
    this.state.addChild(this.backgroundHighScore);
    this.state.addChild(this.nameText);
    this.state.addChild(this.scoreText);
    this.state.addChild(this.postitionText);
 


}
Kiwi.extend(HighScoreBlock, Kiwi.Group);



HighScoreBlock.prototype.removeBlock = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    this.backgroundHighScore.exists = false;
    this.nameText.exists = false;
    this.scoreText.exists = false;
    this.postitionText.exists = false;


  
    
}





