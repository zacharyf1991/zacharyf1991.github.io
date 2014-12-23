var Standoff = Standoff || {};

/**
* @module Standoff
*/


/**
* Manages effects on the battlefield.
*
* Effects must be layered for peak performance, so this should create several
* "bookmarks" in the state so it can add and remove effects without grouping.
* There is a small but significant cost associated with getting parent
* matrices, so grouping is impractical.
*
* Currently this doesn't happen.
*
* @class EffectsManager
* @constructor
* @param state {Kiwi.State} Current state
*/
Standoff.EffectsManager = function( state ) {

	/**
	* State to which effects are applied
	* @property state
	* @type Kiwi.State
	* @public
	*/
	this.state = state;

	this.effectBeamGroup = new Kiwi.Group( this.state );
	this.state.addChild( this.effectBeamGroup );

	this.effectBlastGroup = new Kiwi.Group( this.state );
	this.state.addChild( this.effectBlastGroup );

	this.effectParticleGroup = new Kiwi.Group( this.state );
	this.state.addChild( this.effectParticleGroup );
};


/**
* @method addBeam
* @param params {Object} Composite parameter object
*	@param params.start {Kiwi.Point} Shooter position
*	@param params.end {Kiwi.Point} Target position
*	@param params.duration {Number} Time to fly to target
*	@param params.color {Array} Normalized RGB components of beam
*	@param.params.tweenManager {Kiwi.Animations.TweenManager}
*		Tween manager to use
* @public
*/
Standoff.EffectsManager.prototype.addBeam = function( params ) {
	var beam, effect;

	beam = new Kiwi.Plugins.Primitives.Rectangle( {
			state: this.state,
			width: 30,
			height: 2,
			color: params.color,
			drawStroke: false,
			x: params.start.x,
			y: params.start.y,
			rotation: params.start.angleTo( params.end )
		});
	this.effectBeamGroup.addChild( beam );

	effect = new Standoff.Effect( {
			tweenManager: params.tweenManager,
			effectObject: beam,
			to: {
					x: params.end.x,
					y: params.end.y
				},
			duration: params.duration,
			tweenType: Kiwi.Animations.Tweens.Easing.Linear.None
		});
};
// Test protocol:
// state.effects.addBeam( { start: new Kiwi.Geom.Point( 100, 100 ),
//	end: new Kiwi.Geom.Point( 700, 500 ), duration: 1000,
//	color: [ 0.5, 0.5, 1 ], tweenManager: state.game.tweens } )
