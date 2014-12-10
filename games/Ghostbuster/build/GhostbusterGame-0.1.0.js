var Death = function(state, x, y, amount){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['ghost'], x, y);
	this.state = state;
	this.box.hitbox = new Kiwi.Geom.Rectangle(60, 65, 60, 55); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.amount = amount;

	var animationSpeed = 0.1;
	//var animationSpeed = (Math.random() * 0.1) + 0.05;
	this.animation.add('invis', [30], 0.1, false);
	this.animation.add('appear', [00, 01, 02, 03, 04, 06, 07, 08, 09, 10, 12, 13, 14, 15], 0.06, false);
	this.animation.add('death', [ 16, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28 ], animationSpeed, false);
	
	this.animation.play('death');


	//this.animation.getAnimation('appear').onStop.add(this.dash, this);
	this.animation.getAnimation('death').onStop.add(this.die, this);






	





}
Kiwi.extend(Death, Kiwi.GameObjects.Sprite);

Death.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);


    

    
}

Death.prototype.die = function() {
	this.state.itemManager.addItem('cash', this.x, this.y, this.amount);
	// this.state.weaponManager.stopShooting();
	this.destroy();
};








var Ghost = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['ghost'], x, y);
	this.state = state;
	this.box.hitbox = new Kiwi.Geom.Rectangle(50, 50, 80, 75); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.objType = 'Ghost';

	this.releaseTime == null;

	var animationSpeed = 0.1;
	//var animationSpeed = (Math.random() * 0.1) + 0.05;
	this.animation.add('invis', [0], 0.1, false);
	this.animation.add('appear', [00, 01, 02, 03, 04, 06, 07, 08, 09, 10, 12, 13, 14, 15], 0.06, false);
	this.animation.add('disappear', [ 30, 31, 32, 33, 34, 35, 36, 37, 38, 39 ], 0.06, false);
	this.animation.add('disappear2', [ 40, 41, 41, 41, 41, 41, 43, 41, 41, 41, 43, 41, 41, 41, 43, 41, 41, 41, 44], 0.06, false);
	this.animation.add('capture', [16, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28], animationSpeed, false);
	this.animation.add('idle',[05, 11], 0.1, true);
	this.animation.add('dash',[05, 11], 0.1, true);
	this.animation.add('damage1',[17], 0.1, false);
	this.animation.add('damage2',[23], 0.1, false);
	this.animation.add('damage3',[29], 0.1, false);
	this.animation.play('invis');

	//console.log(this.width, this.height, "Zach the width and Height");
	var centerX = this.width * 0.5;
	var centerY = this.height * 0.5;
	this.centerPoint = new Kiwi.Geom.Point(centerX, centerY);

	var randomDash = Math.floor( Math.random() * 2 );
	this.dashAmount = 2;


	this.animation.getAnimation('appear').onStop.add(this.appeared, this);
	this.animation.getAnimation('capture').onStop.add(this.capture, this);
	this.animation.getAnimation('disappear').onStop.add(this.startD2, this);

	// this.animation.getAnimation('disappear').onStop.add(this.disappear, this);


	this.health = 3;
	this.yVelo = 0;
	this.xVelo = 0;
	this.dashSpeed = 1.5;
	this.speed = 0.3;
	this.detectionDistance = 300;
	this.oriSpeed = this.speed;
	this.inYRange = false;
	this.inXRange = false;
	this.hit = false;
	this.distanceToEgon = 100000000000;
	this.pauseTime = 0;
	this.isVisible = false;
	this.targetLocation = [0,0];

	this.canBeHit = false;


	this.canEscape = false;



	this.setupAI();
	this.lastKnownPoint;
	





}
Kiwi.extend(Ghost, Kiwi.GameObjects.Sprite);

Ghost.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);

    if(this.isVisible || this.animation.currentAnimation.name == 'appear' ){
    	this.alpha = 1;
    } else {
    	this.alpha = 0;
    }

    this.centerPoint.x = this.worldX + this.width * 0.5;
    this.centerPoint.y = this.worldY + this.height * 0.5;


    if(this.state.player.x >this.x){
    	this.scaleX = -1;
    } else if(this.state.player.x < this.x){
    	this.scaleX = 1;
    }

    this.physics.update();
    this.ai.update();
    if(this.hit){
    	// console.log("I am hit!!!!");
    	//this.state.weaponManager.beamManager.beams[0]
    	// console.log(this.state.weaponManager.beamManager.beams[0], "Zach");
    	if( this.state.weaponManager.beamManager.beam.exists){
    		// console.log("Beam Exists!!!!", this.state.weaponManager.beamManager.beam );
    		var alignSpeed = 0.5,
    			beam = this.state.weaponManager.beamManager.beam,
    			enemyCenter = new Kiwi.Geom.Point(this.x, this.y),
    			impactCenter = new Kiwi.Geom.Point ( 0, 0 );

    			var tempImpPoint = this.state.weaponManager.beamManager.getHoldPos( this.targetIndex );

    			if(tempImpPoint){
	    			impactCenter.x = tempImpPoint.x + beam.x;
	    			impactCenter.y = tempImpPoint.y + beam.y;
    				this.lastKnownPoint = new Kiwi.Geom.Point(impactCenter.x, impactCenter.y);
	    		} else {
	    			impactCenter.x = this.lastKnownPoint.x;
	    			impactCenter.y = this.lastKnownPoint.y;
	    		
	    		}
    			//impactSprite = this.state.weaponManager.beamManager.beams[0].members[0];

    			enemyCenter.x = this.x + this.width * 0.5;
    			enemyCenter.y = this.y + this.height * 0.5;

    			// console.log(this.state.weaponManager.beamManager.beams[0].members[0].transform.worldX ,  this.x, "Zach");
	    	if(enemyCenter.x > impactCenter.x ){
	    		this.x -= alignSpeed;
	    		// this.x -=10;
	    	}
	    	if(enemyCenter.x < impactCenter.x ){
	    		this.x += alignSpeed;

	    		// this.x += 10;
	    		
	   	 	}
	   	 	if(enemyCenter.y > impactCenter.y ){
	    		this.y -= alignSpeed;
	    	}
	    	if(enemyCenter.y < impactCenter.y){
	    		this.y += alignSpeed;
	    		
	   	 	}

    	}
    	

    	switch(this.health) {
		case 1:
			if (this.animation.currentAnimation.name != 'damage1'){
	               this.animation.play('damage1');
	    	}
    		break;
		case 2:
    		if (this.animation.currentAnimation.name != 'damage2'){
	               this.animation.play('damage2');
	    	}
    		break;
    	case 3:
    		if (this.animation.currentAnimation.name != 'damage3'){
	               this.animation.play('damage3');
	    	}
    		break;
		}
    }

    
}

Ghost.prototype.capture = function() {
	this.state.addCash(1, this.x, this.y);
	this.state.weaponManager.stopShooting();
	this.destroy();
};

Ghost.prototype.appeared = function() {
	this.canBeHit = true;
};
Ghost.prototype.startD2 = function() {
	this.createEscapeText();
	this.canBeHit = false;
	this.animation.play('disappear2');
};

Ghost.prototype.startLoop = function(){
	if (this.animation.currentAnimation.name != 'idle'){
               
               this.animation.play('idle');
       }
}

Ghost.prototype.dash = function(){
	//this.speed = 5;

	//this.animation.play('dash');
}





Ghost.prototype.damageEnemy = function() {
	this.health -= 1;
	if(this.health <= 0){
		this.state.enemyManager.killEnemy(this, this.x, this.y);
		if (this.animation.currentAnimation.name != 'capture'){

               //this.animation.play('capture');
    	}
	}
};
Ghost.prototype.killSelf = function() {
	this.state.weaponManager.stopShooting();
	this.state.enemyManager.kill(this);

};

Ghost.prototype.updateDirection = function() {
	
	
	if(this.y >= this.state.player.y - 20){

		this.yVelo = -this.speed;
		this.inYRange = false;
	} else if(this.y <= this.state.player.y  - 20){
		this.yVelo = this.speed;
		this.inYRange = false;
	} else {
		this.inYRange = true;
		this.yVelo = 0;
	}


	if(this.x < this.state.player.x - 0){
		//this.xVelo = this.speed;
		this.inXRange = false;
	} else if(this.x >= this.state.player.x + 0){
		//this.xVelo = -this.speed;
		this.inXRange = false;
	} else {
		this.xVelo = 0;
		this.inXRange = true;
	}
	this.speed = this.oriSpeed;
};

Ghost.prototype.checkDash = function() {
	var ghostPoint = new Kiwi.Geom.Point(this.x, this.y);
	var playerPoint = new Kiwi.Geom.Point(this.state.player.x, this.state.player.y);
	//console.log(playerPoint);
	this.distanceToEgon = ghostPoint.distanceToXY(this.state.player.x, this.state.player.y);
};

Ghost.prototype.teleport = function() {

	if( this.dashAmount > 0 ){
		this.dashAmount--;
		return;
	}

	// console.log("CELL INDEX == 44")
	this.exists = false;
	if(this.cellIndex == 44){

	}
	var xPos = Math.floor( Math.random() * this.state.game.stage.width ),
		yPos = 220 + Math.random() * 440;
	if(this.survival){

	}
	this.x = xPos;
	this.y = yPos;
	// this.x =  Math.random() * this.state.width
	// this.y = Math.random() * 200 - 100 + this.state.player.y;
};

Ghost.prototype.finishedAppear = function() {
	
};
Ghost.prototype.createQuestionMark = function() {
	var questionMark = new FadeOutItem( this.state, this.x, this.y, this.state.textures.questionMark, 0.04, 'questionMark' );
	this.state.addChild( questionMark );
	// console.log(questionMark);
	
};
Ghost.prototype.createEscapeText = function() {
	var escapeText = new FadeOutItem( this.state, 0, 0, this.state.textures.escapeText, 0.02, 'escape' );
	var x = this.x + this.width * 0.5 - escapeText.width * 0.5;
	var y = this.y + this.height * 0.5 - escapeText.height * 0.5;
	escapeText.x = x;
	escapeText.y = y;
	
	this.state.addChild( escapeText );
	// console.log(escapeText);
	
};

Ghost.prototype.setupAI = function() {
	
	//////////////////////////////////
	//SETUP AI

	/*
	AI root
		detectHitSelector
			detectHitSequencer
				detectHit
				hit
			dashSelector
				escapeSequence
					*isEscaping
					*playEscape
					*teleport

				dashSequence
					detectVisible
					dashTargetSelect
					dashPause
					dash
					****MinigamePauseBeforeDisappear
					*afterDashPause
					*teleport
				detectEgonSelector
					detectEgonSequencer
						detectEgon
						appear
					randomMoveSequencer
						selectLocation
						moveTo
						pause
	*/

	
	var aiTree = new Kiwi.Plugins.AITree.AI();

	var moveTo = new Kiwi.Plugins.GhostAI.Actions.MoveToLocation({
		sprite:this
	});

	var selectLocation = new Kiwi.Plugins.GhostAI.Actions.SelectNewLocation({
		sprite:this,
		top: 0,
		bottom: 600,
		left: 0,
		right: 800,
		distance: 200
	});
	var pause = new Kiwi.Plugins.GhostAI.Actions.Pause({
        sprite:this,
        length:100
    });
    var dash = new Kiwi.Plugins.GhostAI.Actions.Dash({
    	sprite:this,
    	target:this.state.player
    });
    var dashPause = new Kiwi.Plugins.GhostAI.Actions.Pause({
        sprite:this,
        length:160
    });
    var postDashPause = new Kiwi.Plugins.GhostAI.Actions.Pause({
        sprite:this,
        length:480
    });
    var teleport = new Kiwi.Plugins.GhostAI.Actions.Teleport({
        sprite:this,
        length:120
    });
    var dashTargetSelect = new Kiwi.Plugins.GhostAI.Actions.SelectDashTarget({
    	sprite:this,
    	target:this.state.player
    });
    var detectVisible = new Kiwi.Plugins.GhostAI.Conditions.DetectVisible({
    	sprite:this
    });
    var detectEgon = new Kiwi.Plugins.GhostAI.Conditions.DetectEgon({
    	sprite:this,
    	target:this.state.player
    });
    var appear = new Kiwi.Plugins.GhostAI.Actions.Appear({
    	sprite:this
    });
    var hit = new Kiwi.Plugins.GhostAI.Actions.Hit({
        sprite:this
    });
    var detectHit = new Kiwi.Plugins.GhostAI.Conditions.DetectHit({
    	sprite:this
    });
    var isEscaping = new Kiwi.Plugins.GhostAI.Actions.IsEscaping({
    	sprite:this
    });
    var playEscape = new Kiwi.Plugins.GhostAI.Actions.PlayEscape({
    	sprite:this
    });

	var randomMoveSequence = new Kiwi.Plugins.AITree.Sequencer({name:'randomMoveSequence'});
	randomMoveSequence.addChild(selectLocation);
	randomMoveSequence.addChild(moveTo);
	randomMoveSequence.addChild(pause);

	var detectEgonSequencer = new Kiwi.Plugins.AITree.Sequencer({name:'detectEgonSequencer'});
	detectEgonSequencer.addChild(detectEgon);
	detectEgonSequencer.addChild(appear);

	var detectEgonSelector = new Kiwi.Plugins.AITree.Selector({name:'detectEgonSelector'});
	detectEgonSelector.addChild(detectEgonSequencer);
	detectEgonSelector.addChild(randomMoveSequence);

	var detectHitSequencer = new Kiwi.Plugins.AITree.Sequencer({name:'detectHitSequencer'});
	detectHitSequencer.addChild(detectHit);
	detectHitSequencer.addChild(hit);

	var escapeSequence = new Kiwi.Plugins.AITree.Sequencer({name:'escapeSequence'});
	escapeSequence.addChild(isEscaping);
	escapeSequence.addChild(playEscape);
	escapeSequence.addChild(teleport);

	var dashSequence = new Kiwi.Plugins.AITree.Sequencer({name:'dashSequence'});
	dashSequence.addChild(detectVisible);
	dashSequence.addChild(dashTargetSelect);
	dashSequence.addChild(dashPause);
	dashSequence.addChild(dash);
	dashSequence.addChild(postDashPause);
	dashSequence.addChild(teleport);

	var dashSelector = new Kiwi.Plugins.AITree.Selector({name:'dashSelector'});
	dashSelector.addChild(escapeSequence);
	dashSelector.addChild(dashSequence);
	dashSelector.addChild(detectEgonSelector);

	var detectHitSelector = new Kiwi.Plugins.AITree.Selector({name:'detectHitSelector'});
	detectHitSelector.addChild(detectHitSequencer);
	detectHitSelector.addChild(dashSelector);

	aiTree.addChild(detectHitSelector);


	this.ai = aiTree;

	////////////////////////////////////////////////////
	//END AI SETUP


};
var Beam = function( state, x, y, angle, beamLength ){
	Kiwi.Group.call( this, state );

	this.x = x;
	this.y = y;


	this.origin = new Kiwi.Geom.Point( 0, 0);

	this.desiredLength = new Kiwi.Geom.Point(0,0);

	this.beamVelo = 25;

	this.maxLength = 1000;

	this.beamLength = 0;

	this.beamLocked = false;
	this.impact = {exists: false}


	// this.spawnPoint = new Kiwi.Geom.Point ( 0, 0 );
	this.impactPoint;

	this.beamLine;
	this.beamSprite;

	this.sparkSprite;
	this.impactSprite;

	this.targets = [];

	this.haveHitTarget = false;
	this.currentlyShooting;

	this.beamStage = 0;
	this.animationCell = 0;

	this.beamLength = beamLength;
	this.angle = angle;

	this.spark = new Spark( this.state, this.x, this.y );
	this.spark.anchorPointY = this.spark.height / 2;
	// this.spark.anchorPointX = 0;
	//this.spark.anchorPointX = -24;
	this.state.addChild( this.spark );

	this.beamRep = new Kiwi.Plugins.GameObjects.Repetition(this.state, this.state.textures.beam, 0, 0);
	this.beamRep.anchorPointY = this.beamRep.height * 0.5;
	
	this.state.addChild(this.beamRep);



	


}


Kiwi.extend(Beam, Kiwi.Group);

Beam.prototype.encase = function( entity ) {
	var group = new Kiwi.Group( this.state );

	group.addChild( entity );
	group.x = entity.x;
	group.y = entity.y;
	entity.x = 0;
	entity.y = 0;

	return group;
};

Beam.prototype.removeBeam = function() {
	// console.log("REMOVE BEAM");
	if(this.spark){
		this.spark.exists = false;
	}
	if(this.impact){
		this.impact.exists = false;
	}
	if(this.primLine){
		this.primLine.destroy();
	}
	if(this.beamRep){
		this.beamRep.exists = false;
	}
};
Beam.prototype.moveBeam = function( x, y ) {
	// console.log("REMOVE BEAM");
	// console.log( "Moving Beam" );
	this.x = x;
	this.y = y;

};
Beam.prototype.getLine = function(){
	return this.beamLine;
}
Beam.prototype.setImpactPoint = function( impactPoint ){
	this.desiredLength = impactPoint;
}
Beam.prototype.addTarget = function( ghost ){
	this.targets.push( ghost );
}
Beam.prototype.getTargets = function(){
}
Beam.prototype.positionTargets = function(){
}


Beam.prototype.update = function(){
    Kiwi.Group.prototype.update.call(this);
    // this.x = this.state.player.x;
    // this.y = this.state.player.y;


    this.updateLength();

    this.updateLines();
    // this.drawLines();
    this.updateAnimation();
    this.drawRepBeam();
    this.updateSpark();
    this.updateImpact();

    // console.log( this.beamLine.length );
    // console.log (this.beamLine);
    // console.log( this.primLine.x, this.primLine.y );
    
}

Beam.prototype.drawRepBeam = function() {
	this.beamRep.rotation = this.rotation;
	this.beamRep.transform.x = this.x + 480;
	this.beamRep.transform.y = this.y + 246;
	this.beamRep.width = this.beamLength;
	// console.log("Beam Rep", this.beamRep.x, this.beamRep.y, this.x, this.y);
}

Beam.prototype.updateSpark = function() {
	if( !this.spark.exists || !this.state.weaponManager.beamManager.sparkPoint) {
		return;
	}
    this.spark.x = this.state.weaponManager.beamManager.sparkPoint.x - this.spark.width/2;
    this.spark.y = this.state.weaponManager.beamManager.sparkPoint.y - this.spark.height/2;
    this.spark.rotation = this.rotation;
}

Beam.prototype.updateImpact = function() {
	if( !this.impact.exists ) {
		return;
	}
    this.impact.x = this.desiredLength.x - this.impact.width/2 + this.x;
    this.impact.y = this.desiredLength.y - this.impact.height/2 + this.y;
}
Beam.prototype.updateLength = function() {
    this.beamLength += this.beamVelo;
    if( this.beamLength > this.maxLength ){
    	this.beamLength = this.maxLength;
    }
}
Beam.prototype.updateLines = function() {

	var pointX,
		pointY;

	pointX = this.origin.x + this.beamLength * Math.cos( this.rotation );
	pointY = this.origin.y + this.beamLength * Math.sin( this.rotation );


	this.desiredLength = new Kiwi.Geom.Point( pointX, pointY );

	this.beamLine = new Kiwi.Geom.Line( this.origin.x + this.x, this.origin.y + this.y,
				this.desiredLength.x + this.x, this.desiredLength.y + this.y );

	// console.log ( this.beamLine );

	
}

Beam.prototype.setLength = function( point ) {

	var num1 = Math.pow( this.origin.x - point.x, 2 ) 
			+ Math.pow( this.origin.y - point.y, 2 );

	var num2 = Math.sqrt(num1);
	this.beamLength = num2;
}

Beam.prototype.createImpact = function() {
	this.impact = new Impact( this.state, this.x + this.desiredLength.x, this.y + this.desiredLength.y);
	this.updateImpact();
	this.state.addChild(this.impact);
	// console.log("My Impact", this.impact);
}

Beam.prototype.drawLines = function() {

	// Demo linesjjj
	params = {
		state: this.state,
		strokeColor: [ 0.94,  0.67, 0.45 ],
		strokeWidth: 5,
		points: [ [ 0 , 0 ],
		 		[ this.beamLength , 0 ] ]
	};

	if(this.primLine){
		this.primLine.destroy();
	}
	
	this.primLine = new Kiwi.Plugins.Primitives.Line( params );

	// this.primLine.x = this.state.player.x;
	// this.primLine.y = this.state.player.y;
	
	this.addChild( this.encase( this.primLine ) );

	// // console.log( this.primLine, "Zach Line" );
}

Beam.prototype.updateAnimation = function( stage ) {

	//console.log( "Inside update Animation");
	switch ( this.beamStage ) {
		case 0:
			if(this.beamRep.cellIndex >= 11) {
				this.animationCell = 0;
			}
			this.beamRep.cellIndex = this.animationCell;
			break;
		case 1:
			if(this.beamRep.cellIndex >= 23 || this.beamRep.cellIndex < 12) {
				this.animationCell = 12;
			}
			this.beamRep.cellIndex = this.animationCell;
			break;
		case 2:
			if(this.beamRep.cellIndex >= 35 || this.beamRep.cellIndex < 24) {
				this.animationCell = 24;
			}
			this.beamRep.cellIndex = this.animationCell;
			break;
		default:
			console.error( stage, ": Stage was undefined")
			if(this.beamRep.cellIndex >= 11) {
				this.animationCell = 0;
			}
			this.beamRep.cellIndex = this.animationCell;
	};
	// console.log(this.beamStage);
	this.animationCell ++;

	// console.log( this.animation.currentAnimation.name, "Animation current Animation :", stage, "Stage upgrade passed");
};


var Impact = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['impact'], x, y);

	this.animation.add('impact', [00, 01, 02, 03, 04, 05, 06, 07, 08], 0.06, true, true);

	//this.animation.getAnimation('impact').onStop.add(this.startLoop, this);
	this.objType = 'impact';

	//console.log(this.width, this.height, "Zach the width and Height");
	var centerX = this.width * 0.5;
	var centerY = this.height * 0.5;
	this.centerPoint = new Kiwi.Geom.Point(centerX, centerY);





}
Kiwi.extend(Impact, Kiwi.GameObjects.Sprite);

Impact.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);

    this.centerPoint.x = this.worldX + this.width * 0.5;
    this.centerPoint.y = this.worldY + this.height * 0.5;

}

Impact.prototype.startLoop = function(){
	this.animation.play('shoot');
}

var Spark = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['beamSpark'], x, y);

	var animationSpeed = 0.1;
	//var animationSpeed = (Math.random() * 0.1) + 0.05;
	this.animation.add('initiate', [00, 01, 02, 03, 04, 05, 06, 07, 08, 09], 0.06, false, true);
	this.animation.add('shoot', [11, 12, 13], animationSpeed, true);
	//this.animation.getAnimation('shoot').onStop.add(this.startLoop, this);
	this.animation.play('shoot');






}
Kiwi.extend(Spark, Kiwi.GameObjects.Sprite);

Spark.prototype.startLoop = function(){
	//this.animation.play('shoot');
}
//PlayerManager / Player
var Book = function ( state, type, x, y, toX, toY ){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['books'], x, y);
	this.state = state;

	this.health = 3;
	this.phase = 1;
	this.objType = "Book";
	this.targetImpact = null;
	this.type = type;

	// This is duration the throw tween plays in milliseconds. 
	this.throwSpeed = 1500;
	this.maxHoldTime = 5;

	this.moving = true;

	this.moveTo(toX, toY);

	// this.rotPointX = Math.floor( Math.random() * this.width );
	// this.rotPointY = Math.floor( Math.random() * this.height );

	// this.rotationSpeed = (Math.random() - 0.5) * 0.03;


	// Top half animations

	

	switch (type) {
		case 'bible':
			this.animation.add('disappear', [ 0, 1, 2, 3, 4, 5, 6, 7 ], 0.05, false);
			this.animation.add('hold', [ 8, 9 ], 0.05, true);
			this.animation.add('idle', [ 10, 11, 12 ], 0.7, true);
			// console.log(type, "Type of book");
			break;
		case 'book1':
			this.animation.add('disappear', [ 16, 17, 18, 19, 20 /*, 21, 22 */ ], 0.05, false);
			this.animation.add('hold', [ 13, 14 ], 0.05, true);
			this.animation.add('idle', [ 24, 25, 26 ], 0.7, true);
			break;
		case 'book2':
			this.animation.add('disappear', [ 27, 28, 29, 30, 31 ], 0.05, false);
			this.animation.add('hold', [ 32, 33 ], 0.05, true);
			this.animation.add('idle', [ 34, 35, 36 ], 0.7, true);
			break;
		case 'book3':
			this.animation.add('disappear', [ 40, 41, 42, 43, 44 ], 0.05, false);
			this.animation.add('hold', [ 37, 38 ], 0.05, true);
			this.animation.add('idle', [ 45, 46, 47 ], 0.7, true);
			break;
		default:
			console.error("Book type did not match any given case");
			// this.animation.add('disappear', [ 16, 17, 18, 19, 20 /*, 21, 22 */ ], 0.05, true);
			// this.animation.add('hold', [ 13, 14 ], 0.05, false);
			// this.animation.add('idle', [ 24, 25, 26 ], 0.05, false);

			// code
	}
	








	this.animation.play('idle'); 


	this.box.hitbox = new Kiwi.Geom.Rectangle(25, 20, 35, 80); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));


	this.animation.getAnimation('disappear').onStop.add(this.removeBook, this);

	//this.animation.getAnimation('death').onStop.add(this.bossDead, this);

	
	// this.physics.acceleration.y = 30;

	this.centerPoint = new Kiwi.Geom.Point( this.x + this.width * 0.5, this.y + this.height * 0.5 );
	


}
Kiwi.extend(Book, Kiwi.GameObjects.Sprite);


Book.prototype.update = function () {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	this.updateCenterPoint();
	this.checkCollisions();

	// this.rotation += this.rotationSpeed;



}


Book.prototype.switchToIdle = function() {
	if( this.animation.currentAnimation != 'idle' ) {
		this.animation.play( 'idle' );
	}
};

Book.prototype.removeBook = function() {
	// console.log( "REMOVE" );
	// console.log( this.animation.currentAnimation.name, "ZACH ANI" );
	this.alpha = 0;
	this.exists = false;
};

Book.prototype.grabbed = function( amount ) {

}


Book.prototype.moveTo = function (x, y) {

	var currX = this.x,
		currY = this.y;
	this.tween = this.game.tweens.create(this);

	var tweenObj = {};
	tweenObj.x = x;
	tweenObj.y = y;

	this.moving = true;

	this.tween.to(tweenObj, 1000, Kiwi.Animations.Tweens.Easing.Linear.None); 
	this.tween.onComplete(this.finishedMoving, this);
	//this.tween.delay(2000); //delays the tween after starting. In milliseconds.
	this.tween.start();     //start the tween
}

Book.prototype.checkCollisions = function () {

}

Book.prototype.collideWithBoss = function () {
	
}

Book.prototype.updateCenterPoint = function () {
	this.centerPoint.x = this.worldX + this.width * 0.5;
    this.centerPoint.y = this.worldY + this.height * 0.5;
}

Book.prototype.throwAt = function ( target ) {
	this.moving = true;

	var diffY, diffX,
		currX = this.x,
		currY = this.y;


	diffX = target.x - this.x;
	diffY = target.y - this.y;



	var throwTween = this.game.tweens.create(this);

	var tweenObj = {};
	tweenObj.x = target.x + diffX * 2;
	tweenObj.y = target.y + diffY * 2;

	// console.log(tweenObj);

	throwTween.to(tweenObj, this.throwSpeed, Kiwi.Animations.Tweens.Easing.Linear.None); 
	throwTween.onComplete(this.finishedThrow, this);
	//throwTween.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.finishedThrow, this);
	throwTween.delay(100); //delays the tween after starting. In milliseconds.
	throwTween.start();     //start the tween

}

Book.prototype.finishedThrow = function () {
	this.exists = false;
}

Book.prototype.trapped = function () {
	/*this.exists = false;*/
	this.deathTimer = this.game.time.clock.createTimer('spawn', this.maxHoldTime, 0, false);  
    this.deathTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.disappear, this);

    this.deathTimer.start();


}
Book.prototype.disappear = function () {
	//console.log("BOOK DISAPPEAR")
	if(this.exists){
		if(this.animation.currentAnimation.name != 'disappear') {
			this.animation.play('disappear', false); 
			// console.log("BOOK DISAPPEAR 2")
			
		}
	}

}

Book.prototype.finishedMoving = function () {
	//this.animation.play('disappear'); 
	this.moving = false;

}
//PlayerManager / Player
var Boss = function (state, x, y){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['boss'], x, y);
	this.state = state;

	this.health = 3;
	this.phase = 1;
	this.timerDelay = 2;
	this.books = new Kiwi.Group(this.state);
	this.trappedBooks = new Kiwi.Group( this.state );
	this.state.addChild( this.books );
	this.state.addChild( this.trappedBooks );

	this.objType = 'Boss'
	this.bossMiniGame = false;

	this.vulnerable = false;

	// Top half animations
	this.animation.add('idle', [ 6, 7, 8, 9, 10, 11 ], 0.0625, true);
	this.animation.add('leftThrow', [ 24, 25, 26, 26, 26, 27, 28 ], 0.0625, false);
	this.animation.add('rightThrow', [ 30, 31, 32, 32, 32, 33, 34 ], 0.0625, false);
	this.animation.add('appear', [ 12, 13, 14, 13, 15, 13 ], 0.0625, false);
	this.animation.add('disappear', [ 18, 19, 20, 21, 22 ], 0.0625, false);
	this.animation.add('damage', [ 0, 1, 2 ], 0.0625, false);
	this.animation.add('death', [ 3, 4, 5 ], 0.0625, false);
	//this.animation.play('idle'); 


	this.box.hitbox = new Kiwi.Geom.Rectangle(25, 20, 35, 80); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));


	this.animation.getAnimation('leftThrow').onStop.add(this.switchToIdle, this);
	this.animation.getAnimation('rightThrow').onStop.add(this.switchToIdle, this);
	//this.animation.getAnimation('appear').onStop.add(this.switchToIdle, this);
	this.animation.getAnimation('disappear').onStop.add(this.switchToIdle, this);
	this.animation.getAnimation('damage').onStop.add(this.switchToIdle, this);

	this.animation.getAnimation('death').onStop.add(this.bossDead, this);
	this.animation.getAnimation('appear').onStop.add(this.finishedAppearing, this);

	
	// this.physics.acceleration.y = 30;

	this.centerPoint = new Kiwi.Geom.Point( this.x + this.width * 0.5, this.y + this.height * 0.5 );

	this.shield = new Shield(this.state, x, y);
	this.state.addChild(this.shield);

	//this.nextTimer();
	this.currentPhase = 'throwBooks';
	this.timer = this.game.time.clock.createTimer('spawn', this.timerDelay, 0, false);  
    this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.nextTimer, this);

    //this.timer.start();
    this.appear();


}
Kiwi.extend(Boss, Kiwi.GameObjects.Sprite);

Boss.prototype.appear = function () {
	this.animation.play('appear');

}

Boss.prototype.finishedAppearing = function () {
	console.log( "Started Boss");
	this.currentPhase = 'throwBooks';
	this.timer.start();
	this.switchToIdle();
}



Boss.prototype.update = function () {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	this.updateTrappedBooks();
	this.checkIfHit();

	if( this.health <= 0 ) {
		this.shield.alpha = 0;
		this.nextPhase = null;
		this.currentPhase = null;
		if(this.animation.currentAnimation.name != 'death'){
			this.animation.play('death');
		}
		this.game.tweens.removeAll();
		//this.updateDamage();
	}

	//console.log(this.vulnerable)
}



Boss.prototype.bossHitWithBeam = function () {
	if ( !this.bossMiniGame && this.vulnerable){
		this.bossMiniGame = true;
		this.state.miniGameManager.createMiniGame( this.centerPoint , this.health );
		
	}
}

Boss.prototype.hurtByBeam = function () {
	if( this.animation.currentAnimation != 'damage' ){
		this.animation.play( 'damage', false );
	}
	this.health -= 1;


	//this.state.enemyManager.killTrapped();
	this.state.weaponManager.stopShooting();

	this.state.weaponManager.beamManager.enemyKilled();
	// this.bossMiniGame;
	// this.updatePhase();
}

Boss.prototype.updateDamage = function () {
	this.state.collisionManager.checkBossHit();
}

Boss.prototype.checkIfHit = function () {
	for (var i = this.trappedBooks.members.length - 1; i >= 0; i--) {
		if( this.trappedBooks.members[i].type == 'bible'){
			if ( this.state.collisionManager.checkShieldBossHit( this/*.shield*/, this.trappedBooks.members[i] ) ){
				//console.log ( "Shield Hit!");
				this.shield.takeDamage();
				this.shieldDown();
			}

			
		}
	};
}
Boss.prototype.shieldDown = function (){
	this.vulnerable = true;
	if( this.animation.currentAnimation != 'damage' ){
		this.animation.play( 'damage', false );
	}


}

Boss.prototype.shieldUp = function (){
	this.vulnerable = false;
	this.bossMiniGame = false;

}

Boss.prototype.updateTrappedBooks = function () {
	for (var i = this.trappedBooks.members.length - 1; i >= 0; i--) {
		this.moveToImpact( this.trappedBooks.members[i] );
		this.updateBookAnimations( this.trappedBooks.members[i] );
	};
}
Boss.prototype.updateBookAnimations = function (book) {
	if( book.animation.currentAnimation != 'hold' && this.animation.currentAnimation.name != 'disappear'){
		book.animation.play( 'hold', false );
	}
}
Boss.prototype.moveToImpact = function ( book ) {
	if (!book.exists || !book.targetImpact.exists) {
		// console.log ( "no book or impact");
		return;
	}
	var impact = book.targetImpact,
		tar = this.getDist( book, impact );
	// console.log( "temp point", tar );
	book.x += tar.x - book.width * 0.5 + impact.width * 0.5;
	book.y += tar.y - book.height * 0.5 + impact.height * 0.5;
	
}


Boss.prototype.getDist = function ( book, impact ) {
	var myPoint = new Kiwi.Geom.Point( 0, 0);
	myPoint.x = impact.worldX - book.worldX;
	myPoint.y = impact.worldY - book.worldY;


	return myPoint;
	
}
//Boss.prototype.getImpact

Boss.prototype.nextTimer = function() {
	switch ( this.currentPhase ) {
		case 'pickBooksUp':
			this.pickUpBooks();
			this.nextPhase = 'throwBooks';
			// Pick up books
			break;
		case 'throwBooks':
			//this.nextPhase = 'throwBooks'; // <--- remove this when books are working (is temp)
			if(this.bookAmount() > 0 ){
				this.throwBook();
				this.nextPhase = 'throwBooks';
			} else {
				// Pick up books again
				this.nextPhase = 'pickBooksUp'
			}
			break;

		default:
			//code;

	}


    if(this.nextPhase){
		this.timer = this.game.time.clock.createTimer('spawn', this.timerDelay, 0, false);  
	    this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.nextTimer, this);
    	this.timer.start();
    }

	this.currentPhase = this.nextPhase;
	//console.log("PHASE:", this.currentPhase)
};

Boss.prototype.bookAmount = function () {
	return this.books.members.length
}

Boss.prototype.pickUpBooks = function() {
	if(this  == undefined){
		return;
	}
	if( this.health > 1 ) {
		this.createBooks( 2 );
	} else if ( this.health === 1 ){
		this.createBooks( 4 );
	}
};

Boss.prototype.createBooks = function ( num ) {

	if( num == 2 ){




		var tempBook1, tempBook2, pos, startPos, hand;

		hand = this.spawnOrder( 2 );

		pos = this.bookPos( hand[0] );
		startPos = this.bookStartPos();
		tempBook1 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook1 );

		startPos = this.bookStartPos();
		pos = this.bookPos( hand[1] );
		tempBook2 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook2 );
	}

	if( num == 4 ){




		var tempBook1, tempBook2, tempBook3, tempBook4, pos, startPos, hand;

		hand = this.spawnOrder( 4 );

		pos = this.bookPos( hand[0] );
		startPos = this.bookStartPos();
		tempBook1 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook1 );

		startPos = this.bookStartPos();
		pos = this.bookPos( hand[1] );
		tempBook2 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook2 );

		startPos = this.bookStartPos();
		pos = this.bookPos( hand[2] );
		tempBook3 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook3 );

		startPos = this.bookStartPos();
		pos = this.bookPos( hand[3] );
		tempBook4 = new Book( this.state, this.getBookType(), startPos.x, startPos.y, pos.x, pos.y );
		this.books.addChild( tempBook4 );
	}

}


//Returns array of length num in random order from 1 - num
// E.g spawnOrder( 2 ) can return either [ 1, 2 ] or [ 2, 1 ]
Boss.prototype.spawnOrder = function( num ) {
	var myArray = [],
		tempArray = [];
	for ( var i = 0 ; i < num; i++ ) {
		tempArray[i] = i + 1;
	};


	while ( tempArray.length > 0 ){
		var j = Math.floor( Math.random() * tempArray.length );
		myArray[myArray.length] = tempArray[j];
		tempArray.splice( j , 1 );
	}
	return myArray;
};

Boss.prototype.throwBook = function() {
	this.throwAni();
	this.books.members[0].throwAt( this.state.player );
};
Boss.prototype.throwAni = function() {
	if ( this.books.members[0].x < this.x ) {
		this.animation.play('leftThrow');
	} else {
		this.animation.play('rightThrow');
	}
};

Boss.prototype.switchToIdle = function() {
	if( this.animation.currentAnimation != 'idle' ) {
		this.animation.play( 'idle' );
	}
};

Boss.prototype.bossDead = function() {
	console.log("Boss Dead");
	this.game.tweens.removeAll();
	this.state.miniGameManager.beamTarget = this.state.player;
	this.state.weaponManager.beamManager.targetEnemy = this.state.player;
	this.shield.alpha = 0;
	this.books.alpha = 0;
	this.trappedBooks.alpha = 0;
	// this.books.removeChildren();
	// this.trappedBooks.removeChildren();
	//this.exists = false;
	this.alpha = 0;
	this.state.levelManager.gameOver();
};

Boss.prototype.getBookType = function() {
	var num = Math.floor(Math.random() * 4);
	// console.log("Type of book: ", num );
	switch (num) {
		case 0:
			return 'bible';
			break;
		case 1:
			return 'book1';
			break;
		case 2:
			return 'book2';
			break;
		case 3: 
			return 'book3';
			break;
		default:
		console.error("Book type was not defined properly");
			return 'book3'
	}

}

Boss.prototype.bookPos = function ( num ) {
	var pos;
	if ( num == 1 ) {
		pos = new Kiwi.Geom.Point( this.x - 300, this.y );
	} else if (num == 2){
		pos = new Kiwi.Geom.Point( this.x + this.width + 100, this.y );
	} else if (num == 3){
		pos = new Kiwi.Geom.Point( this.x + this.width + 200, this.y  + 100);
	} else if (num == 4){
		pos = new Kiwi.Geom.Point( this.x - 400, this.y  + 100);
	}
	return pos;
}

Boss.prototype.bookStartPos = function () {
	var num, pos;
	num = Math.floor(Math.random() * 2);
	if ( num == 1 ){
		pos = new Kiwi.Geom.Point( this.state.bookPileL.x, this.state.bookPileL.y );
	} else {
		pos = new Kiwi.Geom.Point( this.state.bookPileR.x, this.state.bookPileR.y );
	}
	
	return pos;
}

Boss.prototype.endState = function () {
	this.shield.destroy();
	this.stopAllTweens();
	this.currentPhase = null;
	this.nextPhase = null;
	this.timer.stop();
}

Boss.prototype.trapBook = function ( book, beamGroup ) {
	this.trappedBooks.addChild( book );
	book.trapped();
	book.targetImpact = beamGroup.getChildAt( 0 );
}

Boss.prototype.stopAllTweens = function () {
	this.game.tweens.removeAll();
}
//PlayerManager / Player
var Shield = function ( state, x, y ){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['shield'], x, y);
	this.state = state;

	this.damageTimer;
	this.timerDelay = 4;
	this.vulnerable = false;

	// Top half animations

	
	this.animation.add('damage', [ 0, 1, 0, 1, 0, 1, 2, 3 ], 0.05, false);
	this.animation.add('idle', [ 4, 5, 6, 7, 7, 6, 5, 4 ], 0.25, true);
	this.animation.add('recharge', [ 8, 9, 10, 11 ], 0.5, false);








	this.animation.play('idle'); 


	this.box.hitbox = new Kiwi.Geom.Rectangle(25, 20, 35, 80); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));


	this.animation.getAnimation('recharge').onStop.add(this.playIdle, this);

	//this.animation.getAnimation('death').onStop.add(this.bossDead, this);

	
	// this.physics.acceleration.y = 30;

	this.centerPoint = new Kiwi.Geom.Point( this.x + this.width * 0.5, this.y + this.height * 0.5 );
	


}
Kiwi.extend(Shield, Kiwi.GameObjects.Sprite);


Shield.prototype.update = function () {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	

}

Shield.prototype.playIdle = function () {
	//this.vulnerable = false;
	if ( this.animation.currentAnimation != 'idle' ){
		this.animation.play('idle');
	}

	this.state.boss.shieldUp();
	

};

Shield.prototype.bossMiniGameStarted = function () {

}

Shield.prototype.takeDamage = function () {
	var damageTimer;
	if ( this.animation.currentAnimation != 'damage' ){
		this.animation.play('damage');
	}
	//this.vulnerable = true;

	this.damageTime = this.game.time.clock.createTimer('spawn', this.timerDelay, 0, false);  
    this.damageTime.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.recharge, this);

    this.damageTime.start();



};

Shield.prototype.recharge = function () {
	if( !this.exists ){
		return;
	}
	if ( this.animation.currentAnimation != 'recharge'  ){
		this.animation.play('recharge');
	}
};
//PlayerManager / Player
var DeathAnimation = function (state, x, y){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['egonSprite'], x, y);
	this.state = state;

	// Bottom half animations
	
	this.animation.add('death', [43], 0.1, false);
	this.animation.play('death'); 

	//this.scaleX = 10;
	//this.scaleY = 10;



	///////////////////
	//KEYBOARD
	this.rightKeyDown = false;
	this.leftKeyDown = false;
	this.jumpKeyDown = false;


	this.tweenA = this.game.tweens.create(this);  
	this.tweenB = this.game.tweens.create(this); 
	
	//set the tweens up
	this.tweenA.to({ y: this.y - 120 }, 400, Kiwi.Animations.Tweens.Easing.Cubic.Out, false);
	this.tweenB.to({ y: this.y + 400  }, 1600, Kiwi.Animations.Tweens.Easing.Cubic.Out, false);
	this.tweenB.onComplete( this.gameOver, this );

	this.tweenA.chain(this.tweenB);
	this.tweenA.start();


}
Kiwi.extend(DeathAnimation, Kiwi.GameObjects.Sprite);

DeathAnimation.prototype.gameOver = function(){

	//console.log( this.scaleX, this.scaleY, ":SCALE" );

	this.state.levelManager.gameOver();
	
}


//Platform / Player
var Platform = function (state, x, y){
    Kiwi.GameObjects.Sprite.call(this, state, state.textures['platform'], x, y);
    this.state = state;
     

    this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
    this.physics.immovable = true;
    //this.physics.acceleration.y = 15;
    //this.physics.velocity.y = 15;




}
Kiwi.extend(Platform,Kiwi.GameObjects.Sprite);

    
   

    Platform.prototype.update = function(){
        Kiwi.GameObjects.Sprite.prototype.update.call(this);

        this.physics.update();
        



    }

   


var Cash = function(state, x, y, amount){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures.cash, x, y );
	this.state = state;
	this.box.hitbox = new Kiwi.Geom.Rectangle(60, 65, 60, 55); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));

	this.animation.add('drop1', [0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 7, 7, 8, 8, 7, 7, 8, 8, 7, 7, 8, 8], 0.05, false, true);
	this.animation.add('drop2', [0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 7, 7, 8, 8, 7, 7, 8, 8, 7, 7, 8, 8], 0.05, false, true);
	this.animation.add('drop3', [0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 7, 7, 8, 8, 7, 7, 8, 8, 7, 7, 8, 8], 0.05, false, true);
	this.animation.play('drop'+amount);


	this.animation.getAnimation('drop1').onStop.add(this.removeCash, this);
	this.animation.getAnimation('drop2').onStop.add(this.removeCash, this);
	this.animation.getAnimation('drop3').onStop.add(this.removeCash, this);
	this.hittable = false;
	this.state.gameManager.addScore(5000);


	





}
Kiwi.extend(Cash, Kiwi.GameObjects.Sprite);

Cash.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    
}

Cash.prototype.removeCash = function() {

	this.exists = false;
};



var Gem = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures.gem, x, y);
	this.state = state;
	//this.box.hitbox = new Kiwi.Geom.Rectangle(60, 65, 60, 55); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	var animationSpeed = Math.random()* 0.05 + 0.1;

	this.animation.add('idle', [0, 1, 2, 3, 4, 5, 6, 7,  8,  9], animationSpeed, true, true);
	this.animation.add('pickup', [10, 11, 12, 13, 14, 15, 16, 17], 0.1, false);
	this.animation.play('idle');


	this.animation.getAnimation('pickup').onStop.add(this.removeSelf, this);
	this.hittable = true;

	





}
Kiwi.extend(Gem, Kiwi.GameObjects.Sprite);

Gem.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    
}

Gem.prototype.removeSelf = function() {
	this.exists = false; //state.itemManager.removeItem(this);
};

Gem.prototype.hitPlayer = function() {
	this.hittable = false;
	this.state.gameManager.addScore(500);
	this.animation.play('pickup');
};
var FadeOutItem = function(state, x, y, texture, fadeSpeed, type){
	Kiwi.GameObjects.Sprite.call(this, state, texture, x, y);
	this.state = state;
	this.type = type

	// this.animation.add('idle', [0], animationSpeed, true, true);
	// this.animation.play('idle');

	this.fadeSpeed = fadeSpeed;
	if(this.type == 'escape'){
		this.fadeSpeed = 0;
		this.animation.add('idle', [ 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 ], 0.06, false);
		this.animation.play('idle');
		this.animation.getAnimation('idle').onStop.add(this.removeSelf, this);
	}
	





}
Kiwi.extend(FadeOutItem, Kiwi.GameObjects.Sprite);

FadeOutItem.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);
    this.alpha -= this.fadeSpeed;
    if(this.alpha <= 0 ){
    	this.removeSelf();
    }
    
}

FadeOutItem.prototype.removeSelf = function() {
	//console.log("REMOVED FADE OUT ITEM")
	this.exists = false; //state.itemManager.removeItem(this);
};

var BeamManager = function (state) {
	"use strict";
	this.state = state;

	//this.gunPoint = new Kiwi.Geom.Point( 0, 0 );

	this.currentlyShooting = false;
	this.spawnPoint = new Kiwi.Geom.Point ( 0, 0 );

	// this.beams;
	this.beam = undefined;
	this.nonActiveBeams = [];
	this.sparkPoint = new Kiwi.Geom.Point( 0, 0 );

	this.targets = [];
	this.releaseTime = 0;


	// This boolean is used to determine if the beam has ever hit a target
	this.hasHit = false;

};

BeamManager.prototype.continueMiniGame = function ( collideWith ) {
	var temp = false;
	for (var l = collideWith.length - 1; l >= 0; l--) {
		for (var m = this.targets.length - 1; m >= 0; m--) {
			if( this.targets[m] === collideWith[l].enemy ) {
				temp = true;
			}
		}
	}
	
	if( !temp ){
		if(this.state.miniGameManager.active){
			this.state.miniGameManager.removeOldGame();
		}
		this.releaseGhosts();
		this.targets = [];
	}

	return temp;

};


// This method is continuiously called when the shoot key is down. 
BeamManager.prototype.shoot = function () {
	"use strict";
	if( this.state.miniGameManager.active ){
		// console.log( "TIME UPDATE" );
		this.releaseTime = this.state.game.time.now();
	}

	if(this.state.player.alpha === 0){
		return;
	}

	if( this.currentlyShooting ){


		//returns an object with an enemy and an intersect reulst. (only returns if it is not already hit.)
		var collideWith = this.state.collisionManager.checkBeamIntersectsEnemy();
		// console.log(collideWith);

			// console.log("Has Hit", this.hasHit );
		if ( collideWith ){
			 var continueMinigameBoo = this.continueMiniGame( collideWith ); //false;
			
			for (var k = collideWith.length - 1; k >= 0; k--) {
				//collideWith[i]dd
				collideWith[k].enemy.hit = true;
				var matched = false;
				if(this.hasHit){
					matched = this.matchTargets(collideWith[k].enemy);
				}
				
				if( !matched ){
					

					//console.log("Creating MiniGame");



					collideWith[k].enemy.canEscape = true;
					this.state.survivalGame.resetSpawn(true);
					var index = this.targets.length;

					if( !this.matchTargets( collideWith[k].enemy ) ){
						this.targets.push(collideWith[k].enemy);
						
					}

					collideWith[k].enemy.targetIndex = index;
					var health = 3;
					if(this.state.miniGameManager.active){
						if(health < 3){
							health = this.state.miniGameManager.getHealth();
						}
						if(this.targets.length ===  1){
							health = 3;
						} 
						if(this.targets.length ===  2){
							health = 5;
						} 
						if(this.targets.length >=  3){
							health = 6;
						}

					}
					console.log(health, "Skull HEALTH")
					this.state.miniGameManager.createMiniGame( null , health );
						
					this.state.cameraManager.damageState = true;

					if( !this.beam.impact.exists ) {
						this.beam.createImpact();
						
					}

					var colPoint = new Kiwi.Geom.Point( collideWith[k].intersectResult.x, collideWith[k].intersectResult.y );

					var tempLine = new Kiwi.Geom.Line(this.beam.x, this.beam.y, colPoint.x, colPoint.y);

					if( !this.beam.beamLocked ) {
						this.beam.beamLocked = true;
						this.beam.beamLength = tempLine.length;
						this.beam.maxLength = tempLine.length;

						
					}

					this.beam.beamVelo = 0;

					this.hasHit = true;
					
				}
			}
		}

		// Continue Shooting
	} else {

		// Start Shooting

		// Create Beam

		this.removeOldBeam();

		var rotation = this.getDirection() - Math.PI / 2;
		var beam = new Beam ( this.state, this.state.player.centerPoint.x, this.state.player.centerPoint.y,  rotation, 0 );


		this.state.addChild( beam );

		
		beam.rotation = rotation;

		this.beam = beam;

		// console.dir ( this.beam, "New Beam" );

		// Reset Everything (MiniGame / Targets)?;
		this.currentlyShooting = true;
	}

};


// This method is called when the shoot key has been lifted
BeamManager.prototype.stopShooting = function () {
	"use strict";
	// console.log( "Stop Shooting" );
	this.currentlyShooting = false;
	this.state.cameraManager.damageState = false;

	this.hasHit = false;
	this.removeOldBeam();
	
	
};


// This method is called when the shoot key has been lifted
BeamManager.prototype.matchTargets = function ( enemy ) {

	for (var i = this.targets.length - 1; i >= 0; i--) {
		if ( this.targets[i] == enemy ) {
			
			return true;
			
		}
	}
	return false;
};
BeamManager.prototype.removeOldBeam = function ( x, y ) {
	"use strict";
	if ( this.beam ){
		this.beam.removeBeam();
		this.beam.exists = false;
	}
	
};

BeamManager.prototype.startRelease = function () {
	// console.log("START RELEASE");
	var timer = this.state.game.time.clock.createTimer('releaseGhosts', 2, 0, false);  
    timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.releaseAll, this);

    timer.start();
	
};
BeamManager.prototype.releaseAll = function () {
	// console.log("RELEASE ALL");
	if(this.state.miniGameManager.active){
		this.state.miniGameManager.removeOldGame();
	}

	this.releaseGhosts();

	this.targets = [];
	
};


BeamManager.prototype.moveBeam = function (  ) {
	"use strict";
	if( this.beam !== undefined ){
		if( this.beam.exists ){
			var offX, offY;
			switch ( this.beam.rotation + Math.PI * 0.5 ){
				case (-( Math.PI / 2 )): // Left
					offX = -50;
					offY = 15;
					break;
				case (-( Math.PI / 4 )): // Up Left
					offX = -35;
					offY = -25;
					break;
				case 0: // Up
					offX = 0;
					offY = -50;
					break;
				case Math.PI / 4: // Up Right
					offX = 35;
					offY = -25;
					break;
				case  Math.PI / 2: //Right
					offX = 50;
					offY = 15;
					break;
				default:
					offX = 0;
					offY = 0;
			}
			
			this.sparkPoint = new Kiwi.Geom.Point(  this.state.player.centerPoint.x + offX, this.state.player.centerPoint.y + offY  );
			this.beam.moveBeam(  this.sparkPoint.x, this.sparkPoint.y );
		}
	}	
};

BeamManager.prototype.getHoldPos = function ( index ) {
	"use strict";
	var myPoint, offX, offY,
		offset = 20;
	if( this.targets.length <= 1 ){
		return this.beam.desiredLength;
	} else if ( this.targets.length == 2 ) {
		if( index === 0 ){
			offX = offset * 0.5;
			offY = -offset;
		} else {
			offX = -offset * 0.5;
			offY = offset;
		}

	} else if ( this.targets.length >= 3 ) {
		if( index === 0 ){
			offX = 0;
			offY = -offset;

		} else if( index == 1 ){
			// console.log("INDEX IS ONE");
			offX = -offset;
			offY = offset;
		} else {
			offX = offset;
			offY = offset;
		}

	} 
	myPoint = new Kiwi.Geom.Point ( this.beam.desiredLength.x + offX, this.beam.desiredLength.y + offY );
	// console.log( "My POint", myPoint );
	return myPoint;
};

BeamManager.prototype.releaseGhosts = function () {
	"use strict";
	this.state.enemyManager.releaseGhosts();	
};

BeamManager.prototype.update = function () {
	this.updateSpawnPoint();
	this.moveBeam();

	if(this.state.miniGameManager){
		// var number1 = this.state.game.time.now() - this.state.weaponManager.neamManagerreleaseTime;
		// var number2 = number1 / 2000;
		// this.state.miniGameManager.setAlpha( 1 - number2 );
		
	}
	if(this.releaseTime + 2000 < this.state.game.time.now()){
		this.releaseAll();
	}
};
BeamManager.prototype.updateSpawnPoint = function () {
	if( this.state.player ){
		this.spawnPoint.x = this.state.player.x;
		this.spawnPoint.y = this.state.player.y;
	}
};

BeamManager.prototype.updateBeamStage = function () {
	// console.log("UPDATE BEAM");
	if(this.beam){
		if(this.beam.beamStage < 2){
		this.beam.beamStage += 1;
			
		}
		// console.log("INSIDE", this.beam.beamStage);
	}
};


BeamManager.prototype.getDirection = function() {
	var keysDown = this.state.inputManager.getKeysDown();
	if(keysDown.upKey){
		if (keysDown.leftKey){

			// console.log( "Up Left" );
			if(this.state.player.scaleX == 1){
				return -( Math.PI / 4 );
			} else {
				return Math.PI / 4;
			}
		} else if (keysDown.rightKey){

			// console.log( "Up Right");
			return Math.PI / 4;
		} else {

			// console.log("Up");
			return 0;
		}
	} else if(keysDown.leftKey){

		// Left
		// return -( Math.PI / 2 );
		if(this.state.player.scaleX == 1){
			return -( Math.PI / 2 );
		} else {
			return Math.PI / 2;
		}
	} else if (keysDown.rightKey) {

		//Right
		return Math.PI / 2;
	} else {

		// console.log("No direction was selected when shooting")
		if(this.state.player.scaleX < 0){
			return Math.PI / 2;
		} else {
			return -(Math.PI / 2);
		}
	}
};

BeamManager.prototype.enemyKilled = function() {
		this.stopShooting();
};

CameraManager = function(state){
	this.state = state;
    this.shakeSize = 3;
    this.damageState = false;
    this.shakeDamage = this.state.game.time.clock.createTimer('shakeDamage', 0.005, 0, false);
    this.lockCamera = true;



}

/**
* This method moves the game camera dynamically via the player, but restrained on game borders
* @method updateCamera
* @public
*/
CameraManager.prototype.update = function () {
    this.updatePosition();
    this.shakeCamera();
    if(this.damageState){
        this.shakeCameraDamage();
    }

    // if(this.state.weaponManager.beamManager.enemyTarget){
    //     this.shakeCameraDamage();
    // }


    
}


CameraManager.prototype.takeDamage = function() {
    //console.log("I'M HERE")

    this.shakeDamage.clear();
    this.shakeDamage.stop();
    this.shakeDamage.delay = 0.45;
    this.shakeDamage.repeatCount = 1;
    this.shakeDamage.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.damageReset, this);
    this.shakeDamage.start();
    this.damageState = true;
    
};

CameraManager.prototype.shakeCameraDamage = function() {

    this.state.camera.transform.x += Math.floor(Math.random() * 6 - 3);
    this.state.camera.transform.y += Math.floor(Math.random() * 6 - 3);
    
};

CameraManager.prototype.damageReset = function() {

    this.damageState = false;
};

CameraManager.prototype.shakeCamera = function() {
    this.shakeSize = this.state.weaponManager.beamStage * 3 + 3;
    if(this.state.weaponManager.enemyTargeted){
        this.state.camera.transform.x += Math.floor(Math.random() * this.shakeSize - (this.shakeSize * 0.5));
        this.state.camera.transform.y += Math.floor(Math.random() *this.shakeSize - (this.shakeSize * 0.5));
    }
};

CameraManager.prototype.updatePosition = function() {

    // Lock Position
    if( this.lockCamera ) {
        this.state.camera.transform.x = -20;

        if (this.state.player.y < this.state.game.stage.height / 2) {
        this.state.camera.transform.y = 0;
    } else if (this.state.player.y > (this.state.levelManager.groundLayer.heightInPixels - (this.state.game.stage.height / 2))) {
        this.state.camera.transform.y = -(this.state.levelManager.groundLayer.heightInPixels - this.state.game.stage.height);
    } else {
        this.state.camera.transform.y = -this.state.player.y + this.state.game.stage.height / 2; // was 2
    }

    // Free position

    } else {

    if (this.state.player.x < this.state.game.stage.width / 2) {
            this.state.camera.transform.x = 0;
        } else if (this.state.player.x > (this.state.levelManager.groundLayer.widthInPixels - (this.state.game.stage.width / 2))) {

            // Lock Camera
            this.lockCamera = true;
            // this.state.createBoss();
            
            // this.state.boss.appear();
            this.state.camera.transform.x = -(this.state.levelManager.groundLayer.widthInPixels - this.state.game.stage.width);
        } else {
            this.state.camera.transform.x = -this.state.player.x + this.state.game.stage.width / 2;
        }
        
        if (this.state.player.y < this.state.game.stage.height / 2) {
            this.state.camera.transform.y = 0;
        } else if (this.state.player.y > (this.state.levelManager.groundLayer.heightInPixels - (this.state.game.stage.height / 2))) {
            this.state.camera.transform.y = -(this.state.levelManager.groundLayer.heightInPixels - this.state.game.stage.height);
        } else {
            this.state.camera.transform.y = -this.state.player.y + this.state.game.stage.height / 2; // was 2
        }
    }
};
CollisionManager = function(state){
	this.state = state;
	this.beamCollideDistance = 12;

	this.ghostCollideDistance = 80;

	this.bookCollideDistance = 30;
	this.shieldHitDistance = 200;
	this.bossHitDistance = 70;
	this.bookHitDistance = 30;
	this.hitCounter = 0;


}



/**
* This method checks to see if a player is on a leftSlope.
*
* Please note, "leftSlope" is refering to a slope that when the player is standing on the tile, facing away from the tile, the player is facing left.
* Also note, this function checks for the outward edges of the sloping tile and calculates those points too for a more polished slope interaction
*
* @method checkLeftSlope
* @public
*/

CollisionManager.prototype.update = function(){
	var onGround = false;

	//if the player is not on a slope, check for regular tile collision
	if (!this.state.sloping) {
		//overlap ground
		this.state.levelManager.groundLayer.physics.overlapsTiles(this.state.player, true);
		//Are we on the ground?
		if (this.state.player.physics.isTouching(Kiwi.Components.ArcadePhysics.DOWN)) {

			// Attempt to fix pants bounce problem
			this.state.player.physics.velocity.y = 0;


			this.jumps = 0;
			if(this.state.player.jumping){
				this.state.player.roll();
			}
			onGround = true;
		}
	} else {
		//on ground anyway, so reset jumps
		if (this.state.player.physics.velocity.y >= 0) {
			this.state.jumps = 0;
			if(this.state.player.jumping){
				this.state.player.roll();
			}
			onGround = true;
		}
	}
	
	//set animation
	if (onGround) {
		if (this.state.player.physics.velocity.x == 0) {
			//this.animatePlayer('idle');
		} else {
		   // this.animatePlayer('walking');
		}
	}



}
CollisionManager.prototype.checkLeftSlope = function () {
	var tx = Math.floor(this.state.px / this.state.tileWidth);
	var ty = Math.floor(this.state.py / this.state.tileHeight);

	//basic slope tile collision, entering a slope from the top
	var slope = this.state.levelManager.slopeLeftLayer.getTileFromXY(tx, ty);
	if (slope != null) {
		//if a tile exists, check collision
		if (slope.index != 0) {
			//get the slope postion
			var slopeX = tx * this.state.tileWidth;
			var slopeY = ty * this.state.tileHeight;
			this.state.sloping = true;

			//get the difference of player position ad slope 0,0 co-ordinates
			var diffX = this.state.px - slopeX;
			var diffY = this.state.py - slopeY;

			//if you're within the solid part of a sloping tile
			//OR if youve just entered a tile from the right, snap down into the tile
			if ((diffY >= this.state.tileHeight - diffX)
			|| (this.state.px - (this.state.player.physics.velocity.x / 10) >= slopeX + this.tileWidth)) {
				var destY = slopeY + this.state.tileHeight - diffX;

				this.state.player.y = Math.ceil(destY - this.state.player.height);
				//this.player.physics.velocity.y = 40;

				// Attempt to fix pants bounce problem
				this.state.player.physics.velocity.y = 0;

				//already sloping, so no need for further checking
				return;
			}
		}
	}

	//check when entering onto a sloping tile, and also when between two, or when you'ce fallen "into" the tile
	var aboveSlope = this.state.levelManager.slopeLeftLayer.getTileFromXY(tx, ty-1);
	if (aboveSlope != null) {
		//if a tile exists, check collision
		if (aboveSlope.index != 0) {
			var aboveSlopeX = tx * this.state.tileWidth;
			var aboveSlopeY = (ty-1) * this.state.tileHeight;

			//flag to ignore remaining map collision in the update loop
			this.state.sloping = true;

			var diffX = this.state.px - aboveSlopeX;
			var destY = (aboveSlopeY + this.state.tileHeight) - diffX;

			this.state.player.y = destY - this.state.player.height;
			//this.player.physics.velocity.y = 40;
		}
	}
}

/**
* This method checks to see if a player is on a rightSlope.
*
* Please note, "rightSlope" is refering to a slope that when the player is standing on the tile, facing away from the tile, the player is facing right.
* Also note this function checks for the outward edges of the sloping tile and calculates those points too for a more polished slope interaction
*
* @method checkRightSlope
* @public
*/
CollisionManager.prototype.checkRightSlope = function () {
	if (this.sloping) {
		//console.log('Already sloping on left slope')
		return;
	}
	//get the bottom centre point ofthe character to calculate position from
	//tile based location
	var tx = Math.floor(this.state.px / this.state.tileWidth);
	var ty = Math.floor(this.state.py / this.state.tileHeight);

	var slope = this.state.levelManager.slopeRightLayer.getTileFromXY(tx, ty);
	if (slope != null) {
		//if a tile exists, check collision
		if (slope.index != 0) {
			//get the slope postion
			var slopeX = tx * this.state.tileWidth;
			var slopeY = ty * this.state.tileHeight;

			//flag to ignore remaining map collision in the update loop
			this.state.sloping = true;

			//get the difference of player position ad slope 0,0 co-ordinates
			var diffX = this.state.px - slopeX;
			var diffY = this.state.py - slopeY;

			//if you're within the solid part of a sloping tile
			//OR if youve just entered a tile from the left, snap down into the tile
			if ((diffY >= diffX)
			|| (this.state.px - (this.state.player.physics.velocity.x / 10) <= slopeX)) {
				this.state.player.y = Math.ceil(slopeY + diffX - this.state.player.height);
				//this.player.physics.velocity.y = 40;

				// Attempt to fix pants bounce problem
				this.state.player.physics.velocity.y = 0;

				//already sloping, so no need for further checking
				return;
			}
		}
	}

	//check when entering onto a sloping tile, or when you've fallen "into" the tile
	var aboveSlope = this.state.levelManager.slopeRightLayer.getTileFromXY(tx, ty - 1);
	if (aboveSlope != null) {
		//if a tile exists, check collision
		if (aboveSlope.index != 0) {
			//flag to ignore remaining map collision in the update loop
			this.state.sloping = true;

			var aboveSlopeX = tx * this.state.tileWidth;
			var aboveSlopeY = (ty - 1) * this.state.tileHeight;
			var diffX = this.state.px - aboveSlopeX;

			this.state.player.y = Math.ceil(aboveSlopeY + diffX - this.state.player.height);
			//this.player.physics.velocity.y = 40;
		}
	}
}




CollisionManager.prototype.checkBeamIntersectsEnemy = function () {
	var beam = this.state.weaponManager.beamManager.beam,
		beamManager = this.state.weaponManager.beamManager,
		collisions = [],
		enemies = this.state.enemyManager.enemies;
		// console.log( "Hello" );


	for (var i = enemies.members.length - 1; i >= 0; i--) {
		var tempRes = new Kiwi.Geom.IntersectResult();
		// console.log (enemies.members[i], beam.beamLine)
		if( !beam.beamLine ) {
			return;
		}
		if( enemies.members[i].alpha < 1 ){
			continue;
		}
		if( !enemies.members[i].canBeHit ){
			continue;
		}
		Kiwi.Geom.Intersect.lineSegmentToRectangle( beam.beamLine, enemies.members[i].box.hitbox, tempRes );
		if ( tempRes.result ){
			

			var num1 = Math.pow( beam.x - enemies.members[i].centerPoint.x, 2 ) 
			+ Math.pow( beam.y - enemies.members[i].centerPoint.y, 2 );

			var num2 = Math.sqrt(num1);

			if (num2 < beam.beamLength + 20 ){

				// This is to make sure the line only hits things 

				// Calculates the dir of beam and then the dir of enemy from beam.
				var dir = beam.desiredLength.x ,
					dir2 = enemies.members[i].centerPoint.x - beam.x,
					dir3 = dir * dir2;



				if( dir3 >= 0 ){
					var a = {};
					a.enemy = enemies.members[i];
					a.intersectResult = tempRes; 
					if( a.enemy.hit ){
						// continue;
					}

				}  else {
					//return false;
				}
				

				
				
				if(a){
					// console.log( a, "Adding Enemy");
					collisions.push( a );
					
				}


				
			}

			// console.dir( tempRes );
		}
	};

	if (collisions.length > 0){
		return collisions;
	}
	return false;
}
var EnemyManager = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.enemies = new Kiwi.Group(state);
	this.deathGroup = new Kiwi.Group(state);
	this.itemGroup = new Kiwi.Group(state);

	this.addChild(this.enemies);
	this.state.addChild(this.deathGroup);
	this.addChild(this.itemGroup);
	this.enemiesLength = 0;
	this.rotChanged = false;

	




}
Kiwi.extend(EnemyManager , Kiwi.Group);

EnemyManager.prototype.checkCollision = function(entity) {

	// check if entity collides with enemygroup
	
	var enemiesMem = this.enemies.members;
	this.enemiesLength = this.enemies.members.length;
	var myEnemy = null;
	//console.log(this.enemiesLength)

	for (var i = this.enemiesLength - 1; i >= 0; i--) {

		if(enemiesMem[i].physics.overlaps(entity)){
			myEnemy =  enemiesMem[i];
			//console.log('setting hit!');
			this.enemies.members[i].hit = true;
		} else {
			//console.log("Hello")
		}


	};
	return myEnemy;
}

EnemyManager.prototype.releaseGhosts = function(entity) {

	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		this.enemies.members[i].targetIndex = 0;
		this.enemies.members[i].hit = false; 
	};
}


EnemyManager.prototype.enemiesAlive = function() {
	return this.enemies.members.length;
}


EnemyManager.prototype.resetHit = function() {
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		this.enemies.members[i].hit = false;
	};
};

EnemyManager.prototype.resetEnemies = function() {
	this.resetHit();
};




EnemyManager.prototype.trap = function ( ghost ) {
	var tempHealth;

	// console.log("TRAPPED", ghost.hit , this.state.miniGameManager.miniGameActive);

	if(!ghost.hit && this.state.miniGameManager.miniGameActive){
		console.log ( "INSIDE" );
		ghost.hit = true;
		tempHealth = this.state.miniGameManager.getHealth();
		this.state.miniGameManager.skullGroup.clear();

		this.state.miniGameManager.createSkulls (tempHealth + 3);

		
	}
	ghost.hit = true;
	//console.log("Ghost hit is:", ghost.hit)
}

EnemyManager.prototype.checkGroupCollision = function(targetGroup) {

	// check if entity collides with enemygroup
	
	var enemiesMem = this.enemies.members;
	this.enemiesLength = this.enemies.members.length;
	var targetMem = targetGroup.members;

	for (var i = this.enemiesLength - 1; i >= 0; i--) {

		if(enemiesMem[i].physics.overlaps(entity)){
			return true;
		}


	};
	return false;
}

EnemyManager.prototype.addEnemies = function(num){
	//add 'num' enemies to group
	for (var i = num - 1; i >= 0; i--) {
		var tempGhost = new Ghost(this.state, Math.random()*this.state.width * 0.5 + this.state.width * 0.5, 440);
        this.enemies.addChild(tempGhost);
        this.enemiesLength ++;
    }
}


EnemyManager.prototype.spawnSurvivalGhost = function(){
	//add 'num' enemies to group

	//x = 1255 y 2164 range = 909
	var xPos = Math.floor( Math.random() * this.state.game.stage.width ),
		yPos = 220 + Math.random() * 440;

	var tempGhost = new Ghost(this.state, xPos, yPos);
	tempGhost.survival = true;

    this.enemies.addChild(tempGhost);
    this.enemiesLength ++;
}
EnemyManager.prototype.getTrappedEnemies = function () {
	var trappedEnemies = [];
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		if( this.enemies.members[i].hit ){
			trappedEnemies.push( this.enemies.members[i] );
		}
	};
	return trappedEnemies;
}


EnemyManager.prototype.updateTrappedAnimation = function () {
	var rand,
		enemies = this.getTrappedEnemies();
		// console.log(enemies, "ZACH?")

	for (var i = enemies.length - 1; i >= 0; i--) {
		rand = Math.floor( Math.random() * 3 );
		enemies[i].health -=1;
		switch ( rand ){
			case 0:
				enemies[i].animation.play('damage1');
				break;
			case 1:
				enemies[i].animation.play('damage2');
				break;
			case 2:
				enemies[i].animation.play('damage3');
				break;
			default:
				enemies[i].animation.play('damage3');
		}
		// console.log( enemies[i].animation.currentAnimation.name , "Animation Switched To")
	};
}

EnemyManager.prototype.updateTrappedEnemies = function() {
	var playerVelX = this.state.player.physics.velocity.x,
		playerVelY = this.state.player.physics.velocity.y;

	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		if( this.enemies.members[i].hit ){
			console.log(playerVelX, playerVelY, "Updating Hit Ghost");
			this.enemies.members[i].x += playerVelX;
			this.enemies.members[i].y += playerVelY;
		}
	};
}

EnemyManager.prototype.addEnemy = function(type, x, y){
	//add 'num' enemies to group
	if(type == 'ghost'){
		var tempGhost = new Ghost(this.state, x, y);
        this.enemies.addChild(tempGhost);
        this.enemiesLength ++;

	}
		
}

EnemyManager.prototype.removeEnemies = function(){
	this.animation.play('shoot');
}


EnemyManager.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	var enemiesMem = this.enemies.members;
	this.enemiesLength = enemiesMem.length;
	this.checkPlayerCollision();
	for (var i = this.enemiesLength - 1; i >= 0; i--) {

		//////////////////////////
		//Update enemies here
		//enemiesMem[i].update();
		//enemies[i].
	};
}
EnemyManager.prototype.kill = function(enemy) {
	var temp = this.enemies.members

	this.enemies.removeChild(enemy, true); 
	//this.state.egon.stopShooting();
};

EnemyManager.prototype.changeRotPoint = function() {
	var en = this.getTrappedEnemies();
	
	for (var i = en.length - 1; i >= 0; i--) {
		if(en[i].rotPointX == 0 ){
			en[i].rotPointX = Math.random() * 30 -15;
			en[i].rotPointY = Math.random() * 30 -15;

		}
	};
};


EnemyManager.prototype.restoreRotPoint = function(){
	var en = this.getTrappedEnemies();
	this.rotChanged = false;
	
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		if ( this.enemies.members[i].rotPointX != 0 ){
			this.enemies.members[i].rotPointX = 0;
			this.enemies.members[i].rotPointY = 0;
		}
	};
};


EnemyManager.prototype.killTrapped = function(enemy) {
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		if( this.enemies.members[i].hit ) {
			// console.log( "Hello!" )
			this.killEnemy( this.enemies.members[i]);
		}
	};

};

EnemyManager.prototype.killEnemy = function(enemy) {
	enemy.exists = false;

	
	
};

EnemyManager.prototype.killAll = function(enemy) {
	for (var i = this.enemies.members.length - 1; i >= 0; i--) {
		this.enemies.members[i].exists = false;
	};
	// console.log( "All enemies removed", this.enemies );
};



EnemyManager.prototype.checkPlayerCollision = function(){
	Kiwi.Group.prototype.update.call(this);
	var enemiesMem = this.enemies.members;
	this.enemiesLength = enemiesMem.length;

	for (var i = this.enemiesLength - 1; i >= 0; i--) {

		//////////////////////////
		//Update enemies here
		if(enemiesMem[i].animation.currentAnimation.name != 'appear' && enemiesMem[i].animation.currentAnimation.name != 'disappear'){
			if(enemiesMem[i].physics.overlaps(this.state.player)){
				this.state.player.hitByEnemy();
			}
			
		}
	};
}
var GameManager = function(state){
	this.state = state;
	this.playersEnergy = 100;
    this.playersHealth = 10;
    this.playerDamage = 1;
    //this.damageTimer = 0;
    this.DAMAGE_TIMER = 70;
    this.canTakeDamage = true;
    this.score = 0;

    this.damageTimer = this.state.game.time.clock.createTimer('damageTimer', 0.45, 0, false);
    this.state.createSurvivalGame();

}

GameManager.prototype.update = function(){
    //this.damageTimer --;
    // console.log(this.damageTimer);
    if(this.playersHealth <= 0){
        this.state.player.die();
        // this.state.levelManager.gameOver();
    }



    if(this.state.weaponManager.shooting){
        if(this.playersEnergy > 0 ){
            this.playersEnergy -= 0.1;
        } else {
            this.state.weaponManager.stopShooting();
        }

    } else if(this.playersEnergy <= 100){
        this.playersEnergy += 0.5;
    }

};

GameManager.prototype.addScore = function(amount){
   this.score += amount;

};

GameManager.prototype.playersEnergy = function() {
	return this.playersEnergy;
	// body...
};

GameManager.prototype.playerHitByEnemy = function() {
    //console.log(this);
    // as.as.as.asdafafa
    if(this.canTakeDamage && !this.state.player.invulnerable){
        this.startDamageTimer();
        this.state.player.takeDamage();
        this.state.cameraManager.shakeCamera();
        this.playersHealth -= this.playerDamage;
        //this.damageTimer = this.DAMAGE_TIMER;
    }
};

GameManager.prototype.startDamageTimer = function() {
    
    this.damageTimer.clear();
    this.damageTimer.stop();
    this.damageTimer.delay = 0.45;
    this.damageTimer.repeatCount = 1;
    this.damageTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.damageReset, this);
    this.damageTimer.start();
    this.canTakeDamage = false;
};
GameManager.prototype.damageReset = function() {
    //console.log("RESET");
    this.canTakeDamage = true;
};

GameManager.prototype.gameOver = function() {
    var params = {
        score: this.score

    }

    return params;
};
HUDManager = function(state){
	this.state = state;

	/////////////////////////////
    //HUD
    this.playersHealth = new Kiwi.HUD.Widget.Bar(this.state.game, 6, 10, 130, 13, 80, 9);
    
    this.playersHealth.style.backgroundColor = "#transparent";
    this.playersHealth.style.boxShadow="2px 2px 2px 0px #000000, 0px 0px 2px 2px #FF0000 inset ";

    this.playersHealth.bar.style.backgroundColor = "#FF0000";
    this.playersHealth.bar.style.boxShadow=" 2px 2px 2px 0px #777777 inset";

    this.playersEnergy = new Kiwi.HUD.Widget.Bar(this.state.game, 100, 100, 130, 27, 80, 9);
    ////////
    //BACK BAR
    this.playersEnergy.style.backgroundColor = "#transparent";
    this.playersEnergy.style.boxShadow="2px 2px 2px 0px #000000, 0px 0px 2px 2px #3c8fdc inset";
    
    ////////////////
    //FRONT BAR
    this.playersEnergy.bar.style.backgroundColor = "#3c8fdc";
    this.playersEnergy.bar.style.boxShadow="2px 2px 2px 0px #999999 inset";



    ////////////////////////////
    //SCORE

    this.hudScore = new Kiwi.HUD.Widget.TextField(this.state.game, '$6500', 150, 42);
    
    this.hudScore.style.fontFamily = 'myFirstFont';
    this.hudScore.style.color = '#FFB674';
    this.hudScore.style.textShadow ="2px 2px #000000";
    this.hudScore.style.fontSize ="12px";
    this.hudScore.style.letterSpacing ="1px";


    this.state.game.huds.defaultHUD.addWidget(this.playersHealth);
    this.state.game.huds.defaultHUD.addWidget(this.playersEnergy);
    this.state.game.huds.defaultHUD.addWidget(this.hudScore);

    this.energy = 100;
    this.health = 10;
    this.score = 0;


    ////////////////////////////////
    //FACE
    this.faceIcon = new Kiwi.HUD.Widget.Icon(this.state.game, this.state.textures.UI, 10, 10);
    this.state.game.huds.defaultHUD.addWidget(this.faceIcon);





}


HUDManager.prototype.update = function(){

	this.energy = this.state.gameManager.playersEnergy;

    this.health = this.state.gameManager.playersHealth;
    this.score  = this.state.gameManager.score;

	this.playersEnergy.counter.current = this.energy;
    this.playersHealth.counter.current = this.health;

    this.hudScore.text = "$"+this.score;


}
HUDManager.prototype.endState = function() {
    this.state.game.huds.defaultHUD.removeAllWidgets();
};


var InputManager = function (state, x, y){
    this.state = state;



    
    this.keyboard = this.state.game.input.keyboard;
    this.mouse = this.state.game.input.mouse;

    

    ///////////////////
    //KEYBOARD
    this.rightKey = this.keyboard.addKey(Kiwi.Input.Keycodes.D);
    this.rightArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.RIGHT);

    this.leftKey = this.keyboard.addKey(Kiwi.Input.Keycodes.A);
    this.leftArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.LEFT);

    this.upKey = this.keyboard.addKey(Kiwi.Input.Keycodes.W);
    this.upArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.UP);

    this.downKey = this.keyboard.addKey(Kiwi.Input.Keycodes.S);
    this.downArrowKey = this.keyboard.addKey(Kiwi.Input.Keycodes.DOWN);

    this.spawnKey = this.keyboard.addKey(Kiwi.Input.Keycodes.Q);
    this.restartKey = this.keyboard.addKey(Kiwi.Input.Keycodes.R);

    this.shootKey = this.keyboard.addKey(Kiwi.Input.Keycodes.J);
    this.shoot2Key = this.keyboard.addKey(Kiwi.Input.Keycodes.Z);

    this.jumpKey = this.keyboard.addKey(Kiwi.Input.Keycodes.K);
    this.jump2Key = this.keyboard.addKey(Kiwi.Input.Keycodes.X);

    this.gemKey = this.keyboard.addKey(Kiwi.Input.Keycodes.G);
    this.gameOverKey = this.keyboard.addKey(Kiwi.Input.Keycodes.F);

    this.captureKey = this.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);
    ////////////////////////
    //MOUSE
    //this.state.game.input.onUp.add(this.mouseUp, this);
    //this.state.game.input.onDown.add(this.mouseDown, this);

    this.keyboard.onKeyDownOnce.add(this.keyDownOnce, this);
    this.keyboard.onKeyUp.add(this.keyUp, this);








}

InputManager.prototype.keyDownOnce = function(keyCode, key) {
    // body...
    //console.log(keyCode, key);

    if(keyCode == this.rightKey.keyCode || keyCode == this.rightArrowKey.keyCode){
        this.state.player.updateKeyDown('RIGHT');
    } 

    if(keyCode == this.leftKey.keyCode || keyCode == this.leftArrowKey.keyCode){
        this.state.player.updateKeyDown('LEFT');
    } 

    if(keyCode == this.upKey.keyCode || keyCode == this.upArrowKey.keyCode){
        this.state.player.updateKeyDown('UP');
    } 
    if(keyCode == this.jumpKey.keyCode || keyCode == this.jump2Key.keyCode){
        this.state.player.updateKeyDown('JUMP');
        this.keyUp(this.shootKey.keyCode, this.jumpKey);
    }

    if(keyCode == this.spawnKey.keyCode){
        this.state.enemyManager.addEnemies(1);
    }
    ////////////////////
    //Shooting
    if(keyCode == this.shootKey.keyCode || keyCode == this.shoot2Key.keyCode){
        this.state.weaponManager.shootKeyDown();
    }
    /////////////////////
    //Capture
    if(keyCode == this.captureKey.keyCode){
        var matched = this.state.miniGameManager.attemptMatch();
        // console.log("CAPTURE KEY", matched);
        if (!matched){
            if(this.state.miniGameManager.miniGameActive){
                this.state.gameManager.playersEnergy -= 10;
                
            }
        }
    }
    if(keyCode == this.gemKey.keyCode){
        var tempPoint = new Kiwi.Geom.Point(this.mouse.x, this.mouse.y);
        tempPoint = game.cameras.defaultCamera.transformPoint(tempPoint);
        this.state.itemManager.addItem('gem', tempPoint.x, tempPoint.y);
    }



};

InputManager.prototype.keyUp = function(keyCode, key) {
    // body...
    //console.log(keyCode, key);
    //Move
    if(keyCode == this.rightKey.keyCode || keyCode == this.rightArrowKey.keyCode){
        this.state.player.updateKeyUp('RIGHT');
    } 

    if(keyCode == this.leftKey.keyCode || keyCode == this.leftArrowKey.keyCode){
        this.state.player.updateKeyUp('LEFT');
    } 

    if(keyCode == this.upKey.keyCode || keyCode == this.upArrowKey.keyCode){
        this.state.player.updateKeyUp('UP');
    } 
    //Jump
    if(keyCode == this.jumpKey.keyCode || keyCode == this.jump2Key.keyCode){
       this.state.player.updateKeyUp('JUMP');
    }
    //Shoot
    if(keyCode == this.shootKey.keyCode || keyCode == this.shoot2Key.keyCode){
        this.state.weaponManager.shootKeyUp();
    }

    if(keyCode == this.restartKey.keyCode){
        this.state.levelManager.switchStates();
    }
    if(keyCode == this.gameOverKey.keyCode){
        // this.state.levelManager.gameOver();
    }
    

};

InputManager.prototype.switchStates = function(){
    this.keyboard.onKeyDownOnce.remove(this.keyDownOnce, this);
    this.keyboard.onKeyUp.remove(this.keyUp, this);
}

InputManager.prototype.getKeysDown = function(){
    var keys = {
        rightKey: this.rightKey.isDown || this.rightArrowKey.isDown,
        leftKey: this.leftKey.isDown || this.leftArrowKey.isDown,
        upKey: this.upKey.isDown || this.upArrowKey.isDown,
        downKey: this.downKey.isDown || this.downArrowKey.isDown
    }
    return keys;
}
var ItemManager = function(state){
    Kiwi.Group.call(this, state);
    this.state = state;
    this.items = new Kiwi.Group(state);
    this.itemGroup = new Kiwi.Group(state);

    this.addChild(this.items);
    this.addChild(this.itemGroup);
    this.enemiesLength = 0;

    




}
Kiwi.extend(ItemManager , Kiwi.Group);






ItemManager.prototype.addItem = function(type, x, y, num){
    if(type == 'cash'){
        var tempItem = new Cash(this.state, x, y);
        this.items.addChild(tempItem);
    }

    if(type == 'gem'){
        var tempItem = new Gem(this.state, x, y);
        this.items.addChild(tempItem);
    }
   
}




ItemManager.prototype.update = function(){
    Kiwi.Group.prototype.update.call(this);
    var itemsMem = this.items.members;
    this.itemsLength = itemsMem.length;
    //CHECK PLAYER COLLISIONS
    this.checkCollision();

    
}
ItemManager.prototype.removeItem = function(item) {
    var temp = this.items.members

    this.items.removeChild(item, true); 
};


ItemManager.prototype.checkCollision = function() {
    var itemsMem = this.items.members;
    this.itemsLength = itemsMem.length;

    for (var i = this.itemsLength - 1; i >= 0; i--) {
        if(itemsMem[i].hittable){
            if(itemsMem[i].physics.overlaps(this.state.player)){
                //console.log("YEah you did it!");
                itemsMem[i].hitPlayer();


            }
        }
        
    };
};


LevelManager = function (state){
	this.state = state



}


/**
* The generateTileMap method outputs and organizes tile map data in individual layers
* @method generateTileMap
* @public
*/
LevelManager.prototype.generateTileMap = function () {
    //Tile map
    this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this.state, 'tilemap', this.state.textures.tiles);



    //background
    this.backgroundLayer = this.tilemap.getLayerByName('Background');
    this.backgroundLayer.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;

    this.state.addChild(this.backgroundLayer);


    //ground
    this.groundLayer = this.tilemap.getLayerByName('Ground');
    this.groundLayer.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    this.state.addChild(this.groundLayer);

    this.objectLayer = this.tilemap.getLayerByName('Objects');
    this.objectLayer.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    this.state.addChild(this.objectLayer);

    this.slopeLeftLayer = this.tilemap.getLayerByName('SlopeLeft');
    this.slopeLeftLayer.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    this.state.addChild(this.slopeLeftLayer);

    this.slopeRightLayer = this.tilemap.getLayerByName('SlopeRight');
    this.slopeRightLayer.allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    this.state.addChild(this.slopeRightLayer);

    //allow all tile layers to interact/not interact
    for (var i = 1; i < this.tilemap.tileTypes.length; i++) {
        this.tilemap.tileTypes[i].allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    }
}

/**
* The generateForegroundTileMap method generates tile map data in front of the player
* @method generateForegroundTileMap
* @public
*/
LevelManager.prototype.generateForegroundTileMap = function () {
    //foreground assets
    this.foregroundRightLayer = this.tilemap.getLayerByName('Foreground');
    this.state.addChild(this.foregroundRightLayer);

    /////////////////////
    //Test
    this.slopeRightForegroundLayer = this.tilemap.getLayerByName('SlopeRight');
    this.state.addChild(this.slopeRightForegroundLayer);
    this.slopeLeftForegroundLayer = this.tilemap.getLayerByName('SlopeLeft');
    this.state.addChild(this.slopeLeftForegroundLayer);
}

LevelManager.prototype.gemsLevelOne = function() {
    // this.state.itemManager.addItem('gem', 409, 569);
    // this.state.itemManager.addItem('gem', 672, 571);
    // this.state.itemManager.addItem('gem', 1160, 478);
    // this.state.itemManager.addItem('gem', 1529, 330);
    // this.state.itemManager.addItem('gem', 1708, 332);
    // this.state.itemManager.addItem('gem', 1727, 157);
    // this.state.itemManager.addItem('gem', 1507, 168);
    // this.state.itemManager.addItem('gem', 1325, 208);
    // this.state.itemManager.addItem('gem', 1259, 273);
    // this.state.itemManager.addItem('gem', 1230, 347);
};

LevelManager.prototype.ghostsLevelOne = function() {
    //this.state.enemyManager.addEnemy('ghost', 992, 479);
    //this.state.enemyManager.addEnemy('ghost', 1610, 320);
};

LevelManager.prototype.gameOver = function() {
    this.state.hudManager.endState();

    if(this.state.survivalGame){
        this.state.survivalGame.spawnTimer.stop();
    }
    var params = this.state.gameManager.gameOver();
    if( this.boss != undefined ) {
        this.state.boss.endState();
        
    }
    game.states.switchState("GameOver", null, null, params);
};

LevelManager.prototype.switchStates = function(){

        this.state.hudManager.endState();
        this.state.inputManager.switchStates();
    

        game.states.switchState("Intro");
}
//PlayerManager / Player
var PlayerManager = function (state, x, y){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call( this, state, state.textures.egonSprite, x, y );

 

	// Top half animations
	this.animation.add('idle', [15], 0.1, true);
	this.animation.add('walk', [ 8, 9, 10, 11, 12, 13, 14, 15 ], 0.05, true);
	this.animation.add('shootHorz', [ 8, 9, 10, 11, 12, 13, 14, 15 ], 0.05, true);
	this.animation.add('shootVert', [ 16, 17, 18, 19, 20, 21, 22, 23 ], 0.05, true);
	this.animation.add('shootDiagonal', [ 0, 1, 2, 3, 4, 5, 6, 7 ], 0.05, true);
	this.animation.add('jump', [ 24, 25], 0.1, false);
	this.animation.add('roll', [ 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 33, 33 ], 0.005, false);
	this.animation.add( 'death', [43], 1, true );
	this.animation.add( 'damaged', [ 44, 44, 44, 44, 44, 44, 44, 44, 44, 44 ], 0.05, false, false );
	this.animation.play('idle'); 

	this.invulnerable = false;

	// Bottom half animations
	
	// this.members[1].animation.add('walk', [ 34, 35, 36, 37, 38, 39, 40, 41 ], 0.05, true);
	// this.members[1].animation.add('idle', [42], 0.1, false);
	// this.members[1].animation.play('idle'); 


	this.box.hitbox = new Kiwi.Geom.Rectangle(25, 20, 35, 80); 
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	
	this.physics.acceleration.y = 30;
	//this.physics.velocity.y = 15;

	this.invulnerable = false;
	this.force = 4;
	this.maxRunVelo = 26;
	this.beamStage = 0;
	this.jumpHeight = 40;
	this.shootingMovementSpeed = 0.5;

	this.playedDeath = false;

	this.centerPoint = new Kiwi.Geom.Point( 0, 0 );

	///////////////////
	//KEYBOARD
	this.rightKeyDown = false;
	this.leftKeyDown = false;
	this.upKeyDown = false;
	this.jumpKeyDown = false;


	////////////////////////
	//MOUSE
	// this.state.game.input.onUp.add(this.mouseUp, this);
	// this.state.game.input.onDown.add(this.mouseDown, this);



	/////////////////////////
	//BOOLEANS
	this.currDir = this.RIGHT;
	this.jumping = false;

	this.takeDamageTimer = this.game.time.clock.createTimer('takeDamageTimer', 0.25, 0, false);




	this.animation.getAnimation('roll').onStop.add(this.finishedRoll, this);
	this.animation.getAnimation('damaged').onStop.add(this.finishedDamaged, this);



};
Kiwi.extend(PlayerManager, Kiwi.GameObjects.Sprite);



PlayerManager.prototype.takeDamage = function() {
	//console.log("I'M HERE")
	// this.cat.y.s.f;
	// If the player has been hit he is invulnerable for 2 seconds
	if( this.invulnerable ){
		return;
	} else {
		this.invulnerable = true;
		
	}

	this.state.cameraManager.takeDamage();
	this.state.weaponManager.stopShooting();

	this.physics.acceleration.x = 0;
	this.physics.velocity.x = this.scaleX * 140;
	// console.log('Scale', this.scaleX, this.scaleX * 140, this.physics.velocity.x);
	this.physics.velocity.y = -60;

	// this.physics.update();

	this.takeDamageTimer.clear();
	this.takeDamageTimer.stop();
	this.takeDamageTimer.delay = 0.33;
	this.takeDamageTimer.repeatCount = 6;
	this.takeDamageTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.flash, this);
	this.takeDamageTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.stopFlash, this);
	this.takeDamageTimer.start();

	this.animation.play('damaged');
	this.alpha = 0.25;
	this.state.playersLegs.alpha = 0;
	
};

PlayerManager.prototype.flash = function() {
	if(this.alpha == 0.25){
		this.alpha = 0.75;
	} else {
		this.alpha = 0.25;
	}
};
PlayerManager.prototype.stopFlash = function() {
	this.invulnerable = false;
	
	this.alpha = 1;
	
};



PlayerManager.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	if(this.x > 2200){
		this.x = -50;
	} else if(this.x < -50){
		this.x = 2200;
	}

	this.updateMovement();

	// Checks if boss exists
	if(this.state.boss){
		this.updateBookCollisions();
		
	}



	
	

	if(this.y > 1000){
		this.y = 50;
	}

	//CHECK TILES
	//round the player position to make tile calculation easier
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);

	this.state.playersLegs.updateLegs();

	if( this.state.weaponManager.shooting ) {
		this.animation.play( this.shootAnimation, false );
		if(this.scaleX != this.shootScaleX){
			this.state.playersLegs.animation.currentAnimation.reverse = true;
		} else {
			this.state.playersLegs.animation.currentAnimation.reverse = false;
		}

		this.scaleX = this.shootScaleX;
		this.state.playersLegs.scaleX = this.shootScaleX;
	}
		
	
};

PlayerManager.prototype.updateBookCollisions = function() {
	if ( this.state.collisionManager.bookHitPlayer() ){
		this.hitByEnemy();
	}
};
PlayerManager.prototype.setAnimation = function () {
	var dir = this.state.weaponManager.beamManager.getDirection();

	// Makes sure animation is not changed when character is being knocked back
	if( this.animation.currentAnimation.name == 'damaged' ) {
		return;
	}


		switch ( dir ) {

			// Left up
			case -( Math.PI / 4 ):
				this.shootAnimation = 'shootDiagonal';
			// this.animation.play( 'shootDiagonal', false );
				break;

			// Right Up
			case Math.PI / 4:
				this.shootAnimation = 'shootDiagonal';
				// this.animation.play( 'shootDiagonal', false );
				break;

			// Up
			case 0:
				this.shootAnimation = 'shootVert';
				// this.animation.play( 'shootVert', false );
				break;

			// Left
			case -( Math.PI / 2 ):
				this.shootAnimation = 'shootHorz';
				// this.animation.play( 'shootHorz', false );
				break;

			// Right
			case Math.PI / 2:
				this.shootAnimation = 'shootHorz';
				// this.animation.play( 'shootHorz', false );
				break;
			default:
				break;
		}

		this.shootScaleX = this.scaleX;


};

// This get the animation if the player is not shooting
PlayerManager.prototype.setNormalAnimation = function () {
	var dir = this.state.weaponManager.beamManager.getDirection();


		switch ( dir ) {

			// Left up
			case -( Math.PI / 4 ):
				this.normalAnimation = 'shootDiagonal';
			// this.animation.play( 'shootDiagonal', false );
				break;

			// Right Up
			case Math.PI / 4:
				this.normalAnimation = 'shootDiagonal';
				// this.animation.play( 'shootDiagonal', false );
				break;

			// Up
			case 0:
				this.normalAnimation = 'shootVert';
				// this.animation.play( 'shootVert', false );
				break;

			// Left
			case -( Math.PI / 2 ):
				this.normalAnimation = 'shootHorz';
				// this.animation.play( 'shootHorz', false );
				break;

			// Right
			case Math.PI / 2:
				this.normalAnimation = 'shootHorz';
				// this.animation.play( 'shootHorz', false );
				break;
			default:
				break;
		}

		//this.shootScaleX = this.scaleX;


};

PlayerManager.prototype.jump = function(){
	if(this.animation.currentAnimation.name == 'damaged' ){
		return;
	}

	if(this.jumpKeyDown && !this.jumping){
		if(this.physics.velocity.x === 0){
			this.physics.velocity.x += (this.maxRunVelo * 1.25) * -this.scaleX;
			//this.scaleX *= -1;
		}
		this.physics.velocity.y = -this.jumpHeight;
		this.physics.velocity.x = this.maxRunVelo * 2 * -this.scaleX;
		this.jumping = true;

		if (this.animation.currentAnimation.name != 'jump'){
			
			   this.animation.play('jump');
	   }
	} 

};

PlayerManager.prototype.roll = function(){
	if (this.animation.currentAnimation.name != 'roll'){
		
		this.animation.play('roll');
	}
};
PlayerManager.prototype.finishedRoll = function(){

	this.jumping = false;
   
};
PlayerManager.prototype.finishedDamaged = function(){
	// console.log( "Finished Damage" );
	this.state.playersLegs.alpha = 0;
	// if(this.animation.currentAnimation == 'damaged'){
		this.animation.play('idle');
		
	// }
   
};

PlayerManager.prototype.updateAnimations = function () {
	//EITHER MOVE KEYS DOWN
	this.setNormalAnimation();
	if(this.animation.currentAnimation.name == 'damaged' ){
		return;
	}
	if(this.leftKeyDown || this.rightKeyDown){
		//console.log("Animation", this.shootAnimation );
		if (this.animation.currentAnimation.name != this.normalAnimation && !this.jumping ){
				// this.animation.play('walk');

				this.animation.play(this.normalAnimation);
				// this.state.playersLegs.animation.play('walk', false);
				// this.state.playersLegs.animation.play(this.normalAnimation, false);
			}
		this.state.playersLegs.animation.play('walk', false);
	} else if(this.upKeyDown) {
		
		//console.log( "INSIDE UP KEY DOWN");
		if (this.animation.currentAnimation.name != this.normalAnimation && !this.jumping ){
				this.animation.play( this.normalAnimation );
			}
	} else {
		if (this.animation.currentAnimation.name != 'idle' && !this.jumping && this.animation.currentAnimation.name != 'damaged' ){
			   this.animation.play('idle');
			   this.state.playersLegs.animation.play('idle', false);
			
		}
			   
	}
};


// If no movement keys are down it eases the players velocity by 92%
PlayerManager.prototype.negativeAccel = function () {

	//BOTH MOVE KEYS UP
	if((!this.rightKeyDown && !this.leftKeyDown) && !this.jumping || this.animation.currentAnimation.name == 'damaged' ){
		if(this.physics.velocity.x > 6 || this.physics.velocity.x < -6){
			this.physics.velocity.x *= 0.92;
		} else {this.physics.velocity.x = 0;}
	}

};

// This is used to slowdown / speed up player if jumping or shooting
PlayerManager.prototype.modifyVelocity = function () {

	if (this.jumping){
		return 2;// this.maxRunVelo * 2;
	} else if (this.state.weaponManager.shooting){
		//
		//console.log("Shooting Mod")
		return this.shootingMovementSpeed;//this.maxRunVelo * 0.5;
	} else {
		return  1;//this.maxRunVelo;
	}

};

PlayerManager.prototype.updateMovement = function(direction){
	this.negativeAccel();
	this.updateAnimations();

	var veloMod = this.modifyVelocity();

	if(this.animation.currentAnimation.name != 'damaged' ){
		// console.log("IM STILL MOVING", game.time.now());
		if(this.rightKeyDown){
			this.scaleX = -1;
			if(this.physics.velocity.x < this.maxRunVelo * veloMod){
				
				this.physics.velocity.x += this.force;
			} else if(!this.jumping){
				this.physics.velocity.x = this.maxRunVelo  * veloMod;
			}

		} else if(this.leftKeyDown){
			this.scaleX = 1;
			//this.physics.velocity.x -= this.force;
			if(this.physics.velocity.x > -this.maxRunVelo * veloMod){
				//console.log(this.physics.velocity.x);
				this.physics.velocity.x -= (this.force);
			} else if(!this.jumping){
				this.physics.velocity.x = -this.maxRunVelo  * veloMod;
			}

		}

	}
	this.centerPoint.x = this.worldX + this.width * 0.5;
	this.centerPoint.y = this.worldY + this.height * 0.5;

	//If camera is lock lock position to boss fight area
	if( this.state.cameraManager.lockCamera ){
		var maxXPos = this.state.game.stage.width - this.width + 20;
		if( this.x < 20 ) {
			this.x = 20;
		} else if (this.x > maxXPos){
			this.x = maxXPos;
		}
	}
};







PlayerManager.prototype.updateKeyDown = function(key) {
	if(key == 'RIGHT'){
		this.rightKeyDown = true;
	}
	if(key == 'LEFT'){
		this.leftKeyDown = true;
	}

	if( key == 'UP'){
		this.upKeyDown = true;
	}

	if(key == 'JUMP'){
		this.jumpKeyDown = true;
		this.jump();
	}


};




PlayerManager.prototype.updateKeyUp = function(key) {
	if(key == 'RIGHT'){
		this.rightKeyDown = false;
	}
	if(key == 'LEFT'){
		this.leftKeyDown = false;
	}
	if( key == 'UP'){
		this.upKeyDown = false;
	}


	if(key == 'JUMP'){
		this.jumpKeyDown = false;
	}
};

PlayerManager.prototype.hitByEnemy = function() {
	if(!this.jumping){
		this.state.gameManager.playerHitByEnemy();
	}
};

PlayerManager.prototype.die = function() {
		this.alpha = 0;
	if( !this.playedDeath ){
		this.playedDeath = true;
		this.deathAni = new DeathAnimation(this.state, this.x, this.y);
		this.state.addChild( this.deathAni );	
	}


};






var SurvivalGame = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;

	this.wave = 1;
	this.waveLimit = 1;
	this.waveCounter = 0;
	this.attempt = 0;
	this.maxWave = 4;

	this.canSpawn = true;

	this.spawnTimer  = this.game.time.clock.createTimer('shoot', 2, -1, false);
    this.spawnEvent = this.spawnTimer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.attemptSpawn, this);  //create a new timer event on that timer
    this.spawnTimer.start();

	//Timers



	//On Enemy Die check if wave limit reached if so Wave ++;

	
	//Start Timer
	//On TimerTick Check if spawn
		// Spawn
		// or Wait


		//REWORK GHOST SPAWN POINTS

}
Kiwi.extend(SurvivalGame , Kiwi.Group);

SurvivalGame.prototype.attemptSpawn = function() {
	// console.log( "Attepmt Spawn", this.wave, this.waveLimit, this.waveCounter );
	
	if(!this.canSpawn){
		if ( this.state.enemyManager.enemiesAlive() !== 0){
			return;
		}
	}
	var enemiesAlive = this.state.enemyManager.enemiesAlive();

	if ( this.waveCounter < this.waveLimit && enemiesAlive < this.waveLimit) {
		this.spawnEnemy();
		this.waveCounter ++;
	} else if ( this.state.enemyManager.enemiesAlive() == 0 ) {
		this.newWave();
	} else {
		this.attempt += 1;
		if ( this.attempt > ( 10 ) ){
			this.newWave();
			this.attempt = 0;
			this.removeAllEnemies();
		}
	}

}

SurvivalGame.prototype.spawnEnemy = function() {
	this.state.enemyManager.spawnSurvivalGhost();
	this.canSpawn = false;
}

SurvivalGame.prototype.resetSpawn = function() {
	// this.state.enemyManager.spawnSurvivalGhost();
	// this.canSpawn = false;
	this.canSpawn = true;

	this.spawnTimer.stop();
	this.spawnTimer.start();
}

SurvivalGame.prototype.newWave = function() {
	this.wave += 1;
	this.attempt = 0;
	if( this.wave < this.maxWave ){
		this.waveLimit += 1;
		this.waveCounter = 0;
		
	} else {
		this.waveLimit = Math.floor( Math.random() * (this.maxWave + 1) ) + 1;
		this.waveCounter = 0;
	}
}

SurvivalGame.prototype.removeAllEnemies = function() {
	this.state.enemyManager.killAll();
}
var WeaponManager = function(state){
	this.state = state;



	this.shootKeyIsDown = false;
	this.shooting = false;
	this.beamShooting = false;
	this.beamNeedsUpdating = false;
	this.enemyTargeted = false;

	this.beamManager = new BeamManager(this.state);


	
}







WeaponManager.prototype.currentlyShooting = function(){
	//if jumping return false
	//if !mouseDown return false

	return this.shooting;
}




WeaponManager.prototype.update = function() {
	this.beamManager.update();
	// console.log("UPDATE WEAPON MANAGER")

	if(this.shooting == true && !this.state.player.jumping){
		//IF ADD MULTIPLE WEAPONS CHECK TYPE OF WEAPON THEN CALL THE START SHOOTING METHOD ON IT

		this.beamManager.shoot();
		//this.state.player.setAnimation();
	}


};



WeaponManager.prototype.stopShooting = function() {
	this.shooting = false;
	this.beamShooting = false;
	this.enemyTargeted = false
	this.beamStage = 0;
	this.beamManager.stopShooting();
	//this.beamManager.clearBeam()
	
   
};


WeaponManager.prototype.startShooting = function(){
	//console.log("startShooting has been reached");
	if(this.shooting == false && !this.state.player.jumping){
		//IF ADD MULTIPLE WEAPONS CHECK TYPE OF WEAPON THEN CALL THE START SHOOTING METHOD ON IT

		this.beamManager.shoot();
		this.state.player.setAnimation();
		this.shooting = true;
	}

}



WeaponManager.prototype.damageEnemy = function() {
	
};


WeaponManager.prototype.shootKeyUp = function(){

	this.shootKeyIsDown = false;

	
	this.stopShooting();



}



WeaponManager.prototype.shootKeyDown = function(){
		this.shootIsKeyDown = true;

		this.startShooting();
}

var BlueCircle = function(state, parent, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['blueCircle'], x, y);
	this.state = state;
	this.myParent = parent;
	var animationSpeed = 0.1;
	//var animationSpeed = (Math.random() * 0.1) + 0.05;
	this.animation.add('loop', [00, 01], 0.06, true);
	this.animation.add('fade', [02, 03, 04, 05], 0.1, false);
	this.animation.add('missedOne', [06, 06, 01, 06, 01, 06, 06], 0.1, false);
	this.animation.add('missedTwo', [07, 07, 01, 07, 07, 01, 07, 07], 0.1, false);
	this.animation.add('missedThree', [08, 08, 01, 08, 08, 01, 08, 08], 0.1, false);


	this.animation.play('loop');
	this.timesMissed = 0;


	this.animation.getAnimation('fade').onStop.add(this.resume, this);
	this.animation.getAnimation('missedTwo').onStop.add(this.resume, this);
	this.animation.getAnimation('missedThree').onStop.add(this.resume, this);
	this.animation.getAnimation('missedOne').onStop.add(this.resume, this);
	


	//this.animation.getAnimation('roll').onStop.add(this.finishedRoll, this);




}
Kiwi.extend(BlueCircle, Kiwi.GameObjects.Sprite);

BlueCircle.prototype.startLoop = function(){
	// this.animation.play('shoot');
}

BlueCircle.prototype.startNextStage = function(){
	this.myParent.hit = false;
	this.myParent.skullGroup.members[0].alpha = 1;
	this.animation.play('loop');

	this.myParent.stageUp();
}
BlueCircle.prototype.resume = function(){
	// this.myParent.hit = false;
	// this.myParent.skullGroup.members[0].alpha = 1;
	this.animation.play('loop');

	this.state.miniGameManager.continueMiniGame();

}


BlueCircle.prototype.capture = function(){
	// this.animation.play('shoot');
}
BlueCircle.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);

}
BlueCircle.prototype.missedHit = function() {
	if(this.timesMissed == 0){
		this.animation.play('missedThree');
	} else if(this.timesMissed == 1){
		this.animation.play('missedTwo');
	}else if(this.timesMissed == 2){
		this.animation.play('missedOne');
	} else {
		//do something bad
	}
	this.timesMissed += 1;
	return this.timesMissed;
};

var Confirm = function(state,  x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['confirm'], x, y);
	this.state = state;
	this.animation.add('one', [00, 00, 01, 00, 01, 00, 01, 00, 01], 0.1, false, true);
	this.animation.add('two', [02, 02, 03, 02, 03, 02, 03, 02, 03], 0.1, false);
	this.animation.add('three', [04, 04, 05, 04, 05, 04, 05, 04, 05], 0.1, false);
	this.animation.play('one');

	console.log("Here");

	var temp = Math.random()*3;
	Math.floor(temp);
	 
	// switch(Math.floor(temp)){
	// 	case 0:
	// 		this.animation.play('one');
	// 		break;
	// 	case 1:
	// 		this.animation.play('two');
	// 		break;
	// 	case 2:
	// 		this.animation.play('three');
	// 		break;
	// }



}
Kiwi.extend(Confirm, Kiwi.GameObjects.Sprite);

Confirm.prototype.update = function(){
    Kiwi.GameObjects.Sprite.prototype.update.call(this);

}
var MiniGame = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;

	this.hitRange = (Math.PI*2 / 360) * 15 ;

	this.rotBlue = 0;
	this.rotSkull = Math.PI*2;
	this.rotBlueSpeed = -0.0176
	this.rotSkullSpeed = 0.0227;

	this.redCircle;
	this.blueCircle;
	this.skullGroup;
	this.center = new Kiwi.Geom.Point( 0, 0 ); 

	this.radius = 84;

	this.miniGameActive = false;

	this.missCount = 0;
	this.trappedGhosts = 0;


	// Groups
		// Skull Group
			// Amount = health
	// Blue Circle Sprite (adjust rot point to center)
	// Red Circle Sprite


	// METHODS:

	// Update MiniGame
	// CreateNewMiniGame
	// MiniGameActive
	// Check Overlapping




}
Kiwi.extend(MiniGame , Kiwi.Group);




MiniGame.prototype.createMiniGame = function ( target, health ) {
	// this.beamTarget = this.state.weaponManager.beamManager.targets[0];

	this.beamTarget = this.state.weaponManager.beamManager.beam.impact;
	// this.beamTarget = new Kiwi.Geom.Point(0,0);
	// this.beamTarget.x = this.state.weaponManager.beamManager.targets[0].x;
	// this.beamTarget.y = this.state.weaponManager.beamManager.targets[0].y;

	this.removeOldGame();
	this.missCount = 0;

	this.updateMiniGamePos();
	this.moveMiniGame;
	this.createRedCircle();

	// console.log("CREATE SKULLS");

	this.createSkulls( health );
	//this.resetHealth();
	this.createBlueCircle();

	this.startMiniGame();


};

MiniGame.prototype.updateMiniGamePos = function(){
	// console.log(this.beamTarget, "BEAM TARGET");

	if ( this.state.weaponManager.beamManager.beam.impact !== undefined && this.state.weaponManager.beamManager.beam.impact.exists ){

		this.beamTarget = this.state.weaponManager.beamManager.beam.impact;
		
		this.center.x = this.beamTarget.worldX + this.beamTarget.width * 0.5;
		this.center.y = this.beamTarget.worldY +  this.beamTarget.height * 0.5;
		// console.log( "Center x and y 2 ", this.center.x, this.center.y);
	}

}
MiniGame.prototype.moveMiniGame = function(){
	this.redCircle.x = this.center.x - this.redCircle.width * 0.5;
	this.redCircle.y = this.center.y - this.redCircle.width * 0.5;

	this.blueCircleGroup.x = this.center.x; // - this.blueCircle.width * 0.5;
	this.blueCircleGroup.y = this.center.y; // - this.blueCircle.width * 0.5;

	this.skullGroup.x = this.center.x;
	this.skullGroup.y = this.center.y;
}

MiniGame.prototype.removeOldGame = function () {
	this.miniGameActive = false;
	this.miniGamePaused = false;
	this.trappedGhosts = 0;
	this.capturedGhosts = 0;
	if ( this.redCircle ) {
		this.redCircle.exists = false;
	}
	if( this.blueCircleGroup ) {
		this.blueCircleGroup.exists = false;
	}
	if( this.skullGroup ) {
		this.skullGroup.exists = false;
	}
}

MiniGame.prototype.createRedCircle = function( ){
	this.redCircle = new Kiwi.GameObjects.Sprite( this.state, this.state.textures.redCircle, this.center.x, this.center.y );

	this.redCircle.x -= this.redCircle.width * 0.5;
	this.redCircle.y -= this.redCircle.height * 0.5;
	this.addChild(this.redCircle);
};
MiniGame.prototype.createSkulls = function ( amount ) {
	var i, rot, tempSkull;

	if(this.skullGroup){
		this.skullGroup.exists = false;
		
	}
	this.skullGroup = new Kiwi.Group(this.state);
	for( i = amount - 1 ;  i >= 0;  i-- ) {
		// tempSkull = new Skull( this.state, this.center.x, this.center.y, this.radius );
		tempSkull = new Skull( this.state, 0, 0, this.radius );

		// Calculates the rotation of the skull 
		rot = ((2 * Math.PI) / amount * i);
		tempSkull.rotation = rot;
		this.skullGroup.addChild(tempSkull);
	}
	this.skullGroup.x = this.center.x;
	this.skullGroup.y = this.center.y;
	this.addChild( this.skullGroup );
};

MiniGame.prototype.resetHealth = function(){

	// Health should equal the current amount of skulls
};

MiniGame.prototype.getHealth = function() {
	if(this.skullGroup != undefined){
		return this.skullGroup.members.length;
	}
};

MiniGame.prototype.createBlueCircle = function() {

	this.blueCircleGroup = new Kiwi.Group ( this.state );

	var blueCircle = new BlueCircle( this.state, 0, 0);
	blueCircle.y = - this.radius; // - blueCircle.height * 0.5;
	// blueCircle.x = -blueCircle.width * 0.5;
	this.blueCircleGroup.addChild( blueCircle );
	this.blueCircleGroup.x = this.center.x;
	this.blueCircleGroup.y = this.center.y;
	this.state.addChild(this.blueCircleGroup);

};
MiniGame.prototype.startMiniGame = function() {
	this.miniGameActive = true;

};


MiniGame.prototype.missedHit = function() {
	this.timesMissed = this.blueCircleGroup.members[0].missedHit();
};

MiniGame.prototype.setAlpha = function( num ) {
	this.redCircle.alpha = num;
	// this.skullGroup.alpha = num;
	this.blueCircleGroup.members[0].alpha = num;
	for (var i = this.skullGroup.members.length - 1; i >= 0; i--) {
		this.skullGroup.members[i].members[0].alpha = num;
		// console.log( this.skullGroup.members[i].mySkull.alpha, num);
	}
};

MiniGame.prototype.startNextStage = function(){

	this.stage += 1;
	this.hit = false;
	// this.skullGroup.members[0].alpha = 1;
	}

MiniGame.prototype.updateRotation = function(){
	if( !this.miniGamePaused ) {
		this.updateSkullRotation();
		this.updateBlueCircleRotation();
		
	}


	//this.animation.play('dash');
}
MiniGame.prototype.updateSkullRotation = function () {
	for (var i = this.skullGroup.members.length - 1; i >= 0; i--) {
		this.skullGroup.members[i].rotation += this.rotSkullSpeed;
	};
}
MiniGame.prototype.updateBlueCircleRotation = function () {
	this.blueCircleGroup.rotation += this.rotBlueSpeed;
	this.blueCircleGroup.members[0].rotation = -this.blueCircleGroup.rotation
}

MiniGame.prototype.catchSkull = function (skull){
	var circRot, diffAngel, skullRot;

	circRot = this.getAngle(this.blueCircleGroup.rotation);
	skullRot = this.getAngle(skull.rotation);

	// console.log(circRot, skullRot, "Capture amounts");

	
	return this.calculateDifference( circRot, skullRot ) < this.hitRange;

}

MiniGame.prototype.getAngle = function(angle){
	while (angle < 0 ){
		angle += ( Math.PI * 2 );
	}
	return angle % (Math.PI * 2);
}

MiniGame.prototype.calculateDifference = function(a, b){

	var diffAngle = Math.abs(a - b);

	if( diffAngle > Math.PI ){
		return  Math.PI * 2 - diffAngle; 
	} else {
	return diffAngle; 

	}
}
MiniGame.prototype.capture = function(){
	// console.log("Capture");

	// UPDATE TRAPPED ENEMY ANIMATION


	this.state.enemyManager.updateTrappedAnimation();
	// SCREEN FLASH HERE
	this.miniGamePaused = true;
	this.blueCircleGroup.members[0].animation.play('fade');
	this.state.weaponManager.beamManager.updateBeamStage();
}

MiniGame.prototype.failCapture = function(){
	// this.animation.play('shoot');
	this.miniGamePaused = true;
	switch ( this.missCount ){
		case 0:
			this.blueCircleGroup.members[0].animation.play('missedOne');
			// this.blueCircleGroup.members[0].animation.play('fade');
			break;
		case 1:
			this.blueCircleGroup.members[0].animation.play('missedTwo');
			// this.blueCircleGroup.members[0].animation.play('fade');
			break;
		case 2:
			this.blueCircleGroup.members[0].animation.play('missedThree');
			// this.blueCircleGroup.members[0].animation.play('fade');
			break;
		default:
			this.state.weaponManager.stopShooting();
			this.removeOldGame();
	}

	this.missCount += 1 ;
}

MiniGame.prototype.continueMiniGame = function () {
	this.blueCircleGroup.members[0].animation.play('loop');
	this.miniGamePaused = false;

}

MiniGame.prototype.update = function(){
    Kiwi.Group.prototype.update.call(this);
    if( !this.miniGameActive ) {
    	return;
    }

    var number1 = this.state.game.time.now() - this.state.weaponManager.beamManager.releaseTime;
	var number2 = number1 / 2000;
	// console.log(1-number2, "Alpha");

    // If !player.shooting set minigame to inactive.

    this.updateRotation();
    this.updateMiniGamePos();
    this.moveMiniGame();

	this.state.miniGameManager.setAlpha( 1 - number2 );


}

MiniGame.prototype.updatePosition = function() {

	console.log("Update Circle Pos");
	var temp = this.state.weaponManager.beamManager.beams[0];
	this.center.x = temp.worldX + temp.width * 0.5;
	this.center.y = temp.worldY + temp.height * 0.5;
	this.updateObjectPos( this.redCircle );
	this.updateObjectPos( this.blueCircleGroup );
	this.updateObjectPos( this.skullGroup );
};

MiniGame.prototype.updateObjectPos = function( obj ) {
	obj.x = this.center.x;
	obj.y = this.center.y;
	// console.log(this.center.x, this.center.y, "Update Circle Pos");
};




MiniGame.prototype.stopMiniGame = function () {
	this.removeOldGame();
}


MiniGame.prototype.attemptMatch = function () {
	if(this.miniGameActive && this.state.weaponManager.beamManager.hasHit){
		for (var i = this.skullGroup.members.length - 1; i >= 0; i--) {
			if( this.catchSkull( this.skullGroup.members[i] ) ) {
				this.skullCaptured( this.skullGroup.members[i] );
				if(this.beamTarget.objType == 'Boss'){
					this.state.boss.hurtByBeam();
				}
				return true;
			} 
		};
		this.failCapture();
		return false;
	}
}

MiniGame.prototype.skullCaptured = function ( skull ) {
	skull.exists = false;
	
	if( this.getHealth() > 1 ){
		// this.state.weaponManager.beamManager.beamUpgrade();
		this.capture();
		return true;
	} else {
		this.killTarget();
	}
}
MiniGame.prototype.killTarget = function () {

	//todo
	var deathAmount = this.state.weaponManager.beamManager.targets.length;
	this.state.enemyManager.killTrapped();
	var tempDeath = new Death(this.state, 0, 0, deathAmount);
	tempDeath.x = this.center.x - tempDeath.width * 0.5;
	tempDeath.y = this.center.y - tempDeath.height * 0.5;
	this.state.addChild(tempDeath);
	this.state.weaponManager.stopShooting();


	this.state.weaponManager.beamManager.enemyKilled();
	this.removeOldGame();

}


var Skull = function(state, x, y, radius){
	Kiwi.Group.call(this, state);
	this.x = x;
	this.y = y;

	//, state.textures['skull'], x, y);
	this.state = state;

	var mySkull = new Kiwi.GameObjects.Sprite(this.state, this.state.textures.skull, 0, -radius)

	var num = Math.floor( Math.random() * 4 );
	mySkull.cellIndex = num;

	this.addChild(mySkull);

	// as.as.as
	// console.log("Create Skull");



	//this.animation.getAnimation('roll').onStop.add(this.finishedRoll, this);
	// Object.defineProperty(Skull.prototype, "alpha", {
	//     get: function () {
	//     },
	//     set: function (value) {
	//     	asas.asasa
	//     	console.error("HERE");
	//     },
	//     enumerable: true,
	//     configurable: true
	// });




}
Kiwi.extend(Skull, Kiwi.Group);


Skull.prototype.update = function(){
    Kiwi.Group.prototype.update.call(this);
    this.members[0].rotation = -this.rotation;
    // this.alpha = this.state.miniGameManager.redCircle.alpha;
    // console.log("Skull Alpha on Update", this.alpha);

}


//PlayerManager / Player
var PlayersLegs = function (state, x, y){
	//Kiwi.Group.call(this, state);
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['egonSprite'], x, y);
	this.state = state;

	// Bottom half animations
	
	this.animation.add('walk', [ 34, 35, 36, 37, 38, 39, 40, 41 ], 0.05, true);
	this.animation.add('idle', [42], 0.1, false);
	this.animation.play('idle'); 



	///////////////////
	//KEYBOARD
	this.rightKeyDown = false;
	this.leftKeyDown = false;
	this.jumpKeyDown = false;


}
Kiwi.extend(PlayersLegs, Kiwi.GameObjects.Sprite);

PlayersLegs.prototype.updateLegs = function(){

	this.x = this.state.player.x;
	this.y = this.state.player.y;

	this.scaleX = this.state.player.scaleX;

	if( this.state.player.jumping || this.state.player.animation.currentAnimation.name == 'damaged' ) {
		this.alpha = 0;
	} else {
		this.alpha = this.state.player.alpha;
	}
	
}


/*
//
// Behaviour Node Tree
// Plugin for Kiwi.js
//
// Benjamin D. Richards 2013.1220
// Working at Instinct Entertainment
//
*/


Kiwi.Plugins.AITree = 
{
	name:"AITree",
	version:"1.0"
}
Kiwi.PluginManager.register( Kiwi.Plugins.AITree );


/*
Core Node Declarations

These are specified in a block for portability and encapsulation.
The core block can be extracted or replaced and remain functional.
Namespaces may be overly verbose outside the Kiwi environment.
*/


// AI Tree
// A container for behaviour tree nodes.
// Attach this to your game object.
Kiwi.Plugins.AITree.AI = function()
{
	// Root node
	this.root = undefined;
	// Unique children census
	this.uniqueChildren = [];
	
	// Update
	this.update = function()
	{
		// Run the tree
		var status = 4;	// Error
		if( this.root.update != undefined )
		{
			status = this.root.update();
		}
		
		// Reset the tree
		for( var i = 0;  i < this.uniqueChildren.length;  i++ )
		{
			this.uniqueChildren[i].reset();
		}
		
		return( status );
	}
	
	// Register
	// Ensures all unique children are listed in the census
	// Is the only part of the tree that can originate a "true" response, which terminates
	// any updateCensus signals.
	this.updateCensus = function()
	{
		// Get complete population list
		var descendants = this.root.getDescendants();
		// Add unique population elements to census
		this.uniqueChildren = [ this.root ];
		for( var i = 0;  i < descendants.length;  i++ )
		{
			if( this.uniqueChildren.indexOf( descendants[i] ) == -1 )
			{
				// That is, the descendant is not yet represented in the census
				this.uniqueChildren.push( descendants[i] );
			}
		}
		// Signal completion
		return( true );
	}
	
	// Set Root
	// Special method for attaching root child to tree
	// Use this method rather than setting root directly
	// It rebuilds necessary information
	this.setRoot = function( candidate )
	{
		if( candidate != undefined )
		{
			this.root = candidate;
			this.root.addParent( this );	// Allow root to signal tree
			this.updateCensus();
		}
	}
	
	// Add Child
	// Alias of SetRoot
	this.addChild = function( candidate )
	{
		return( this.setRoot( candidate ) );
	}
	
	// Has Ancestor
	// Terminates a node-based ancestor seek
	this.hasAncestor = function( candidate )
	{
		return( false );
	}
	
	return( this );
}


// Outer Node
// A template for the outer nodes that perform actions or check conditions.
// Because these are the simplest nodes, they are also the template for other types.
Kiwi.Plugins.AITree.AITreeOuterNode = function( params )
{
	this.name = "untitledNode";
	// Parameters
	if( params != undefined )
	if( params.name != undefined )
	this.name = params.name;
	
	// Status types
	this.STATUS_READY = 0;
	this.STATUS_RUNNING = 1;
	this.STATUS_SUCCESS = 2;
	this.STATUS_FAILURE = 3;
	this.STATUS_ERROR = 4;
	
	// Status - this regulates traversal
	this.status = this.STATUS_READY;
	this.runningDirty = false;	// Flag is TRUE when it's just returned RUNNING status
	this.runsParent = true;		// Flag is TRUE when this passes RUNNING condition up the tree
	
	// Parents
	this.parents = [];
	
	// Update
	// Core functionality
	// Returns status
	this.update = function()
	{
		this.onUpdate();
		this.run();
		if( this.status == this.STATUS_RUNNING )	this.runningDirty = true;
		else										this.runningDirty = false;
		return( this.status );
	}
	
	// On Update
	// Override this method to make the node do something
	// Intended for generic Inner Node behaviours
	this.onUpdate = function()
	{
		// Code goes here
	}
	
	// Run
	// Override this method to make the node do something
	// Intended for specific, unique node behaviours
	this.run = function()
	{
		// Code goes here
	}
	
	// Reset
	// Called at the end of every frame to refresh the tree for a fresh traversal
	this.reset = function()
	{
		if( this.status == this.STATUS_RUNNING	&&	this.runningDirty )
		{
			// Running nodes stay running
			// But only if they have run this update
			// A node that doesn't run next update will be clean, and set to READY
			this.runningDirty = false;
			return;
		}
		if( this.status == this.STATUS_ERROR )
		{
			// Log all errors, but still reset
			console.log( "Error detected in " + this.name, this );
		}
		this.status = this.STATUS_READY;
	}
	
	// Add Parent
	// DO NOT CALL DIRECTLY - use addChild on the parent, which will do the jobs this doesn't
	// Registers unique parents
	// Does not check for cycling
	// Returns False if it already found that parent
	this.addParent = function( candidate )
	{
		if( this.parents.indexOf( candidate ) == -1 )
		{
			// That is, the candidate is not already a parent
			this.parents.push( candidate );
			return( true );
		}
		return( false );
	}
	
	// Remove Parent
	// DO NOT CALL DIRECTLY - use removeChild on the parent
	// Returns True if it found the parent and deregistered it, False if not
	this.removeParent = function( candidate )
	{
		var index = this.parents.indexOf( candidate );
		if( index != -1 )
		{
			// That is, the candidate is listed
			this.parents.splice( index, 1 );
			return( true );
		}
		return( false );
	}
	
	// Update Census
	// Blind signal to update the master tree census
	// Returns True when it gets to the master tree to facilitate fast completion
	// This is called automatically when necessary
	this.updateCensus = function()
	{
		for( var i = 0;  i < this.parents.length;  i++ )
		{
			var response = this.parents[i].updateCensus();
			if( response ) return( true );
		}
		return( false );
	}
	
	return( this );
}


// Inner Node
// A template for the inner nodes that facilitate tree traversal.
Kiwi.Plugins.AITree.AITreeInnerNode = function( params )
{
	// AITreeInnerNode inherits status, parents, update, run, and reset from AITreeOuterNode
	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );
	
	this.runsParent = false;	// Does not convey RUNNING status to parents
	
	// Children
	this.children = [];
	// Child bookmarked as running last update
	// Stored as an object to simplify shuffle behaviours
	this.currentlyRunningNode = undefined;
	
	this.shuffle = false;
	// Parameters
	if( params != undefined )
	if( params.shuffle )
	this.shuffle = params.shuffle;
	
	// On Update
	// Overrides default
	// Shared inner node functions
	this.onUpdate = function()
	{
		// Special functionality: shuffle the children
		if( this.shuffle )	this.shuffleChildren();
	}
	
	// Add Child
	// Passes a child node as candidate for inclusion.
	// Checks for validity - a child cannot be its own parent/ancestor.
	// Returns True if successful, False if this is an illegal child.
	// Candidate is only appended if it is legal.
	// Always use Add Child to add children; 
	//  direct array access or addParent do not prevent cycling.
	this.addChild = function( candidate )
	{
		// Sanitise inputs: avoid null or duplicate entries
		if( candidate == undefined	||	this.children.indexOf( candidate ) != -1 ) return;
		// Cycling check
		if( this.hasAncestor( candidate )	||	this === candidate )
		{
			// Illegal candidate
			return( false );
		}
		// Accept legal candidates
		this.children.push( candidate );
		candidate.addParent( this );
		// Register in tree census
		this.updateCensus();
		// Signal legal success
		return( true );
	}
	
	// Remove Child
	// Attempts to remove a child node.
	// Checks for validity: does the child actually exist?
	// Then attempts to update tree census
	// Always use this to deregister children, as it automatically updates tree data
	this.removeChild = function( candidate )
	{
		// Deregister childhood
		var index = this.children.indexOf( candidate );
		if( index != -1 )
		{
			// That is, it is a valid child and may be removed
			this.children.splice( index, 1 );
			// Deregister parenthood, ignoring returns because either way it's not a parent
			candidate.removeParent( this );
			// Rebuild tree census
			this.updateCensus();
		}
	}
	
	// Shuffle Children
	// Reorders the child array to create random output
	// Because of this behaviour, it is recommended that all node access be via Object, 
	//  not an array index.
	this.shuffleChildren = function()
	{
		var newChildren = [];
		while( 0 < this.children.length )
		{
			var i = Math.floor( Math.random() * this.children.length );
			newChildren.push( this.children[i] );
			this.children.splice( i, 1 );
		}
		this.children = newChildren;
	}
	
	// Has Ancestor
	// Recursive search for a particular node
	this.hasAncestor = function( candidate )
	{
		if( this === candidate )
		{
			// Found a match
			return( true );
		}
		for( var i = 0;  i < this.parents.length;  i++ )
		{
			var r = this.parents[i].hasAncestor( candidate );
			if( r )	return( true );
		}
		return( false );
	}
	
	// Get Descendants
	// Recursive census method
	// Returns all children and subsequent children
	// Does not eliminate duplicates
	this.getDescendants = function()
	{
		var descendants = [];
		for( var i = 0;  i < this.children.length;  i++ )
		{
			descendants.push( this.children[i] );
			if( this.children[i].getDescendants != undefined )
			{
				descendants = descendants.concat( this.children[i].getDescendants() );
			}
		}
		return( descendants );
	}
	
	return( this );
}


// Sequencer Node
// Inner node; steps through children until it finds a FAILURE or finishes its run.
// Upon finding a RUNNING node it also returns RUNNING and resumes from that point next update.
// Succeeds if it completes the run, fails if it finds a failure.
Kiwi.Plugins.AITree.Sequencer = function( params )
{
	// Inherit from Inner Node
	Kiwi.Plugins.AITree.AITreeInnerNode.call( this, params );
	
	// Run override
	this.run = function()
	{
		var start = 0;
		if( this.currentlyRunningNode != undefined )
		{
			var currentlyRunningIndex = this.children.indexOf( this.currentlyRunningNode );
			if( currentlyRunningIndex != -1 )
			{
				// Skip straight to the currently running node
				start = currentlyRunningIndex;
			}
		}
		for( var i = start;  i < this.children.length;  i++ )
		{
			var output = this.children[i].update();
			if( output == this.STATUS_RUNNING )
			{
				if( this.children[i].runsParent )
				{
					// The child is still running, so this node is running too
					this.status = this.STATUS_RUNNING;
					this.currentlyRunningNode = this.children[i];
				}
				else
				{
					// Non-contagious run; return SUCCESS
					this.status = this.STATUS_SUCCESS;
					this.currentlyRunningNode = undefined;
				}
				return;
			}
			else this.currentlyRunningNode = undefined;	// Not running
			if( output == this.STATUS_FAILURE )
			{
				// Task completed
				this.status = this.STATUS_FAILURE;
				return;
			}
		}
		// No significant results? Then this pass finishes as a success.
		this.currentlyRunningNode = undefined;	// Not running
		this.status = this.STATUS_SUCCESS;
	}
	
	return( this );
}


// Selector Node
// Inner node; steps through children until it finds a SUCCESS or finishes its run.
// Upon finding a RUNNING node it also returns RUNNING and resumes from that point next update.
// Succeeds if it finds a successful child, fails if it completes the run.
Kiwi.Plugins.AITree.Selector = function( params )
{
	// Inherit from Inner Node
	Kiwi.Plugins.AITree.AITreeInnerNode.call( this, params );
	
	// Run override
	this.run = function()
	{
		var start = 0;
		if( this.currentlyRunningNode != undefined )
		{
			var currentlyRunningIndex = this.children.indexOf( this.currentlyRunningNode );
			if( currentlyRunningIndex != -1 )
			{
				// Skip straight to the currently running node
				start = currentlyRunningIndex;
			}
		}
		for( var i = start;  i < this.children.length;  i++ )
		{
			var output = this.children[i].update();
			if( output == this.STATUS_RUNNING )
			{
				if( this.children[i].runsParent )
				{
					// The child is still running, so this node is running too
					this.status = this.STATUS_RUNNING;
					this.currentlyRunningNode = this.children[i];
				}
				else
				{
					// Non-contagious run; return SUCCESS
					this.status = this.STATUS_SUCCESS;
					this.currentlyRunningNode = undefined;
				}
				return;
			}
			else this.currentlyRunningNode = undefined;	// Not running
			if( output == this.STATUS_SUCCESS )
			{
				// Task completed
				this.status = this.STATUS_SUCCESS;
				return;
			}
		}
		// No significant results? Then this pass finishes as a failure.
		this.currentlyRunningNode = undefined;	// Not running
		this.status = this.STATUS_FAILURE;
	}
	
	return( this );
}


// Until Failure Node
// Inner node; steps through children until it finds a FAILURE.
// Upon finding a RUNNING node it also returns RUNNING and resumes from that point next update.
// Succeeds if it finds a failure. Does not have a fail state.
// CAUTION: This node can loop indefinitely. Be sure to provide it with an escape condition.
Kiwi.Plugins.AITree.UntilFailure = function( params )
{
	// Inherit from Inner Node
	Kiwi.Plugins.AITree.AITreeInnerNode.call( this, params );
	
	// Run override
	this.run = function()
	{
		var i = 0;
		if( this.currentlyRunningNode != undefined )
		{
			var currentlyRunningIndex = this.children.indexOf( this.currentlyRunningNode );
			if( currentlyRunningIndex != -1 )
			{
				// Skip straight to the currently running node
				i = currentlyRunningIndex;
			}
		}
		while( 0 < this.children.length )	// Essentially a "while true"
		{
			var output = this.children[i].update();
			if( output == this.STATUS_RUNNING )
			{
				if( this.children[i].runsParent )
				{
					// The child is still running, so this node is running too
					this.status = this.STATUS_RUNNING;
					this.currentlyRunningNode = this.children[i];
				}
				else
				{
					// Non-contagious run; return SUCCESS
					this.status = this.STATUS_SUCCESS;
					this.currentlyRunningNode = undefined;
				}
				return;
			}
			else this.currentlyRunningNode = undefined;	// Not running
			if( output == this.STATUS_FAILURE )
			{
				// Task completed
				this.status = this.STATUS_SUCCESS;
				return;
			}
			// Iterate and loop
			i++;
			if( this.children.length <= i)	i = 0;
		}
	}
	
	return( this );
}


// Until Success Node
// Inner node; steps through children until it finds a SUCCESS.
// Upon finding a RUNNING node it also returns RUNNING and resumes from that point next update.
// Succeeds if it finds a successful child. Does not have a fail state.
// CAUTION: This node can loop indefinitely. Be sure to provide it with an escape condition.
Kiwi.Plugins.AITree.UntilSuccess = function( params )
{
	// Inherit from Inner Node
	Kiwi.Plugins.AITree.AITreeInnerNode.call( this, params );
	
	// Run override
	this.run = function()
	{
		var i = 0;
		if( this.currentlyRunningNode != undefined )
		{
			var currentlyRunningIndex = this.children.indexOf( this.currentlyRunningNode );
			if( currentlyRunningIndex != -1 )
			{
				// Skip straight to the currently running node
				i = currentlyRunningIndex;
			}
		}
		while( 0 < this.children.length )	// Essentially a "while true"
		{
			var output = this.children[i].update();
			if( output == this.STATUS_RUNNING )
			{
				if( this.children[i].runsParent )
				{
					// The child is still running, so this node is running too
					this.status = this.STATUS_RUNNING;
					this.currentlyRunningNode = this.children[i];
				}
				else
				{
					// Non-contagious run; return SUCCESS
					this.status = this.STATUS_SUCCESS;
					this.currentlyRunningNode = undefined;
				}
				return;
			}
			else this.currentlyRunningNode = undefined;	// Not running
			if( output == this.STATUS_SUCCESS )
			{
				// Task completed
				this.status = this.STATUS_SUCCESS;
				return;
			}
			// Iterate and loop
			i++;
			if( this.children.length <= i)	i = 0;
		}
	}
	
	return( this );
}


// Until Time Node
// Inner node; steps through children until the clock runs out.
// Upon finding a RUNNING node it also returns RUNNING and resumes from that point next update.
// Succeeds after a certain time. Does not have a fail state.
// Unlike other Until nodes, this one has a built-in escape condition.
Kiwi.Plugins.AITree.UntilTime = function( params )
{
	// Inherit from Inner Node
	Kiwi.Plugins.AITree.AITreeInnerNode.call( this, params );
	
	// Timer
	this.timerDuration = 100;	// Measured in milliseconds
	// Parameters
	if( params != undefined )
	if( params.timerDuration != undefined )
	this.timerDuration = params.timerDuration;
	
	// Run override
	this.run = function()
	{
		// Initiate timer
		var endTime = this.getTime() + this.timerDuration;
		
		// Resume running node
		var i = 0;
		if( this.currentlyRunningNode != undefined )
		{
			var currentlyRunningIndex = this.children.indexOf( this.currentlyRunningNode );
			if( currentlyRunningIndex != -1 )
			{
				// Skip straight to the currently running node
				i = currentlyRunningIndex;
			}
		}
		
		while( this.getTime() < endTime )
		{
			var output = this.children[i].update();
			if( output == this.STATUS_RUNNING )
			{
				if( this.children[i].runsParent )
				{
					// The child is still running, so this node is running too
					this.status = this.STATUS_RUNNING;
					this.currentlyRunningNode = this.children[i];
				}
				else
				{
					// Non-contagious run; return SUCCESS
					this.status = this.STATUS_SUCCESS;
					this.currentlyRunningNode = undefined;
				}
				return;
			}
			// Iterate and loop
			i++;
			if( this.children.length <= i)	i = 0;
		}
		this.status = this.STATUS_SUCCESS;
	}
	
	// Get Time
	// Uses various methods to seek the best available time in millis.
	this.getTime = function()
	{
		if( window.performance.now )	return( window.performance.now() );
		if( window.performance.webkitNow )	return( window.performance.webkitNow() );
		return( new Date().getTime() );
	}
	
	return( this );
}


/*
End Core Node Declarations
*/
/**
* 
* @model Kiwi
* @submodel Plugins
* @class ShareButton
*/
Kiwi.Plugins.ShareButton = {
	name: 'ShareButton',
	version: '1.0.0'
}
Kiwi.PluginManager.register(Kiwi.Plugins.ShareButton);

//Do Kiwi Plugin GameObjects Exist?
if( typeof Kiwi.Plugins.GameObjects == "undefined") {
    Kiwi.Plugins.GameObjects = {}; 
}

Kiwi.Plugins.GameObjects.ShareButton = function(state, atlas, x, y){

	Kiwi.GameObjects.Sprite.call(this, state, atlas, x, y);

	this.animation.add('up', [0], 0.1, false);
	this.animation.add('down', [1], 0.1, false);	
	this.animation.play('up');
	this.isDown = false;
	this.isUp = true;
	this.hitbox = new Kiwi.Geom.Rectangle(x, y, this.width, this.height);
	this.enabled = true;

}
Kiwi.extend(Kiwi.Plugins.GameObjects.ShareButton, Kiwi.GameObjects.Sprite);

Kiwi.Plugins.GameObjects.ShareButton.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	var hit = false;
    //bug w/game.input
	//if(this.game.input.isDown) console.log('DOWN')
	if(this.enabled){
	    if (this.game.input.isDown) {
	        //console.log('input:', this.game.input.pointers)
			for(var i = 0; i<this.game.input.pointers.length; i++){
				if(this.game.input.pointers[i].active){
					if(this.hitbox.containsPoint(this.game.input.pointers[i].point)){
						if(this.isUp){
							this.isDown = true;
							this.isUp = false;
							if(this.animation.currentAnimation.name!='down')
								this.animation.switchTo('down', true);
								this.buttonDown();
						}
						hit = true;
					}
				}
			}
		}
	}


	if(!hit){
		if(this.isDown){
			this.isDown = false;
			this.isUp = true;
			if(this.animation.currentAnimation.name!='up')
				this.animation.switchTo('up', true);
		}
	}

}

//Disables the use of this button 
Kiwi.Plugins.GameObjects.ShareButton.prototype.disable = function(){
	this.enabled = false;
}

//Enables the use of this button 
Kiwi.Plugins.GameObjects.ShareButton.prototype.enable = function(){
	this.enabled = true;
}

//Hides the button but still allows its use
Kiwi.Plugins.GameObjects.ShareButton.prototype.hide = function(){
	this.visibility = false;
}

//Shows the button if it was hidden
Kiwi.Plugins.GameObjects.ShareButton.prototype.show = function(){
	this.visibility = true;
}
Kiwi.Plugins.GameObjects.ShareButton.prototype.buttonDown = function(){
	/////////////////////////////////////
	//PUT SHARING CODE HERE
	console.log('Share button hit');





	//END SHARING CODE
	/////////////////////////////////////
	
}
Kiwi.Plugins.GhostAI =
{
	name:"GhostAI",
	version:"1.0"
}
Kiwi.PluginManager.register(Kiwi.Plugins.GhostAI);

Kiwi.Plugins.GhostAI.Actions = {};
Kiwi.Plugins.GhostAI.Conditions = {};

Kiwi.Plugins.GhostAI.Actions.MoveToLocation = function( params )
{
	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;
	this.target = params.sprite.targetLocation;
	this.proximityThreshold = 16;

	this.run = function()
	{
		
		var distX = this.target[0] - this.sprite.x;
		var distY = this.target[1] - this.sprite.y;
		var dist = Math.sqrt( distX * distX + distY * distY );

		if( dist < this.proximityThreshold )
		{
			this.status = this.STATUS_SUCCESS;
		}
		else if( dist != 0 )
		{

			var dx = distX / dist;
			var dy = distY / dist;

			this.sprite.x += dx * this.sprite.speed;
			this.sprite.y += dy * this.sprite.speed;


			this.status = this.STATUS_RUNNING;
		}
		

	}
	return( this );
}

Kiwi.Plugins.GhostAI.Actions.SelectNewLocation = function( params )
{

	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;
	this.top = params.top;
	this.bottom = params.bottom;
	this.left = params.left;
	this.right = params.right;
	this.distance = params.distance;
		
	this.run = function()
	{

		var direction = Math.random() * 360;
		
		var dx = Math.cos(direction) * this.distance;
		var dy = Math.sin(direction) * this.distance;

		var x = this.sprite.x + dx;
		var y = this.sprite.y + dy;

		if(y > this.sprite.bottom)
			y = this.sprite.bottom;
		if(y < this.sprite.top)
			y = this.sprite.top;
		if(x < this.sprite.left)
			x = this.sprite.left;
		if(x > this.sprite.right)
			x = this.sprite.right;

		// Endless Wave Positions
		var xPos = Math.floor( Math.random() * game.stage.width ),
		yPos = 220 + Math.random() * 440;

		x = xPos;
		y = yPos;

		this.sprite.targetLocation[0] = x;
		this.sprite.targetLocation[1] = y;

		this.status = this.STATUS_SUCCESS;
	}
	return( this );
}

Kiwi.Plugins.GhostAI.Actions.Hit = function( params )
{
	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;
	this.proximityThreshold = 16;

	this.run = function()
	{
		
		
		

	}
	return( this );
}

Kiwi.Plugins.GhostAI.Actions.Pause = function( params )
{

	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;
	this.length = params.length;
	// if(this.sprite.dashAmount <= 0 ){
	// 	console.log("ONCE");
	// 	this.length *= 2;
	// }

		
	this.run = function()
	{

		if(this.sprite.pauseTime < this.length){
			this.sprite.pauseTime++;
			this.status = this.STATUS_RUNNING;
		}
		else{
			this.sprite.pauseTime = 0;
			this.status = this.STATUS_SUCCESS;
		}

	}
	return( this );
}

Kiwi.Plugins.GhostAI.Actions.Teleport = function( params )
{

	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;
	this.length = params.length;
		
	this.run = function()
	{
		this.status = this.STATUS_SUCCESS;
		this.sprite.isVisible = false;
		if(this.sprite.dashAmount > 0){
			this.sprite.isVisible = true;			
		}

		this.sprite.teleport();

		// Reset Everything

	}
	return( this );
}

Kiwi.Plugins.GhostAI.Conditions.DetectVisible = function( params ){

	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;

	this.run = function()
	{
		this.status = this.STATUS_FAILURE;
			
			if(this.sprite.isVisible){
				this.status = this.STATUS_SUCCESS;
				 //console.log("VISIBILE");
			}else{
				//console.log("NOOOOO VISIBILE");
			}
	}
	
	return( this );
}

Kiwi.Plugins.GhostAI.Conditions.DetectHit = function( params ){

	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;

	this.run = function()
	{
		this.status = this.STATUS_FAILURE;
			
			if(this.sprite.hit){
				this.status = this.STATUS_SUCCESS;
				//console.log("HIT");
			}else{
				//console.log("NOOOOO HIT");
			}
	}
	
	return( this );
}

Kiwi.Plugins.GhostAI.Conditions.DetectEgon = function( params ){

	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;
	this.target = params.target;

	this.run = function(){

		this.status = this.STATUS_FAILURE;

		var ghostPoint = new Kiwi.Geom.Point(this.sprite.x, this.sprite.y);

			if(ghostPoint.distanceToXY(this.target.x, this.target.y) < this.sprite.detectionDistance){
				this.status = this.STATUS_SUCCESS;
				// console.log('detected egon');
			}
		}
}

Kiwi.Plugins.GhostAI.Actions.Appear = function( params )
{
	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;

	this.run = function(){

		

		this.status = this.STATUS_RUNNING;
		if(this.sprite.animation.currentAnimation.name!='appear' && this.sprite.animation.currentAnimation.name != 'dash'){
			//console.log('appear node');
			//this.sprite.isVisible = true;
	        this.sprite.animation.switchTo('appear', true);
	    } 
	    else if( this.sprite.animation.currentCell==15 || this.sprite.animation.currentAnimation.name == 'dash' ){
	    	this.sprite.isVisible = true;
	    	this.sprite.animation.switchTo('dash', true);
	    	this.status = this.STATUS_SUCCESS;
	    }
	}
}

Kiwi.Plugins.GhostAI.Actions.Dash = function( params )
{
	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;
	this.target = params.target;
	this.proximityThreshold = 1;
	this.stepSizeZach = 0.01;

	this.run = function()
	{

		this.targetLocation = this.sprite.targetLocation;
		
		var distX = this.targetLocation[0] - this.sprite.x;
		var distY = this.targetLocation[1] - this.sprite.y;
		var dist = Math.sqrt( distX * distX + distY * distY );

		if( dist < this.proximityThreshold )
		{	

			if( this.sprite.dashAmount <= 0 ){
				this.sprite.animation.play('disappear', true);
			}
			// this.sprite.canEscape = true;
			
			this.status = this.STATUS_SUCCESS;
		}
		else if( dist != 0 )
		{

			var dx = distX / dist;
			var dy = distY / dist;

			///////////////////////////////////
			//ZACH EDIT
			var MIN_SPEED = 0.2;



			this.sprite.x += (this.targetLocation[0] - this.sprite.x) * this.stepSizeZach;
			this.sprite.y += (this.targetLocation[1] - this.sprite.y) * this.stepSizeZach;

			////////
			//INCOMING BAD LOGIC
			

			if((this.targetLocation[0] - this.sprite.x) >= 0){
				//console.log("RIGHT");
				this.sprite.x += MIN_SPEED;

				
			} else {
				//console.log("LEFT");
				this.sprite.x -= MIN_SPEED;
			}

			if((this.targetLocation[1] - this.sprite.y) >= 0){
				//console.log("RIGHT");
				this.sprite.y += MIN_SPEED;

				
			} else {
				//console.log("LEFT");
				this.sprite.y -= MIN_SPEED;
			}


			//END ZACH
			///////////////////////////

			///////////////////
			//LOXY STUFF

			//this.sprite.x += dx * this.sprite.dashSpeed;
			//this.sprite.y += dy * this.sprite.dashSpeed;

			//END LOXY STUFF
			///////////////////
			
	        if(this.sprite.animation.currentAnimation.name!='dash'){
	        	this.sprite.animation.switchTo('dash', true);
	        }


			this.status = this.STATUS_RUNNING;
		}
		

	}
	return( this );
}

Kiwi.Plugins.GhostAI.Actions.SelectDashTarget = function( params )
{
	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;
	this.target = params.target;

	this.run = function()
	{
		//console.log(this.target);

		// this.sprite.createQuestionMark();
		if(this.sprite.x > this.target.x){
			this.sprite.targetLocation[0] = this.target.x - 150;
			this.sprite.targetLocation[1] = this.target.y;
		} else {
			this.sprite.targetLocation[0] = this.target.x + 150;
			this.sprite.targetLocation[1] = this.target.y;
		}
		

		this.status = this.STATUS_SUCCESS;
	}
}

Kiwi.Plugins.GhostAI.Actions.IsEscaping = function( params )
{

	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;
	// this.length = params.length;
		
	this.run = function()
	{

		if(this.sprite.canEscape){
			this.status = this.STATUS_SUCCESS;
		} else {
			this.status = this.STATUS_FAILURE;
		}

	}
	return( this );
}


Kiwi.Plugins.GhostAI.Actions.PlayEscape = function( params )
{

	Kiwi.Plugins.AITree.AITreeOuterNode.call( this, params );

	this.sprite = params.sprite;
	this.length = params.length;
		
	this.run = function()
	{
		// is playing animation
			//is done
				//success
			// is not done 
				// running
		// play animation
			// running

		if (this.sprite.animation.currentAnimation.name == 'disappear' || this.sprite.animation.currentAnimation.name == 'disappear2'){
			if(this.sprite.cellIndex != 44){
				this.status = this.STATUS_RUNNING;
			} else {
				this.status = this.STATUS_SUCCESS;

			}

		} else {
			// console.log("START ANIMATION");
			this.sprite.createQuestionMark();
			this.sprite.animation.play('disappear', true);
			
			// this.sprite.scaleX = 1;
			this.status = this.STATUS_RUNNING;
		}

	
	}
	return( this );
}
/**
* Primitive Gameobjects plugin, providing geometric objects to the designer.
*
* @module Kiwi
* @submodule Plugins
* @namespace Kiwi.Plugins
* @class Primitives
*/
Kiwi.Plugins.Primitives = {

	/**
	* The name of this plugin.
	* @property name
	* @type String
	* @default "Primitives"
	* @public
	*/
	name:"Primitives",

	/**
	* The version of this plugin.
	* @property version
	* @type String
	* @public
	*/
	version:"1.0.0"

};

/**
* Registers this plugin with the Global Kiwi Plugins Manager if it is avaiable.
* 
*/
Kiwi.PluginManager.register(Kiwi.Plugins.Primitives);

/**
* This create method is executed when Kiwi Game that has been told to
* use this plugin reaches the boot stage of the game loop.
* @method create
* @param game{Kiwi.Game} The game that is current in the boot stage.
* @private 
*/
Kiwi.Plugins.Primitives.create = function(game) {
	console.log( "Hello " + game.name );
};


/**
* Polygon Gameobject
* <br><br>
* This is the master system which handles all primitives. When you create
* another primitive (Ellipse, Line, Rectangle, Star or Triangle) you are
* really creating a Polygon with some options pre-set. All primitives
* inherit parameters and methods from Polygon.
* <br><br>
* Polygons are defined with a params object. This must contain the non-optional
* parameter "state", which is a reference to the current state. It also contains
* optional transform and style information.
* <br><br>
* You may specify common transform options in the params of any primitive.
* This includes alpha, visible, x, y, rotation, scale, scaleX, scaleY,
* anchorPointX, and anchorPointY. If not specified, these default to alpha = 1,
* visible = true, x = 0, y = 0, rotation = 0, scale = 1, and the anchorPoint
* defaults to the geometric center of the object.
* <br><br>
* All primitives contain both a fill and a stroke. You may style these
* separately and enable or disable rendering of either. Available style options
* include color (the color with which the primitive is filled; an array of 3
* normalized values, from black [ 0, 0, 0 ] to white [ 1, 1, 1 ] ), drawFill
* (whether to render the fill), strokeColor (as color, but for the stroke),
* drawStroke (whether to render the stroke), and strokeWidth (the width of the
* stroke line, in pixels).
* <br><br>
* If the default primitives do not meet your requirements, you can define your
* own by using the Polygon. You will need to provide the params object with
* arrays of vertices, indices, and strokeIndices.
* <br><br>
* new Kiwi.Plugins.Primitives.Polygon( {<br>
*	state: MyGame.state,<br>
*	indices: [ 0, 1, 2, 3 ],<br>
*	vertices: [[ 0, 0 ], [ 100, 100 ], [ 200, 0 ], [ 300, 100 ] ],<br>
*	strokeIndices: [ 0, 1, 2, 0 ]<br>
* } );
* <br><br>
* All three arrays are processed to create new internal representations.
* Two Polygons created from the same arrays will not contain the same data.
* This prevents unexpected modifications from one object affecting another.
* <br><br>
* The "vertices" param is a list of points, each defined as an array of two
* points. The order of vertices does not matter for rendering, but you must be
* aware of it. A simple vertices array might read [ [ 0, 0 ], [ 100, 100 ],
* [ 200, 0 ], [ 300, 100 ] ]. Each is an XY coordinate.
* <br><br>
* The "indices" param is a list of references to vertices. It is processed
* using a TRIANGLE_STRIP procedure. This means that every three consecutive
* values on the list define a new triangle. You can add new triangles simply
* by appending a single new index. Each index is the array position of a vertex.
* For example, to draw a single triangle you could pass [ 0, 1, 2 ]. To draw two
* triangles, you could pass [ 0, 1, 2, 3 ].
* <br><br>
* The TRIANGLE_STRIP procedure is very succinct, but it doesn't allow for every
* desirable form of geometry. If you need to stop positioning triangles in one
* place and start adding them elsewhere, you can't skip over empty space.
* Fortunately, you can use a concept called "degenerate triangles" to cheat.
* <br><br>
* A degenerate triangle is one with zero area. It is formed when a triangle has
* two or three vertices in the same place. It is very easy to simply not draw a
* degenerate triangle. We can use these to connect disparate triangles. (In
* fact, the renderer uses these behind the scenes to efficiently render numerous
* primitives at once.)
* <br><br>
* To create degenerate triangles, just double up an index on either side of the
* gap. For example, if you want to draw triangles at indices [ 0, 1, 2 ] and
* [ 8, 9, 10 ], you can combine them into one with the indices
* [ 0, 1, 2, 2, 8, 8, 9, 10 ]. This creates the degenerate triangles
* [ 1, 2, 2 ], [ 2, 2, 8 ], [ 2, 8, 8 ] and [ 8, 8, 9 ]. Although this
* introduces some overhead, it is often quicker than rendering them as separate
* objects.
* <br><br>
* You may reduce the degenerate data to a single index if you know what you're
* doing with winding orders. This is left as an exercise for the user.
* <br><br>
* The "strokeIndices" param is used to create a stroke. This is usually a line
* around the edge of a polygon, but it can be any sort of line. It is, like the
* indices param, a list of array positions in the vertices param. Unlike
* indices, strokeIndices does not use TRIANGLE_STRIP. It just connects points in
* order.
* <br><br>
* Technically, the stroke is itself a series of triangles, a sort of
* mini-polygon. It will usually have more triangles than the fill. For this
* reason, you should be careful about overusing stroke.
* <br><br>
* You may also construct polygons by building several objects and combining
* them using the ".combine()" method. This may not be as efficient as
* defining a polygon by hand, and will introduce several degenerate triangles,
* but for large-scale constructions it is very convenient.
*
* @class Polygon
* @constructor
* @namespace Kiwi.Plugins.Primitives
* @extends Kiwi.Entity
* @param params {Object} The parameter object.
* @param params.state {Kiwi.State} Context state
* @param [params.color=[0.5,0.5,0.5]] {array} RGB normalized color
* @param [params.drawFill=true] {boolean} Whether to fill the polygon
* @param [params.drawStroke=true] {boolean} Whether to draw the stroke
* @param [params.indices] {array} Array of vertices for triangle strips
* @param [params.strokeColor=[0.5,0.5,0.5]] {array} RGB normalized color
* @param [params.strokeWidth=1] {number} Width of stroke in pixels
* @param [params.strokeIndices] {array} Array of vertices for strokes
* @param [params.vertices] {array} Array of vertex coordinates
*	array pairs ([ [ x1, y1 ], [x2, y2 ] ] etc).
* @since 0.1.0
*/
Kiwi.Plugins.Primitives.Polygon = function( params ) {

	var state = params.state;

	this._initProperties();

	// Super
	Kiwi.Entity.call( this, state, 0, 0 );

	this.parseParams( params );

	// Create WebGL renderer
	if (this.game.renderOption === Kiwi.RENDERER_WEBGL) {
		this.glRenderer =
			this.game.renderer.requestSharedRenderer( "PrimitiveRenderer" );
		this.atlas = this.glRenderer.getAtlas();
	}

	this.rebuildBounds();
};
Kiwi.extend( Kiwi.Plugins.Primitives.Polygon, Kiwi.Entity );

/**
* Index of pointers to vertices. The sequence of points
* which constructs the poly.
* @property indices
* @type {array}
* @public
* @since 0.3.0
*/
Object.defineProperty( Kiwi.Plugins.Primitives.Polygon.prototype, "indices", {
	get: function() {
		return this._indices;
	},
	set: function( value ) {
		var i;
		this._indices = [];

		if ( value.length > 2 ) {
			for ( i = 0; i < value.length; i++ ) {
				this._indices.push( value[ i ] );
			}
		}
	}
} );

/**
* Index of vertices.
* @property vertices
* @type {array}
* @public
* @since 0.3.0
*/
Object.defineProperty( Kiwi.Plugins.Primitives.Polygon.prototype, "vertices", {
	get: function() {
		return this._vertices;
	},
	set: function( value ) {
		var i;
		this._vertices = [];
		for ( i = 0; i < value.length; i++ ) {
			this._vertices.push( [
				value[ i ][ 0 ],
				value[ i ][ 1 ]
			] );
		}
	}
} );

/**
* Index of pointers to vertices. The sequence of points which
* constructs the stroke. To be distinguished from the strokePolyIndices,
* which define the actual shape of the stroke.
* @property strokeIndices
* @type {array}
* @public
* @since 0.3.0
*/
Object.defineProperty(
		Kiwi.Plugins.Primitives.Polygon.prototype, "strokeIndices", {
	get: function() {
		return this._strokeIndices;
	},
	set: function( value ) {
		var i;
		this._strokeIndices = [];

		if ( value.length > 1 ) {
			for ( i = 0; i < value.length; i++ ) {
				this._strokeIndices.push( value[ i ] );
			}
			this.createstroke( this._strokeIndices, this._vertices );
		}
	}
} );

/**
* Index of pointers to vertices. The sequence of points which
* make up the stroke. To be distinguished from the strokeIndices,
* which define the construction of the stroke.
* @property strokePolyIndices
* @type {array}
* @public
* @since 0.3.0
*/
Object.defineProperty(
		Kiwi.Plugins.Primitives.Polygon.prototype, "strokePolyIndices", {
	get: function() {
		return this._strokePolyIndices;
	},
	set: function( value ) {
		var i;
		this._strokePolyIndices = [];

		if ( value.length > 2 ) {

			// Double up the first index to prevent strip connexion
			if ( value.length === 3 ) {
				this._strokePolyIndices.push( value[ 0 ] );
			}

			for ( i = 0; i < value.length; i++ ) {
				this._strokePolyIndices.push( value[ i ] );
			}
		}
	}
} );

/**
* Index of vertices for stroke shape.
* @property strokePolyVertices
* @type {array}
* @public
* @since 0.3.0
*/
Object.defineProperty(
		Kiwi.Plugins.Primitives.Polygon.prototype, "strokePolyVertices", {
	get: function() {
		return this._strokePolyVertices;
	},
	set: function( value ) {
		var i;
		this._strokePolyVertices = [];
		for ( i = 0; i < value.length; i++ ) {
			this._strokePolyVertices.push( [
				value[ i ][ 0 ],
				value[ i ][ 1 ]
			] );
		}
	}
} );

/**
* Constructs a miter, a building block for strokes.
* Miters sit atop vertices and form the endpoints for two stroke segments.
* @method _buildMiter
* @param line1 {Array} The first line, an array of 2 Points
* @param line2 {Array} The second line, an array of 2 Points;
* the first point on line2 is the actual position of the miter
* @return {object}
* @private
* @since 0.3.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype._buildMiter =
		function( line1, line2) {
	var angle, angleDiffHalf, dx, dy, innerDist, line1Angle, line2Angle,
		line1Length, line2Length, lineMinLength, pointA, pointB,
		indices = [],
		vertices = [],
		pointN = line2[ 0 ];

	// Compute the length of the two lines
	line1Length = line1[0].distanceTo( line1[1] );
	line2Length = line2[0].distanceTo( line2[1] );
	lineMinLength = Math.min( line1Length, line2Length );

	// Compute the angles of the two lines
	line1Angle = Math.atan2(
		line1[ 1 ].y - line1[ 0 ].y,
		line1[ 1 ].x - line1[ 0 ].x );
	line2Angle = Math.atan2(
		line2[ 1 ].y - line2[ 0 ].y,
		line2[ 1 ].x - line2[ 0 ].x );
	line1Angle = Kiwi.Utils.GameMath.normalizeAngle( line1Angle );
	line2Angle = Kiwi.Utils.GameMath.normalizeAngle( line2Angle );

	// Compute the angle between the lines, then halve it for future use
	angleDiffHalf = line2Angle - line1Angle;
	if ( angleDiffHalf > Math.PI ) {
		angleDiffHalf = Math.PI * 2 - angleDiffHalf;
	} else if ( angleDiffHalf < -Math.PI ) {
		angleDiffHalf = -Math.PI * 2 - angleDiffHalf;
	}
	angleDiffHalf *= 0.5;

	// Compute the average angle of the two lines
	if ( Math.abs( line1Angle - line2Angle ) > Math.PI ) {
		if ( line1Angle < line2Angle ) {
			line1Angle += Math.PI * 2;
		} else {
			line2Angle += Math.PI * 2;
		}
	}
	angle = Kiwi.Utils.GameMath.normalizeAngle(
		( line1Angle + line2Angle ) * 0.5 );

	// Cache some trig
	dx = Math.cos( angle );
	dy = -Math.sin( angle );

	// Compute the distance to the inner corner, where two miter points overlap
	innerDist = this.strokeWidth / ( 2 * Math.cos( angleDiffHalf ) );
	if ( innerDist > lineMinLength ) {
		innerDist = lineMinLength;
	}

	// Create sharp miters
	pointA = new Kiwi.Geom.Point(
		dy * innerDist,
		dx * innerDist
	);
	pointB = new Kiwi.Geom.Point(
		dy * -innerDist,
		dx * -innerDist
	);
	pointA.x += pointN.x;
	pointA.y += pointN.y;
	pointB.x += pointN.x;
	pointB.y += pointN.y;

	indices = [ 0, 1, 0, 1 ];
	vertices = [ [ pointA.x, pointA.y ], [ pointB.x, pointB.y ] ];

	return { indices: indices, vertices: vertices };
};

/**
* Construct a stroke by tracing a connection through all vertices.
* @method _buildStroke
* @param srcIndices {array} List of points to connect in order.
* @param srcVertices {array} Definition of points.
* @private
* @since 0.3.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype._buildStroke =
		function( srcIndices, srcVertices ) {
	var dx, dy, end, i, j, miter, point1, point2, point3,
		inds = [],
		offset = 0,
		vertLen = srcIndices.length,
		verts = [];

	if ( vertLen > 1 ) {

		// Begin with a double-up on vertex 0
		point1 = new Kiwi.Geom.Point(
			srcVertices[ srcIndices[ 0 ] ][ 0 ],
			srcVertices[ srcIndices[ 0 ] ][ 1 ]
		);
		point2 = new Kiwi.Geom.Point(
			srcVertices[ srcIndices[ 1 ] ][ 0 ],
			srcVertices[ srcIndices[ 1 ] ][ 1 ]
		);
		miter = this._buildMiter( [ point1, point2 ], [ point1, point2 ] );
		inds = inds.concat( miter.indices );
		verts = verts.concat( miter.vertices );
		offset += miter.vertices.length;

		// Connect all additional vertices
		for ( i = 1; i < vertLen - 1; i++ ) {
			point1 = new Kiwi.Geom.Point(
				srcVertices[ srcIndices[ i - 1 ] ][ 0 ],
				srcVertices[ srcIndices[ i - 1 ] ][ 1 ]
			);
			point2 = new Kiwi.Geom.Point(
				srcVertices[ srcIndices[ i ] ][ 0 ],
				srcVertices[ srcIndices[ i ] ][ 1 ]
			);
			point3 = new Kiwi.Geom.Point(
				srcVertices[ srcIndices[ i + 1 ] ][ 0 ],
				srcVertices[ srcIndices[ i + 1 ] ][ 1 ]
			);
			miter = this._buildMiter( [ point1, point2 ], [ point2, point3 ] );
			for ( j = 0; j < miter.indices.length; j++ ) {
				miter.indices[ j ] += offset;
			}
			inds = inds.concat( miter.indices );
			verts = verts.concat( miter.vertices );
			offset += miter.vertices.length;
		}

		// Finish with a double-up on the last vertex
		// We must first construct an extension of the last line segment
		end = srcIndices.length - 1;
		dx = srcVertices[ srcIndices[ end ] ][ 0 ] -
			srcVertices[ srcIndices[ end - 1 ] ][ 0 ];
		dy = srcVertices[ srcIndices[ end ] ][ 1 ] -
			srcVertices[ srcIndices[ end - 1 ] ][ 1 ];
		point1 = new Kiwi.Geom.Point(
			srcVertices[ srcIndices[ end ] ][ 0 ],
			srcVertices[ srcIndices[ end ] ][ 1 ]
		);
		point2 = new Kiwi.Geom.Point(
			srcVertices[ srcIndices[ end ] ][ 0 ] + dx,
			srcVertices[ srcIndices[ end ] ][ 1 ] + dy
		);
		miter = this._buildMiter( [ point1, point2 ], [ point1, point2 ] );
		for ( j = 0; j < miter.indices.length; j++ ) {
			miter.indices[ j ] += offset;
		}
		inds = inds.concat( miter.indices );
		verts = verts.concat( miter.vertices );

		return { indices: inds, vertices: verts };
	}

	return null;
};

/**
* Creates a copy of this polygon.
* @method clone
* @return {Kiwi.Plugins.Primitives.Polygon}
* @public
* @since 0.3.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype.clone = function() {
	var params = {
			color: this.color,
			indices: this._indices,
			state: this.state,
			strokeColor: this.strokeColor,
			strokeIndices: this._strokeIndices,
			vertices: this._vertices,

			x: this.x,
			y: this.y,
			rotation: this.rotation,
			scaleX: this.scaleX,
			scaleY: this.scaleY,
			anchorPointX: this.anchorPointX,
			anchorPointY: this.anchorPointY,
			alpha: this.alpha,
			visible: this.visible
		};

	return (new Kiwi.Plugins.Primitives.Polygon( params ) );
};

/**
* Determines the min and max x and y coordinates from an array.
* @method computeMinMaxXY
* @param array {array} Array of points, defined as arrays [ x, y ]
* @return object
* @public
* @since 0.1.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype.computeMinMaxXY = function( array ) {
	var i, vert,
		vertLen = array.length,
		maxX = 0,
		maxY = 0,
		minX = 0,
		minY = 0;

	for ( i = 0; i < vertLen; i++ ) {
		vert = array[ i ];
		if ( vert[0] < minX ) {
			minX = vert[0];
		}
		if ( vert[0] > maxX ) {
			maxX = vert[0];
		}
		if ( vert[1] < minY ) {
			minY = vert[1];
		}
		if ( vert[1] > maxY ) {
			maxY = vert[1];
		}
	}

	return {
		maxX: maxX,
		maxY: maxY,
		minX: minX,
		minY: minY
	};
};

/**
* Adds another poly to this.
* @method combine
* @param poly {Kiwi.Plugins.Primitives.Polygon} Primitive to combine.
* @param [discard=true] {boolean} Discard the combination source?
* @return {boolean}
* @public
* @since 0.3.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype.combine = function( poly, discard ) {
	if ( typeof discard === "undefined" ) {
		discard = true;
	}

	// Do not self-combine
	if ( this.poly === this ) {
		return false;
	}

	var indexOffset,
		inverseMatrix = this.transform.getConcatenatedMatrix().invert(),
		matrix = poly.transform.getConcatenatedMatrix(),
		point = new Kiwi.Geom.Point( 0, 0 ),
		polyIndicesLen = poly.indices.length,
		polyVerticesLen = poly.vertices.length,
		polyStrokeIndicesLen = poly.strokePolyIndices.length,
		polyStrokeVerticesLen = poly.strokePolyVertices.length;


	// Attach fill
	if ( polyIndicesLen > 2 ) {
		indexOffset = this._vertices.length;

		// Create degenerate attachment
		if ( this._indices.length > 0 ) {
			this._indices.push( this._indices[ this._indices.length - 1 ] );
			this._indices.push( poly.indices[ 0 ] + indexOffset );
		}

		// Add vertices and indices
		for ( i = 0; i < polyIndicesLen; i++ ) {
			this._indices.push( poly.indices[ i ] + indexOffset );
		}
		for ( i = 0; i < polyVerticesLen; i++ ) {
			point.setTo(
				poly.vertices[ i ][ 0 ] - poly.anchorPointX,
				poly.vertices[ i ][ 1 ] - poly.anchorPointY
			);

			point = matrix.transformPoint( point );
			point = inverseMatrix.transformPoint( point );

			this._vertices.push( [
				point.x + this.anchorPointX,
				point.y + this.anchorPointY
			] );
		}
	}
	

	// Attach stroke
	if ( polyStrokeIndicesLen > 2 ) {
		indexOffset = this._strokePolyVertices.length;

		// Create degenerate attachment
		if ( this._strokePolyIndices.length > 0 ) {
			this._strokePolyIndices.push(
				this._strokePolyIndices[ this._strokePolyIndices.length - 1 ] );
			this._strokePolyIndices.push(
				poly.strokePolyIndices[ 0 ] + indexOffset );
		}

		// Add vertices and indices
		for ( i = 0; i < polyStrokeIndicesLen; i++ ) {
			this._strokePolyIndices.push(
				poly.strokePolyIndices[ i ] + indexOffset );
		}
		for ( i = 0; i < polyStrokeVerticesLen; i++ ) {
			point.setTo(
				poly.strokePolyVertices[ i ][ 0 ] - poly.anchorPointX,
				poly.strokePolyVertices[ i ][ 1 ] - poly.anchorPointY
			);

			point = matrix.transformPoint( point );
			point = inverseMatrix.transformPoint( point );

			this._strokePolyVertices.push( [
				point.x + this.anchorPointX,
				point.y + this.anchorPointY
			] );
		}
	}

	

	// Discard source
	if ( discard ) {
		poly.destroy();
	}

	return true;
};

/**
* Reports an error message.
* @method complain
* @param string {string} Text to report
* @public
* @since 0.4.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype.complain = function( string ) {
	console.log(
		"Primitive Error encountered:",
		string
	);
};

/**
* Put a stroke on this Polygon, following the strokeIndices vertex list.
* You should not need to do this manually.
* @method createstroke
* @public
* @return boolean
* @since 0.3.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype.createstroke = function() {
	var strokeData = this._buildStroke( this.strokeIndices, this.vertices );

	if ( strokeData ) {
		this.strokePolyIndices = strokeData.indices;
		this.strokePolyVertices = strokeData.vertices;
	}
};

/**
* Initialise internal properties
* @method _initProperties
* @private
* @since 0.1.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype._initProperties = function() {
	/**
	* Part of the WebGL rendering pipeline
	* @property glRenderer
	* @type Kiwi.Renderers.Renderer
	* @public
	* @since 0.1.0
	*/
	this.glRenderer = undefined;

	// Mirror properties: private data accessed by getters/setters
	this._indices = null;
	this._vertices = null;
	this._strokeIndices = null;
	this._strokePolyIndices = null;
	this._strokePolyVertices = null;
};

/**
* Returns the type of object that this is.
* @method objType
* @return {string}
* @public
*/
Kiwi.Plugins.Primitives.Polygon.prototype.objType = function() {
	return "Primitive Polygon";
};

/**
* Sets default parameters on primitive. Note that this will redefine the
* entire primitive. If you call parseParams after creation, you will have to
* take steps to preserve any shape, style, or transform data you wish to keep.
* @method parseParams
* @param params {object} The param objects
* @return boolean
* @public
* @since 0.1.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype.parseParams = function( params ) {

	/**
	* RGB color triplet, normalized to the range 0-1
	* @property color
	* @type {array} 
	* @public
	*/
	this.color = params.color || [ 0.5, 0.5, 0.5 ];

	/**
	* Whether the fill will draw
	* @property drawFill
	* @type {boolean}
	* @public
	*/
	this.drawFill = ( typeof params.drawFill !== "undefined" ) ?
		params.drawFill :
		true;

	/**
	* Whether the stroke will draw
	* @property drawFill
	* @type {boolean}
	* @public
	*/
	this.drawStroke = ( typeof params.drawStroke !== "undefined" ) ?
		params.drawStroke :
		true;

	this.indices = params.indices || [];
	this.vertices = params.vertices || [];

	// These stroke properties must be defined
	// after base vertices and in unique order

	/**
	* RGB color triplet, normalized to the range 0-1
	* @property strokeColor
	* @type {array}
	* @public
	*/
	this.strokeColor = params.strokeColor || [ 0, 0, 0 ];

	/**
	* Width of the stroke, in pixels. If the primitive is scaled, the stroke
	* will also change size.
	* @property strokeWidth
	* @type {number}
	* @public
	*/
	this.strokeWidth = params.strokeWidth || 1;

	this.strokeIndices = params.strokeIndices || [];
	this.strokePolyIndices = this._strokePolyIndices || [];
	this.strokePolyVertices = this._strokePolyVertices || [];

	// Universal entity params
	this.alpha = params.alpha || 1;
	this.anchorPointX = params.anchorPointX || undefined;
	this.anchorPointY = params.anchorPointY || undefined;
	this.rotation = params.rotation || 0;
	if (
			typeof params.scaleX === "undefined" &&
			typeof params.scaleY === "undefined" ) {
		this.scale = params.scale || 1;
	} else {
		this.scaleX = params.scaleX || 1;
		this.scaleY = params.scaleY || 1;
	}
	this.visible = params.visible || true;
	this.x = params.x || 0;
	this.y = params.y || 0;

	return this.parseStrict();
};

/**
* Perform a strict compliance check on data. If this fails,
* it's because somebody passed bad data.
* @method parseStrict
* @return boolean
* @public
* @since 0.4.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype.parseStrict = function() {
	var i;

	// Check stroke width
	if ( isNaN( this.strokeWidth ) ) {
		this.complain( "strokeWidth is not a number" );
		return false;
	}

	// Check color values
	if ( Kiwi.Utils.Common.isArray( this.color ) ) {
		for ( i = 0; i < 3; i++ ) {
			if ( isNaN( this.color[ i ] ) ) {
				this.complain(
					"Could not parse color: Non-numeric color channel " + i );
				return false;
			}
		}
	} else {
		this.complain( "Could not parse color: Color is not an array" );
		return false;
	}

	// Check stroke color values
	if ( Kiwi.Utils.Common.isArray( this.strokeColor ) ) {
		for ( i = 0; i < 3; i++ ) {
			if ( isNaN( this.strokeColor[ i ] ) ) {
				this.complain(
					"Could not parse strokeColor: Non-numeric color channel " +
					i );
				return false;
			}
		}
	} else {
		this.complain( "Could not parse strokeColor: Color is not an array" );
		return false;
	}

	// Check indices
	if ( Kiwi.Utils.Common.isArray( this.indices ) ) {
		for ( i = 0; i < this.indices.length; i++ ) {
			if ( isNaN( this.indices[ i ] ) ) {
				this.complain( "Index " + i + " is not a number" );
				return false;
			}
		}
	} else {
		this.complain( "Could not parse indices: Not an array" );
		return false;
	}

	// Check stroke indices
	if ( Kiwi.Utils.Common.isArray( this.strokeIndices ) ) {
		for ( i = 0; i < this.strokeIndices.length; i++ ) {
			if ( isNaN( this.strokeIndices[ i ] ) ) {
				this.complain( "Stroke Index " + i + " is not a number" );
				return false;
			}
		}
	} else {
		this.complain( "Could not parse strokeIndices: Not an array" );
		return false;
	}

	// Check vertices
	if ( Kiwi.Utils.Common.isArray( this.vertices ) ) {
		for ( i = 0; i < this.vertices.length; i++ ) {
			if ( Kiwi.Utils.Common.isArray( this.vertices[ i ] ) ) {
				if ( isNaN( this.vertices[ i ][ 0 ] ) ) {
					this.complain( "Vertex " + i + ".x is not a number" );
					return false;
				}
				if ( isNaN( this.vertices[ i ][ 1 ] ) ) {
					this.complain( "Vertex " + i + ".y is not a number" );
					return false;
				}
			} else {
				this.complain( "Vertex " + i + " is not an array" );
				return false;
			}
		}
	} else {
		this.complain( "Could not parse indices: Not an array" );
		return false;
	}

	// We can't find anything wrong with it
	return true;
};

/**
* Compute width, height, box, anchor points etc
* @method rebuildBounds
* @public
* @since 0.1.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype.rebuildBounds = function() {

	// Compute width, height, and anchor points
	var bounds = this.computeMinMaxXY( this._vertices );
	this.width = bounds.maxX - bounds.minX;
	this.height = bounds.maxY - bounds.minY;
	if ( typeof this.anchorPointX === "undefined" ) {
		this.anchorPointX = bounds.maxX - 0.5 * this.width;
	}
	if ( typeof this.anchorPointY === "undefined" ) {
		this.anchorPointY = bounds.maxY - 0.5 * this.height;
	}

	// Compute box
	this.box = this.components.add( new Kiwi.Components.Box(
		this, this.x + bounds.minX, this.x + bounds.minY,
		this.width, this.height ) );
};

/**
* Software rendering method
* @method render
* @param {Kiwi.Camera} camera
* @public
*/
Kiwi.Plugins.Primitives.Polygon.prototype.render = function( camera ) {

	var ctx, i, pTemp,
		indicesLen = this._indices.length,
		p0 = new Kiwi.Geom.Point( 0, 0 ),
		p1 = new Kiwi.Geom.Point( 0, 0 ),
		p2 = new Kiwi.Geom.Point( 0, 0 );

	Kiwi.Entity.prototype.render.call( this, camera );
	if ( this.alpha > 0 ) {
		ctx = this.game.stage.ctx;
		ctx.save();

		if ( this.alpha <= 1 ) {
			ctx.globalAlpha = this.alpha;
		}

		var t = this.transform;
		var m = t.getConcatenatedMatrix();
		ctx.transform( m.a, m.b, m.c, m.d, m.tx, m.ty );


		// Draw fill
		if ( this.drawFill && this._indices.length > 3 ) {
			ctx.fillStyle = "rgb(" + Math.round( this.color[ 0 ] * 255 ) + "," +
				Math.round( this.color[ 1 ] * 255 ) + "," +
				Math.round( this.color[ 2 ] * 255 ) + ")";

			p1.setTo(
				this._vertices[ this._indices[ 1 ] ][ 0 ] - t.anchorPointX,
				this._vertices[ this._indices[ 1 ] ][ 1 ] - t.anchorPointY
			);
			p2.setTo(
				this._vertices[ this._indices[ 0 ] ][ 0 ] - t.anchorPointX,
				this._vertices[ this._indices[ 0 ] ][ 1 ] - t.anchorPointY
			);

			for ( i = 2; i < indicesLen; i++ ) {

				// Overwrite start point
				p0.setTo(
					this._vertices[ this._indices[ i ] ][ 0 ] - t.anchorPointX,
					this._vertices[ this._indices[ i ] ][ 1 ] - t.anchorPointY
				);

				// Draw
				ctx.beginPath();
				ctx.moveTo( p0.x, p0.y );
				ctx.lineTo( p1.x, p1.y );
				ctx.lineTo( p2.x, p2.y );
				ctx.closePath();
				ctx.fill();

				// Cycle points
				pTemp = p2;
				p2 = p1;
				p1 = p0;
				p0 = pTemp;
			}
		}


		// Draw stroke
		if ( this.drawStroke && this._strokePolyIndices.length > 3 ) {
			indicesLen = this._strokePolyIndices.length;

			ctx.fillStyle =
				"rgb(" + Math.round( this.strokeColor[ 0 ] * 255 ) + "," +
				Math.round( this.strokeColor[ 1 ] * 255 ) + "," +
				Math.round( this.strokeColor[ 2 ] * 255 ) + ")";

			p1.setTo(
				this._strokePolyVertices[
					this._strokePolyIndices[ 1 ] ][ 0 ] - t.anchorPointX,
				this._strokePolyVertices[
					this._strokePolyIndices[ 1 ] ][ 1 ] - t.anchorPointY
			);
			p2.setTo(
				this._strokePolyVertices[
					this._strokePolyIndices[ 0 ] ][ 0 ] - t.anchorPointX,
				this._strokePolyVertices[
					this._strokePolyIndices[ 0 ] ][ 1 ] - t.anchorPointY
			);

			for ( i = 2; i < indicesLen; i++ ) {

				// Overwrite start point
				p0.setTo(
					this._strokePolyVertices[
						this._strokePolyIndices[ i ] ][ 0 ] - t.anchorPointX,
					this._strokePolyVertices[
						this._strokePolyIndices[ i ] ][ 1 ] - t.anchorPointY
				);

				// Draw
				ctx.beginPath();
				ctx.moveTo( p0.x, p0.y );
				ctx.lineTo( p1.x, p1.y );
				ctx.lineTo( p2.x, p2.y );
				ctx.closePath();
				ctx.fill();

				// Cycle points
				pTemp = p2;
				p2 = p1;
				p1 = p0;
				p0 = pTemp;
			}
		}
		


		// Clean up context
		ctx.restore();
	}
};



/**
* Hardware rendering method using WebGL
* @method renderGL
* @param gl {WebGLRenderingContext}
* @param camera {Kiwi.Camera}
* @param params {object}
*/
Kiwi.Plugins.Primitives.Polygon.prototype.renderGL =
		function( gl ) {
	if ( this.alpha > 0 ) {
		if ( this.drawFill ) {
			this.glRenderer.addToBatch( gl, this,
				this._indices, this._vertices, this.color
			);
		}
		if ( this.drawStroke ) {
			this.glRenderer.addToBatch( gl, this,
				this._strokePolyIndices, this._strokePolyVertices,
				this.strokeColor
			);
		}
	}
};

/**
* Decompose a polygon into its constituent triangles.
* This will destroy the original polygon and substitute a group
* containing the triangles.
* @method shatter
* @return {Kiwi.Group}
* @public
* @since 0.3.0
*/
Kiwi.Plugins.Primitives.Polygon.prototype.shatter = function() {
	var dVert12, dVert13, dVert23, i, params, tri, vert1, vert2, vert3,
		indices = [ 0, 1, 2 ],
		group = new Kiwi.Group( this.state );

	for ( i = 0; i < this._indices.length - 2; i++ ) {

		vert1 = this._vertices[ this._indices[ i ] ];
		vert2 = this._vertices[ this._indices[ i + 1 ] ];
		vert3 = this._vertices[ this._indices[ i + 2 ] ];

		dVert12 = Math.sqrt(
			Math.pow( vert1[ 0 ] - vert2[ 0 ], 2 ) +
			Math.pow( vert1[ 1 ] - vert2[ 1 ], 2 )
		);
		dVert13 = Math.sqrt(
			Math.pow( vert1[ 0 ] - vert3[ 0 ], 2 ) +
			Math.pow( vert1[ 1 ] - vert3[ 1 ], 2 )
		);
		dVert23 = Math.sqrt(
			Math.pow( vert2[ 0 ] - vert3[ 0 ], 2 ) +
			Math.pow( vert2[ 1 ] - vert3[ 1 ], 2 )
		);

		// Avoid degenerate triangles
		if ( dVert12 !== 0 && dVert13 !== 0 && dVert23 !== 0 ) {
			params = {
				indices: indices,
				vertices: [ vert1, vert2, vert3 ],
				state: this.state,
				color: this.color,
				x: this.x,
				y: this.y,
				rotation: this.rotation,
				scaleX: this.scaleX,
				scaleY: this.scaleY,
				anchorPointX: this.anchorPointX,
				anchorPointY: this.anchorPointY
			};
			tri = (new Kiwi.Plugins.Primitives.Polygon( params ) ).clone();
			group.addChild( tri );
		}
	}

	// Eliminate original
	if ( this.parent ) {
		this.parent.addChildBefore( group, this );
	}
	this.destroy();

	return group;
};


/**
* Ellipse Primitive
* <br><br>
* Create a ellipse primitive. Define a params object including a reference
* to the current state. You may also add style parameters from the Polygon.
* <br><br>
* You may draw regular polygons by reducing the segments. For example,
* to draw a hexagon:
* <br><br>
* new Kiwi.Plugins.Primitives.Ellipse( {<br>
*	drawStroke: false,<br>
*	radius: 32,<br>
*	state: MyGame.state,<br>
*	segments: 6<br>
* } );
* @class Ellipse
* @constructor
* @extends Kiwi.Plugins.Primitives.Polygon
* @namespace Kiwi.Plugins.Primitives
* @param params {object} Parameter object
* @param params.state {Kiwi.State} Current state
* @param [params.centerOnTransform=false] {boolean} If true, ellipse is centered
*	on transform; if false, ellipse has top left corner on transform
* @param [params.height=8] {number} Height of the ellipse
* @param [params.radius] {number} Radius of a circle; overide width and height
* @param [params.radiusPointer=false] {boolean} Whether to draw the radius,
*	useful for debugging rotation on circles.
* @param [params.segments=32] {number} Number of radial segments; detail.
* @param [params.width=8] {number} Width of the ellipse
* @since 0.4.0
*/
Kiwi.Plugins.Primitives.Ellipse = function( params ) {
	var angle, i,
		defaultDimension = 8,
		offsetX = 0,
		offsetY = 0;

	// Create elliptical geometry data
	if ( typeof params.segments === "undefined" ) {
		params.segments = 32;
	}
	if ( typeof params.radius !== "undefined" ) {
		params.width = params.radius * 2;
		params.height = params.radius * 2;
	}
	if ( typeof params.width !== "number" ) {
		params.width = defaultDimension;
	}
	if ( typeof params.height !== "number" ) {
		params.height = defaultDimension;
	}
	if ( !params.centerOnTransform ) {
		offsetX = params.width * 0.5;
		offsetY = params.height * 0.5;
	}
	params.indices = [];
	params.vertices = [];
	params.strokeIndices = [];
	for ( i = 0; i < params.segments; i++ ) {

		// Define indices, looping from the middle
		params.indices.push( i );
		params.indices.push( params.segments );
		params.indices.push( ( i + 1 ) % params.segments );

		// Define vertices
		angle = Math.PI * 2 * i / params.segments;
		params.vertices.push( [
			params.width * 0.5 * Math.cos( angle ) + offsetX,
			params.height * 0.5 * Math.sin( angle ) + offsetY
		] );

		// Define stroke
		params.strokeIndices.push( i );
	}

	// Define central vertex
	params.vertices.push( [ offsetX, offsetY ] );

	// Complete stroke
	params.strokeIndices.push( 0 );

	// Add radius pointer
	if ( params.radiusPointer ) {
		params.strokeIndices.push( params.segments );
	}

	Kiwi.Plugins.Primitives.Polygon.call( this, params );
};
Kiwi.extend( Kiwi.Plugins.Primitives.Ellipse,
	Kiwi.Plugins.Primitives.Polygon );

/**
* Line Primitive
* <br><br>
* Create a line primitive. Define a params object including a reference
* to the current state. You may also add style parameters from the Polygon.
* For example:
* <br><br>
* new Kiwi.Plugins.Primitives.Line( {<br>
*	points: [ [ 0, 0 ], [ 100, 100 ], [ 200, 0 ] ],<br>
*	state: MyGame.state,<br>
*	strokeColor: [ 1, 0.1, 1 ],<br>
*	strokeWidth: 4<br>
* } );
* @class Line
* @constructor
* @extends Kiwi.Plugins.Primitives.Polygon
* @namespace Kiwi.Plugins.Primitives
* @param params {object} Parameter object
* @param params.state {Kiwi.State} Current state
* @param [params.points] {array} Array of x,y points to connect with lines
* @since 0.4.0
*/
Kiwi.Plugins.Primitives.Line = function( params ) {
	var i;

	params.vertices = [];
	params.strokeIndices = [];
	params.drawFill = false;
	params.drawStroke = true;
	if ( params.points ) {
		for ( i = 0; i < params.points.length; i++ ) {
			params.vertices.push( params.points[ i ] );
			params.strokeIndices.push( i );
		}
	}

	Kiwi.Plugins.Primitives.Polygon.call( this, params );
};
Kiwi.extend( Kiwi.Plugins.Primitives.Line,
	Kiwi.Plugins.Primitives.Polygon );


/**
* Rectangle Primitive
* <br><br>
* Create a rectangular primitive. Define a params object including a reference
* to the current state. You may also add style parameters from the Polygon.
* For example:
* <br><br>
* new Kiwi.Plugins.Primitives.Rectangle( {<br>
*	state: MyGame.state,<br>
*	color: [ 0.9, 0.3, 0.7 ],<br>
*	strokeWidth: 4,<br>
*	width: 32,<br>
*	height: 16<br>
* } );
* @class Rectangle
* @constructor
* @extends Kiwi.Plugins.Primitives.Polygon
* @namespace Kiwi.Plugins.Primitives
* @param params {object} Parameter object
* @param params.state {Kiwi.State} Current state
* @param [params.centerOnTransform=true] {boolean} If true, rectangle is centered
*	on transform; if false, rectangle has top left corner on transform
* @param [params.height=8] {number} Height of the rectangle
* @param [params.width=8] {number} Width of the rectangle
* @since 0.4.0
*/
Kiwi.Plugins.Primitives.Rectangle = function( params ) {
	var defaultDimension = 8;

	// Create rectangle geometry data
	params.indices = [ 0, 1, 2, 3 ];
	params.strokeIndices = [ 0, 1, 3, 2, 0 ];
	if ( typeof params.width === "undefined" ) {
		params.width = defaultDimension;
	}
	if ( typeof params.height === "undefined" ) {
		params.height = defaultDimension;
	}

	// Position rectangle relative to transform
	if ( params.centerOnTransform ) {
		params.vertices = [
			[ -params.width * 0.5, -params.height * 0.5 ],
			[ params.width * 0.5, -params.height * 0.5 ],
			[ -params.width * 0.5, params.height * 0.5 ],
			[ params.width * 0.5, params.height * 0.5 ]
		];
	} else {
		params.vertices = [
			[ 0, 0 ],
			[ params.width, 0 ],
			[ 0, params.height ],
			[ params.width, params.height ]
		];
	}

	Kiwi.Plugins.Primitives.Polygon.call ( this, params );
};
Kiwi.extend( Kiwi.Plugins.Primitives.Rectangle,
	Kiwi.Plugins.Primitives.Polygon );


/**
* Star Primitive
* <br><br>
* Create a star primitive. Define a params object including a reference
* to the current state. You may also add style parameters from the Polygon.
* <br><br>
* You may draw semi-random stars. For example, to draw a cartoon impact flare:
* <br><br>
* new Kiwi.Plugins.Primitives.Star( {<br>
*	centerOnTransform: true,<br>
*	color: [ 1, 0.01, 1 ],<br>
*	drawStroke: false,<br>
*	radius: 32,<br>
*	spikeRandom: 1,<br>
*	state: MyGame.state,<br>
*	segments: 16<br>
* } );
* @class Star
* @constructor
* @extends Kiwi.Plugins.Primitives.Polygon
* @namespace Kiwi.Plugins.Primitives
* @param params {object} Parameter object
* @param params.state {Kiwi.State} Current state
* @param [params.centerOnTransform=false] {boolean} If true, star is centered
*	on transform; if false star has top left corner on transform
* @param [params.height=8] {number} Height of the star
* @param [params.spikeLength=1] {number} Length of spikes relative to radius
* @param [params.spikeRandom=0] {number} Randomness of star spikes, where 0 is
*	no randomness and 1 will make some spikes up to twice as long;
*	there is no cap.
* @param [params.radius] {number} Radius of a star; overide width and height
* @param [params.segments=32] {number} Number of points
* @param [params.width=8] {number} Width of the star
* @since 0.4.0
*/
Kiwi.Plugins.Primitives.Star = function( params ) {
	var angle, i, spikiness,
		defaultDimension = 8,
		offsetX = 0,
		offsetY = 0;

	// Create stellar geometry data
	if ( typeof params.segments === "undefined" ) {
		params.segments = 32;
	}
	if ( typeof params.radius !== "undefined" ) {
		params.width = params.radius * 2;
		params.height = params.radius * 2;
	}
	if ( typeof params.width !== "number" ) {
		params.width = defaultDimension;
	}
	if ( typeof params.height !== "number" ) {
		params.height = defaultDimension;
	}
	if ( !params.centerOnTransform ) {
		offsetX = params.width * 0.5;
		offsetY = params.height * 0.5;
	}
	if( typeof params.spikeLength !== "number" ) {
		params.spikeLength = 1;
	}
	if( typeof params.spikeRandom !== "number" ) {
		params.spikeRandom = 0;
	}


	params.indices = [];
	params.vertices = [];
	params.strokeIndices = [];

	for ( i = 0; i < params.segments; i++ ) {

		// Define indices, looping from the middle
		params.indices.push( i );
		params.indices.push( params.segments );
		params.indices.push( ( i + 1 ) % params.segments );

		// Define vertices
		angle = Math.PI * 2 * i / params.segments;
		params.vertices.push( [
			params.width * 0.5 * Math.cos( angle ) + offsetX,
			params.height * 0.5 * Math.sin( angle ) + offsetY
		] );

		// Define stroke
		params.strokeIndices.push( i, i + 1 + params.segments );
	}

	// Define central vertex
	params.vertices.push( [ offsetX, offsetY ] );

	// Define stellar spikes
	for ( i = 0; i < params.segments; i++ ) {
		params.indices.push( i );
		params.indices.push( params.segments + i + 1 );
		params.indices.push( ( i + 1) % params.segments );

		// Define vertices
		angle = Math.PI * 2 * ( i + 0.5 ) / params.segments;
		spikiness = ( 1 + Math.random() * params.spikeRandom ) *
			( params.spikeLength + 1 ) * 0.5;
		params.vertices.push( [
			params.width * Math.cos( angle ) * spikiness + offsetX,
			params.height * Math.sin( angle ) * spikiness + offsetY
		] );
	}

	// Complete stroke
	params.strokeIndices.push( 0 );


	Kiwi.Plugins.Primitives.Polygon.call( this, params );


	// Reset anchor point to middle of core circle.
	// This compensates for random spike lengths.
	this.anchorPointX = params.anchorPointX || offsetX;
	this.anchorPointY = params.anchorPointY || offsetY;
};
Kiwi.extend( Kiwi.Plugins.Primitives.Star,
	Kiwi.Plugins.Primitives.Polygon );


/**
* Triangle Primitive
* <br><br>
* Create a triangle primitive. Define a params object including a reference
* to the current state. You may also add style parameters from the Polygon.
* For example:
* <br><br>
* new Kiwi.Plugins.Primitives.Triangle( {<br>
*	points: [ [ 0, 0 ], [ 100, 100 ], [ 200, 0 ] ],<br>
*	state: MyGame.state,<br>
*	x: 10,<br>
*	y: 10,<br>
*	scale: 2<br>
* } );
* <br><br>
* If you do not specify points in the param object, the Triangle will default to
* [ [ 0, 0 ], [ 0, 8 ], [ 8, 0 ] ]
* @class Triangle
* @constructor
* @extends Kiwi.Plugins.Primitives.Polygon
* @namespace Kiwi.Plugins.Primitives
* @param params {object} Parameter object
* @param params.state {Kiwi.State} Current state
* @param [params.corners] {array} Array of x,y pairs to form triangle's corners.
* @since 0.4.0
*/
Kiwi.Plugins.Primitives.Triangle = function( params ) {
	var i,
		defaultDimension = 8;

	params.indices = [ 0, 1, 2 ];
	params.strokeIndices = [ 0, 1, 2, 0 ];
	params.vertices = [];
	
	// Create triangle geometry data
	if ( params.points ) {
		for ( i = 0; i < 3; i++ ) {
			if ( params.points[ i ] ) {
				params.vertices.push( params.points[ i ] );
			} else {
				params.vertices.push( [ 0, 0 ] );
			}
		}
	} else {
		params.vertices.push(
			[ 0, 0 ],
			[ 0, defaultDimension ],
			[ defaultDimension, 0 ]
		);
	}
	
	Kiwi.Plugins.Primitives.Polygon.call( this, params );
};
Kiwi.extend( Kiwi.Plugins.Primitives.Triangle,
	Kiwi.Plugins.Primitives.Polygon );


/**
* Null Texture Atlas interfaces with KiwiJS rendering system
* which expects a texture atlas, and provides it with an atlas
* that has no texture.
*
* @class NullAtlas
* @constructor
* @namespace Kiwi.Plugins.Primitives
* @since 0.1.0
*/
Kiwi.Plugins.Primitives.NullAtlas = function() {
	this.cells = [];
};

/** Dummy texture enable method, doing the bare minimum to satisfy the
* texture manager requirements. Parameters don't matter.
* @method enableGL
* @public
* @since 0.1.0
*/
Kiwi.Plugins.Primitives.NullAtlas.prototype.enableGL = function() {};



/**
* Primitive Renderer
* <br><br>
* This renders primitives using triangle strips.
* @class PrimitiveRenderer
* @constructor
* @namespace Kiwi.Renderers
* @param gl {WebGLRenderingContext} The WebGL rendering context in use.
* @param shaderManager {Kiwi.Renderers.ShaderManager} The Kiwi shader manager.
* @since 0.1.0
*/
Kiwi.Renderers.PrimitiveRenderer = function( gl, shaderManager ) {
	this.bufferItemSize = 6;
	this.indices = [];
	this.nullAtlas = new Kiwi.Plugins.Primitives.NullAtlas();
	this._tempPoint = new Kiwi.Geom.Point( 0, 0 );
	this._maxItems = 1000;
	this._vertexBuffer =
		new Kiwi.Renderers.GLArrayBuffer( gl, this.bufferItemSize );
	this._indexBuffer = new Kiwi.Renderers.GLElementArrayBuffer( gl, 1, [] );

	// Perform super functionality
	Kiwi.Renderers.Renderer.call( this, gl, shaderManager, true );

	this.setShaderPair( "PrimitiveShader" );
};
Kiwi.extend( Kiwi.Renderers.PrimitiveRenderer, Kiwi.Renderers.Renderer );

/**
* Returns a null atlas so that all primitives share a texture object.
* @method getAtlas
* @return Kiwi.Plugins.Primitives.NullAtlas
* @public
* @since 0.3.0
*/
Kiwi.Renderers.PrimitiveRenderer.prototype.getAtlas = function() {
	return this.nullAtlas;
};

/**
* Enables the renderer for drawing
* @method enable
* @param gl {WebGLRenderingContext}
* @param [params=null] {object}
* @public
*/
Kiwi.Renderers.PrimitiveRenderer.prototype.enable = function( gl, params ) {
	// Boilerplate extension
	Kiwi.Renderers.Renderer.
		prototype.enable.call( this, gl, params );

	this.shaderPair = this.shaderManager.requestShader(gl,
		this._shaderPairName, true);

	gl.uniform2fv( this.shaderPair.uniforms.uResolution.location,
		params.stageResolution );
	gl.uniformMatrix3fv( this.shaderPair.uniforms.uCamMatrix.location,
		false, params.camMatrix );
};

/**
* Disables the renderer
* @method disable
* @param gl {WebGLRenderingContext}
* @public
*/
Kiwi.Renderers.PrimitiveRenderer.prototype.disable = function( gl ) {
	gl.disableVertexAttribArray( this.shaderPair.attributes.aXY );
	gl.disableVertexAttribArray( this.shaderPair.attributes.aRGBA );
};

/**
* Clears the vertex buffer
* @method clear
* @param gl {WebGLRenderingContext}
* @public
*/
Kiwi.Renderers.PrimitiveRenderer.prototype.clear = function( gl, params ) {
	this._vertexBuffer.clear();
	gl.uniformMatrix3fv( this.shaderPair.uniforms.uCamMatrix.location,
		false, params.camMatrix );
};

/**
* Updates the stage resolution uniforms
* @method updateStageResolution
* @param gl {WebGLRenderingContext}
* @param res {Float32Array}
* @public
*/
Kiwi.Renderers.PrimitiveRenderer.prototype.updateStageResolution =
		function( gl, res ) {
	gl.uniform2fv(this.shaderPair.uniforms.uResolution.location, res);
};

/**
* Sets shader pair by name
* @method setShaderPair
* @param shaderPair {String}
* @public
*/
Kiwi.Renderers.PrimitiveRenderer.prototype.setShaderPair =
		function( shaderPair ) {
	if ( typeof shaderPair === "string" ) {
		this._shaderPairName = shaderPair;
	}
};

/**
* Collates all xy and uv coordinates into a buffer
* ready for upload to video memory
* @method _collateVertexAttributeArrays
* @param gl {WebGLRenderingContext}
* @param entity {Kiwi.Entity}
* @param camera {Camera}
* @public
*/
Kiwi.Renderers.PrimitiveRenderer.prototype.addToBatch =
		function( gl, entity, indices, vertices, color ) {

	var i,
		indexLen = indices.length,
		indexOffset = this._vertexBuffer.items.length / this.bufferItemSize,
		vertLen = vertices.length;

	var t = entity.transform;
	var m = t.getConcatenatedMatrix();

	for ( i = 0; i < vertLen; i++ ) {
		this._tempPoint.setTo(
			vertices[ i ][ 0 ] - t.anchorPointX,
			vertices[ i ][ 1 ] - t.anchorPointY );

		this._tempPoint = m.transformPoint( this._tempPoint );

		this._vertexBuffer.items.push(
			this._tempPoint.x, this._tempPoint.y,
			color[ 0 ], color[ 1 ], color[ 2 ],
			entity.alpha
		);
	}

	// Append indices

	// Because we cannot guarantee winding order, we must always assume
	// that we will require two connectors, except for the first triangle.
	if ( this.indices.length > 0 ) {
		this.indices.push( this.indices[ this.indices.length - 1 ] );
		this.indices.push( indices[ 0 ] + indexOffset );
	}

	for ( i = 0; i < indexLen; i++ ) {
		this.indices.push( indices[ i ] + indexOffset );
	}
};

/**
* Makes a draw call. This is where things actually
* get rendered to the draw buffer (or a framebuffer).
* @method draw
* @param gl {WebGLRenderingContext}
* @public
*/
Kiwi.Renderers.PrimitiveRenderer.prototype.draw = function( gl ) {
	var byteHead = 0,
		bytesPerF32 = 4,
		bytes = this.bufferItemSize * bytesPerF32;

	this._vertexBuffer.uploadBuffer( gl, this._vertexBuffer.items );

	gl.enableVertexAttribArray( this.shaderPair.attributes.aXY );
	gl.vertexAttribPointer( this.shaderPair.attributes.aXY,
		bytesPerF32, gl.FLOAT, false, bytes, byteHead );
	byteHead += 2 * bytesPerF32;

	gl.enableVertexAttribArray( this.shaderPair.attributes.aRGBA );
	gl.vertexAttribPointer( this.shaderPair.attributes.aRGBA,
		bytesPerF32, gl.FLOAT, false, bytes, byteHead );
	// byteHead += 4 * bytesPerF32;

	// Generate vertex index strip
	this._indexBuffer.indices = this.indices;
	this._indexBuffer.refresh( gl );

	// Render
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer.buffer );
	gl.drawElements( gl.TRIANGLE_STRIP,
		this._indexBuffer.numItems,
		gl.UNSIGNED_SHORT, 0 );

	// Clear index buffer
	this.indices = [];
};


/**
* Primitive Shader Pair
* @class PrimitiveShader
* @constructor
* @namespace Kiwi.Shaders
* @since 0.1.0
*/
Kiwi.Shaders.PrimitiveShader = function() {

	// Super call
	Kiwi.Shaders.ShaderPair.call( this );

	// Extended functionality
	this.attributes = {
		aXY: null,
		aRGBA: null
	};

	// Configure uniforms
	this.uniforms = {
		uCamMatrix: {
			type: "mat3",
		},
		uResolution: {
			type: "2fv",
		}
	};

	// Declare shaders
	this.vertSource = [
		"attribute vec2 aXY;",
		"attribute vec4 aRGBA;",
		"uniform mat3 uCamMatrix;",
		"uniform vec2 uResolution;",
		"varying vec4 vRGBA;",
		"void main(void) {",
		"	vec2 pos = ( uCamMatrix * vec3( aXY, 1 ) ).xy; ",
		"	gl_Position = vec4( ( pos / uResolution * 2.0 - 1.0 ) *",
		"		vec2(1 , -1 ), 0, 1 );",
		"	vRGBA = aRGBA;",
		"}"
	];

	this.fragSource = [
		"precision mediump float;",
		"varying vec4 vRGBA;",
		"void main(void) {",
		"  gl_FragColor = vRGBA;",
		"}"
	];
};
Kiwi.extend( Kiwi.Shaders.PrimitiveShader, Kiwi.Shaders.ShaderPair );

Kiwi.Shaders.PrimitiveShader.prototype.init = function( gl ) {
	Kiwi.Shaders.ShaderPair.prototype.init.call( this, gl );

	this.attributes.aXY = gl.getAttribLocation(this.shaderProgram, "aXY");
	this.attributes.aRGBA = gl.getAttribLocation(this.shaderProgram, "aRGBA");

	this.initUniforms(gl);
};

/**
* A Object that outlines the information related to this Repetition Plugin. Aka the name and version of it. 
* 
* @module Kiwi
* @submodule Plugins
* @namespace Kiwi.Plugins
* @class Repetition
*/
Kiwi.Plugins.Repetition = {
    /**
    * The name of this plugin.
    * @property name
    * @default 'Repetition'
    * @public
    */
	name: 'Repetition',
    /**
    * The version of this plugin.
    * @property version
    * @default '1.0.0'
    */
	version: '1.0.0'
}
	
Kiwi.PluginManager.register(Kiwi.Plugins.Repetition);


//Do Kiwi Plugin GameObjects Exist?
if( typeof Kiwi.Plugins.GameObjects == "undefined") {
    Kiwi.Plugins.GameObjects = {}; 
}


/**
* 
* @class Repetition
* @extends Entity
* @namespace Kiwi.Plugins.GameObjects
* @constructor
* @param state {State} The State that this gameobject belongs to.
* @param atlas {TextureAtlas|SpriteSheet} The spritesheet or textureatlas that holds the font.
* @param [x=0] {Number} The gameobjects coordinates on the x-axis.
* @param [y=0] {Number} The gameobjects coordinates on the y-axis.
* @param [width] {Number} How wide of an area the Object should cover. Note: Does not take affect if locked to a camera. If not passed will be as wide as the first cell in the TextureAtlas.
* @param [height] {Number} How high of an area the Object should cover. Note: Does not take affect if locked to a camera. If not passed will be as wide as the first cell in the TextureAtlas.
*/
Kiwi.Plugins.GameObjects.Repetition = function(state, atlas, x, y, width, height) {

    //Call the parent.
    Kiwi.Entity.call(this, state, x, y); 

    /**
    * The texture atlas holds the image that will be used for rendering.
    * @property atlas
    * @type TextureAtlas
    * @public
    */
    this.atlas = atlas;

    /**
    * The camera that the repeating background should be 'locked' to. This is an INTERNAL property, use the 'camera' getters/setters for actual implementation 
    * @property _camera
    * @type Camera
    * @private
    */
    this._camera = null;

    /**
    * Indicates whether or not this GameObject is currently 'locked' onto a camera or not. This property is READ ONLY.
    * @property lockedToCamera
    * @type Boolean
    * @default false
    * @public
    */
    this.lockedToCamera = false;

    /**
    * Whether the graphic should be rendered in repetition on the X axis.
    * @property repeatX
    * @type Boolean
    * @default true
    * @public
    */
    this.repeatX = true;

    /**
    * Whether the graphic should be rendered in repetition on the y axis.
    * @property repeatY
    * @type Boolean
    * @default true
    * @public
    */
    this.repeatY = true;

    /**
    * The Offset, is a how far away from the regular x/y coordinates the rendering should take place. 
    * This work regardless of if it is locked to a camera or not.
    * @property _offset
    * @type Point
    * @private
    */
    this._offset = new Kiwi.Geom.Point(0, 0);

    /**
    * The cell offset is how far away the first image (when rendering) should be away from the top/left coordinate (normal x/y + offset x/y).
    * See the paralax/stars examples for more information. 
    * @property _cellOffset
    * @type Point
    * @private
    */
    this._cellOffset = new Kiwi.Geom.Point(0, 0);


    //Was the width set? 
    if(typeof width == "undefined") {
        this._width = this.atlas.cells[this.cellIndex].w;
    } else {
        this._width = width;
    }

    //Was the height set?
    if(typeof height == "undefined") {
        this._height = this.atlas.cells[this.cellIndex].h;
    } else {
        this._height = height;
    }

    //If rendering in webgl then use the TextureAtlasRenderer
    if( this.game.renderOption === Kiwi.RENDERER_WEBGL) {
        this.glRenderer = this.game.renderer.requestSharedRenderer("TextureAtlasRenderer");
    }

}

//End it from a Entity
Kiwi.extend(Kiwi.Plugins.GameObjects.Repetition, Kiwi.Entity);


/**
* The type of object this is.
* @method objType
* @type String
* @public
* @default 'Repetition'
*/
Kiwi.Plugins.GameObjects.Repetition.prototype.objType = function() {
    return 'Repetition';
}


/**
* The camera that the repeating background is 'locked' to.
* If you are wanting to remove the object from being 'locked' to the camera then set this to 'null' or 'false'.
* @property camera
* @type Camera
* @public
*/
Object.defineProperty(Kiwi.Plugins.GameObjects.Repetition.prototype, "camera", {
    get: function() {
        if(this.lockedToCamera) {
            return this._camera;
        } else {
            return null;
        }
    },
    set: function(val) {
        if(val == null || val == false) {
            this.lockedToCamera = false;
            this._camera = null;
        } else {
            this.lockedToCamera = true;
            this.x = 0;
            this.y = 0;
            this._camera = val;  
        }
    },
    enumerable: true,
    configurable: true
});


/**
* How wide of an area the Object should cover. 
* Note: If locked to a camera, then the width rendered will be that of the camera this is locked to. 
* You can still set the width if should take up afterwards if you want though.
* @property width
* @type number
* @public
*/
Object.defineProperty(Kiwi.Plugins.GameObjects.Repetition.prototype, "width", {
    get: function() {
        if(this.repeatX == false) return this.atlas.cells[this.cellIndex].w;

        if(this.lockedToCamera) {
            return this._camera.width;
        } else {
            return this._width;
        }

    },
    set: function(val) {
        this._width = val;
    },
    enumerable: true,
    configurable: true
});



/**
* How high of an area the Object should cover. 
* Note: If locked to a camera, then the height rendered will be that of the camera this is locked to. 
* You can still set the height if should take up afterwards if you want though.
* @property height
* @type number
* @public
*/
Object.defineProperty(Kiwi.Plugins.GameObjects.Repetition.prototype, "height", {
    get: function() {
        if(this.repeatY == false) return this.atlas.cells[this.cellIndex].h;

        if(this.lockedToCamera) {
            return this._camera.height;
        } else {
            return this._height;
        }

    },
    set: function(val) {
        this._height = val;
    },
    enumerable: true,
    configurable: true
});



/**
* The cell offset X is how far away the first image (when rendering) should be away from the left coordinate (normal x + offset x).
* The cell offset X is how far away the first image (when rendering) should be away from the left coordinate (normal x + offset x).
* See the paralax/stars examples for more information. 
* @property cellOffsetX
* @type number
* @public
*/
Object.defineProperty(Kiwi.Plugins.GameObjects.Repetition.prototype, "cellOffsetX", {
    get: function() {
        return this._cellOffset.x;
    },
    set: function(val) {        
        this._cellOffset.x = Kiwi.Utils.GameMath.wrap(val, this.atlas.cells[this.cellIndex].w, 1);
    },
    enumerable: true,
    configurable: true
});



/**
* The cell offset Y is how far away the first image (when rendering) should be away from the left coordinate (normal y + offset y).
* See the paralax/stars examples for more information. 
* @property cellOffsetY
* @type number
* @public
*/
Object.defineProperty(Kiwi.Plugins.GameObjects.Repetition.prototype, "cellOffsetY", {
    get: function() {
        return this._cellOffset.y;
    },
    set: function(val) {
        this._cellOffset.y = Kiwi.Utils.GameMath.wrap(val, this.atlas.cells[this.cellIndex].h, 0);
    },
    enumerable: true,
    configurable: true
});



/**
* The Offset, is a how far away from the regular x coordinates the rendering should take place. 
* This will work regardless of if it is locked to a camera or not.
* @property offsetX
* @type Number
* @public
*/
Object.defineProperty(Kiwi.Plugins.GameObjects.Repetition.prototype, "offsetX", {
    get: function() {
        return this._offset.x;
    },
    set: function(val) {
        this._offset.x = val;
    },
    enumerable: true,
    configurable: true
});



/**
* The Offset, is a how far away from the regular y coordinates the rendering should take place. 
* This will work regardless of if it is locked to a camera or not.
* @property offsetY
* @type Number
* @private
*/
Object.defineProperty(Kiwi.Plugins.GameObjects.Repetition.prototype, "offsetY", {
    get: function() {
        return this._offset.y;
    },
    set: function(val) {
        this._offset.y = val;
    },
    enumerable: true,
    configurable: true
});



/**
* The update loop that is executed every frame.
* @method update
* @public
*/
Kiwi.Plugins.GameObjects.Repetition.prototype.update = function() {

    //Update
    Kiwi.Entity.prototype.update.call(this);

    if(this.lockedToCamera) {
        this.x = 0 - this.camera.transform.x;
        this.y = 0 - this.camera.transform.y;
    }

}


/**
* The method that controls how this object is rendered when using the CANVAS renderer. 
* @method render
* @public
*/
Kiwi.Plugins.GameObjects.Repetition.prototype.render = function(camera) {

    if(this.visible == true && this.alpha > 0) {

        var ctx = this.game.stage.ctx;
        ctx.save();

        if (this.alpha > 0 && this.alpha <= 1) {
            ctx.globalAlpha = this.alpha;
        }

        //get entity/view matrix
        var t = this.transform;
        var m = t.getConcatenatedMatrix();

        var ct = camera.transform;

        //ctx.setTransform(m.a, m.b, m.c, m.d, m.tx + t.rotPointX, m.ty + t.rotPointY);
        ctx.transform(m.a, m.b, m.c, m.d, m.tx + t.rotPointX - ct.rotPointX, m.ty + t.rotPointY - ct.rotPointY);

        this.calculateCoordinates();

        for(var i = 0; i < this._renderCoords.length; i += 8) {

            //Loop through them...
            ctx.drawImage(this.atlas.image, this._renderCoords[i], this._renderCoords[i+1], this._renderCoords[i+2], this._renderCoords[i+3], this._renderCoords[i + 4] - t.rotPointX, this._renderCoords[i + 5] - t.rotPointY, this._renderCoords[i+6], this._renderCoords[i+7]);
        
        }

        ctx.restore();

    }   

}


/**
* This method is used across renderers to calculate the coordinates for all of the 
* @method calculateCoordinates
* @public 
*/
Kiwi.Plugins.GameObjects.Repetition.prototype.calculateCoordinates = function() {

        this._renderCoords = [];

        var cell = this.atlas.cells[this.cellIndex];

        var w = cell.w;
        var h = cell.h;

        var cellX = cell.x;
        var cellY = cell.y;

        for(var x = 0; x < this.width; x += w) {
            
            if(x + cell.w > this.width) {
                w = cell.w - ((x + cell.w) - this.width);
            } else {
                w = cell.w;
            }

            if(this._cellOffset.x !== 0 && x === 0) {

                w = cell.w - this._cellOffset.x; 

                cellX = cell.x + ( cell.w - w );

                if(x + w > this.width) {
                    w = this.width - x;
                }

            } else {
                cellX = cell.x;

            }

            for(var y = 0; y < this.height; y += h) {


                if(y + cell.h > this.height) {
                    h = cell.h - ((y + cell.h) - this.height);
                } else {
                    h = cell.h;
                }

                if(this._cellOffset.y !== 0 && y === 0) {

                    h = cell.h - this._cellOffset.y; 

                    cellY = cell.y + ( cell.h - h );

                    if(y + h > this.height) {
                        h = this.height - y;
                    }

                } else {
                    cellY = cell.y;

                }


                this._renderCoords.push(cellX, cellY, w, h, x + this.offsetX, y + this.offsetY, w, h);

            }
        }
}


/**
* Controls the rendering of this gameobject on WebGL.
* @method renderGL
* @public
*/
Kiwi.Plugins.GameObjects.Repetition.prototype.renderGL = function(gl, camera, params) {

    if(this.visible == false) return; 

    //Set-up the xyuv and alpha
    var vertexBuffer= [];

    //Width/Height
    var w = 0;
    var h = 0;

    //Transform/Matrix
    var t = this.transform;
    var m = t.getConcatenatedMatrix();

    //Create the Point Objects.
    var pt1 = new Kiwi.Geom.Point(0 - t.rotPointX , 0 - t.rotPointY);
    var pt2 = new Kiwi.Geom.Point(0 - t.rotPointX , 0 - t.rotPointY);
    var pt3 = new Kiwi.Geom.Point(0 - t.rotPointX , 0 - t.rotPointY);
    var pt4 = new Kiwi.Geom.Point(0 - t.rotPointX , 0 - t.rotPointY);


    //Add on the matrix to the points
    pt1 = m.transformPoint(pt1);
    pt2 = m.transformPoint(pt2);
    pt3 = m.transformPoint(pt3);
    pt4 = m.transformPoint(pt4);


    var cell = this.atlas.cells[this.cellIndex];


    this.calculateCoordinates();

    for(var i = 0; i < this._renderCoords.length; i += 8) {

        vertexBuffer.push(
            pt1.x + t.rotPointX + this._renderCoords[i + 4], pt1.y + t.rotPointY + this._renderCoords[i + 5],         this._renderCoords[i], this._renderCoords[i+1], this.alpha,                     //Top Left Point
            pt2.x + t.rotPointX + this._renderCoords[i + 4] + this._renderCoords[i+6], pt2.y + t.rotPointY + this._renderCoords[i + 5],     this._renderCoords[i] + this._renderCoords[i+2], this._renderCoords[i+1], this.alpha,                  //Top Right Point
            pt3.x + t.rotPointX + this._renderCoords[i + 4] + this._renderCoords[i+6], pt3.y + t.rotPointY + this._renderCoords[i + 5] + this._renderCoords[i+7], this._renderCoords[i] + this._renderCoords[i+2], this._renderCoords[i+1] + this._renderCoords[i+3], this.alpha,              //Bottom Right Point
            pt4.x + t.rotPointX + this._renderCoords[i + 4], pt4.y + t.rotPointY + this._renderCoords[i + 5] + this._renderCoords[i+7],     this._renderCoords[i], this._renderCoords[i+1] + this._renderCoords[i+3],  this.alpha                //Bottom Left Point
        );
        
    }


    //Add to the batch!
    this.glRenderer.concatBatch(vertexBuffer);

}
/**
* 
* @model Kiwi
* @submodel Plugins
* @class TouchButton
*/
Kiwi.Plugins.TouchButton = {
	name: 'TouchButton',
	version: '1.0.0'
}
Kiwi.PluginManager.register(Kiwi.Plugins.TouchButton);

//Do Kiwi Plugin GameObjects Exist?
if( typeof Kiwi.Plugins.GameObjects == "undefined") {
    Kiwi.Plugins.GameObjects = {}; 
}

Kiwi.Plugins.GameObjects.TouchButton = function(state, atlas, x, y){

	Kiwi.GameObjects.Sprite.call(this, state, atlas, x, y);

	this.animation.add('up', [0], 0.1, false);
	this.animation.add('down', [1], 0.1, false);	
	this.animation.play('up');
	this.isDown = false;
	this.isUp = true;
	this.hitbox = new Kiwi.Geom.Rectangle(x, y, this.width, this.height);
	this.enabled = true;

}
Kiwi.extend(Kiwi.Plugins.GameObjects.TouchButton, Kiwi.GameObjects.Sprite);

Kiwi.Plugins.GameObjects.TouchButton.prototype.update = function(){
	Kiwi.GameObjects.Sprite.prototype.update.call(this);

	var hit = false;
    //bug w/game.input
	//if(this.game.input.isDown) console.log('DOWN')
	if(this.enabled){
	    if (this.game.input.isDown) {
	        //console.log('input:', this.game.input.pointers)
			for(var i = 0; i<this.game.input.pointers.length; i++){
				if(this.game.input.pointers[i].active){
					if(this.hitbox.containsPoint(this.game.input.pointers[i].point)){
						if(this.isUp){
							this.isDown = true;
							this.isUp = false;
							if(this.animation.currentAnimation.name!='down')
								this.animation.switchTo('down', true);
						}
						hit = true;
					}
				}
			}
		}
	}

	if(!hit){
		if(this.isDown){
			this.isDown = false;
			this.isUp = true;
			if(this.animation.currentAnimation.name!='up')
				this.animation.switchTo('up', true);
		}
	}

}

//Disables the use of this button 
Kiwi.Plugins.GameObjects.TouchButton.prototype.disable = function(){
	this.enabled = false;
}

//Enables the use of this button 
Kiwi.Plugins.GameObjects.TouchButton.prototype.enable = function(){
	this.enabled = true;
}

//Hides the button but still allows its use
Kiwi.Plugins.GameObjects.TouchButton.prototype.hide = function(){
	this.visibility = false;
}

//Shows the button if it was hidden
Kiwi.Plugins.GameObjects.TouchButton.prototype.show = function(){
	this.visibility = true;
}
var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.Credits = new Kiwi.State('Credits');



PlatformBlueprint.Credits.create = function (params) {
	this.keyboard = this.game.input.keyboard;
	this.mouse = this.game.input.mouse;
	this.score = params;

	
	this.credits = new Kiwi.GameObjects.Sprite(this, this.textures.credits, 0, -20);

	// this.logo = new Kiwi.GameObjects.Sprite( this, this.textures.secretBaseLogo, 0, 0 );
	this.addChild( this.credits );

	this.keyboard.onKeyDownOnce.add(this.changeFrame, this);
	this.mouse.onDown.add(this.openURL, this);

	
}
PlatformBlueprint.Credits.changeFrame = function(){
	// Kiwi.State.prototype.update.call(this);
	if (this.credits.cellIndex < 0){
		this.credits.cellIndex ++;

	} else {
		this.exitState();
	}
}


PlatformBlueprint.Credits.exitState = function(){
	this.mouse.onDown.remove(this.openURL, this);
	this.keyboard.onKeyDownOnce.remove(this.changeFrame, this);

	game.states.switchState("Intro");

}

PlatformBlueprint.Credits.openURL = function(){

	window.open("http://store.steampowered.com/app/279580/");

}


var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.GameOver = new Kiwi.State('GameOver');



PlatformBlueprint.GameOver.create = function (params) {
	this.gameOverKeyboard = this.game.input.keyboard;
    this.mouse = this.game.input.mouse;
    this.score = params;
    this.game.stage.color = "000000";



	// this.keyboard.onKeyUp.add(this.startGame, this);
	// this.game.input.onUp.add(this.mouseUp, this);
	// this.menuBackground = new Kiwi.GameObjects.Sprite(this, this.textures.menu, 0, 0);
	// this.menuBackground.animation.add('play', [0, 1, 2, 2, 1], 0.075, true);
	// this.menuBackground.animation.play('play'); 
	// this.addChild(this.menuBackground);


    //BEAM
    this.beam = new Kiwi.GameObjects.Sprite( this, this.textures.GOBeam, 0, 0 );
    this.beam.animation.add('play', [0, 1, 2, 3, 3, 2, 1, 0], 0.075, true);
    this.beam.animation.play('play');

    this.beam.x = this.game.stage.width * 0.5 - this.beam.width * 0.5;
    this.addChild( this.beam ); 

    //EGON

    this.egon = new Kiwi.GameObjects.Sprite( this, this.textures.GOEgon, 430, 300 );
    this.egon.animation.add('standUp', [ 2, 3, 4, 5, 6, 7, 8 ], 0.075, false);
    this.egon.animation.getAnimation('standUp').onStop.add(this.exitState, this);
    // this.egon.animation.play('play');
    this.addChild( this.egon ); 

    //GOText

    this.GOText = new Kiwi.GameObjects.Sprite( this, this.textures.GOText, 0, 125 );
    this.GOText.x = this.game.stage.width * 0.5 - this.GOText.width * 0.5;
    this.addChild( this.GOText );

    //GOContinueQuit
    this.GOContinueQuit = new Kiwi.GameObjects.Sprite( this, this.textures.GOContinueQuit, 0, 190 );
    this.GOContinueQuit.x = this.game.stage.width * 0.5 - this.GOContinueQuit.width * 0.5;
    this.addChild( this.GOContinueQuit );

    this.rightKey = this.gameOverKeyboard.addKey(Kiwi.Input.Keycodes.D);
    this.leftKey = this.gameOverKeyboard.addKey(Kiwi.Input.Keycodes.A);
    this.selectKey = this.gameOverKeyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);

	

    this.game.cameras.defaultCamera.transform.x = 0;
    this.game.cameras.defaultCamera.transform.y = 0;
    //this.keyboard.onKeyDown.add(this.restartGame, this);

    ////////////////////////////
    //SCORE

    this.hudScore = new Kiwi.HUD.Widget.TextField(game, 'GAME OVER - YOUR SCORE IS: ' + this.score, 0, 480);
    
    this.hudScore.style.fontFamily = 'myFirstFont';
    this.hudScore.style.color = '#FFEAD1';
    this.hudScore.style.fontSize ="16px";
    this.hudScore.style.letterSpacing ="1px";
    this.hudScore.style.width ="100%";
    this.hudScore.style.textAlign ="center";

    game.huds.defaultHUD.addWidget(this.hudScore);

    this.gameOverKeyboard.onKeyDownOnce.add(this.keyDownOnce, this);

    this.shareTwitter = new Kiwi.GameObjects.Sprite( this, this.textures.twitterShare, 360,  510 );
    this.addChild ( this.shareTwitter );

    this.shareTwitter.input.onUp.add(this.share, this);



    //this.shareB = new Kiwi.Plugins.GameObjects.ShareButton(this, this.textures['shareButton'], game.stage.width/2 - 125 ,405);
    //this.shareB.enable();
    //this.addChild(this.shareB);

    
}
PlatformBlueprint.GameOver.update = function(){
    Kiwi.State.prototype.update.call(this);
}

PlatformBlueprint.GameOver.share = function(){
    console.log("Share");
    this.tweetWindow("http://bit.ly/1xGBN0s", "Merry Christmas, #Ghostbusters! Kick ectoplasmic ass in the new game by @secretbaseSG, powered by @kiwijsengine!");

}

PlatformBlueprint.GameOver.tweetWindow = function(url, text) {
  window.open( "http://twitter.com/share?url=" + 
    encodeURIComponent(url) + "&text=" + 
    encodeURIComponent(text) + "&count=none/", 
    "tweet", "height=300,width=550,resizable=1" ) 
}

// PlatformBlueprint.GameOver.restartGame = function(){
// 	this.gameOverKeyboard.onKeyUp.remove(this.restartGame, this);
// 	game.huds.defaultHUD.removeAllWidgets();

// 	game.states.switchState("Intro");

// }


PlatformBlueprint.GameOver.keyDownOnce = function(keyCode, key) {
    // body...
    //console.log(keyCode, key);

    if(keyCode == this.rightKey.keyCode){
        this.GOContinueQuit.animation.switchTo( 1 );
    } 

    if(keyCode == this.leftKey.keyCode){

        this.GOContinueQuit.animation.switchTo( 0 );
    } 
    /////////////////////
    //Capture
    if(keyCode == this.selectKey.keyCode){
        if( this.GOContinueQuit.animation.currentCell == 0 ) {
            this.continueGame();
            
        } else {
            this.exitState();
        }
    }



};

PlatformBlueprint.GameOver.continueGame = function(){
    this.egon.animation.play('standUp');

}


PlatformBlueprint.GameOver.exitState = function(){
    this.gameOverKeyboard.onKeyDownOnce.remove(this.keyDownOnce, this);
    this.gameOverKeyboard.onKeyUp.remove(this.keyDownOnce, this);
    // this.keyboard.onKeyUp.remove(this.restartGame, this);
    game.huds.defaultHUD.removeAllWidgets();

    game.states.switchState("Intro");

}
var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.HowToPlay = new Kiwi.State('HowToPlay');



PlatformBlueprint.HowToPlay.create = function (params) {
	this.keyboard = this.game.input.keyboard;
	this.mouse = this.game.input.mouse;
	this.score = params;

	
	this.howTo = new Kiwi.GameObjects.Sprite(this, this.textures.howTo, 0, 0);

	// this.logo = new Kiwi.GameObjects.Sprite( this, this.textures.secretBaseLogo, 0, 0 );
	this.addChild( this.howTo );

	this.keyboard.onKeyDownOnce.add(this.changeFrame, this);

	
}
PlatformBlueprint.HowToPlay.changeFrame = function(){
	// Kiwi.State.prototype.update.call(this);
	if (this.howTo.cellIndex < 2){
		this.howTo.cellIndex ++;

	} else {
		this.exitState();
	}
}


PlatformBlueprint.HowToPlay.exitState = function(){
	this.keyboard.onKeyDownOnce.remove(this.changeFrame, this);
	game.states.switchState("Intro");

}

var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.Intro = new Kiwi.State('Intro');

/**
* The IntroState is the state which would manage any main-menu functionality for your game.
* Generally this State would switch to other sub 'states' which would handle the individual features. 
*  
* Right now we are just switching straight to the PlayState.
*
*/
PlatformBlueprint.Intro.init = function(){
	this.timer  = this.game.time.clock.createTimer('changeVisible', .175, -1, false);
    this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.changeVisible, this);  //create a new timer event on that timer

}

PlatformBlueprint.Intro.create = function () {
	this.keyboard = this.game.input.keyboard;
    this.mouse = this.game.input.mouse;

    //game.timers.stopAllTimers()


    this.rightKey = this.keyboard.addKey(Kiwi.Input.Keycodes.D);

    this.upKey = this.keyboard.addKey(Kiwi.Input.Keycodes.W);
    this.downKey = this.keyboard.addKey(Kiwi.Input.Keycodes.S);

    this.enterKey  = this.keyboard.addKey(Kiwi.Input.Keycodes.ENTER);
    this.spaceKey  = this.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);

	this.keyboard.onKeyDownOnce.add(this.startGame, this);
	this.menuBackground = new Kiwi.GameObjects.Sprite(this, this.textures.menu, 0, 0);
	this.menuBackground.animation.add('play', [0, 1, 2, 2, 1], 0.075, true);
	this.menuBackground.animation.play('play'); 
	this.addChild(this.menuBackground);

	this.startText = new Kiwi.GameObjects.StaticImage(this, this.textures.startText, 375, 440);
	// this.addChild(this.startText);

	this.menuSelect = new Kiwi.GameObjects.Sprite(this, this.textures.menuSelectSprite, 360, 410);
	this.addChild(this.menuSelect);

	
    this.timer.start();
    this.counter = 0;

    this.game.cameras.defaultCamera.transform.x = 0;
    this.game.cameras.defaultCamera.transform.y = 0;

    this.hudScore = new Kiwi.HUD.Widget.TextField(game, 'ORIGINAL CONCEPT BY SECRET BASE', 0, 10);
    
    this.hudScore.style.fontFamily = 'myFirstFont';
    this.hudScore.style.color = '#FFEAD1';
    this.hudScore.style.fontSize ="16px";
    this.hudScore.style.letterSpacing ="1px";
    this.hudScore.style.width ="100%";
    this.hudScore.style.textAlign ="center";


    game.huds.defaultHUD.addWidget(this.hudScore);

    
}
PlatformBlueprint.Intro.startGame = function(keyCode, key){

	if(keyCode == this.rightKey.keyCode){

	}
	if(keyCode == this.upKey.keyCode){
		this.menuSelect.animation.prevFrame();

		
	}
	if(keyCode == this.downKey.keyCode){
		this.menuSelect.animation.nextFrame();
		
	}
	if(keyCode == this.enterKey.keyCode){
		
		game.states.switchState("HowToPlay");
		
	}

	if(keyCode == this.spaceKey.keyCode){
		console.log(this.menuSelect.cellIndex);

		switch (this.menuSelect.cellIndex) {
			case 0:
				this.stopState();
				game.states.switchState("Play");
				break
			case 1:
				this.stopState();
				game.states.switchState("HowToPlay");
				break;
			case 2:
				this.stopState();
				game.states.switchState("Credits");
				break;
			case 3:
				this.share();
				break;
			default:

		}
		
	}
	

}
PlatformBlueprint.Intro.stopState = function(){
	this.keyboard.onKeyDownOnce.remove(this.startGame, this);
		this.timer.stop();
		this.hudScore.style.opacity = 0;

}

PlatformBlueprint.Intro.share = function(){
    console.log("Share");
    this.tweetWindow("http://bit.ly/1xGBN0s", "Merry Christmas, #Ghostbusters! Kick ectoplasmic ass in the new game by @secretbaseSG, powered by @kiwijsengine!");

}

PlatformBlueprint.Intro.tweetWindow = function(url, text) {
  window.open( "http://twitter.com/share?url=" + 
    encodeURIComponent(url) + "&text=" + 
    encodeURIComponent(text) + "&count=none/", 
    "tweet", "height=300,width=550,resizable=1" ) 
}


PlatformBlueprint.Intro.changeVisible = function(){
	if(this.startText.alpha == 1){
		if(this.counter == 1){
			this.startText.alpha = 0;
		} else {
			this.counter +=1;
		}
	} else {
		this.startText.alpha = 1;
		this.counter = 0;
	}

}
/**
* The Loading State is going to be used to load in all of the in-game assets that we need in game.
*
* Because in this blueprint there is only a single "hidden object" section we are going to load in all of 
* the asset's at this point.
*
* If you have multiple states however, I would recommend have loading the other graphics as they are required by their states, 
* Otherwise the loading times maybe a bit long and it is not the most optimal solution.
*
*/

/**
* Since we want to use the custom Kiwi.JS loader with the bobing kiwi/html5 logo and everything. We need to extend the KiwiLoadingScreen State.  
* The KiwiLoadingScreen State is an extentsion of a normal State but it has some custom code to handle the loading/bobbing/fading of all the items, so if you override a method (like the preload) for example just make sure you call the super method.
* 
* The parameters we are passing into this method are as ordered.
* 1 - name {String} Name of this state.
* 2 - stateToSwitch {String} Name of the state to switch to AFTER all the assets have loaded. Note: The state you want to switch to should already have been added to the game.
* 3 - dimensions {Object} A Object containing the width/height that the game is to be. For example {width: 1024, height: 768}
* 4 - subfolder {String} The folder that the loading graphics are located at. 
*/

var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.Loading = new KiwiLoadingScreen('Loading', 'SplashState', 'assets/img/loading/');
// PlatformBlueprint.Loading = new KiwiLoadingScreen('Loading', 'Play', 'assets/img/loading/');

PlatformBlueprint.Loading.preload = function () {
    
    //Make sure to call the super at the top.
    //Otherwise the loading graphics will load last, and that defies the whole point in loading them. 
    KiwiLoadingScreen.prototype.preload.call(this);

    this.addImage('background1', 'assets/img/environment/background.jpg');
    this.addImage('secretBaseLogo', 'assets/img/loading/LogoSecretBase0150.png');
    ////////////////////////
    //PLAYER
    this.addSpriteSheet('egonSprite', 'assets/img/sprites/egon-sprite.png', 100, 100);
    this.addImage('UI', 'assets/img/UI/UI.png');
    this.addImage('cashUI', 'assets/img/UI/cashUI.png');

    ///////////////////////////
    //PROTON BEAM
    this.addSpriteSheet('beam', 'assets/img/beam/beam.png', 24 , 24);
    this.addSpriteSheet('beamSpark', 'assets/img/beam/beamSpark.png', 48, 48);
    this.addSpriteSheet('impact', 'assets/img/beam/impact.png', 68, 68);

    //////////////////////
    //ENEMIES

    this.addSpriteSheet('ghost', 'assets/img/enemies/ghost2.png', 160, 160);
    this.addSpriteSheet('boss', 'assets/img/enemies/boss.png', 300, 200);

    this.addSpriteSheet('questionMark', 'assets/img/enemies/Slimer_questionmark.png', 60, 60);
    this.addSpriteSheet('escapeText', 'assets/img/enemies/Slimer_EscapeText04.png', 68, 44);

    this.addSpriteSheet('books', 'assets/img/enemies/books.png', 200, 200);
    this.addSpriteSheet('shield', 'assets/img/enemies/shield.png', 300, 220);


    //////////////////////
    //Game Over

    this.addSpriteSheet('GOContinueQuit', 'assets/img/gameOver/continue-quit.png', 380, 18);
    this.addSpriteSheet('GOEgon', 'assets/img/gameOver/egonGameOver.png', 120, 120);
    this.addImage('GOText', 'assets/img/gameOver/Gameover_text_gameover.png');
    this.addSpriteSheet('GOBeam', 'assets/img/gameOver/gameOverBeam.png', 294, 451);

    this.addImage('twitterShare', 'assets/img/gameOver/Twitter2.png' );

    /////////////////////
    //MINIGAME 
    this.addSpriteSheet('blueCircle', 'assets/img/minigame/blue3.png', 70, 70);
    this.addImage('redCircle', 'assets/img/minigame/redCircle.png');
    this.addImage('skullTest', 'assets/img/minigame/skull.png');
    this.addSpriteSheet('skull', 'assets/img/minigame/pacGhostSprite.png', 70, 70);
    this.addSpriteSheet('confirm', 'assets/img/minigame/confirm.png', 66, 14);

    //////////////////////
    //ITEMS
    this.addSpriteSheet('cash', 'assets/img/items/cash.png', 160, 160);
    this.addSpriteSheet('gem', 'assets/img/items/diamond.png', 32, 32);
    this.addSpriteSheet('bookPile', 'assets/img/items/bookPiles.png', 248, 72);





    ////////////////////////////
    //BUTTONS
    this.addSpriteSheet('shareButton', 'assets/img/buttons/Share.png', 250, 70);

    ////////////////////////////
    //MENU
    this.addSpriteSheet('menu', 'assets/img/menu/MenuAnimation.png', 960, 540);
    this.addSpriteSheet('howTo', 'assets/img/menu/HowTo.png', 960, 540);
    this.addSpriteSheet('credits', 'assets/img/menu/Credits.png', 960, 540);
    this.addImage('startText', 'assets/img/menu/PressStart1.png');

    this.addSpriteSheet( 'menuSelectSprite', 'assets/img/menu/menuSelectSprite.png', 264, 118 );

    /////////////////////////
    //MENU OPENING
    this.addImage('open1', 'assets/img/menu/Menu_Opening1.png');
    this.addImage('open2', 'assets/img/menu/Menu_Opening2.png');
    this.addImage('open3', 'assets/img/menu/Menu_Opening3.png');
    this.addImage('open4', 'assets/img/menu/Menu_Opening4.png');




    ////////////////////////
    //TEXTURE ATLASES
    //this.addTextureAtlas('environmentTiles', 'assets/img/tiles.png', 'environmentJSON', 'src/json/environment.json');
    


    //optional on screen controller assets
    this.addSpriteSheet('leftButton', 'assets/img/controller/leftButton.png', 51, 73);
    this.addSpriteSheet('rightButton', 'assets/img/controller/rightButton.png', 51, 73);
    this.addSpriteSheet('upButton', 'assets/img/controller/upButton.png', 73, 51);
    this.addSpriteSheet('downButton', 'assets/img/controller/downButton.png', 73, 51);

    this.addSpriteSheet('tiles', 'assets/img/tiles2.png', 32, 32);

    //Test
    //this.addJSON('tilemap', 'assets/map/map.json');
    this.addJSON('tilemap', 'assets/map/BossLevel.json');

};

var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.MenuOpening = new Kiwi.State('MenuOpening');



PlatformBlueprint.MenuOpening.create = function (params) {
	this.open1 = new Kiwi.GameObjects.Sprite ( this, this.textures.open1, 0, 0 );
	this.open1.alpha = 0;
	this.open1.x = this.game.stage.width * 0.5 - this.open1.width * 0.5;
	this.open1.y = this.game.stage.height * 0.5 - this.open1.height * 0.5;

	this.open2 = new Kiwi.GameObjects.Sprite ( this, this.textures.open2, 0, 0 );
	this.open2.alpha = 0;
	this.open2.x = this.game.stage.width * 0.5 - this.open2.width * 0.5;
	this.open2.y = this.game.stage.height * 0.5 - this.open2.height * 0.5;

	this.open3 = new Kiwi.GameObjects.Sprite ( this, this.textures.open3, 0, 0 );
	this.open3.alpha = 0;
	this.open3.x = this.game.stage.width * 0.5 - this.open3.width * 0.5;
	this.open3.y = this.game.stage.height * 0.5 - this.open3.height * 0.5;

	this.open4 = new Kiwi.GameObjects.Sprite ( this, this.textures.open4, 0, 0 );
	this.open4.alpha = 0;
	this.open4.x = this.game.stage.width * 0.5 - this.open4.width * 0.5;
	this.open4.y = this.game.stage.height * 0.5 - this.open4.height * 0.5;

	this.menuBackground = new Kiwi.GameObjects.Sprite(this, this.textures.menu, 0, 0);
	this.menuBackground.animation.add('play', [0, 1, 2, 2, 1], 0.075, true);
	this.menuBackground.animation.play('play'); 
	this.menuBackground.alpha = 0;
	this.addChild(this.menuBackground);


	this.addChild( this.open4 );
	this.addChild( this.open3 );
	this.addChild( this.open2 );
	this.addChild( this.open1 );

	this.tweenTime = 500;
	this.tweenHoldTime = 1000;
	this.tweenInTime = 500;
	this.delayTime = 200;

	///////////////////
	//KEYBOARD
	this.keyboard = this.game.input.keyboard;
	this.skip2Key = this.keyboard.addKey(Kiwi.Input.Keycodes.ENTER);

	this.skipKey = this.keyboard.addKey(Kiwi.Input.Keycodes.SPACEBAR);

	this.keyboard.onKeyDownOnce.add(this.myKeyDownOnce, this);



	//create the tweens
  this.tween1In = this.game.tweens.create(this.open1);
  this.tween1Hold = this.game.tweens.create(this.open1);  
  this.tween1Out = this.game.tweens.create(this.open1);

  this.tween2In = this.game.tweens.create(this.open2); 
  this.tween2Hold = this.game.tweens.create(this.open2); 
  this.tween2Out = this.game.tweens.create(this.open2); 

  this.tween3In = this.game.tweens.create(this.open3);
  this.tween3Hold = this.game.tweens.create(this.open3); 
  this.tween3Out = this.game.tweens.create(this.open3);

  this.tween4In = this.game.tweens.create(this.open4);
  this.tween4Hold = this.game.tweens.create(this.open4);
  // this.tween4Out = this.game.tweens.create(this.open4);
  
  //set the tweens up
  this.tween1In.to({ alpha: 1 }, this.tweenInTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween1Hold.to({ alpha: 1 }, this.tweenHoldTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween1Out.to({ alpha: 0 }, this.tweenTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);

  this.tween2In.to({ alpha: 1 }, this.tweenInTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween2Hold.to({ alpha: 1 }, this.tweenHoldTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween2Out.to({ alpha: 0 }, this.tweenTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);

  this.tween3In.to({ alpha: 1 }, this.tweenInTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween3Hold.to({ alpha: 1 }, this.tweenHoldTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween3Out.to({ alpha: 0 }, this.tweenTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);

  this.tween4In.to({ alpha: 1 }, this.tweenInTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);
  this.tween4Hold.to({ alpha: 1 }, this.tweenHoldTime, Kiwi.Animations.Tweens.Easing.Linear.None, false);


  this.tween1In.delay(this.delayTime);
  this.tween2In.delay(this.delayTime);
  this.tween3In.delay(this.delayTime);
  this.tween4In.delay(this.delayTime);

  //set the order that they will execute one after the other in.
  this.tween1In.chain(this.tween1Hold);
  this.tween1Hold.chain(this.tween1Out);
  this.tween1Out.chain(this.tween2In);

  this.tween2In.chain(this.tween2Hold);
  this.tween2Hold.chain(this.tween2Out);
  this.tween2Out.chain(this.tween3In);

  this.tween3In.chain(this.tween3Hold);
  this.tween3Hold.chain(this.tween3Out);
  this.tween3Out.chain(this.tween4In);

  this.tween4In.chain(this.tween4Hold);

  this.tween4Hold.onComplete( this.startFlash, this );

  this.tween1In.start();

	
}
PlatformBlueprint.MenuOpening.startFlash = function(){

	// console.log ( "Start Flash" );

	this.menuBackground.alpha = 1;

	this.timer  = this.game.time.clock.createTimer('flash', 0.125, 16, false);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.flash, this);  //create a new timer event on that timer
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_STOP, this.exitState, this);  //create a new timer event on that timer
	this.timer.start();
}

PlatformBlueprint.MenuOpening.flash = function(){

	// console.log ( "Flash" , this.open4.alpha );

	if( this.open4.alpha == 1 ) {
		this.open4.alpha = 0;
	} else {
		this.open4.alpha = 1;
	}
}



PlatformBlueprint.MenuOpening.exitState = function(){
	if(this.game.states.current.name == 'MenuOpening' ){

		game.states.switchState("Intro");
	}

}
PlatformBlueprint.MenuOpening.myKeyDownOnce = function(keyCode, key) {
	// body...
	//console.log(keyCode, key);



	if(keyCode == this.skipKey.keyCode || keyCode == this.skip2Key.keyCode){
	  this.keyboard.onKeyDownOnce.remove(this.myKeyDownOnce, this);
	  game.states.switchState("Intro");
	} 


};
var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.Play = new Kiwi.State('Play');


/**
* The Play in the core state that is used in the game. 
*
* It is the state where the majority of the functionality occurs 'in-game'.
* 
*
* @class Play
* @extends State
* @constructor
*/

/**
* This create method is executed when Kiwi Game reaches the boot stage of the game loop.
* @method create
* @public
*/
PlatformBlueprint.Play.create = function () {
    //camera to follow movement of player
    this.camera = this.game.cameras.defaultCamera;
    //game.stage.resize(800, 600);

    this.game.input.keyboard.onKeyDown.removeAll();
    this.game.input.keyboard.onKeyDownOnce.removeAll();
    this.game.input.keyboard.onKeyUp.removeAll();
    

    //game.stage.createDebugCanvas();

    
    this.background = new Kiwi.GameObjects.StaticImage( this, this.textures.background1, 0, -57 );
    this.addChild(this.background);
    this.background.scaleX = 1;
    this.background.scaleY = 1;
    this.width = this.game.stage.width;

    //Switch the background colour back to white from purple
    this.game.stage.color = 'ffffff';

    //this.generateTileMap();

    this.gameManager = new GameManager(this);
    this.inputManager = new InputManager(this);

    
    this.bookPileL = new Kiwi.GameObjects.Sprite( this, this.textures.bookPile, 1100, 475 );
    this.bookPileL.animation.add( 'left', [0], 1, false, true );
    this.bookPileL.scaleX = -1;

    this.bookPileR = new Kiwi.GameObjects.Sprite( this, this.textures.bookPile, 2150, 480 );
    this.bookPileR.animation.add( 'right', [1], 1, false, true );
    this.bookPileR.scaleX = -1;

    
    this.addChild( this.bookPileR );
    this.addChild( this.bookPileL );
    //////////////////////////
    //enemy manager


    this.levelManager = new LevelManager(this);
    this.levelManager.generateTileMap();

    this.enemyManager = new EnemyManager(this);
    this.addChild(this.enemyManager);

    this.itemManager = new ItemManager(this);
    this.addChild(this.itemManager);

    
    this.hudManager = new HUDManager(this);

    this.collisionManager = new CollisionManager(this);
    this.cameraManager = new CameraManager(this);




    this.playersLegs = new PlayersLegs( this, 0, 0 );
    this.addChild( this.playersLegs );
    this.player = new PlayerManager(this, 100, 444);
    this.addChild(this.player);
    this.weaponManager = new WeaponManager(this);

    

    // this.boss = new Boss( this, 1625, 200 );
    // this.addChild(this.boss);

    // this.swapChildren( this.boss, this.boss.shield );

    this.miniGameManager = new MiniGame( this );
    this.addChild( this.miniGameManager );

    this.survivalGame = new SurvivalGame(this);



    //////////////////////
    //Swap Children
    //this.swapChildren(this.weaponManager.sparkGroup, this.player);
    //this.swapChildren(this.enemyManager.deathGroup, this.weaponManager.myMiniGame.ring);

    //individual tile dimensions
    this.tileWidth = 32;
    this.tileHeight = 32;

    //////////////////
    //ITEMS
    this.cashGroup = new Kiwi.Group(this);
    this.addChild(this.cashGroup);


    

    //this.enemyManager.addEnemies(1);

    //Add to the screen.
    this.sloping = true;


    this.px = this.player.x + this.player.box.bounds.width / 2;
    this.py = this.player.y + this.player.height;

    this.levelManager.generateForegroundTileMap();
    console.log('CREATE GAME');

    /////////////////
    //Add level assets
    this.levelManager.gemsLevelOne();
    this.levelManager.ghostsLevelOne();



};


/**
* This method is the main update loop. Move scrolling items and update player here
* @method update
* @public
*/
PlatformBlueprint.Play.update = function () {
    this.cameraManager.update();
    this.gameManager.update();
    this.hudManager.update();
    this.weaponManager.update();
    this.enemyManager.update();

    this.player.update();
    this.player.physics.update();

    this.updateCash();
    
    Kiwi.State.prototype.update.call(this);

    

    //check sloping collisions
    this.sloping = false;

    
    //bottom middle point of player to check against sloping tiles
    this.px = Math.round(this.player.x + this.player.box.bounds.width / 2);
    this.py = this.player.y + this.player.height;

    //check sloping tiles
    this.collisionManager.checkLeftSlope();
    this.collisionManager.checkRightSlope();
    
    this.collisionManager.update();
    
    
   // this.updateController();
};


PlatformBlueprint.Play.updateCash = function(){
    for (var i = this.cashGroup.members.length - 1; i>= 0; i--) {
        //console.log("test");
        this.cashGroup.members[i].physics.update();
    }
};

PlatformBlueprint.Play.createBoss = function(){
    this.boss = new Boss( this, 1625, 200 );
    this.addChild(this.boss);

    this.swapChildren( this.boss, this.boss.shield );
    this.swapChildren( this.boss, this.miniGameManager );
};

PlatformBlueprint.Play.createSurvivalGame = function(){
    // this.boss = new Boss( this, 1625, 200 );
    // this.addChild(this.boss);

    // this.survivalGame = new SurvivalGame(this)

    // this.swapChildren( this.boss, this.boss.shield );
    // this.swapChildren( this.boss, this.miniGameManager )
};

var PlatformBlueprint = PlatformBlueprint || {};

PlatformBlueprint.SplashState = new Kiwi.State('SplashState');



PlatformBlueprint.SplashState.create = function (params) {
	this.keyboard = this.game.input.keyboard;
	this.mouse = this.game.input.mouse;
	this.score = params;

	

	this.game.cameras.defaultCamera.transform.x = 0;
	this.game.cameras.defaultCamera.transform.y = 0;

	this.game.stage.color = "000000";
	//create the tweens
	this.logo = new Kiwi.GameObjects.Sprite( this, this.textures.secretBaseLogo, 0, 0 );
	this.logo.x = this.game.stage.width * 0.5 - this.logo.width * 0.5;
	this.logo.alpha = 0;
	this.addChild( this.logo );
	this.tweenA = this.game.tweens.create(this.logo);  
	this.tweenB = this.game.tweens.create(this.logo); 
	this.tweenC = this.game.tweens.create(this.logo);

	//set the tweens up
	this.tweenA.to({ alpha: 1 }, 500, Kiwi.Animations.Tweens.Easing.Quintic.In, false);
	this.tweenB.to({ alpha: 1 }, 3000, Kiwi.Animations.Tweens.Easing.Circular.InOut, false);
	this.tweenC.to({ alpha: 0 }, 500, Kiwi.Animations.Tweens.Easing.Quintic.Out, false);
	this.tweenC.onComplete( this.splashFinished, this );

	//set the order that they will execute one after the other in.
	this.tweenA.chain(this.tweenB);
	this.tweenB.chain(this.tweenC);

	this.tweenA.start();

	 

	
}
PlatformBlueprint.SplashState.update = function(){
	Kiwi.State.prototype.update.call(this);
}


PlatformBlueprint.SplashState.splashFinished = function(){

	game.states.switchState("MenuOpening");

}


/**
* The core PlatformBlueprint game file.
* 
* This file is only used to initalise (start-up) the main Kiwi Game 
* and add all of the relevant states to that Game.
*
*/

//Initialise the Kiwi Game. 

var gameOptions = {
	renderer: Kiwi.RENDERER_CANVAS, 
	width: 960,
	height: 540,
	plugins: ['ShareButton', 'Repetition'],
	scaleType : Kiwi.Stage.SCALE_FIT
}

var game = new Kiwi.Game('content', 'PlatformBlueprint', null, gameOptions);

Kiwi.Geom.Intersect.lineToRawSegment = function (line, x1, y1, x2, y2, output) {
	if (typeof output === "undefined") { output = new Geom.IntersectResult; }
	var denom = (line.x1 - line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 - x2);
	if (denom !== 0) {
		output.x = ((line.x1 * line.y2 - line.y1 * line.x2) * (x1 - x2) - (line.x1 - line.x2) * (x1 * y2 - y1 * x2)) / denom;
		output.y = ((line.x1 * line.y2 - line.y1 * line.x2) * (y1 - y2) - (line.y1 - line.y2) * (x1 * y2 - y1 * x2)) / denom;

		var maxX = Math.max(x1, x2);
		var minX = Math.min(x1, x2);
		var maxY = Math.max(y1, y2);
		var minY = Math.min(y1, y2);

		if ((output.x <= maxX && output.x >= minX) === true && (output.y <= maxY && output.y >= minY) === true) {
			output.result = true;
		}
	}

	return output;
};


//Add all the States we are going to use.
game.states.addState(PlatformBlueprint.Loading);
game.states.addState(PlatformBlueprint.MenuOpening);
game.states.addState(PlatformBlueprint.HowToPlay);
game.states.addState(PlatformBlueprint.Credits);
game.states.addState(PlatformBlueprint.SplashState);
game.states.addState(PlatformBlueprint.Intro);
game.states.addState(PlatformBlueprint.Play);
game.states.addState(PlatformBlueprint.GameOver);

game.states.switchState("Loading");

