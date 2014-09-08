var IntroState = new Kiwi.State('IntroState');

IntroState.create = function () {
    if (Kiwi.DEVICE.webGL) {
        game.states.switchState("PlayState");
    } else {
        console.log('webGL is not supported by your device or browser.');
        this.errorMess = new Kiwi.GameObjects.Sprite(this, this.textures.webGLError, (this.game.stage.width/2)-247, 100);
        this.addChild(this.errorMess);
        this.errorMess.input.onDown.add(this.pressGame, this);
    }
}

IntroState.pressGame = function () {
    this.errorMess.input.onDown.remove(this.pressGame, this);
    game.states.switchState("PlayState");
}