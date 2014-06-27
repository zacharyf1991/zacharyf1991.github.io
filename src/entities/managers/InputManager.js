var InputManager = function (state, x, y){
    this.state = state;



    
    this.keyboard = this.state.game.input.keyboard;
    this.mouse = this.state.game.input.mouse;

    

    ///////////////////
    //KEYBOARD
    this.rightKey = this.keyboard.addKey(Kiwi.Input.Keycodes.D);
    this.leftKey = this.keyboard.addKey(Kiwi.Input.Keycodes.A);
    this.upKey = this.keyboard.addKey(Kiwi.Input.Keycodes.UP);
    this.downKey = this.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);

    this.spawnKey = this.keyboard.addKey(Kiwi.Input.Keycodes.Q);
    this.restartKey = this.keyboard.addKey(Kiwi.Input.Keycodes.R);

    this.shootKey = this.keyboard.addKey(Kiwi.Input.Keycodes.J);
    this.jumpKey = this.keyboard.addKey(Kiwi.Input.Keycodes.K);

    this.gemKey = this.keyboard.addKey(Kiwi.Input.Keycodes.G);
    this.gameOverKey = this.keyboard.addKey(Kiwi.Input.Keycodes.F);

    this.captureKey = this.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);
    ////////////////////////
    //MOUSE
    //this.state.game.input.onUp.add(this.mouseUp, this);
    //this.state.game.input.onDown.add(this.mouseDown, this);

    this.keyboard.onKeyDownOnce.add(this.keyDownOnce, this);
    this.keyboard.onKeyUp.add(this.keyUp, this);








}

InputManager.prototype.keyDownOnce = function(keyCode, key) {
    // body...
    //console.log(keyCode, key);

    if(keyCode == this.rightKey.keyCode){
        this.state.player.updateKeyDown('RIGHT');
    } else if(keyCode == this.leftKey.keyCode){
        this.state.player.updateKeyDown('LEFT');
    } 
    if(keyCode == this.jumpKey.keyCode){
        this.state.player.updateKeyDown('JUMP');
        this.keyUp(this.shootKey.keyCode, this.jumpKey);
    }

    if(keyCode == this.spawnKey.keyCode){
        this.state.enemyManager.addEnemies(1);
    }
    ////////////////////
    //Shooting
    if(keyCode == this.shootKey.keyCode){
        this.state.weaponManager.mouseDown();
    }
    /////////////////////
    //Capture
    if(keyCode == this.captureKey.keyCode){
        this.state.weaponManager.myMiniGame.checkRange();
    }
    if(keyCode == this.gemKey.keyCode){
        var tempPoint = new Kiwi.Geom.Point(this.mouse.x, this.mouse.y);
        tempPoint = game.cameras.defaultCamera.transformPoint(tempPoint);
        this.state.itemManager.addItem('gem', tempPoint.x, tempPoint.y);
    }



};

InputManager.prototype.keyUp = function(keyCode, key) {
    // body...
    //console.log(keyCode, key);
    //Move
    if(keyCode == this.rightKey.keyCode){
        this.state.player.updateKeyUp('RIGHT');
    } else if(keyCode == this.leftKey.keyCode){
        this.state.player.updateKeyUp('LEFT');
    } 
    //Jump
    if(keyCode == this.jumpKey.keyCode){
       this.state.player.updateKeyUp('JUMP');
    }
    //Shoot
    if(keyCode == this.shootKey.keyCode){
        this.state.weaponManager.mouseUp();
    }

    if(keyCode == this.restartKey.keyCode){
        this.state.levelManager.switchStates();
    }
    if(keyCode == this.gameOverKey.keyCode){
        this.state.levelManager.gameOver();
    }
    

};

LevelManager.prototype.switchStates = function(){
    this.keyboard.onKeyDownOnce.remove(this.keyDownOnce, this);
    this.keyboard.onKeyUp.remove(this.keyUp, this);
}