var gameOptions = {
		// deviceTarget: Kiwi.TARGET_COCOON,
		// scaleType: Kiwi.Stage.SCALE_FIT
	},
	Standoff = Standoff || {};

Standoff.game = new Kiwi.Game( null, "Standoff", null, gameOptions );

Standoff.game.states.addState( Standoff.stateBattle );
Standoff.game.states.switchState( "State Battle" );
