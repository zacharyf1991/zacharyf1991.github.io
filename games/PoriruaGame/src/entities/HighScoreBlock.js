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
    this.scoreText = new Kiwi.GameObjects.Textfield(this.state, this.score + "", this.x + 300, this.y+ 18, '#ffffff', 24, 'normal', 'myFirstFont');
    this.postitionText = new Kiwi.GameObjects.Textfield(this.state, this.position + "", this.x + 10, this.y+ 13, '#ffffff', 32, 'normal', 'myFirstFont');
    
    // this.nameText.style.fontFamily = 'myFirstFont';
    // this.nameText.style.color = '#ffffff';
    // this.nameText.style.textShadow ="1.5px 1.5px  #000, -1.5px 1.5px  #000, 1.5px -1.5px  #000, -1.5px -1.5px  #000";
    // this.nameText.style.fontSize ="16px";
    // this.nameText.style.letterSpacing ="1px";
        ////////////////////////////
    //TIME

    // this.scoreText = new Kiwi.HUD.Widget.TextField(game, this.score + " ", this.x + 300, this.y + 10);
    
    // this.scoreText.style.fontFamily = 'myFirstFont';
    // this.scoreText.style.color = '#ffffff';
    // this.scoreText.style.textShadow ="1.5px 1.5px  #000, -1.5px 1.5px  #000, 1.5px -1.5px  #000, -1.5px -1.5px  #000";
    // this.scoreText.style.fontSize ="32px";
    // this.scoreText.style.letterSpacing ="1px";

    ////////////////////////////
    //ZOMBIE COUNT

    // this.postitionText = new Kiwi.HUD.Widget.TextField(game, this.position + " ", this.x + 10, this.y + 10);
    
    // this.postitionText.style.fontFamily = 'myFirstFont';
    // this.postitionText.style.color = '#ffffff';
    // this.postitionText.style.textShadow ="1.5px 1.5px  #000, -1.5px 1.5px  #000, 1.5px -1.5px  #000, -1.5px -1.5px  #000";
    // this.postitionText.style.fontSize ="32px";
    // this.postitionText.style.letterSpacing ="1px";

    // game.huds.defaultHUD.addWidget(this.nameText);
    this.state.addChild(this.backgroundHighScore);
    this.state.addChild(this.nameText);
    this.state.addChild(this.scoreText);
    this.state.addChild(this.postitionText);
    // game.huds.defaultHUD.addWidget(this.scoreText);
    // game.huds.defaultHUD.addWidget(this.postitionText);
 


}
Kiwi.extend(HighScoreBlock, Kiwi.Group);

HighScoreBlock.prototype.addScores = function(){
    // game.huds.defaultHUD.addWidget(this.nameText);
    // this.addChild(this.nameText);
    // game.huds.defaultHUD.addWidget(this.scoreText);
    // game.huds.defaultHUD.addWidget(this.postitionText);



  
    
}



HighScoreBlock.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);



  
    
}

HighScoreBlock.prototype.removeBlock = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    this.backgroundHighScore.exists = false;
    this.nameText.exists = false;
    this.scoreText.exists = false;
    this.postitionText.exists = false;


  
    
}





