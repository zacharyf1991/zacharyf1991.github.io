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


};



WeaponManager.prototype.stopShooting = function() {
	this.shooting = false;
	this.beamShooting = false;
	this.enemyTargeted = false
	this.beamStage = 0;
	
   
};


WeaponManager.prototype.startShooting = function(){
	//console.log("startShooting has been reached");
	if(this.shooting == false && !this.state.player.jumping){
		//IF ADD MULTIPLE WEAPONS CHECK TYPE OF WEAPON THEN CALL THE START SHOOTING METHOD ON IT

		this.beamManager.shoot();
		this.state.player.setAnimation();
	}

}



WeaponManager.prototype.damageEnemy = function() {
	
};


WeaponManager.prototype.shootKeyUp = function(){

	this.shootKeyIsDown = false;
	this.shooting = false;
	this.beamManager.stoppedShooting();
	this.state.enemyManager.resetEnemies();
	this.stopShooting();
	this.state.enemyManager.resetHit();



}



WeaponManager.prototype.shootKeyDown = function(){
		this.shootIsKeyDown = true;

		this.startShooting();
}
