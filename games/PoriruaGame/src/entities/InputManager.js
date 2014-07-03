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


    ////////////////////////
    //MOUSE
    this.state.game.input.onUp.add(this.mouseUp, this);
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
    } else if(keyCode == this.upKey.keyCode){
        this.state.player.updateKeyDown('UP');
    } else if(keyCode == this.downKey.keyCode){
        this.state.player.updateKeyDown('DOWN');
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
    if(keyCode == this.upKey.keyCode){
        this.state.player.updateKeyUp('UP');
    } else if(keyCode == this.downKey.keyCode){
        this.state.player.updateKeyUp('DOWN');
    }  
  
    

};

InputManager.prototype.mouseUp = function(keyCode, key) {
    console.log(this.mouse.x, this.mouse.y);

    

};

