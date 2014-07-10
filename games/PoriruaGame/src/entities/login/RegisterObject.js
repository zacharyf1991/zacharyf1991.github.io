var RegisterOverlay = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;


	//////////////////
	//Create four HUDinput objects

	////////////////////
	//Create checkbox terms of use

	////////////
	//Create two buttons to be pressed.






}
Kiwi.extend(RegisterOverlay , Kiwi.Group);

RegisterOverlay.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	this.checkCollision();

}





