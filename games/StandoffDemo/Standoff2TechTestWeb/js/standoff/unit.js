var Standoff = Standoff || {};

/**
* @module Standoff
*/

/**
* Unit is the base for all units.
* @class Unit
* @constructor
* @extends Kiwi.Group
* @param params {Object} Params object contains all parameters
*/
Standoff.Unit = function( params ) {
	this._sanitizeParams( params );

	Kiwi.Group.call( this, params.state, params.name );

	this._parseParams( params );

	/**
	* Amount currently reloaded
	* @property reload
	* @type Number
	* @public
	*/
	this.reload = 0;
};
Kiwi.extend( Standoff.Unit, Kiwi.Group );


/**
* Perform per-frame updates
* @method update
* @public
*/
Standoff.Unit.prototype.update = function() {
	Kiwi.Group.prototype.update.call( this );

	// Weapon maintenance
	this.reload += this.game.time.rate;
	if ( this.reload >= this.reloadMax ) {
		this.reload = this.reloadMax;
		this.attackNearest();
	}

	// Call AI
	this.ai.update();
};


/**
* Fill in any missing params and ensure they are all valid
* @method _sanitizeParams
* @param params {Object} The class params object
* @private
*/
Standoff.Unit.prototype._sanitizeParams = function( params ) {

	// Sanitize state
	if ( !( params.state && params.state.objType &&
			params.state.objType() === "State" ) ) {
		throw "Unit creation failure: no state was provided" ;
	}

	// Default name
	if ( typeof params.name !== "string" ) {
		params.name = "";
	}

	// Default team
	if ( typeof params.team !== "string" ) {
		params.team = "team0"
	}

	// Default tags
	if ( !Kiwi.Utils.Common.isArray( params.tags ) ) {
		if ( params.tags ) {
			params.tags = [ params.tags ];
		} else {
			params.tags = [];
		}
	}

	// Default transform
	if ( isNaN( params.x ) ) {
		params.x = 0;
	}
	if ( isNaN( params.y ) ) {
		params.y = 0;
	}
	if ( isNaN( params.rotation ) ) {
		params.rotation = 0;
	}
	if ( isNaN( params.anchorPointX ) ) {
		params.anchorPointX = 0;
	}
	if ( isNaN( params.anchorPointY ) ) {
		params.anchorPointY = 0;
	}
	if ( isNaN( params.scaleX ) ) {
		if ( !isNaN( params.scale ) ) {
			params.scaleX = params.scale;
		} else {
			params.scaleX = 1;
		}
	}
	if ( isNaN( params.scaleY ) ) {
		if ( !isNaN( params.scale ) ) {
			params.scaleY = params.scale;
		} else {
			params.scaleY = 1;
		}
	}

	// Default direction
	if ( isNaN( params.direction ) ) {
		params.direction = 0;
	}

	// Default reload
	if ( isNaN( params.reloadMax ) ) {
		params.reloadMax = 100;
	}

	// Default visual characteristics
	if ( isNaN( params.alpha ) ) {
		params.alpha = 1;
	}
	if ( params.visible !== false ) {
		params.visible = true;
	}
	if ( !params.color ) {
		params.color = [ 0.5, 0.5, 0.5 ];
	}

	// Default weapon
	if ( params.weapon === undefined ) {
		params.weapon = new Kiwi.Plugins.Primitives.Triangle( {
			state: params.state,
			points: [ [ 20, 0 ], [ -5, -5 ], [ -5, 5 ] ],
			color: params.color,
			alpha: params.alpha
		} );
	}

	// Default base
	if ( params.base === undefined ) {
		params.base = new Kiwi.Plugins.Primitives.Triangle( {
			state: params.state,
			points: [ [ 20, 0 ], [ -5, -5 ], [ -5, 5 ] ],
			color: params.color,
			alpha: params.alpha
		} );
	}

	// Default AI
	if ( !params.ai ) {
		params.ai = new Kiwi.Plugins.AiTree.Ai( this );
		params.ai.setRoot( new Kiwi.Plugins.AiTree.Selector( {
				name: "Auto Success selector"
			} ) );
	}

	// Default damage system
	// WARNING: Will not auto-connect health to pipeline if they're different
	if ( !params.health ) {
		params.health = new Kiwi.Plugins.DamagePipeline.MeterNode( {
				doOnZero: (function() {
						this.die();
					}).bind( this )
			} );
	}
	if ( !params.damagePipeline ) {
		params.damagePipeline = params.health;
	}

	// Default health bars
	if ( params.enableHealthBar !== false ) {
		params.enableHealthBar = true;
	}

	// Default tween manager
	if ( !( params.tweenManager &&
			params.tweenManager.objType() === "TweenManager" ) ) {
		params.tweenManager = params.state.game.tweens;
	}

	// Default clock
	if ( !( params.clock && params.clock.objType() === "Clock" ) ) {
		params.clock = params.state.game.time.clock;
	}
};


/**
* Apply params to this object
* @method _parseParams
* @param params {Object} The class params object
* @private
*/
Standoff.Unit.prototype._parseParams = function( params ) {
	this.team = params.team;
	this.tags = params.tags;
	this.tags.push( this.team );
	this.x = params.x;
	this.y = params.y;
	this.rotation = params.rotation;
	this.scaleX = params.scaleX;
	this.scaleY = params.scaleY;
	this.alpha = params.alpha;
	this.color = params.color;
	this.visible = params.visible;

	this.ai = params.ai;
	this.health = params.health;
	this.damagePipeline = params.damagePipeline;
	this.enableHealthBar = params.enableHealthBar;
	this.direction = params.direction;
	this.reloadMax = params.reloadMax;

	this.base = params.base;
	this.weapon = params.weapon;
	this.addChild( params.base );
	this.addChild( params.weapon );
	this.base.rotation = this.direction;
	this.weapon.rotation = this.direction;

	this.clock = params.clock;
	this.tweenManager = params.tweenManager;

	// Adjust child position to be on centroid
	this.base.x = -this.base.anchorPointX;
	this.base.y = -this.base.anchorPointY;
	this.weapon.x = -this.weapon.anchorPointX;
	this.weapon.y = -this.weapon.anchorPointY;

	// Construct health bars
	if ( this.enableHealthBar ) {
		this._buildHealthBar();
	}
};


/**
* Constructs a health bar display
* @method _buildHealthBar
* @private
*/
Standoff.Unit.prototype._buildHealthBar = function() {
	var green, red,
		barHeight = 3,
		barLength = 25,
		barRaise = -0.75 * Math.max( this.base.width,
			Math.max( this.base.height,
				Math.max( this.weapon.width, this.weapon.height)));

	green = new Kiwi.Plugins.Primitives.Rectangle( {
			state: this.state,
			width: barLength,
			height: barHeight,
			drawStroke: false,
			color: [ 0.1, 1, 0.1 ],
			visible: false,
			x: -barLength * 0.5,
			y: barRaise,
			anchorPointX: 0
		});
	red = new Kiwi.Plugins.Primitives.Rectangle( {
			state: this.state,
			width: barLength,
			height: barHeight,
			drawStroke: false,
			color: [ 1, 0.1, 0.1 ],
			visible: false,
			x: green.x,
			y: barRaise,
			anchorPointX: barLength,
			scaleX: 0
		});
	this.addChild( green );
	this.addChild( red );
	this.healthBar = {};
	this.healthBar.green = green;
	this.healthBar.red = red;

	// Automate showing the health bar
	this.health.onReceive.add( this.showHealthBar, this );
};


/**
* Temporarily shows the health bar
* @method showHealthBar
* @public
*/
Standoff.Unit.prototype.showHealthBar = function() {
	var tween;

	this.healthBar.green.alpha = 1;
	this.healthBar.red.alpha = 1;
	this.healthBar.green.scaleX = this.health.valueNormalized;
	this.healthBar.red.scaleX = 1 - this.health.valueNormalized;

	tween = this.tweenManager.create( this.healthBar.green );
	tween.to( { alpha: 0 }, 3000, Kiwi.Animations.Tweens.Easing.Linear.Out );
	tween.start();

	tween = this.tweenManager.create( this.healthBar.red );
	tween.to( { alpha: 0 }, 3000, Kiwi.Animations.Tweens.Easing.Linear.Out );
	tween.start();

	// Visibility management
	tween.onUpdate( this.ensureHealthBarVisible, this );
	tween.onComplete( this.ensureHealthBarInvisible, this );
};


/**
* Remove the health bar from view. Used in animations.
* @method ensureHealthBarInvisible
* @public
*/
Standoff.Unit.prototype.ensureHealthBarInvisible = function() {
	this.healthBar.green.visible = false;
	this.healthBar.red.visible = false;
};


/**
* Ensure the health bar is visible. Used in animations.
* @method ensureHealthBarVisible
* @public
*/
Standoff.Unit.prototype.ensureHealthBarVisible = function() {
	this.healthBar.green.visible = true;
	this.healthBar.red.visible = true;
};


/**
* Instructs the unit to die
* @method die
* @public
*/
Standoff.Unit.prototype.die = function() {

	// TODO
	// Play a suitable animation

	this.destroy();

	this.state.units.remove( this );
};


/**
* Does the unit have the tag?
* @method hasTag
* @param tag {String} Tag to match
* @return Boolean
* @public
*/
Standoff.Unit.prototype.hasTag = function( tag ) {
	return ( this.tags.indexOf( tag ) !== -1 );
};


/**
* Does the unit have all the tags in the parameter array?
* Empty array will always match.
* @method hasAllTagsInArray
* @param array {Array} Array of strings
* @return Boolean
* @public
*/
Standoff.Unit.prototype.hasAllTagsInArray = function( array ) {
	var i;

	for ( i = 0; i < array.length; i++ ) {
		if ( !this.hasTag( array[ i ] ) ) {
			return false;
		}
	}
	return true;
};


/**
* Does the unit have none of the tags in the parameter array?
* Empty array will always match.
* @method hasNoTagsInArray
* @param array {Array} Array of strings
* @return Boolean
* @public
*/
Standoff.Unit.prototype.hasNoTagsInArray = function( array ) {
	var i;

	for ( i = 0; i < array.length; i++ ) {
		if ( this.hasTag( array[ i ] ) ) {
			return false;
		}
	}
	return true;
};


/**
* Attacks the nearest unit
* @method attackNearest
* @public
*/
Standoff.Unit.prototype.attackNearest = function() {
	var ang, damage, dist, end, start,
		target = this.state.units.getNearest( {
			unit: this,
			maxRange: 300,
			tagsProhibited: [ this.team ],
			tagsRequired: []
		});
	if ( target !== null) {
		end = new Kiwi.Geom.Point( target.x, target.y );
		start = new Kiwi.Geom.Point( this.x, this.y );
		ang = start.angleTo( end );
		dist = start.distanceTo( end );

		// Aim weapon
		this.weapon.rotation = ang;

		// Fire beam
		this.state.effects.addBeam( {
				start: start,
				end: end,
				duration: dist,
				color: this.color,
				tweenManager: this.state.game.tweens
			} );

		// Empty ammo
		this.reload = 0;

		// Do damage
		damage = new Kiwi.Plugins.DamagePipeline.Pack( {
				value: 20
			} );
		target.damagePipeline.receive( damage );
	}
};
