var PoriruaGame = PoriruaGame || {};

PoriruaGame.GameOver = new Kiwi.State('GameOver');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/


PoriruaGame.GameOver.create = function (params) {
    game.cameras.defaultCamera.transform.x = 0;
    game.cameras.defaultCamera.transform.y = 0;
    game.cameras.defaultCamera.transform.scale = 1;

    this.fadedBackground = new Kiwi.GameObjects.Sprite(this, this.textures.fadedBackground, 0, 0);
    this.addChild(this.fadedBackground);


    this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.gameOverBackground, 0, 0);
    this.addChild(this.background);
    this.params = params;

    this.theEndScore = this.params.bars * this.params.time;
    this.chocBars = this.params.bars;
    //console.log(this.params);

    this.scores = this.getHighScore();

    if(this.params.condition == 'win'){
        this.win = new Kiwi.GameObjects.Sprite(this, this.textures.winGameOver, 20, 10);
        this.addChild(this.win);
    } else if(this.params.condition == 'lose'){
        this.lose = new Kiwi.GameObjects.Sprite(this, this.textures.loseGameOver, 20, 10);
        this.addChild(this.lose);

    } 


    this.submitButton = new Kiwi.GameObjects.Sprite(this, this.textures.submitGameOver, 184, 450);
    this.addChild(this.submitButton);

    //Ge the scores 
    this.getScores();

    //Post Score
    this.submitButton.input.onUp.add(this.submitScore, this);
    // game.input.onUp.add(this.mouseLoc, this);
    this.addScoreUI();

    this.leaderBoardX = 317;
    this.leaderBoardY = 125;
    this.leaderBoardYStep = 70;
    this.scoreboard = [];

    this.playAgain = new Kiwi.GameObjects.Sprite(this, this.textures.againGameOver, 35, 252);
    this.addChild(this.playAgain);
    this.playAgain.input.onUp.add(this.playAgainHit, this);

}

PoriruaGame.GameOver.gameOverUp = function () {
    game.input.onUp.remove(this.gameOverUp, this);
    	game.states.switchState("Intro");
	

}

PoriruaGame.GameOver.getHighScore = function () {
    

}
PoriruaGame.GameOver.playAgainHit = function () {
    game.huds.defaultHUD.removeAllWidgets();
    this.playAgain.input.onRelease.remove(this.playAgainHit, this);
    this.submitButton.input.onRelease.remove(this.submitScore, this);
    game.states.switchState("Intro");

}
PoriruaGame.GameOver.setHighScore = function () {



}

PoriruaGame.GameOver.update = function () {
    Kiwi.State.prototype.update.call(this);
    //this.updateScoreboard();



}

PoriruaGame.GameOver.updateScoreboard = function () {
    for (var i = this.scoresboard.length - 1; i >= 0; i--) {
        //this.scoresboard[i].update();
    };


}


PoriruaGame.GameOver.getScores = function() {

    this.game.gfleaderboard.get(this.updateLeaderboard, this, 'score');

}


PoriruaGame.GameOver.updateLeaderboard = function(transmissionError, data) {

    if(transmissionError) {
        console.warn('Leaderboard Errored', transmissionError, data);
        return;
    }

    //Loop through the scores
    for(var i = 0; i < data.length; i++) {
    //for(var i = 0; i < 4; i++) {

        var leader = data[i];
        console.log(leader);

        // date
        // game
        // score
        // user
        this.scoreboard[this.scoreboard.length] = new HighScoreBlock(this, this.leaderBoardX, this.leaderBoardYStep * i + this.leaderBoardY, leader.score, leader.user, i + 1);
        this.addChild(this.scoreboard[this.scoreboard.length-1]);


    }

}


PoriruaGame.GameOver.submitScore = function () {
    game.huds.defaultHUD.removeAllWidgets();
    
    this.addScoreUI();
    if(this.game.user.loggedIn == false) {
        console.log("Yo zach, login");
        this.loginOverlay = new LoginOverlay( this );



    } else {
        this.addBoard();
        console.log('Yo zach.');

        //Post score code here...
        var score = this.theEndScore;
        this.game.gfleaderboard.post( score, this.game.user.userData.name, function(success, data) {

            this.getScores();

        }, this );
        this.playAgainHit();

    }
    

}

PoriruaGame.GameOver.startSignUp = function () {
    console.log("Yo zach");
    this.signUpOverlay = new SignUpOverlay(this);


}

PoriruaGame.GameOver.mouseLoc = function () {
    console.log(game.input.mouse.x, game.input.mouse.y);


}


// PoriruaGame.GameOver.shareGame = function () {
//     var myText = "I scored " + this.currHighScore + " points at -90, can you last longer? %20%23negativeNinety via @kiwijsengine"
//     var myURL = "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fkiwijs.org%2F2048%2F&text="+myText
//     window.open(myURL);
// }


PoriruaGame.GameOver.addScoreUI = function(){

    ////////////////////////////
    //Choco COUNT

    this.hudChocCount = new Kiwi.HUD.Widget.TextField(game, this.params.bars+'', 215, 68);
    
    this.hudChocCount.style.fontFamily = 'myFirstFont';
   this.hudChocCount.style.color = '#ffffff';
    this.hudChocCount.style.textShadow ="1.5px 1.5px  #000, -1.5px 1.5px  #000, 1.5px -1.5px  #000, -1.5px -1.5px  #000";
    this.hudChocCount.style.fontSize ="32px";
    this.hudChocCount.style.letterSpacing ="1px";
        ////////////////////////////
    //TIME

    this.hudTime = new Kiwi.HUD.Widget.TextField(game, this.params.visibleTime, 200, 108);
    
    this.hudTime.style.fontFamily = 'myFirstFont';
    this.hudTime.style.color = '#ffffff';
    this.hudTime.style.textShadow ="1.5px 1.5px  #000, -1.5px 1.5px  #000, 1.5px -1.5px  #000, -1.5px -1.5px  #000";
    this.hudTime.style.fontSize ="32px";
    this.hudTime.style.letterSpacing ="1px";

    ////////////////////////////
    //ZOMBIE COUNT

    this.hudZombieCount = new Kiwi.HUD.Widget.TextField(game, this.params.zombies + "", 215, 150);
    
    this.hudZombieCount.style.fontFamily = 'myFirstFont';
    this.hudZombieCount.style.color = '#ffffff';
    this.hudZombieCount.style.textShadow ="1.5px 1.5px  #000, -1.5px 1.5px  #000, 1.5px -1.5px  #000, -1.5px -1.5px  #000";
    this.hudZombieCount.style.fontSize ="32px";
    this.hudZombieCount.style.letterSpacing ="1px";

    ////////////////////////////
    //Score COUNT

    this.theScoreText = new Kiwi.HUD.Widget.TextField(game, this.theEndScore + "", 200, 207);
    
    this.theScoreText.style.fontFamily = 'myFirstFont';
    this.theScoreText.style.color = '#ffffff';
    this.theScoreText.style.textShadow ="1.5px 1.5px  #000, -1.5px 1.5px  #000, 1.5px -1.5px  #000, -1.5px -1.5px  #000";
    this.theScoreText.style.fontSize ="32px";
    this.theScoreText.style.letterSpacing ="1px";



    

    game.huds.defaultHUD.addWidget(this.hudTime);
    game.huds.defaultHUD.addWidget(this.hudZombieCount);
    game.huds.defaultHUD.addWidget(this.hudChocCount);
    game.huds.defaultHUD.addWidget(this.theScoreText);
}

PoriruaGame.GameOver.addBoard = function(){
    console.log("Yes");

    for (var i = this.scoreboard.length - 1; i >= 0; i--) {
        this.scoreboard[i].addScores();
    };
}