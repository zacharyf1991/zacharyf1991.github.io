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
		if(this.sprite.animation.currentAnimation.name!='appear'){
			//console.log('appear node');
			//this.sprite.isVisible = true;
	        this.sprite.animation.switchTo('appear', true);
	    }
	    else if(this.sprite.animation.currentCell==15){
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
			this.sprite.animation.play('disappear', false);
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

		if (this.sprite.animation.currentAnimation.name == 'disappear'){
			if(this.sprite.cellIndex != 41){
				//this.sprite.cellIndex ++;
				// console.log("PLAYING ANIMATION");
				this.sprite.scaleX = 1;
				this.status = this.STATUS_RUNNING;
			} else {
				// console.log("FINISHED ANIMATION", this.sprite.cellIndex);
				this.status = this.STATUS_SUCCESS;

			}

		} else {
			// console.log("START ANIMATION");
			this.sprite.animation.play('disappear');
			this.sprite.scaleX = 1;
			this.status = this.STATUS_RUNNING;
		}

	
	}
	return( this );
}