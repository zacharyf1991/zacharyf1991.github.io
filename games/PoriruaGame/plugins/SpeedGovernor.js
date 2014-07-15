/**
* @module Kiwi
* @submodule Kiwi.Plugins
* @namespace Kiwi.Plugins
* @class SpeedGovernor
* @main
*/
Kiwi.Plugins.SpeedGovernor = {
	/**
    * The name of this plugin.
    * @property name
    * @type String
    * @public
    */
	name: "SpeedGovernor",
	/**
    * The version of this plugin in semver (semantic versioning) format
    * @property version
    * @type String
    * @public
    */
	version: "0.1.0",
	/**
    * The minimum version of Kiwi.js required to run this plugin in semver (semantic versioning) format
    * @property minimumKiwiVersion
    * @type String
    * @public
    */
	minimumKiwiVersion: "1.0.0"
}
Kiwi.PluginManager.register(Kiwi.Plugins.SpeedGovernor);

/** 
* The create method that the plugin manager will execute when the game this plugin is on is created.
* @method SpeedGovernor.create
* @param game {Game} The game that this Plugin is being created on/should be created on.
* @return SpeedGovernor
*/
Kiwi.Plugins.SpeedGovernor.create = function(game) {
    
    var speedGovernor = new Kiwi.Plugins.SpeedGovernor.SpeedGovernor(game);
    game.speedGovernor = speedGovernor;

    //Tells the Plugin Manager to execute the boot method that is on the speedGovernor that was just created.
    return game.speedGovernor;	
}

/**
* Deals with actual speed governance
* 
* @module Plugins
* @submodule SpeedGovernor
* @main SpeedGovernor
*/

/**
* Tracks time between frames to determine the actual speed at which time is passing.
* 
* @class SpeedGovernor
* @constructor
* @param game {Game}
* @return SpeedGovernor
*/
Kiwi.Plugins.SpeedGovernor.SpeedGovernor = function(game) {

    /**
    * The game that this SpeedGovernor belongs to.
    * @property game
    * @type Game
    * @public
    */
	this.game = game;
}


/**
* Returns the type of object that this is.
* @method objType
* @return string
* @public
*/
Kiwi.Plugins.SpeedGovernor.SpeedGovernor.prototype.objType = function() {
    return( 'SpeedGovernor' );
}

/**
* The boot method for this SpeedGovernor is executed when the game is in the process of starting up.
* This is an internal method used by Kiwi and as such a Dev should not need to use it.
* @method boot
* @protected
*/
Kiwi.Plugins.SpeedGovernor.SpeedGovernor.prototype.boot = function() {
	/**
	* Length of a single ideal frame.
	*
	* @property idealFrameLength
	* @public
	*/
	this.idealFrameLength = 1000.0 / 60.0;
}

/**
* The time scale factor describes how much time has passed since the last frame, in units of the ideal frame length (1000/60 milliseconds). For example, if the game is running at 30 frames per second, around 33.3 milliseconds per frame, it will report a time scale factor of 2. Use this factor to multiply the rate at which values change over time, making them seem to move smoothly even if frame rates are variable.
*
* @method timeScaleFactor
* @return number
* @public
*/
Kiwi.Plugins.SpeedGovernor.SpeedGovernor.prototype.timeScaleFactor = function() {
    return( this.game._delta / this.idealFrameLength );
}

/**
* Alias for time scale factor
*
* @method t
* @return number
* @public
*/
Kiwi.Plugins.SpeedGovernor.SpeedGovernor.prototype.t = function() {
    return( this.timeScaleFactor() );
}