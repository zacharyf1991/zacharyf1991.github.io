var Standoff = Standoff || {};

Standoff.stateBattle = new Kiwi.State( "State Battle" );

Standoff.stateBattle.preload = function() {
	Kiwi.State.prototype.preload.call( this );
};

Standoff.stateBattle.create = function() {
	var i, testUnit,
		testPopulation = 25;

	Kiwi.State.prototype.create.call( this );

	// TODO

	// Create clocks for world and ui

	// Universal Unit Selector
	this.units = new Standoff.UnitSelector();

	// Create scenery
	this.game.stage.color = "F0E0C0";

	// Populate test world

	// Create blue team
	for ( i = 0; i < testPopulation; i++ ) {
		testUnit = new Standoff.Unit( {
				state: this,
				x: Math.random() * 0.25 * this.game.stage.width,
				y: Math.random() * this.game.stage.height,
				direction: 0 + Math.random() - 0.5,
				color: [ 0.1, 0.1, 0.9 ],
				team: "teamBlue"
			} );
		testUnit.ai = this.makeAi( testUnit, 1 );

		this.addChild( testUnit );
		this.units.add( testUnit );
	}
	// Create red team
	for ( i = 0; i < testPopulation; i++ ) {
		testUnit = new Standoff.Unit( {
				state: this,
				x: ( Math.random() * 0.25 + 0.75 ) * this.game.stage.width,
				y: Math.random() * this.game.stage.height,
				direction: Math.PI+ Math.random() - 0.5,
				color: [ 0.9, 0.1, 0.1 ],
				team: "teamRed"
			} );
		testUnit.ai = this.makeAi( testUnit, 1 );

		this.addChild( testUnit );
		this.units.add( testUnit );
	}

	// Create effects manager
	this.effects = new Standoff.EffectsManager( this );
};

Standoff.stateBattle.update = function() {
	var i;

	Kiwi.State.prototype.update.call( this );

	// TODO

	// Update units
	// for ( i = 0; i < this.members.length; i++ ) {
	// 	this.members[i].rotation += 0.01;
	// }
};




Standoff.stateBattle.makeAi = function( entity, speed ) {
	var ai = new Kiwi.Plugins.AiTree.Ai( this ),
		move = new Kiwi.Plugins.AiTree.Sequencer( {
				name: "SEL: Move"
			} ),
		moveForward = new Standoff.UnitAi.MoveForward( {
				entity: entity,
				speed: speed
			} ),
		avoidLeft = new Standoff.UnitAi.AvoidLeft( {
				entity: entity
			}),
		avoidRight = new Standoff.UnitAi.AvoidRight( {
				entity: entity
			}),
		avoidTop = new Standoff.UnitAi.AvoidTop( {
				entity: entity
			}),
		avoidBottom = new Standoff.UnitAi.AvoidBottom( {
				entity: entity
			});

		ai.setRoot( move );
		move.addChild( avoidLeft );
		move.addChild( avoidRight );
		move.addChild( avoidTop );
		move.addChild( avoidBottom );
		move.addChild( moveForward );

		return ai;
};
