//Here is the code for a bare bones plugin that does nothing but register itself.
Kiwi.Plugins.Gamepad = {
 
	/**
	* The name of this plugin.
	*/
	name:'Gamepad',
	
	/**
	* The version of this plugin in semver (semantic versioning) format
	*/
	version:'0.1.0',
	
	/**
	* The minimum version of Kiwi.js required to run this plugin in semver (semantic versioning) format
	*/
	minimumKiwiVersion: "1.0.0"
};
Kiwi.PluginManager.register(Kiwi.Plugins.Gamepad);

Kiwi.Plugins.Gamepad.create = function( game ) {

	var support = Kiwi.Plugins.Gamepad.supportsGamepad();

	if( !support ) {
		console.error ( "Your browser / platform does not support Gamepad Controllers")
	}


		
  game.gamepads = new Kiwi.Plugins.Gamepad.Manager( game );

  return game.gamepads;
};
Kiwi.Plugins.Gamepad.supportsGamepad = function() {
	return "getGamepads" in navigator;
};

/**
* 
* @module Plugins
* @submodule Gamepad
* @class Main
* @constructor
* @param game {Kiwi.Game} The game that this 
*/
Kiwi.Plugins.Gamepad.Manager = function( game ) {
	this.game = game;
	// console.log("ZACH");

	this.gamepads = this.createControllers();




};

Kiwi.Plugins.Gamepad.Manager.prototype.update = function( ) {
	// console.log("Updating Plugin");
	this.updateControllers();

};

Kiwi.Plugins.Gamepad.Manager.prototype.updateControllers = function(){
	var gamepads = navigator.getGamepads();

	for (var i = 0; i < gamepads.length; i++) {
		if(gamepads[i]){
			this.gamepads[i].checkButtons( gamepads[i]);
			this.gamepads[i].checkAxes( gamepads[i] );
		}	
	};

};

Kiwi.Plugins.Gamepad.Manager.prototype.createControllers = function () {

	var gamepads = [],
		gamepadLength = navigator.getGamepads().length;

	console.log("Creating Controllers", gamepadLength);

	for (var i = gamepadLength - 1; i >= 0; i--) {
		var tempController = new Kiwi.Plugins.Gamepad.Controller( this, 0.5, 0.5 );
		// console.log("Creating new controller", tempController);
		gamepads.push( tempController );
	};
	return gamepads;



};











/////////////
// CONTROLLER
/////////////
Kiwi.Plugins.Gamepad.Controller = function ( parent, axesThreshold, triggerThreshold ) {
	this.parent = parent;
	this.axesThreshold = axesThreshold;
	this.triggerThreshold = triggerThreshold;
	this.createButtons();
	this.createAxes();

	this.onUp = new Kiwi.Signal();
	this.isDown = new Kiwi.Signal();
	this.onDownOnce = new Kiwi.Signal();
	this.justReleased = new Kiwi.Signal();




};

Kiwi.Plugins.Gamepad.Controller.prototype.createButtons = function(){

	this.button0 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_A');
	this.button1 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_B');
	this.button2 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_X');
	this.button3 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_Y');

	this.button4 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_LEFT_BUMPER');
	this.button5 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_RIGHT_BUMPER');
	this.button6 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_LEFT_TRIGGER', 0.2);
	this.button7 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_RIGHT_TRIGGER', 0.2);

	this.button8 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_BACK');
	this.button9 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_START');

	this.button10 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_LEFT_STICK');
	this.button11 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_RIGHT_STICK');

	this.button12 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_DPAD_UP');
	this.button13 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_DPAD_DOWN');
	this.button14 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_DPAD_LEFT');
	this.button15 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_DPAD_RIGHT');

	// this.button16 = new Kiwi.Plugins.Gamepad.Button( 0, 'XBOX_MIDDLE_BUTTON');

	this.rightButtons = [ this.button0, this.button1, this.button2, this.button3 ];
	this.bumpers = [ this.button4, this.button5 ];
	this.trigers = [ this.button6, this.button7 ];
	this.thumbsticks = [ this.button10, this.button11 ]
	this.dpad = [ this.button12, this.button13, this.button14, this.button15 ];
	this.optionButtons = [  this.button8, this.button9,  this.button16 ];

	this.buttons = [ this.button0, this.button1, this.button2, this.button3, this.button4, 
			this.button5, this.button6, this.button7, this.button8, this.button9, 
			this.button10, this.button11, this.button12, this.button13, this.button14, 
			this.button15 ];

};

Kiwi.Plugins.Gamepad.Controller.prototype.createAxes = function(){
	this.axis0 = { rot: 0 };
	this.axis1 = { rot: 0 };
	this.axis2 = { rot: 0 };
	this.axis3 = { rot: 0 };

	this.axes = [ this.axis0, this.axis1, this.axis2, this.axis3 ];
	this.leftAxis = [ this.axis0, this.axis1 ];
	this.rightAxis = [ this.axis2, this.axis3 ];
};

Kiwi.Plugins.Gamepad.Controller.prototype.checkButtons = function( gamepad ){
	// console.log(gamepad, "ZACH", this.buttons);
	for (var i = this.buttons.length - 1; i >= 0; i--) {
		// console.log(i, "ZACH", gamepad)
		if(this.buttons[ i ].pressed ===  gamepad.buttons[ i ].pressed ){
			if( this.buttons[ i ].pressed === true ){
				////////////////////
				//FIRE IS DOWN SIGNAL
				this.buttons[ i ].isDown( gamepad.buttons[ i ] );

				this.isDown.dispatch( this.buttons[ i ] );

			} else {
				//Button has not been pressed
			}
		} else if(this.buttons[ i ].pressed !==  gamepad.buttons[ i ].pressed ) {
			if( gamepad.buttons[ i ].pressed === true ){
				////////////////////
				//FIRE IS DOWN SIGNAL
				//FIRE IS DOWN ONCE SIGNAL
				this.buttons[ i ].press( gamepad.buttons[ i ] );
				this.isDown.dispatch( this.buttons[ i ] );

				this.onDownOnce.dispatch( this.buttons[ i ] );

			} else if( gamepad.buttons[ i ].pressed === false ){
				////////////////////
				//FIRE IS UP SIGNAL
				this.buttons[ i ].release();

				this.onUp.dispatch( this.buttons[ i ] );

			}

		}
	};
};

Kiwi.Plugins.Gamepad.Controller.prototype.checkAxes = function( gamepad ){
};


//////////////////
// BUTTON
//////////////////

Kiwi.Plugins.Gamepad.Button = function ( index, name, threshold ) {
	// console.log("Creating Button ZACH");
	this.index = index;
	this.name = name;
	this.threshold = threshold || 0;

	this.value = 0;
	this.pressed = false;

	this.startDown;
	this.startUp;
};

Kiwi.Plugins.Gamepad.Button.prototype.release = function () {
	this.pressed = false;
	this.value = 0;
};
Kiwi.Plugins.Gamepad.Button.prototype.press = function ( button ) {
	// console.log(button);
	this.pressed = true;
	this.value = button.value;
};

Kiwi.Plugins.Gamepad.Button.prototype.isDown = function ( button ) {
	// console.log(button);
	this.pressed = true;
	this.value = button.value;
};


/////////////////
// THUMB STICK
/////////////////

Kiwi.Plugins.Gamepad.Thumbstick = function ( index, name, threshold ) {
	this.threshold = threshold


};