var PoriruaGame = PoriruaGame || {};

PoriruaGame.HighscoreState = new Kiwi.State('HighscoreState');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/


PoriruaGame.HighscoreState.create = function () {
    game.cameras.defaultCamera.transform.x = 0;
    game.cameras.defaultCamera.transform.y = 0;
    game.cameras.defaultCamera.transform.scale = 1;

    this.fadedBackground = new Kiwi.GameObjects.Sprite(this, this.textures.fadedBackground, 0, 0);
    this.addChild(this.fadedBackground);


    this.background = new Kiwi.GameObjects.StaticImage(this, this.textures.leaderboardBackground, 0, 0);
    this.addChild(this.background);

    this.topImage = new Kiwi.GameObjects.StaticImage(this, this.textures.LeaderboardImage, 0, 0);
    this.addChild(this.topImage);



    //Ge the scores 
    this.getScores();


    this.leaderBoardX = 317;
    this.leaderBoardY = 125;
    this.leaderBoardYStep = 70;
    this.scoreboard = [];

    this.playAgain = new Kiwi.GameObjects.Sprite(this, this.textures.againGameOver, 35, 252);
    this.addChild(this.playAgain);
    this.playAgain.input.onUp.add(this.playHit, this);

    this.facebookButton = new Kiwi.GameObjects.Sprite(this, this.textures.facebookGameOver, 152, 348);
    this.addChild(this.facebookButton);
    this.facebookButton.input.onUp.add(this.facebookButtonHit, this);
    this.twitterButton = new Kiwi.GameObjects.Sprite(this, this.textures.twitterGameOver, 201, 348);
    this.addChild(this.twitterButton);
    this.twitterButton.input.onUp.add(this.twitterButtonHit, this);
    this.googlePlusButton = new Kiwi.GameObjects.Sprite(this, this.textures.gPlusGameOver, 249, 348);
    this.addChild(this.googlePlusButton);
    this.googlePlusButton.input.onUp.add(this.googlePlusButtonHit, this);

}



PoriruaGame.HighscoreState.playHit = function () {
    game.huds.defaultHUD.removeAllWidgets();
    this.playAgain.input.onRelease.remove(this.playHit, this);
    game.states.switchState("Intro");

}

PoriruaGame.HighscoreState.facebookButtonHit = function () {
    console.log("facebookGameOver");

}
PoriruaGame.HighscoreState.twitterButtonHit = function () {
    console.log("twitterGameOver");
    var myText = "I scored " + 111 + " points at Nick Leggett Fast Fibre, can you score higher? %20%23NickLeggett %20%23FastFibre via @kiwijsengine"
    var myURL = "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fkiwijs.org%2F2048%2F&text="+myText
    window.open(myURL);

}




PoriruaGame.HighscoreState.googlePlusButtonHit = function () {
    console.log("gPlusGameOver");
}
PoriruaGame.HighscoreState.playHit = function () {
    game.huds.defaultHUD.removeAllWidgets();
    this.playAgain.input.onRelease.remove(this.playHit, this);
    game.states.switchState("Intro");

}
PoriruaGame.HighscoreState.update = function () {
    Kiwi.State.prototype.update.call(this);
    //this.updateScoreboard();



}



PoriruaGame.HighscoreState.getScores = function() {

    this.game.gfleaderboard.get(this.updateLeaderboard, this, 'score');

}


PoriruaGame.HighscoreState.updateLeaderboard = function(transmissionError, data) {

    if(transmissionError) {
        console.warn('Leaderboard Errored', transmissionError, data);
        return;
    }

    //Loop through the scores
    for(var i = 0; i < data.length; i++) {
    //for(var i = 0; i < 4; i++) {

        var leader = data[i];
        //console.log(leader);

        // date
        // game
        // score
        // user
        this.scoreboard[this.scoreboard.length] = new HighScoreBlock(this, this.leaderBoardX, this.leaderBoardYStep * i + this.leaderBoardY, leader.score, leader.user, i + 1);
        this.addChild(this.scoreboard[this.scoreboard.length-1]);


    }

}





PoriruaGame.HighscoreState.addBoard = function(){
    console.log("Yes");

    for (var i = this.scoreboard.length - 1; i >= 0; i--) {
        this.scoreboard[i].addScores();
    };
}