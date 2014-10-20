var InputManager = function (state, x, y){
    this.state = state;



    
    this.keyboard = this.state.game.input.keyboard;
    this.mouse = this.state.game.input.mouse;

    

    ///////////////////
    //KEYBOARD
    this.rightKey = this.keyboard.addKey(Kiwi.Input.Keycodes.D);
    this.leftKey = this.keyboard.addKey(Kiwi.Input.Keycodes.A);
    this.upKey = this.keyboard.addKey(Kiwi.Input.Keycodes.W);
    this.downKey = this.keyboard.addKey(Kiwi.Input.Keycodes.S);

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
    } 

    if(keyCode == this.leftKey.keyCode){
        this.state.player.updateKeyDown('LEFT');
    } 

    if(keyCode == this.upKey.keyCode){
        this.state.player.updateKeyDown('UP');
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
        this.state.weaponManager.shootKeyDown();
    }
    /////////////////////
    //Capture
    if(keyCode == this.captureKey.keyCode){
        this.state.miniGameManager.attemptMatch();
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
    } 

    if(keyCode == this.leftKey.keyCode){
        this.state.player.updateKeyUp('LEFT');
    } 

    if(keyCode == this.upKey.keyCode){
        this.state.player.updateKeyUp('UP');
    } 
    //Jump
    if(keyCode == this.jumpKey.keyCode){
       this.state.player.updateKeyUp('JUMP');
    }
    //Shoot
    if(keyCode == this.shootKey.keyCode){
        this.state.weaponManager.shootKeyUp();
    }

    if(keyCode == this.restartKey.keyCode){
        this.state.levelManager.switchStates();
    }
    if(keyCode == this.gameOverKey.keyCode){
        this.state.levelManager.gameOver();
    }
    

};

InputManager.prototype.switchStates = function(){
    this.keyboard.onKeyDownOnce.remove(this.keyDownOnce, this);
    this.keyboard.onKeyUp.remove(this.keyUp, this);
}

InputManager.prototype.getKeysDown = function(){
    var keys = {
        rightKey: this.rightKey.isDown,
        leftKey: this.leftKey.isDown,
        upKey: this.upKey.isDown,
        downKey: this.downKey.isDown
    }
    return keys;
}