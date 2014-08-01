var ObjectManager = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.objects = new Kiwi.Group(state);

	this.state.addChild(this.objects);
	


}
Kiwi.extend(ObjectManager, Kiwi.Group);




ObjectManager.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	this.checkCollision();

	// console.log("Objects update");	

	// var platMemebers = this.platforms.members;

	// for (var i = platMemebers.length - 1; i >= 0; i--) {
	// 	platMemebers[i].updateMovement();
	// };

}

////////////////////////////////////////////////////
//Call this when platform has been moved 'activated'
ObjectManager.prototype.createObject = function(plat){
	

	/// if 1  out of 4
	//	// if 1 out of 2
			//create crate
		//else
			//create collectable

	var spawnRNG = Math.floor(Math.random()*4);
	var typeRNG = Math.floor(Math.random()*2);
	// console.log(spawnRNG);
	if(spawnRNG == 3){
		// console.log("Spawn")
		if(typeRNG == 1){
			// console.log("Crate");
			var temp = new Crate(this.state, plat);
			this.objects.addChild(temp);
		} else {
			// console.log("Kiwi!");
			var temp = new Collectable(this.state, plat);
			this.objects.addChild(temp);
		}
	}


	

}

ObjectManager.prototype.checkCollision = function(){
	var player = this.state.player;
	var objectMembers = this.objects.members;
	// console.log("Collisionioasdasd")

	for (var i = objectMembers.length - 1; i >= 0; i--) {
		if(objectMembers[i].physics.overlaps(player) && objectMembers[i].collidable){
			objectMembers[i].hitPlayer();
			// console.log("Object hit player");
		}
	};

	/// if 1  out of 4
	//	// if 1 out of 2
			//create crate
		//else
			//create collectable


	

}








