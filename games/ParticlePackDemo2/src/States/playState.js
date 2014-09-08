var PlayState = new Kiwi.State('PlayState');

/**
* The PlayState in the core state that is used in the game. 
*
* It is the state where majority of the functionality occurs 'in-game' occurs.
*
* @class playState
* @extends State
* @constr
* @public
*/
PlayState.create = function () {
	this.width = game.stage.width;
	this.mouse = this.game.input.mouse;
	this.speed = 3;
	this.currentlyShooting = false;

    //drawn assets
	this.bg = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, 0, 0);
	this.bg.animation.switchTo(3);
	this.addChild(this.bg);

	this.para = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, 0, 0);
	this.para.animation.switchTo(2);
	this.addChild(this.para);

    
	this.bgSmokeEmit = new Kiwi.GameObjects.StatelessParticles(this, this.textures.particlePack2SpriteSheet, 360, 175, bgSmoke);
	this.addChild(this.bgSmokeEmit);
	this.bgSmokeEmit.startEmitting(true, true);

	this.ground = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, 0, 0);
	this.ground.animation.switchTo(1);
	this.addChild(this.ground);

    //stars emitting
	this.starEmit = new Kiwi.GameObjects.StatelessParticles(this, this.textures.particlePack2SpriteSheet, 400, 0, stars);
	this.addChild(this.starEmit);
	this.starEmit.startEmitting(true, true);

	this.smokeEmit = new Kiwi.GameObjects.StatelessParticles(this, this.textures.particlePack2SpriteSheet, 500, 280, smoke);
	this.addChild(this.smokeEmit);
	this.smokeEmit.startEmitting(true, true);

	this.player = new Kiwi.GameObjects.Sprite(this,this.textures.FlameSprite, 100, 170);
	this.player.animation.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.1, true);
	this.player.animation.add('walk', [10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 0.1, true);
	this.player.animation.add('walkBack', [19, 18, 17, 16, 15, 14, 13, 12, 11, 10], 0.1, true);
	this.player.animation.add('lift', [20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], 0.01, false);
	this.player.animation.add('drop', [30, 31, 32, 33, 34, 35, 36, 37, 38, 39], 0.051, false);
	this.player.animation.add('shoot', [59], 0.1, true);
	this.player.animation.play('idle');

	this.player.animation.getAnimation('drop').onStop.add(this.changeToIdle, this);
	this.player.animation.getAnimation('lift').onStop.add(this.changeToShoot, this);

	this.addChild(this.player);

	this.foreEmit = new Kiwi.GameObjects.StatelessParticles(this, this.textures.particlePack2SpriteSheet, 300, 120, cloud);
	this.addChild(this.foreEmit);
	this.foreEmit.startEmitting(true, true);

    //effects
	this.effects = ['Machinegunflash', 'Rifleflash', 'Sniperflash', 'Pistolflash', 'Shotgunflash', 'Flamethrower', 'Explosiveflash', 'Laserflash'];
	this.colours = ['orange', 'red', 'purple', 'blue', 'green', 'yellow']

	this.effectNum = 0;
	this.colourNum = 0;

	this.updateMyEffect();

    //buttons
	this.weaponsOnline = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, 12, 10);
	this.weaponsOnline.animation.switchTo(19);
	this.addChild(this.weaponsOnline);

	this.button = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, 220, 35);
	this.button.animation.switchTo('colours');
	this.addChild(this.button);

	this.button2 = new Kiwi.GameObjects.Sprite(this, this.textures.tiles, 5, 35);
	this.button2.animation.switchTo('weapons');
	this.addChild(this.button2);

	///////////////////////////////////
	//Callbacks
	this.game.input.onUp.add(PlayState.mouseUp, PlayState);
	this.game.input.onDown.add(PlayState.mouseDown, PlayState);

	this.rightKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.D);
	this.leftKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.A);
	this.spaceKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);
	this.vKey = this.game.input.keyboard.addKey(Kiwi.Input.Keycodes.V);
}

PlayState.update = function () {
    Kiwi.State.prototype.update.call(this);

    if (this.currentlyShooting) {
        if (this.player.animation.currentAnimation.name != 'shoot' && this.player.animation.currentAnimation.name != 'lift') {
            this.player.animation.play('shoot');
            this.startEmittingEffect();
        }
    } else {
        //this.stopEmittingEffect();
    }
	
	this.mPoint = new Kiwi.Geom.Point(this.mouse.x, this.mouse.y);
    
	if ((this.mouse.isDown) && !this.button.box.bounds.containsPoint(this.mPoint) ){
    	this.startShooting();
    } else if (this.leftKey.isDown && !this.currentlyShooting) {
        this.player.x -= this.speed;
        this.player.scaleX = -1;

        //Update Effect Position and Rotation
        this.myEffect.rotation = Math.PI;
        this.myEffect.x = this.player.x + 105;
        this.myEffect.y = this.player.y + 165;
        if(this.player.scaleX == -1){
            this.myEffect.rotation = Math.PI 
    }
        if (this.player.x < -190) {
            this.player.x = 650;
        }
    	if (this.player.animation.currentAnimation.name != 'walk')
    	    this.player.animation.play('walk');

    } else if (this.rightKey.isDown && !this.currentlyShooting) {
        this.player.x += this.speed;
        this.player.scaleX = 1;

        if (this.player.x > 650) {
            this.player.x = -190;
        }
        this.player.scaleX = 1;

        //Update Effect Position and Rotation
        this.myEffect.rotation = 0;
        this.myEffect.x = this.player.x + 192;
        this.myEffect.y = this.player.y + 165;
        if(this.player.scaleX == 1){
            this.myEffect.rotation = 0; 
        }


        if (this.player.animation.currentAnimation.name != 'walk') {
            this.player.animation.play('walk');
        }
    } else {
        this.stopEmittingEffect();
    }

	if (this.vKey.isDown) {
	    this.mouseUp();
	}

    if(this.leftKey.justReleased()){
    	if (this.player.animation.currentAnimation.name != 'drop' && this.player.animation.currentAnimation.name != 'shoot'){
    		this.player.animation.play('drop');
    	}
    }
    if(this.rightKey.justReleased()){
    	if (this.player.animation.currentAnimation.name != 'drop' && this.player.animation.currentAnimation.name != 'shoot'){
    		this.player.animation.play('drop');
    	}
    }
}

PlayState.startEmittingEffect = function () {
    if (this.myEffect.members != undefined) {
        for (var i = 0; i < this.myEffect.members.length; i++) {
            this.myEffect.members[i].rotPointX = 0;
            this.myEffect.members[i].rotPointY = 0;
            this.myEffect.members[i].startEmitting(true, false);
        }
    } else {
        this.myEffect.rotPointX = 0;
        this.myEffect.rotPointY = 0;
        this.myEffect.startEmitting(true, false);
    }
}

PlayState.stopEmittingEffect = function () {
    if (this.myEffect == undefined) return;
    if (!this.currentlyShooting) return;

    if (this.myEffect.members != undefined) {
        for (var i = 0; i < this.myEffect.members.length; i++) {
            if (this.myEffect.members[i] != undefined) {
                this.myEffect.members[i].stopEmitting(false, false);
            }
        }
    } else {
        this.myEffect.stopEmitting(false, false);
    }
    this.currentlyShooting = false;
    this.player.animation.switchTo('drop');
    console.log('stop');
}

PlayState.mouseUp = function () {
    if (this.player.animation.currentAnimation.name != 'idle') {
        this.player.animation.play('drop');
    }
    this.stopEmittingEffect();
    this.currentlyShooting = false;

}

PlayState.mouseDown = function(){
    this.mPoint = new Kiwi.Geom.Point(this.mouse.x, this.mouse.y);

    if (this.button2.box.bounds.containsPoint(this.mPoint)) {
        this.effectNum++;
        if (this.effectNum >= 8) this.effectNum = 0;
        this.button2.animation.switchTo(this.effectNum);
        this.updateMyEffect();
        
    } else if (this.button.box.bounds.containsPoint(this.mPoint)) {
        this.colourNum++;
        if (this.colourNum >= this.colours.length) this.colourNum = 0;
        this.button.animation.switchTo(this.colourNum);
        this.updateMyEffect();
    }
}

PlayState.startShooting = function(){
	if(this.currentlyShooting == false){
		this.currentlyShooting = true;
		this.player.animation.play('lift');
	}
}

PlayState.changeToIdle = function(){
	this.player.animation.play('idle');
}

PlayState.changeToShoot = function(){
    this.player.animation.play('shoot');
    this.startEmittingEffect();

}

//change emitted effect
PlayState.updateMyEffect = function () {
    if (this.myEffect != undefined) {
        this.myEffect.destroy();
    }
    var myString = this.effects[this.effectNum] + '' + this.colours[this.colourNum];

    this.myEffect = Kiwi.Plugins.ParticlePack2[myString](this, 10, 10);
    if(this.player.scaleX == -1){
        this.myEffect.rotation = Math.PI;
        this.myEffect.x = this.player.x + 105;
        this.myEffect.y = this.player.y + 165;
    } else{
        this.myEffect.rotation = 0;
        this.myEffect.x = this.player.x + 192;
        this.myEffect.y = this.player.y + 165;
    }
    this.addChild(this.myEffect);

}