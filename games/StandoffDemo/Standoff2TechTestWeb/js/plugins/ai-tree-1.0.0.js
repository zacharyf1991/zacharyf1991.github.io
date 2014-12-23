/**
* AI Tree plugin, providing intuitive, powerful AI trees to the designer.
*
* @module Kiwi
* @submodule Plugins
* @namespace Kiwi.Plugins
* @class AiTree
*/
Kiwi.Plugins.AiTree =
{
	name: "AiTree",
	version: "1.0.0"
};
Kiwi.PluginManager.register( Kiwi.Plugins.AiTree );

/**
* Uses various methods to seek the best available time in millis.
* This method uses high precision time, so it is possible to specify
* decimal milliseconds; however this feature is only available in compatible
* browsers.
* @method getTime
* @return {number} Current time in milliseconds
* @public
*/
Kiwi.Plugins.AiTree.getTime = function() {
	if ( window.performance.now ) {
		return window.performance.now();
	}
	if ( window.performance.webkitNow ) {
		return window.performance.webkitNow();
	}
	return ( new Date().getTime() );
};



/**
* AI container component. Create and attach one of these to every
* AI actor.
* @class Ai
* @constructor
* @namespace Kiwi.Plugins.AiTree
* @extends Kiwi.Component
* @param entity {Kiwi.Entity} The entity to which these behaviours belong.
*/
Kiwi.Plugins.AiTree.Ai = function( entity ) {
	Kiwi.Component.call( this, entity, "AiTree" );

	/**
	* The root node of the AI tree, where all decision-making begins.
	* This is the internal value and should not be accessed without
	* also performing the proper rebuilds via this.setRoot().
	* @property _root
	* @type {Kiwi.Plugins.AiTree.OuterNode}
	* @private
	*/
	this._root = undefined;

	/**
	* Master list of all unique child nodes.
	* @property uniqueChildren
	* @type {array}
	* @public
	*/
	this.uniqueChildren = [];

	return this;
};
Kiwi.extend( Kiwi.Plugins.AiTree.Ai, Kiwi.Component );

/**
* The root node of the AI tree, where all decision-making begins.
* @property root
* @type {Kiwi.Plugins.AiTree.OuterNode}
* @public
*/
Object.defineProperty( Kiwi.Plugins.AiTree.Ai.prototype, "root", {
	get: function() {
		return this._root;
	},
	set: function( value ) {
		this.setRoot( value );
	}
} );

/**
* Adds a child to the node tree. Because this base can only have one child,
* the root, this just calls this.setRoot().
* @method addChild
* @param candidate {Kiwi.Plugins.AiTree.OuterNode}
* @return {Kiwi.Plugins.AiTree.OuterNode}
*/
Kiwi.Plugins.AiTree.Ai.prototype.addChild = function( candidate ) {
	return this.setRoot( candidate );
};

/**
* Whether this node has a specific ancestor. Because this cannot have ancestors
* by definition, always returns false.
* @method hasAncestor
* @return {boolean}
*/
Kiwi.Plugins.AiTree.Ai.prototype.hasAncestor = function() {
	return false;
};

/**
* Whether this node has a specific descendant.
* @method hasDescendant
* @param candidate {Kiwi.Plugins.AiTree.OuterNode}
* @return {boolean}
*/
Kiwi.Plugins.AiTree.Ai.prototype.hasDescendant = function( candidate ) {
	var i;

	for ( i = 0; i < this.uniqueChildren.length; i++ ) {
		if ( candidate === this.uniqueChildren[ i ] ) {
			return true;
		}
	}
	return false;
};

/**
* Attaches the root child of the node tree. This function ensures that all
* connections are rebuilt. It is automatically called if "root" is
* accessed directly.
* @method setRoot
* @param candidate {Kiwi.Plugins.AiTree.OuterNode}
* @return {Kiwi.Plugins.AiTree.OuterNode}
*/
Kiwi.Plugins.AiTree.Ai.prototype.setRoot = function( candidate ) {
	if ( candidate !== undefined ) {
		this._root = candidate;
		this.root.addParent( this );
		this.updateCensus();
	}
	return candidate;
};

/**
* Updates the Ai tree and makes decisions. Call this once per frame.
* @method update
* @return {number} A number, a constant referring to the status of the tree.
* @public
*/
Kiwi.Plugins.AiTree.Ai.prototype.update = function() {
	var i,
		status = Kiwi.Plugins.AiTree.OuterNode.prototype.STATUS_ERROR;

	// Reset the tree
	for ( i = 0; i < this.uniqueChildren.length; i++ ) {
		this.uniqueChildren[ i ].reset();
	}

	// Run the tree
	if ( this.root && this.root.update !== undefined ) {
		status = this.root.update();
	}

	return status;
};

/**
* Updates the census, a list of all unique child nodes.
* @method updateCensus
* @return {boolean}
*/
Kiwi.Plugins.AiTree.Ai.prototype.updateCensus = function() {
	var i,
		descendants = this.root.getDescendants();

	this.uniqueChildren = [ this.root ];
	for ( i = 0; i < descendants.length; i++ ) {

		// If a descendant is not yet represented, add it.
		if ( this.uniqueChildren.indexOf( descendants[ i ] ) === -1 ) {
			this.uniqueChildren.push( descendants[ i ] );
		}
	}

	// Return true, which is only returned from the very base of the tree.
	return true ;
};



/**
* Template for all responsive nodes. An Outer Node performs some process
* (usually an action or a condition check)
* then returns a STATUS to its caller. This STATUS dictates the entire
* tree traversal. <br><br>
* All nodes are based on the Outer Node.
* @class OuterNode
* @constructor
* @param params {object} Universal param object
* @param [params.name] {string} Name for the node
* @param [params.runsParent=true] {boolean} Whether the parent inherits running
*/
Kiwi.Plugins.AiTree.OuterNode = function( params ) {

	if ( params == null ) {
		this.params = {};
	}

	/**
	* Optional name for the node. This is not used internally, but is useful
	* for debugging. If it has no value given in params, it takes it
	* from the DEFAULT_NODE_NAME.
	* @property name
	* @type {string}
	* @public
	*/
	this.name = params.name || this.DEFAULT_NODE_NAME;

	/**
	* Status regulates traveral. Inner nodes choose their next action
	* based on the status they receive.
	* @property status
	* @type {number}
	* @public
	*/
	this.status = this.STATUS_READY;

	/**
	* Has the node just returned STATUS_RUNNING?
	* @property runningDirty
	* @type boolean
	* @default false
	* @public
	*/
	this.runningDirty = false;

	/**
	* Does the node pass STATUS_RUNNING up the tree?
	* @property runsParent
	* @type boolean
	* @default true
	* @public
	*/
	this.runsParent = params.runsParent || true;
	
	/**
	* Any parent nodes of this node. A node may have multiple parents,
	* but may not create cyclic graphs.
	* @property parents
	* @type array
	* @public
	*/
	this.parents = [];
	
	return this;
};

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Untitled outer node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.OuterNode.prototype.DEFAULT_NODE_NAME =
	"Untitled outer node";

/**
* Status of a node that has not yet run on this tree traversal.
* @property STATUS_READY
* @type {number}
* @public
* @final
*/
Kiwi.Plugins.AiTree.OuterNode.prototype.STATUS_READY = 0;

/**
* Status of a node that will continue to run on an upcoming tree traversal.
* @property STATUS_RUNNING
* @type {number}
* @public
* @final
*/
Kiwi.Plugins.AiTree.OuterNode.prototype.STATUS_RUNNING = 1;

/**
* Status of a node that has succeeded in its task.
* @property STATUS_SUCCESS
* @type {number}
* @public
* @final
*/
Kiwi.Plugins.AiTree.OuterNode.prototype.STATUS_SUCCESS = 2;

/**
* Status of a node that has failed in its task.
* @property STATUS_FAILURE
* @type {number}
* @public
* @final
*/
Kiwi.Plugins.AiTree.OuterNode.prototype.STATUS_FAILURE = 3;

/**
* Status of a node that has encountered an error.
* @property STATUS_ERROR
* @type {number}
* @public
* @final
*/
Kiwi.Plugins.AiTree.OuterNode.prototype.STATUS_ERROR = 4;

/**
* Adds a parent to this node. Do not call directly. Does not check for cycling.
* @method addParent
* @return {boolean}
* @public
*/
Kiwi.Plugins.AiTree.OuterNode.prototype.addParent =
		function( candidate ) {
	if ( this.parents.indexOf( candidate ) === -1 ) {
		this.parents.push( candidate );
		return true;
	}
	return false;
};

/**
* Customisable stub for Inner Node behaviors.
* @method _onUpdate
* @private
*/
Kiwi.Plugins.AiTree.OuterNode.prototype._onUpdate = function() {

	// Code goes here
};

/**
* Removes a parent from this node. Do not call directly.
* Does not check for cycling.
* @method removeParent
* @return {boolean}
* @public
*/
Kiwi.Plugins.AiTree.OuterNode.prototype.removeParent =
		function( candidate ) {
	var index = this.parents.indexOf( candidate );
	if ( index !== -1 ) {
		this.parents.splice( index, 1 );
		return true;
	}
	return false;
};

/**
* Resets the tree at the end of an update
* @method reset
* @public
*/
Kiwi.Plugins.AiTree.OuterNode.prototype.reset = function() {

	// Running nodes stay running
	// But only if they have run this update
	// A node that doesn't run next update will be clean, and set to READY
	if ( this.status === this.STATUS_RUNNING && this.runningDirty ) {
		this.runningDirty = false;
		return;
	}

	// Log errors before reset
	if ( this.status === this.STATUS_ERROR ) {
		console.log( "Error detected in " + this.name, this );
	}

	this.status = this.STATUS_READY;
};

/**
* Customisable stub for Outer Node behaviours.
* Override this method to create your own custom behaviours.
* @method _run
* @private
*/
Kiwi.Plugins.AiTree.OuterNode.prototype._run = function() {

	// Code goes here
};

/**
* Runs node functionality. Returns status. Do not override this function;
* use _run() to define user code.
* @method update
* @public
*/
Kiwi.Plugins.AiTree.OuterNode.prototype.update = function() {
	this._onUpdate();
	this._run();
	if ( this.status === this.STATUS_RUNNING ) {
		this.runningDirty = true;
	} else {
		this.runningDirty = false;
	}
	return this.status;
};

// Update Census
// Blind signal to update the master tree census
// Returns True when it gets to the master tree to facilitate fast completion
// This is called automatically when necessary
/**
* Updates the tree census. This is just a signal which activates the root
* Kiwi.Plugins.AiTree.Ai object census method.
* @method updateCensus
* @public
*/
Kiwi.Plugins.AiTree.OuterNode.prototype.updateCensus = function() {
	var i, response;

	for ( i = 0; i < this.parents.length; i++ ) {
		response = this.parents[ i ].updateCensus();
		if ( response ) {
			return true;
		}
	}
	return false;
};


// Inner Node
// A template for the inner nodes that facilitate tree traversal.
/**
* Inner Nodes are templates for the inner nodes that facilitate tree traveral.
* @class InnerNode
* @constructor
* @extends Kiwi.Plugins.AiTree.OuterNode
* @param params {object} Generic parameter object
* @param [params.name] {string} Name of the node
* @param [params.shuffle] {boolean} Whether the node will shuffle its children.
* @param [params.runsParent=false] {boolean} Whether the parent inherits running
*/
Kiwi.Plugins.AiTree.InnerNode = function( params ) {

	// Super
	Kiwi.Plugins.AiTree.OuterNode.call( this, params );

	/**
	* The child nodes of this node.
	* @property children
	* @type array
	* @public
	*/
	this.children = [];

	/**
	* If the node has a running child, it is tracked here.
	* @property currentlyRunningNode
	* @type {Kiwi.Plugins.AiTree.OuterNode}
	* @default undefined
	* @public
	*/
	this.currentlyRunningNode = undefined;

	/**
	* Whether the node shuffles its children every update.
	* @property shuffle
	* @type boolean
	* @default false
	* @public
	*/
	this.shuffle = params.shuffle || false;

	this.runsParent = params.runsParent || false;
	
	return this;
};
Kiwi.extend( Kiwi.Plugins.AiTree.InnerNode,
	Kiwi.Plugins.AiTree.OuterNode );

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Untitled inner node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.InnerNode.prototype.DEFAULT_NODE_NAME =
	"Untitled inner node";

/**
* Passes a child node as candidate for inclusion.
* Checks for validity; a child cannot be its own parent or ancestor.
* Candidate is only appended if it is legal.
* @method addChild
* @param candidate {Kiwi.Plugins.AiTree.OuterNode} Node to add as child
* @return boolean
* @public
*/
Kiwi.Plugins.AiTree.InnerNode.prototype.addChild = function( candidate ) {

	// Sanitise inputs: avoid null or duplicate entries
	if ( candidate == null || this.children.indexOf( candidate ) !== -1 ) {
		return false;
	}

	// Cycling check
	if ( this.hasAncestor( candidate ) || this === candidate )
	{
		return false;
	}

	// Accept legal candidates
	this.children.push( candidate );
	candidate.addParent( this );
	this.updateCensus();

	// Signal legal success
	return true;
};

/**
* Returns all children and subsequent children. Does not eliminate duplicates.
* @method getDescendants
* @return {array} List of all descendant nodes
* @public
*/
Kiwi.Plugins.AiTree.InnerNode.prototype.getDescendants = function() {
	var i,
		descendants = [];

	for ( i = 0; i < this.children.length; i++ ) {
		descendants.push( this.children[ i ] );
		if ( this.children[ i ].getDescendants ) {
			descendants = descendants.concat(
				this.children[ i ].getDescendants() );
		}
	}
	return descendants;
};

/**
* Recursive search for a particular node.
* A node counts as its own ancestor.
* @method hasAncestor
* @param candidate {Kiwi.Plugins.AiTree.OuterNode} Node to find
* @return boolean
* @public
*/
Kiwi.Plugins.AiTree.InnerNode.prototype.hasAncestor =
		function( candidate ) {
	var i, result;

	if ( this === candidate ) {
		return true;
	}
	for ( i = 0; i < this.parents.length; i++ )
	{
		result = this.parents[ i ].hasAncestor( candidate );
		if ( result ) {
			return true;
		}
	}
	return false;
};

/**
* Returns whether a particular node is beneath this node.
* @method hasDescendant
* @param candidate {Kiwi.Plugins.AiTree.OuterNode} Node to find
* @return boolean
* @public
*/
Kiwi.Plugins.AiTree.InnerNode.hasDescendant = function( candidate ) {
	var i,
		descendants = this.getDescendants();

	for ( i = 0; i < descendants.length; i++ ) {
		if ( candidate === descendants[ i ] ) {
			return true;
		}
	}
	return false;
};

/**
* Shared inner node functions
* @method _onUpdate
* @private
*/
Kiwi.Plugins.AiTree.InnerNode.prototype._onUpdate = function()
{
	if ( this.shuffle ) {
		this.shuffleChildren();
	}
};

/**
* Removes a child of this node, if it exists.
* @method removeChild
* @param candidate {Kiwi.Plugins.AiTree.OuterNode} Node to remove
* @return boolean
* @public
*/
Kiwi.Plugins.AiTree.InnerNode.prototype.removeChild =
		function( candidate ) {

	// Deregister childhood
	var index = this.children.indexOf( candidate );
	if ( index !== -1 ) {
		this.children.splice( index, 1 );

		// Deregister parenthood, ignoring returns because it's never a parent
		candidate.removeParent( this );

		this.updateCensus();
		return true;
	}
	return false;
};

/** 
* Reorders the child array to create a random output.
* @method shuffleChildren
* @public
*/
Kiwi.Plugins.AiTree.InnerNode.prototype.shuffleChildren = function() {
	var i,
		newChildren = [];
	while ( 0 < this.children.length ) {
		i = Math.floor( Math.random() * this.children.length );
		newChildren.push( this.children[ i ] );
		this.children.splice( i, 1 );
	}
	this.children = newChildren;
};



/**
* Inner node. Tries to execute a sequence. Steps through children one by one.
* <br><br>
* If it reaches the end, it returns STATUS_SUCCESS.
* <br><br>
* If it receives STATUS_FAILURE it returns STATUS_FAILURE.
* <br><br>
* If it receives STATUS_RUNNING it returns STATUS_RUNNING
* and resumes from that node on the next update.
* @class Sequencer
* @constructor
* @extends Kiwi.Plugins.AiTree.InnerNode
* @param params {object} Generic parameter object
* @param [params.name] {string} Name of the node
* @param [params.shuffle] {boolean} Whether the node will shuffle its children
*/
Kiwi.Plugins.AiTree.Sequencer = function( params )
{
	// Inherit from Inner Node
	Kiwi.Plugins.AiTree.InnerNode.call( this, params );
	
	return this;
};
Kiwi.extend( Kiwi.Plugins.AiTree.Sequencer,
	Kiwi.Plugins.AiTree.InnerNode );

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Sequencer inner node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.Sequencer.prototype.DEFAULT_NODE_NAME =
	"Sequencer inner node";

/**
* Node functionality, called once per update.
* @method _run
* @private
*/
Kiwi.Plugins.AiTree.Sequencer.prototype._run = function() {
	var i, output, runningIndex,
		start = 0;

	// Skip straight to running node
	if ( this.currentlyRunningNode !== undefined ) {
		runningIndex = this.children.indexOf( this.currentlyRunningNode );
		if ( runningIndex !== -1 ) {
			start = runningIndex;
		}
	}

	for ( i = start; i < this.children.length; i++ ) {

		// Run child
		output = this.children[ i ].update();

		if ( output === this.STATUS_RUNNING ) {
			if ( this.children[ i ].runsParent ) {

				// The child is still running, so this node is running too
				this.status = this.STATUS_RUNNING;
				this.currentlyRunningNode = this.children[ i ];
			} else {

				// The child does not compel this node to run
				this.status = this.STATUS_SUCCESS;
				this.currentlyRunningNode = undefined;
			}
			return;
		} else {
			this.currentlyRunningNode = undefined;
		}

		if ( output === this.STATUS_FAILURE ) {
			this.status = this.STATUS_FAILURE;
			return;
		}
	}

	// No significant results? Then this pass finishes as a success.
	this.currentlyRunningNode = undefined;
	this.status = this.STATUS_SUCCESS;
};



/**
* Inner node. Tries to find a successful node. Steps through children.
* <br><br>
* If it receives STATUS_SUCCESS, it returns STATUS_SUCCESS.
* <br><br>
* If it reaches the end, it returns STATUS_FAILURE.
* <br><br>
* If it receives STATUS_RUNNING it returns STATUS_RUNNING
* and resumes from that node on the next update.
* @class Selector
* @constructor
* @extends Kiwi.Plugins.AiTree.InnerNode
* @param params {object} Generic parameter object
* @param [params.name] {string} Name of the node
* @param [params.shuffle] {boolean} Whether the node will shuffle its children
*/
Kiwi.Plugins.AiTree.Selector = function( params ) {
	Kiwi.Plugins.AiTree.InnerNode.call( this, params );
	
	return this;
};
Kiwi.extend( Kiwi.Plugins.AiTree.Selector,
	Kiwi.Plugins.AiTree.InnerNode );

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Selector inner node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.Selector.prototype.DEFAULT_NODE_NAME =
	"Selector inner node";

/**
* Node functionality, called once per update.
* @method _run
* @private
*/
Kiwi.Plugins.AiTree.Selector.prototype._run = function() {
	var i, output, runningIndex,
		start = 0;

	// Skip straight to running node
	if ( this.currentlyRunningNode !== undefined ) {
		runningIndex = this.children.indexOf( this.currentlyRunningNode );
		if ( runningIndex !== -1 ) {
			start = runningIndex;
		}
	}

	for ( i = start; i < this.children.length; i++ ) {

		// Run child
		output = this.children[ i ].update();

		if ( output === this.STATUS_RUNNING ) {
			if ( this.children[ i ].runsParent ) {

				// The child is still running, so this node is running too
				this.status = this.STATUS_RUNNING;
				this.currentlyRunningNode = this.children[ i ];
			} else {

				// The child does not compel this node to run
				this.status = this.STATUS_SUCCESS;
				this.currentlyRunningNode = undefined;
			}
			return;
		} else {
			this.currentlyRunningNode = undefined;
		}

		if ( output === this.STATUS_SUCCESS ) {
			this.status = this.STATUS_SUCCESS;
			return;
		}
	}

	// No significant results? Then this pass finishes as a failure.
	this.currentlyRunningNode = undefined;
	this.status = this.STATUS_FAILURE;
};



/**
* Inner node. Tries to repeat a sequence indefinitely.
* <br><br>
* If it receives STATUS_FAILURE it returns STATUS_SUCCESS.
* <br><br>
* If it receives STATUS_RUNNING it returns STATUS_RUNNING
* and resumes from that node on the next update.
* <br><br>
* CAUTION: This node can loop indefinitely.
* Be sure to provide an escape condition.
* @class UntilFailure
* @constructor
* @extends Kiwi.Plugins.AiTree.InnerNode
* @param params {object} Generic parameter object
* @param [params.name] {string} Name of the node
* @param [params.shuffle] {boolean} Whether the node will shuffle its children
*/
Kiwi.Plugins.AiTree.UntilFailure = function( params ) {
	Kiwi.Plugins.AiTree.InnerNode.call( this, params );
	
	return( this );
};
Kiwi.extend( Kiwi.Plugins.AiTree.UntilFailure,
	Kiwi.Plugins.AiTree.InnerNode );

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Until Failure inner node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.UntilFailure.prototype.DEFAULT_NODE_NAME =
	"Until Failure inner node";

/**
* Node functionality, called once per update.
* @method _run
* @private
*/
Kiwi.Plugins.AiTree.UntilFailure.prototype._run = function() {
	var i, output, runningIndex,
		start = 0;

	// Skip straight to running node
	if ( this.currentlyRunningNode !== undefined ) {
		runningIndex = this.children.indexOf( this.currentlyRunningNode );
		if ( runningIndex !== -1 ) {
			start = runningIndex;
		}
	}

	i = start;

	while ( 0 < this.children.length ) {

		// Run child
		output = this.children[ i ].update();

		if ( output === this.STATUS_RUNNING ) {
			if ( this.children[ i ].runsParent ) {

				// The child is still running, so this node is running too
				this.status = this.STATUS_RUNNING;
				this.currentlyRunningNode = this.children[ i ];
			} else {

				// The child does not compel this node to run
				this.status = this.STATUS_SUCCESS;
				this.currentlyRunningNode = undefined;
			}
			return;
		} else {
			this.currentlyRunningNode = undefined;
		}

		if ( output === this.STATUS_FAILURE ) {
			this.status = this.STATUS_SUCCESS;
			return;
		}

		i++;
		if ( this.children.length <= i ) {
			i = 0;
		}
	}
};



/**
* Inner node. Tries to find a success, indefinitely.
* <br><br>
* If it receives STATUS_SUCCESS, it returns STATUS_SUCCESS.
* <br><br>
* If it receives STATUS_RUNNING it returns STATUS_RUNNING
* and resumes from that node on the next update.
* <br><br>
* CAUTION: This node can loop indefinitely.
* Be sure to provide an escape condition.
* @class UntilSuccess
* @constructor
* @extends Kiwi.Plugins.AiTree.InnerNode
* @param params {object} Generic parameter object
* @param [params.name] {string} Name of the node
* @param [params.shuffle] {boolean} Whether the node will shuffle its children
*/
Kiwi.Plugins.AiTree.UntilSuccess = function( params ) {
	Kiwi.Plugins.AiTree.InnerNode.call( this, params );
	
	return( this );
};
Kiwi.extend( Kiwi.Plugins.AiTree.UntilSuccess,
	Kiwi.Plugins.AiTree.InnerNode );

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Until Success inner node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.UntilSuccess.prototype.DEFAULT_NODE_NAME =
	"Until Success inner node";

/**
* Node functionality, called once per update.
* @method _run
* @private
*/
Kiwi.Plugins.AiTree.UntilSuccess.prototype._run = function() {
	var i, output, runningIndex,
		start = 0;

	// Skip straight to running node
	if ( this.currentlyRunningNode !== undefined ) {
		runningIndex = this.children.indexOf( this.currentlyRunningNode );
		if ( runningIndex !== -1 ) {
			start = runningIndex;
		}
	}

	i = start;

	while ( 0 < this.children.length ) {

		// Run child
		output = this.children[ i ].update();

		if ( output === this.STATUS_RUNNING ) {
			if ( this.children[ i ].runsParent ) {

				// The child is still running, so this node is running too
				this.status = this.STATUS_RUNNING;
				this.currentlyRunningNode = this.children[ i ];
			} else {

				// The child does not compel this node to run
				this.status = this.STATUS_SUCCESS;
				this.currentlyRunningNode = undefined;
			}
			return;
		} else {
			this.currentlyRunningNode = undefined;
		}

		if ( output === this.STATUS_SUCCESS ) {
			this.status = this.STATUS_SUCCESS;
			return;
		}

		i++;
		if ( this.children.length <= i ) {
			i = 0;
		}
	}
};



/**
* Inner node. Runs over and over for a specific duration.
* This is useful for scheduling advanced tasks that are not expected
* to finish quickly, but do reach an acceptable approximation quickly.
* <br><br>
* If it receives STATUS_RUNNING it returns STATUS_RUNNING
* and resumes from that node on the next update.
* <br><br>
* Returns STATUS_SUCCESS when time runs out.
* @class TimeLoop
* @constructor
* @extends Kiwi.Plugins.AiTree.InnerNode
* @param params {object} Generic parameter object
* @param [params.name] {string} Name of the node
* @param [params.shuffle] {boolean} Whether the node will shuffle its children
* @param [params.timerDuration=5] {number} How long the node runs,
* in milliseconds
*/
Kiwi.Plugins.AiTree.TimeLoop = function( params )
{
	Kiwi.Plugins.AiTree.InnerNode.call( this, params );

	/**
	* Timer duration in milliseconds
	* @property timerDuration
	* @type number
	* @default 5
	* @public
	*/
	this.timerDuration = params.timerDuration || 5;

	return this;
};
Kiwi.extend( Kiwi.Plugins.AiTree.TimeLoop,
	Kiwi.Plugins.AiTree.InnerNode );

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Time Loop inner node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.TimeLoop.prototype.DEFAULT_NODE_NAME =
	"Time Loop inner node";

/**
* Node functionality, called once per update.
* @method _run
* @private
*/
Kiwi.Plugins.AiTree.TimeLoop.prototype._run = function() {
	var output,
		i = 0,
		endTime = Kiwi.Plugins.AiTree.getTime() + this.timerDuration;

	// Resume running node
	if ( this.currentlyRunningNode !== undefined ) {
		var runningIndex = this.children.indexOf( this.currentlyRunningNode );
		if ( runningIndex !== -1 ) {
			i = runningIndex;
		}
	}

	while ( Kiwi.Plugins.AiTree.getTime() < endTime ) {
		output = this.children[ i ].update();
		if ( output === this.STATUS_RUNNING ) {
			if ( this.children[ i ].runsParent ) {

				// The child is still running, so this node is running too
				this.status = this.STATUS_RUNNING;
				this.currentlyRunningNode = this.children[ i ];
			} else {

				// The child does not compel this node to run
				this.status = this.STATUS_SUCCESS;
				this.currentlyRunningNode = undefined;
			}
			return;
		}

		i++;
		if ( i >= this.children.length ) {
			i = 0;
		}
	}
	this.status = this.STATUS_SUCCESS;
};



/**
* Inner node. Runs over and over for a specific duration.
* Unlike TimeLoop, it returns if it encounters a failure.
* This is useful for scheduling advanced tasks that are not expected
* to finish quickly, but might need to stop.
* <br><br>
* If it receives STATUS_RUNNING it returns STATUS_RUNNING
* and resumes from that node on the next update.
* <br><br>
* If it receives STATUS_FAILURE it returns STATUS_FAILURE.
* <br><br>
* Returns STATUS_SUCCESS when time runs out.
* @class TimeTrial
* @constructor
* @extends Kiwi.Plugins.AiTree.InnerNode
* @param params {object} Generic parameter object
* @param [params.name] {string} Name of the node
* @param [params.shuffle] {boolean} Whether the node will shuffle its children
* @param [params.timerDuration=5] {number} How long the node runs,
* in milliseconds
*/
Kiwi.Plugins.AiTree.TimeTrial = function( params )
{
	Kiwi.Plugins.AiTree.InnerNode.call( this, params );

	/**
	* Timer duration in milliseconds
	* @property timerDuration
	* @type number
	* @default 5
	* @public
	*/
	this.timerDuration = params.timerDuration || 5;

	return this;
};
Kiwi.extend( Kiwi.Plugins.AiTree.TimeTrial,
	Kiwi.Plugins.AiTree.InnerNode );

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Time Trial inner node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.TimeTrial.prototype.DEFAULT_NODE_NAME =
	"Time Trial inner node";

/**
* Node functionality, called once per update.
* @method _run
* @private
*/
Kiwi.Plugins.AiTree.TimeTrial.prototype._run = function() {
	var output,
		i = 0,
		endTime = Kiwi.Plugins.AiTree.getTime() + this.timerDuration;

	// Resume running node
	if ( this.currentlyRunningNode !== undefined ) {
		var runningIndex = this.children.indexOf( this.currentlyRunningNode );
		if ( runningIndex !== -1 ) {
			i = runningIndex;
		}
	}

	while ( Kiwi.Plugins.AiTree.getTime() < endTime ) {
		output = this.children[ i ].update();
		if ( output === this.STATUS_RUNNING ) {
			if ( this.children[ i ].runsParent ) {

				// The child is still running, so this node is running too
				this.status = this.STATUS_RUNNING;
				this.currentlyRunningNode = this.children[ i ];
			} else {

				// The child does not compel this node to run
				this.status = this.STATUS_SUCCESS;
				this.currentlyRunningNode = undefined;
			}
			return;
		}

		if ( output === this.STATUS_FAILURE ) {
			this.status = this.STATUS_FAILURE;
			return;
		}

		i++;
		if ( i >= this.children.length ) {
			i = 0;
		}
	}
	this.status = this.STATUS_SUCCESS;
};



/**
* Inner node. Inverts its child.
* <br><br>
* If it receives STATUS_SUCCESS it returns STATUS_FAILURE.
* <br><br>
* If it receives STATUS_FAILURE it returns STATUS_SUCCESS.
* <br><br>
* If it receives STATUS_RUNNING it returns STATUS_RUNNING.
* <br><br>
* If it has no children it returns STATUS_FAILURE. It can only have one child,
* and will replace it if another is added.
* @class Inverter
* @constructor
* @extends Kiwi.Plugins.AiTree.InnerNode
* @param params {object} Generic parameter object
* @param [params.name] {string} Name of the node
* @param [params.shuffle] {boolean} Whether the node will shuffle its children
*/
Kiwi.Plugins.AiTree.Inverter = function( params )
{
	Kiwi.Plugins.AiTree.InnerNode.call( this, params );

	return this;
};
Kiwi.extend( Kiwi.Plugins.AiTree.Inverter,
	Kiwi.Plugins.AiTree.InnerNode );

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Inverter inner node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.Inverter.prototype.DEFAULT_NODE_NAME =
	"Inverter inner node";

/**
* Node functionality, called once per update.
* @method _run
* @private
*/
Kiwi.Plugins.AiTree.Inverter.prototype._run = function() {
	var output;

	if ( this.children.length === 0 ) {
		this.status = this.STATUS_FAILURE;
		return;
	}

	output = this.children[ 0 ].update();

	if ( output === this.STATUS_RUNNING ) {
		if ( this.children[ i ].runsParent ) {

			// The child is still running, so this node is running too
			this.status = this.STATUS_RUNNING;
			this.currentlyRunningNode = this.children[ i ];
		} else {

			// The child does not compel this node to run
			this.status = this.STATUS_SUCCESS;
			this.currentlyRunningNode = undefined;
		}
		return;
	}

	if ( output === this.STATUS_FAILURE ) {
		this.status = this.STATUS_SUCCESS;
		return;
	}

	this.status = this.STATUS_FAILURE;
};

/**
* Passes a child node as candidate for inclusion.
* Checks for validity; a child cannot be its own parent or ancestor.
* Candidate is only appended if it is legal.
* Inverter nodes can only have one child, and replace old children
* if new ones are added.
* @method addChild
* @param candidate {Kiwi.Plugins.AiTree.OuterNode} Node to add as child
* @return boolean
* @public
*/
Kiwi.Plugins.AiTree.Inverter.prototype.addChild = function( candidate ) {
	var success;

	success = Kiwi.Plugins.AiTree.InnerNode.prototype.addChild.call(
		this, candidate );

	if ( success ) {
		while ( this.children.length > 1 ) {
			this.removeChild( this.children[ 0 ] );
		}
	}

	return success;
};



/**
* Very simple outer node that always returns STATUS_SUCCESS.
* This can be useful for controlling sophisticated behaviours.
* For example, if you use a Selector to perform one of a series of tasks,
* none of which are guaranteed to return success, but you want the Selector
* to always succeed, you can add a Success node to the end.
* @class Success
* @constructor
* @extends Kiwi.Plugins.AiTree.OuterNode
* @param params {object} Generic parameter object
* @param [params.name] {string} Name of the node
*/
Kiwi.Plugins.AiTree.Success = function( params ) {
	Kiwi.Plugins.AiTree.OuterNode.call( this, params );

	return this;
};
Kiwi.extend( Kiwi.Plugins.AiTree.Success, Kiwi.Plugins.AiTree.OuterNode );

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Success outer node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.Success.prototype.DEFAULT_NODE_NAME = "Success outer node";

/**
* Node functionality
* @method _run
* @private
*/
Kiwi.Plugins.AiTree.Success.prototype._run = function() {
	this.status = this.STATUS_SUCCESS;
};



/**
* Very simple outer node that always returns STATUS_FAILURE.
* This can be useful for controlling sophisticated behaviours.
* For example, if you use a Sequencer to perform a series of tasks,
* but would like the Sequencer to fail for reasons of flow control,
* you can add a Failure node to the end.
* @class Failure
* @constructor
* @extends Kiwi.Plugins.AiTree.OuterNode
* @param params {object} Generic parameter object
* @param [params.name] {string} Name of the node
*/
Kiwi.Plugins.AiTree.Failure = function( params ) {

	Kiwi.Plugins.AiTree.OuterNode.call( this, params );

	return this;
};
Kiwi.extend( Kiwi.Plugins.AiTree.Failure, Kiwi.Plugins.AiTree.OuterNode );

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Failure outer node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.Failure.prototype.DEFAULT_NODE_NAME = "Failure outer node";

/**
* Node functionality
* @method _run
* @private
*/
Kiwi.Plugins.AiTree.Failure.prototype._run = function() {
	this.status = this.STATUS_FAILURE;
};



/**
* Counter outer node. This node counts to a maximum value.
* <br><br>
* The node increments its counter by 1 and returns STATUS_FAILURE.
* <br><br>
* If the node reaches its maximum, it instead returns STATUS_SUCCESS.
* <br><br>
* This node is very useful for causing an UntilSuccess or UntilFailure node
* to finish after a certain number of repetitions.
* @class Counter
* @constructor
* @extends Kiwi.Plugins.AiTree.OuterNode
* @param params {object} Generic parameter object
* @param [params.name] {string} Name of the node
* @param [params.max=1] {number} Number to which to count
*/
Kiwi.Plugins.AiTree.Counter = function( params ) {

	Kiwi.Plugins.AiTree.OuterNode.call( this, params );

	/**
	* The number of times this node will run before succeeding
	* @property max
	* @type number
	* @default 1
	* @public
	*/
	this.max = params.max || 1;

	/**
	* The current count
	* @property count
	* @type number
	* @default 0
	* @public
	*/
	this.count = 0;

	/**
	* Whether the node will reset on ready, or only on completion.
	* @property resetOnReady
	* @type boolean
	* @default false
	* @public
	*/
	this.resetOnReady = params.resetOnReady || false;

	return this;
};
Kiwi.extend( Kiwi.Plugins.AiTree.Counter, Kiwi.Plugins.AiTree.OuterNode );

/**
* Default node name.
* @property DEFAULT_NODE_NAME
* @default "Counter outer node"
* @type {string}
* @public
* @final
*/
Kiwi.Plugins.AiTree.Counter.prototype.DEFAULT_NODE_NAME = "Counter outer node";

/**
* Node functionality
* @method _run
* @private
*/
Kiwi.Plugins.AiTree.Counter.prototype._run = function() {

	// Reset the node
	if ( this.status === this.STATUS_READY && this.resetOnReady ) {
		this.count = 0;
	}

	this.count++;

	if ( this.count < this.max ) {
		this.status = this.STATUS_FAILURE;
		return;
	}

	this.count = 0;
	this.status = this.STATUS_SUCCESS;
};
