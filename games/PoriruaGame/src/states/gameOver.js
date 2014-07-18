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
    var barPoints = 10;
    var zombiePoints = 25;

    this.theEndScore = ((this.params.time + 100) / 100) * ((this.params.zombies * zombiePoints) + (this.params.bars * barPoints));
    console.log(this.theEndScore);
    this.theEndScore = Math.round(this.theEndScore);
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
    this.leaderBoardY = 128;
    this.leaderBoardYStep = 72;
    this.scoreboard = [];

    this.playAgain = new Kiwi.GameObjects.Sprite(this, this.textures.againGameOver, 35, 252);
    this.addChild(this.playAgain);
    this.playAgain.input.onUp.add(this.playAgainHit, this);

    this.pointer = null;
    this.scrolling = false;
    this.initY = 0;

    this.game.input.mouse.onDown.add(this.checkDown, this);
    this.game.input.mouse.onUp.add(this.checkInput, this);
    this.data = null;
    this.percent = 0;
    this.noOverlay = true;

    this.createScrollBar();


    this.facebookButton = new Kiwi.GameObjects.Sprite(this, this.textures.facebookGameOver,249, 348);
    this.addChild(this.facebookButton);
    this.facebookButton.input.onUp.add(this.facebookButtonHit, this);
    this.twitterButton = new Kiwi.GameObjects.Sprite(this, this.textures.twitterGameOver, 201, 348);
    this.addChild(this.twitterButton);
    this.twitterButton.input.onUp.add(this.twitterButtonHit, this);
    this.googlePlusButton = new Kiwi.GameObjects.Sprite(this, this.textures.gPlusGameOver, 249, 348);
    // this.addChild(this.googlePlusButton);
    // this.googlePlusButton.input.onUp.add(this.googlePlusButtonHit, this);

}

PoriruaGame.GameOver.gameOverUp = function () {
    game.input.onUp.remove(this.gameOverUp, this);
    	game.states.switchState("Intro");
	

}

PoriruaGame.GameOver.getHighScore = function () {
    

}
PoriruaGame.GameOver.playAgainHit = function () {
    if(this.noOverlay){
        game.huds.defaultHUD.removeAllWidgets();
        this.playAgain.input.onRelease.remove(this.playAgainHit, this);
        this.submitButton.input.onRelease.remove(this.submitScore, this);
        this.game.input.mouse.onDown.remove(this.checkDown, this);
        this.game.input.mouse.onUp.remove(this.checkInput, this);
        game.states.switchState("Intro");
    }

}
PoriruaGame.GameOver.setHighScore = function () {



}

PoriruaGame.GameOver.facebookButtonHit = function () {
    if(this.noOverlay){
        console.log("facebookGameOver");


        var u = location.href,
        t="",
        text="Help connect Porirua City with ultra fast fibre! Play our Gigatown game and do your bit for the city!";

        window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(t),'sharer','toolbar=0, status=0, left=200, top=200, width=550, height=440');
    }

   
}

PoriruaGame.GameOver.twitterButtonHit = function () {
    if(this.noOverlay){
        console.log("twitterGameOver");
        
         console.log("twitterGameOver");
        var myText = "Fight off zombies & light up Porirua! Play the game, get a highscore, win FREE Whittaker's Chocolate bit.ly/1jDf43r #gigatownporirua"
        var myURL = "https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fkiwijs.org%2F2048%2F&text="+encodeURIComponent(myText)
        window.open(myURL);
     }
}

PoriruaGame.GameOver.update = function () {
    Kiwi.State.prototype.update.call(this);
    //this.updateScoreboard();
    if(this.scrolling) {

        this.scrollBar.y = Kiwi.Utils.GameMath.clamp( this.initY + this.pointer.y, this.maxScroll.y, this.minScroll.y);

        var percent = Math.abs((this.minScroll.y - this.scrollBar.y) / (this.minScroll.y - this.maxScroll.y) );
        //console.log(percent);
        this.percent = percent;
    }

    if(this.data != null && this.noOverlay){
        this.addBoard();
    }



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
    console.log(data);
    this.data = data;

    var scrollBarPos = Math.round(data.length * this.percent);
    console.log(scrollBarPos);
    if(data.length < 4){
        var loopNum = data.length;
    } else {loopNum = 5;}
    //Loop through the scores
    for(var i = 0; i < 5; i++) {
    //for(var i = 0; i < 4; i++) {

        var leader = data[i];
        //console.log(leader);

        // date
        // game
        // score
        // user
        this.scoreboard[this.scoreboard.length] = new HighScoreBlock(this, this.leaderBoardX, this.leaderBoardYStep * i + this.leaderBoardY, leader.score, leader.user, i + scrollBarPos+ 1);


    }

}


PoriruaGame.GameOver.submitScore = function () {
    game.huds.defaultHUD.removeAllWidgets();
    this.noOverlay = false;;
    
    this.addScoreUI();
    if(this.game.user.loggedIn == false) {
        //console.log("Yo zach, login");
        this.loginOverlay = new LoginOverlay( this );



    } else {
        this.addBoard();
       // console.log('Yo zach.');

        //Post score code here...
        var score = this.theEndScore;
        this.game.gfleaderboard.post( score, this.game.user.userData.name, function(success, data) {

            this.getScores();

        }, this );
        console.log("Game should switch back to introState");
        this.noOverlay = true;
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





PoriruaGame.GameOver.createScrollBar = function() {
    var tempX = 704;
    var tempY = 115;
    this.scrollBar = new Kiwi.GameObjects.StaticImage(this, this.textures.scrollBar, tempX, tempY);
    this.addChild(this.scrollBar);

    this.minScroll = new Kiwi.Geom.Point(this.scrollBar.x, this.scrollBar.y);
    this.maxScroll = new Kiwi.Geom.Point(this.scrollBar.x, this.scrollBar.y + 342);

}

PoriruaGame.GameOver.checkDown = function(x,y,td,tu,duration,pointer) {

    if(this.scrollBar.box.hitbox.contains(x,y)) {

        this.initY = this.scrollBar.y - y;

        this.scrolling = true;
        this.pointer = pointer;
    }

}

PoriruaGame.GameOver.checkInput = function(x, y) {

    if(this.scrolling) {
        this.scrolling = false;
        this.pointer = null;

    } else {
      
        
    }

}



PoriruaGame.GameOver.addBoard = function(){
    //console.log("Yes");

    var scrollBarPos = Math.round(this.data.length * this.percent);

    for (var j = this.scoreboard.length - 1; j >= 0; j--) {
        this.scoreboard[j].removeBlock();
    };
    this.scoreboard = [];
    if(this.data.length < 4){
        var loopNum = this.data.length;
    } else {loopNum = 5;}
    //Loop through the scores
    if(scrollBarPos >= this.data.length - 5){
        scrollBarPos = this.data.length - 5; 
    }
    for(var i = 0; i  < 5; i++) {
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
