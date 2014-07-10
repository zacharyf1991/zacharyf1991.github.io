var ChocBarManager = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.bars =  [];
	this.barsCollected = 0;






}
Kiwi.extend(ChocBarManager , Kiwi.Group);

ChocBarManager.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	this.checkCollision();

}

ChocBarManager.prototype.addBar = function(){
	if(this.bars.length < 4){
		//add 'num' enemies to group
		var pointArray = Math.random() * (this.state.rect1.allRoadPoints.length -1);
		var pointArray = Math.round(pointArray);
		var pointInArray = Math.random() * (this.state.rect1.allRoadPoints[pointArray].length - 1);
		var pointInArray = Math.round(pointInArray);

		//console.log(this.state.rect1.allRoadPoints[pointArray][pointInArray]);

		var myPoint = this.state.rect1.allRoadPoints[pointArray][pointInArray]
		var tempBar = new ChocBar(this.state, myPoint.x, myPoint.y);
		this.state.addChild(tempBar);
	    this.bars[this.bars.length] = tempBar;
	}

	
		
}

ChocBarManager.prototype.checkCollision = function() {
	for (var i = this.bars.length - 1; i >= 0; i--) {
		if(this.bars[i].checkCollision(this.state.player)){
			tempBar = this.bars[this.bars.length -1];
			this.bars[i].exists = false;
			this.bars.splice(i, 1);


			break;
		}


	};
};

ChocBarManager.prototype.chocBarCollected = function() {
	this.barsCollected +=1;
	this.startChocBarEffects();
};


ChocBarManager.prototype.startChocBarEffects = function() {
	//this.barsCollected +=1;
	this.endChocBarEffects();
};

ChocBarManager.prototype.endChocBarEffects = function() {
	//console.log()
};


