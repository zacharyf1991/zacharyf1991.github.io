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


    this.createScrollBar();
    //Ge the scores 
    this.getScores();


    this.leaderBoardX = 317;
    this.leaderBoardY = 128;
    this.leaderBoardYStep = 72;
    this.scoreboard = [];

    this.playAgain = new Kiwi.GameObjects.Sprite(this, this.textures.againGameOver, 35, 252);
    this.addChild(this.playAgain);
    this.playAgain.input.onUp.add(this.playHit, this);

    this.facebookButton = new Kiwi.GameObjects.Sprite(this, this.textures.facebookGameOver,249, 348);
    this.addChild(this.facebookButton);
    this.facebookButton.input.onUp.add(this.facebookButtonHit, this);
    this.twitterButton = new Kiwi.GameObjects.Sprite(this, this.textures.twitterGameOver, 201, 348);
    this.addChild(this.twitterButton);
    this.twitterButton.input.onUp.add(this.twitterButtonHit, this);
    this.googlePlusButton = new Kiwi.GameObjects.Sprite(this, this.textures.gPlusGameOver, 249, 348);
    // this.addChild(this.googlePlusButton);
    // this.googlePlusButton.input.onUp.add(this.googlePlusButtonHit, this);

    this.pointer = null;
    this.scrolling = false;
    this.initY = 0;

    this.game.input.mouse.onDown.add(this.checkDown, this);
    this.game.input.mouse.onUp.add(this.checkInput, this);
    this.data = null;
    this.percent = 0;

}

PoriruaGame.HighscoreState.createScrollBar = function() {
    var tempX = 704;
    var tempY = 115;
    this.scrollBar = new Kiwi.GameObjects.StaticImage(this, this.textures.scrollBar, tempX, tempY);
    this.addChild(this.scrollBar);

    this.minScroll = new Kiwi.Geom.Point(this.scrollBar.x, this.scrollBar.y);
    this.maxScroll = new Kiwi.Geom.Point(this.scrollBar.x, this.scrollBar.y + 342);

}



PoriruaGame.HighscoreState.playHit = function () {
    game.huds.defaultHUD.removeAllWidgets();
    this.playAgain.input.onRelease.remove(this.playHit, this);
    this.game.input.mouse.onDown.remove(this.checkDown, this);
    this.game.input.mouse.onUp.remove(this.checkInput, this);
    game.states.switchState("Intro");

}

PoriruaGame.HighscoreState.facebookButtonHit = function () {
    console.log("facebookGameOver");


    var u = location.href,
    t="",
    text="Help connect Porirua City with ultra fast fibre! Play our Gigatown game and do your bit for the city!";

    window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(t),'sharer','toolbar=0, status=0, left=200, top=200, width=550, height=440');


   
}

PoriruaGame.HighscoreState.twitterButtonHit = function () {
    console.log("twitterGameOver");
    var u = location.href,
        t="",
        text="Help connect Porirua City with ultra fast fibre! Play our Gigatown game and do your bit for the city!";

     window.open('http://twitter.com/share?text='+ text +'&url='+ u, '_blank', 'scrollbars=0, resizable=1, menubar=0, left=200, top=200, width=550, height=440');

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

    if(this.scrolling) {

        this.scrollBar.y = Kiwi.Utils.GameMath.clamp( this.initY + this.pointer.y, this.maxScroll.y, this.minScroll.y);

        var percent = Math.abs((this.minScroll.y - this.scrollBar.y) / (this.minScroll.y - this.maxScroll.y) );
        //console.log(percent);
        this.percent = percent;
        // if(this.rowHeight < this.totalHeight) {

        //     this.scoreGroup.y = - Kiwi.Utils.GameMath.snapTo(this.totalHeight * percent, this.rowHeight);
        // }
    }

    if(this.data != null){
        this.addBoard();
    }


}



PoriruaGame.HighscoreState.getScores = function() {

    this.game.gfleaderboard.get(this.updateLeaderboard, this, 'score');

}


PoriruaGame.HighscoreState.updateLeaderboard = function(transmissionError, data) {

    if(transmissionError) {
        console.warn('Leaderboard Errored', transmissionError, data);
        return;
    }
    console.log(data);
    this.data = data;

    var scrollBarPos = Math.round(data.length * this.percent);
    console.log(scrollBarPos);
    if(data.length < 4){
        var loopNum = data.length;
    } else {loopNum = 5;}
    //Loop through the scores
    for(var i = 0; i < loopNum; i++) {
    //for(var i = 0; i < 4; i++) {

        var leader = data[i];
        console.log(leader);
        //console.log(leader);

        // date
        // game
        // score
        // user
        this.scoreboard[this.scoreboard.length] = new HighScoreBlock(this, this.leaderBoardX, this.leaderBoardYStep * i + this.leaderBoardY, leader.score, leader.user, i + 1);


    }

}
PoriruaGame.HighscoreState.checkDown = function(x,y,td,tu,duration,pointer) {

    if(this.scrollBar.box.hitbox.contains(x,y)) {

        this.initY = this.scrollBar.y - y;

        this.scrolling = true;
        this.pointer = pointer;
    }

}

PoriruaGame.HighscoreState.checkInput = function(x, y) {

    if(this.scrolling) {
        this.scrolling = false;
        this.pointer = null;

    } else {
      
        
    }

}






PoriruaGame.HighscoreState.addBoard = function(){
    //console.log("Yes");

    var scrollBarPos = Math.round(this.data.length * this.percent);

    for (var j = this.scoreboard.length - 1; j >= 0; j--) {
        this.scoreboard[j].removeBlock();
    };
    this.scoreboard = [];
    //Loop through the scores
    if(scrollBarPos >= this.data.length - 5){
        scrollBarPos = this.data.length - 5; 
    }
    // Sanitise loop length
    var loopLength = 5;
    if(this.data.length < 5)
        loopLength = this.data.length;
    for(var i = 0; i  < loopLength; i++) {
    //for(var i = 0; i < 4; i++) {

        var leader = this.data[scrollBarPos + i];
        //console.log(leader);

        // date
        // game
        // score
        // user
        this.scoreboard[this.scoreboard.length] = new HighScoreBlock(this, this.leaderBoardX, this.leaderBoardYStep * i + this.leaderBoardY, leader.score, leader.user, i + scrollBarPos + 1);


    }
}