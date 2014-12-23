var Standoff = Standoff || {};

/**
* @module Standoff
*/

/**
* Base for Effects. Relies on a coherent params object,
* so should only be called by constructors of Effects.
* @class Effect
* @constructor
* @param params {Object} Composite parameter object
*	@param params.tweenManager {Kiwi.Animations.TweenManager} Tween manager to use
*	@param params.effectObject {Kiwi.Entity} Object to use in the effect
*	@param params.to {Object} Definition of tween "to" parameters
*	@param params.duration {Number} Duration of effect
*	@param params.tweenType {Kiwi.Animations.Tweens.Easing} Easing type for effect
*	@param params.onComplete {Function} Function to perform upon completion
* @return {Kiwi.Entity} The game object to be displayed by the effect
*/
Standoff.Effect = function( params ) {
	var tween;

	// Create effect object
	this.effectObject = params.effectObject;

	// Create tween
	tween = params.tweenManager.create( this.effectObject );
	tween.to( params.to, params.duration, params.tweenType, true );

	// Set on death function
	tween.onComplete( this.destroy, this );
	if ( typeof params.onComplete === "function" ) {
		tween.onComplete( params.onComplete );
	}

	return this.effectObject;
};


/**
* Destroys the effect assets
* @method destroy
* @public
*/
Standoff.Effect.prototype.destroy = function() {
	this.effectObject.destroy();
};
