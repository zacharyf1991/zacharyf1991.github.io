var Standoff = Standoff || {};

/**
* @module Standoff
*/

/**
* @class UnitSelector
* @constructor
*/
Standoff.UnitSelector = function() {

	/**
	* List of all units that can be selected
	* @property units
	* @type Array
	* @public
	*/
	this.units = [];
};


/**
* @method add
* @param unit {Standoff.Unit} Unit to add
* @public
*/
Standoff.UnitSelector.prototype.add = function( unit ) {
	if ( this.units.indexOf( unit ) === -1 ) {
		this.units.push( unit );
	}
};


/**
* @method remove
* @param unit {Standoff.Unit} Unit to remove
* @public
*/
Standoff.UnitSelector.prototype.remove = function( unit ) {
	var i = this.units.indexOf( unit );
	if ( i === -1 ) {
		this.units.splice( i, 1 );
	}
};


/**
* @method getNearest
* @param params {Object} Composite parameter object
*	@param params.unit {Standoff.Unit} Unit making request
*	@param params.maxRange {Number} Maximum allowable range
*	@param params.tagsRequired {Array} Array of strings required on all
*		valid targets
*	@param params.tagsProhibited {Array} Array of strings that cannot be
*		on valid targets
*	@param params.tagsPriority {Array} Array of strings representing valid
*		targets in order of priority
* @public
*/
Standoff.UnitSelector.prototype.getNearest = function( params ) {
	var i, dist, dx, dy, unit,
		candidateDistance = Infinity,
		candidateIndex = -1;

	for ( i = 0; i < this.units.length; i++ ) {
		unit = this.units[ i ];
		if ( unit !== params.unit &&
				unit.exists &&
				unit.hasAllTagsInArray( params.tagsRequired ) &&
				unit.hasNoTagsInArray( params.tagsProhibited ) ) {
			dx = unit.x - params.unit.x;
			dy = unit.y - params.unit.y;
			dist = Math.sqrt( dx * dx + dy * dy );
			if ( dist < candidateDistance && dist < params.maxRange ) {
				candidateDistance = dist;
				candidateIndex = i;
			}
		}
	}

	if ( candidateIndex !== -1 ) {
		return this.units[ candidateIndex ];
	}
	return null;
};
