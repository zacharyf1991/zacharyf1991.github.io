var Standoff = Standoff || {};

/**
* @module Standoff
* @submodule UnitAi
*/

Standoff.UnitAi = {};



/**
* @class MoveForward
* @constructor
* @param params {Object} Composite parameter object
*/
Standoff.UnitAi.MoveForward = function( params ) {
	Kiwi.Plugins.AiTree.OuterNode.call( this, params );

	this.entity = params.entity;
	this.speed = params.speed;
};
Kiwi.extend( Standoff.UnitAi.MoveForward, Kiwi.Plugins.AiTree.OuterNode );

Standoff.UnitAi.MoveForward.prototype.DEFAULT_NODE_NAME =
	"Action: Move Forward";

Standoff.UnitAi.MoveForward.prototype._run = function() {

	this.entity.x += this.speed * Math.cos( this.entity.direction ) *
		this.entity.game.time.rate;
	this.entity.y += this.speed * Math.sin( this.entity.direction ) *
		this.entity.game.time.rate;

	this.entity.base.rotation = this.entity.direction;

	this.status = this.STATUS_SUCCESS;
};


/**
* @class AvoidLeft
* @constructor
* @param params {Object} Composite parameter object
*/
Standoff.UnitAi.AvoidLeft = function( params ) {
	Kiwi.Plugins.AiTree.OuterNode.call( this, params );

	this.entity = params.entity;
};
Kiwi.extend( Standoff.UnitAi.AvoidLeft, Kiwi.Plugins.AiTree.OuterNode );

Standoff.UnitAi.AvoidLeft.prototype.DEFAULT_NODE_NAME =
	"Action: Avoid Left";

Standoff.UnitAi.AvoidLeft.prototype._run = function() {
	var dx, dy;

	if ( this.entity.x < 0 ) {

		// Ensure direction is pointing right
		// Potentially inefficient bruteforce method
		dx = Math.cos( this.entity.direction );
		dy = Math.sin( this.entity.direction );
		if ( dx < 0 ) {
			dx = -dx;
			this.entity.direction = Math.atan2( dy, dx );
		}
	}
	
	this.status = this.STATUS_SUCCESS;
};


/**
* @class AvoidRight
* @constructor
* @param params {Object} Composite parameter object
*/
Standoff.UnitAi.AvoidRight = function( params ) {
	Kiwi.Plugins.AiTree.OuterNode.call( this, params );

	this.entity = params.entity;
};
Kiwi.extend( Standoff.UnitAi.AvoidRight, Kiwi.Plugins.AiTree.OuterNode );

Standoff.UnitAi.AvoidRight.prototype.DEFAULT_NODE_NAME =
	"Action: Avoid Right";

Standoff.UnitAi.AvoidRight.prototype._run = function() {
	var dx, dy;

	if ( this.entity.x > this.entity.state.game.stage.width ) {

		// Ensure direction is pointing left
		// Potentially inefficient bruteforce method
		dx = Math.cos( this.entity.direction );
		dy = Math.sin( this.entity.direction );
		if ( dx > 0 ) {
			dx = -dx;
			this.entity.direction = Math.atan2( dy, dx );
		}
	}
	
	this.status = this.STATUS_SUCCESS;
};


/**
* @class AvoidTop
* @constructor
* @param params {Object} Composite parameter object
*/
Standoff.UnitAi.AvoidTop = function( params ) {
	Kiwi.Plugins.AiTree.OuterNode.call( this, params );

	this.entity = params.entity;
};
Kiwi.extend( Standoff.UnitAi.AvoidTop, Kiwi.Plugins.AiTree.OuterNode );

Standoff.UnitAi.AvoidTop.prototype.DEFAULT_NODE_NAME =
	"Action: Avoid Top";

Standoff.UnitAi.AvoidTop.prototype._run = function() {
	var dx, dy;

	if ( this.entity.y < 0 ) {

		// Ensure direction is pointing down
		// Potentially inefficient bruteforce method
		dx = Math.cos( this.entity.direction );
		dy = Math.sin( this.entity.direction );
		if ( dy < 0 ) {
			dy = -dy;
			this.entity.direction = Math.atan2( dy, dx );
		}
	}
	
	this.status = this.STATUS_SUCCESS;
};


/**
* @class AvoidBottom
* @constructor
* @param params {Object} Composite parameter object
*/
Standoff.UnitAi.AvoidBottom = function( params ) {
	Kiwi.Plugins.AiTree.OuterNode.call( this, params );

	this.entity = params.entity;
};
Kiwi.extend( Standoff.UnitAi.AvoidBottom, Kiwi.Plugins.AiTree.OuterNode );

Standoff.UnitAi.AvoidBottom.prototype.DEFAULT_NODE_NAME =
	"Action: Avoid Bottom";

Standoff.UnitAi.AvoidBottom.prototype._run = function() {
	var dx, dy;

	if ( this.entity.y > this.entity.state.game.stage.height ) {

		// Ensure direction is pointing left
		// Potentially inefficient bruteforce method
		dx = Math.cos( this.entity.direction );
		dy = Math.sin( this.entity.direction );
		if ( dy > 0 ) {
			dy = -dy;
			this.entity.direction = Math.atan2( dy, dx );
		}
	}
	
	this.status = this.STATUS_SUCCESS;
};
