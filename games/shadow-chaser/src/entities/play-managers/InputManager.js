var InputManager = function (state, x, y){
    this.state = state;



    
    this.mouse = this.state.game.input.mouse;

    


    ////////////////////////
    //MOUSE
    this.state.game.input.onUp.add(this.mouseUp, this);
    this.state.game.input.onDown.add(this.mouseDown, this);

    // this.state.hudManager.jumpButton.input.touch.touchUp.add(this.mouseUp, this);
    // this.state.hudManager.jumpButton.input.touch.touchDown.add(this.mouseDown, this);

    // this.keyboard.onKeyDownOnce.add(this.keyDownOnce, this);
    // this.keyboard.onKeyUp.add(this.keyUp, this);





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





InputManager.prototype.mouseDown = function(x, y, timeDown, timeUp, duration, pointer) {
    //console.log(this.mouse.x, this.mouse.y);
    this.state.player.updateKeyDown('UP');
    //this.mouse.reset();
    

};

InputManager.prototype.mouseUp = function(x, y, timeDown, timeUp, duration, pointer) {
    //console.log(this.mouse.x, this.mouse.y);
    this.state.player.updateKeyUp('UP');

    // console.log("Click!");
    

};




InputManager.prototype.endState = function(){

    this.state.hudManager.jumpButton.input.onUp.remove(this.mouseUp, this);
    this.state.hudManager.jumpButton.input.onDown.remove(this.mouseDown, this);


    this.state.hudManager.pauseButton.input.onUp.remove(this.pauseUp, this);
}