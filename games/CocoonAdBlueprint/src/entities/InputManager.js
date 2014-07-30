var InputManager = function (state, x, y){
    this.state = state;



    
    this.keyboard = this.state.game.input.keyboard;
    this.mouse = this.state.game.input.mouse;

    

    ///////////////////
    //KEYBOARD
    this.rightArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT, true);
    this.leftArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.LEFT, true);
    this.upArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.UP, true);
    this.downArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.DOWN, true);


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

    if(this.rightArrowKey.keyCode == keyCode){
        this.state.player.updateKeyDown('RIGHT');
    } else if(this.leftArrowKey.keyCode == keyCode){
        this.state.player.updateKeyDown('LEFT');
    } else if(this.upArrowKey.keyCode == keyCode){
        this.state.player.updateKeyDown('UP');
    } else if(this.downArrowKey.keyCode == keyCode){
        this.state.player.updateKeyDown('DOWN');
    } 
    



};

InputManager.prototype.keyUp = function(keyCode, key) {
    // body...
    //console.log(keyCode, key);
    //Move
    if(this.rightArrowKey.keyCode == keyCode){
        this.state.player.updateKeyUp('RIGHT');
    } else if(this.leftArrowKey.keyCode == keyCode){
        this.state.player.updateKeyUp('LEFT');
    }
    if(this.upArrowKey.keyCode == keyCode){
        this.state.player.updateKeyUp('UP');
    } else if(this.downArrowKey.keyCode == keyCode){
        this.state.player.updateKeyUp('DOWN');
    }  
  
    

};

InputManager.prototype.mouseUp = function(keyCode, key) {
    //console.log(this.mouse.x, this.mouse.y);

    

};


InputManager.prototype.endState = function(){
    this.state.game.input.onUp.remove(this.mouseUp, this);
    this.keyboard.onKeyDownOnce.remove(this.keyDownOnce, this);
    this.keyboard.onKeyUp.remove(this.keyUp, this);
}