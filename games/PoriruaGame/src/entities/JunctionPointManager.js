var JunctionPointManager = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.junctionPoints =  [];






}
Kiwi.extend(JunctionPointManager , Kiwi.Group);

JunctionPointManager.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	this.checkCollision();

}

JunctionPointManager.prototype.addJP = function(x, y){
	//add 'num' enemies to group
	if(type == 'ghost'){
		var tempJP = new JunctionPoint(this.state, x, y);
        this.junctionPoints[this.junctionPoints.length] = tempJP;

	}
		
}

JunctionPointManager.prototype.checkCollision = function() {
	for (var i = this.junctionPoints.length - 1; i >= 0; i--) {
		this.junctionPoints[i].checkCollision(this.state.player);


	};
};

JunctionPointManager.prototype.allPointsOn = function() {
	for (var i = this.junctionPoints.length - 1; i >= 0; i--) {
		if(!this.junctionPoints[i].isOn){
			return false;
		}
	};
	return true;
};


JunctionPointManager.prototype.createPoints = function() {
	this.junctionPoints[0] = new JunctionPoint(this.state, 415, 535);
	this.junctionPoints[1] = new JunctionPoint(this.state, 450, 755);
	this.junctionPoints[2] = new JunctionPoint(this.state, 450, 830);
	this.junctionPoints[3] = new JunctionPoint(this.state, 400, 970);
	this.junctionPoints[4] = new JunctionPoint(this.state, 730, 1085);
	this.junctionPoints[5] = new JunctionPoint(this.state, 375, 1170);
	this.junctionPoints[6] = new JunctionPoint(this.state, 390, 1337);
	this.junctionPoints[7] = new JunctionPoint(this.state, 755, 1190);
	this.junctionPoints[8] = new JunctionPoint(this.state, 645, 1310);
	this.junctionPoints[9] = new JunctionPoint(this.state, 570, 1315);

	this.junctionPoints[10] = new JunctionPoint(this.state, 410, 1520);
	this.junctionPoints[11] = new JunctionPoint(this.state, 800, 1480);
	this.junctionPoints[12] = new JunctionPoint(this.state, 750, 1700);
	this.junctionPoints[13] = new JunctionPoint(this.state, 720, 1845);
	this.junctionPoints[14] = new JunctionPoint(this.state, 300, 1930);
	this.junctionPoints[15] = new JunctionPoint(this.state, 560, 2035);
	this.junctionPoints[16] = new JunctionPoint(this.state, 965, 1710);
	this.junctionPoints[17] = new JunctionPoint(this.state, 1455, 1540);
	this.junctionPoints[18] = new JunctionPoint(this.state, 1240, 1745);
	this.junctionPoints[19] = new JunctionPoint(this.state, 1375, 1190);

	this.junctionPoints[20] = new JunctionPoint(this.state, 1140, 1200);
	this.junctionPoints[21] = new JunctionPoint(this.state, 1140, 715);
	this.junctionPoints[22] = new JunctionPoint(this.state, 1405, 980);
	this.junctionPoints[23] = new JunctionPoint(this.state, 1555, 945);
	this.junctionPoints[24] = new JunctionPoint(this.state, 1365, 725);
	this.junctionPoints[25] = new JunctionPoint(this.state, 1615, 740);
	this.junctionPoints[26] = new JunctionPoint(this.state, 1170, 195);
	this.junctionPoints[27] = new JunctionPoint(this.state, 1850, 350);
	this.junctionPoints[28] = new JunctionPoint(this.state, 865, 2035);
	this.junctionPoints[29] = new JunctionPoint(this.state, 265, 1235);

	this.junctionPoints[30] = new JunctionPoint(this.state, 1755, 755);
	this.junctionPoints[31] = new JunctionPoint(this.state, 1985, 825);
	this.junctionPoints[32] = new JunctionPoint(this.state, 1825, 1100);

	this.junctionPoints[33] = new JunctionPoint(this.state, 1980, 875);
	this.junctionPoints[34] = new JunctionPoint(this.state, 595, 635);
	this.junctionPoints[35] = new JunctionPoint(this.state, 840, 1330);
	this.junctionPoints[36] = new JunctionPoint(this.state, 825, 1410);
	this.junctionPoints[37] = new JunctionPoint(this.state, 1210, 55);

	for (var i = this.junctionPoints.length - 1; i >= 0; i--) {
		this.state.addChild(this.junctionPoints[i]);
	};


};

JunctionPointManager.prototype.addConnected = function() {
	// body...

	this.junctionPoints[0].addConnected(this.junctionPoints[34]);
	this.junctionPoints[0].addConnected(this.junctionPoints[1]);

	this.junctionPoints[1].addConnected(this.junctionPoints[0]);
	this.junctionPoints[1].addConnected(this.junctionPoints[2]);
	this.junctionPoints[1].addConnected(this.junctionPoints[34]);

	this.junctionPoints[2].addConnected(this.junctionPoints[1]);
	this.junctionPoints[2].addConnected(this.junctionPoints[4]);
	this.junctionPoints[2].addConnected(this.junctionPoints[3]);

	this.junctionPoints[3].addConnected(this.junctionPoints[2]);
	this.junctionPoints[3].addConnected(this.junctionPoints[4]);
	this.junctionPoints[3].addConnected(this.junctionPoints[5]);

	this.junctionPoints[4].addConnected(this.junctionPoints[2]);
	this.junctionPoints[4].addConnected(this.junctionPoints[3]);
	this.junctionPoints[4].addConnected(this.junctionPoints[7]);

	this.junctionPoints[5].addConnected(this.junctionPoints[3]);
	this.junctionPoints[5].addConnected(this.junctionPoints[29]);
	this.junctionPoints[5].addConnected(this.junctionPoints[6]);

	this.junctionPoints[6].addConnected(this.junctionPoints[5]);
	this.junctionPoints[6].addConnected(this.junctionPoints[9]);
	this.junctionPoints[6].addConnected(this.junctionPoints[10]);

	this.junctionPoints[7].addConnected(this.junctionPoints[4]);
	this.junctionPoints[7].addConnected(this.junctionPoints[8]);
	this.junctionPoints[7].addConnected(this.junctionPoints[35]);

	this.junctionPoints[8].addConnected(this.junctionPoints[7]);
	this.junctionPoints[8].addConnected(this.junctionPoints[9]);
	this.junctionPoints[8].addConnected(this.junctionPoints[11]);

	this.junctionPoints[9].addConnected(this.junctionPoints[8]);
	this.junctionPoints[9].addConnected(this.junctionPoints[6]);
	this.junctionPoints[9].addConnected(this.junctionPoints[10]);

	this.junctionPoints[10].addConnected(this.junctionPoints[12]);
	this.junctionPoints[10].addConnected(this.junctionPoints[6]);
	this.junctionPoints[10].addConnected(this.junctionPoints[9]);

	this.junctionPoints[11].addConnected(this.junctionPoints[8]);
	this.junctionPoints[11].addConnected(this.junctionPoints[36]);
	this.junctionPoints[11].addConnected(this.junctionPoints[12]);

	this.junctionPoints[12].addConnected(this.junctionPoints[11]);
	this.junctionPoints[12].addConnected(this.junctionPoints[10]);
	this.junctionPoints[12].addConnected(this.junctionPoints[16]);
	this.junctionPoints[12].addConnected(this.junctionPoints[13]);

	this.junctionPoints[13].addConnected(this.junctionPoints[12]);
	this.junctionPoints[13].addConnected(this.junctionPoints[14]);
	this.junctionPoints[13].addConnected(this.junctionPoints[15]);

	this.junctionPoints[14].addConnected(this.junctionPoints[15]);
	this.junctionPoints[14].addConnected(this.junctionPoints[13]);

	this.junctionPoints[15].addConnected(this.junctionPoints[14]);
	this.junctionPoints[15].addConnected(this.junctionPoints[13]);

	this.junctionPoints[16].addConnected(this.junctionPoints[12]);
	this.junctionPoints[16].addConnected(this.junctionPoints[28]);
	this.junctionPoints[16].addConnected(this.junctionPoints[17]);
	this.junctionPoints[16].addConnected(this.junctionPoints[18]);

	this.junctionPoints[17].addConnected(this.junctionPoints[19]);
	this.junctionPoints[17].addConnected(this.junctionPoints[18]);
	this.junctionPoints[17].addConnected(this.junctionPoints[16]);

	this.junctionPoints[18].addConnected(this.junctionPoints[16]);
	this.junctionPoints[18].addConnected(this.junctionPoints[17]);

	this.junctionPoints[19].addConnected(this.junctionPoints[20]);
	this.junctionPoints[19].addConnected(this.junctionPoints[17]);
	this.junctionPoints[19].addConnected(this.junctionPoints[22]);

	this.junctionPoints[20].addConnected(this.junctionPoints[19]);
	this.junctionPoints[20].addConnected(this.junctionPoints[21]);

	this.junctionPoints[21].addConnected(this.junctionPoints[20]);
	this.junctionPoints[21].addConnected(this.junctionPoints[24]);
	this.junctionPoints[21].addConnected(this.junctionPoints[26]);


	this.junctionPoints[22].addConnected(this.junctionPoints[19]);
	this.junctionPoints[22].addConnected(this.junctionPoints[24]);
	this.junctionPoints[22].addConnected(this.junctionPoints[23]);

	this.junctionPoints[23].addConnected(this.junctionPoints[22]);
	this.junctionPoints[23].addConnected(this.junctionPoints[25]);
	this.junctionPoints[23].addConnected(this.junctionPoints[32]);

	this.junctionPoints[24].addConnected(this.junctionPoints[21]);
	this.junctionPoints[24].addConnected(this.junctionPoints[22]);
	this.junctionPoints[24].addConnected(this.junctionPoints[25]);

	this.junctionPoints[25].addConnected(this.junctionPoints[30]);
	this.junctionPoints[25].addConnected(this.junctionPoints[24]);
	this.junctionPoints[25].addConnected(this.junctionPoints[23]);

	this.junctionPoints[26].addConnected(this.junctionPoints[27]);
	this.junctionPoints[26].addConnected(this.junctionPoints[37]);
	this.junctionPoints[26].addConnected(this.junctionPoints[21]);

	this.junctionPoints[27].addConnected(this.junctionPoints[31]);
	this.junctionPoints[27].addConnected(this.junctionPoints[26]);

	this.junctionPoints[28].addConnected(this.junctionPoints[16]);

	this.junctionPoints[29].addConnected(this.junctionPoints[5]);

	this.junctionPoints[30].addConnected(this.junctionPoints[25]);
	this.junctionPoints[30].addConnected(this.junctionPoints[31]);
	this.junctionPoints[30].addConnected(this.junctionPoints[32]);

	this.junctionPoints[31].addConnected(this.junctionPoints[33]);
	this.junctionPoints[31].addConnected(this.junctionPoints[30]);
	this.junctionPoints[31].addConnected(this.junctionPoints[27]);

	this.junctionPoints[32].addConnected(this.junctionPoints[30]);
	this.junctionPoints[32].addConnected(this.junctionPoints[23]);

	this.junctionPoints[33].addConnected(this.junctionPoints[31]);

	this.junctionPoints[34].addConnected(this.junctionPoints[0]);
	this.junctionPoints[34].addConnected(this.junctionPoints[1]);

	this.junctionPoints[35].addConnected(this.junctionPoints[7]);

	this.junctionPoints[36].addConnected(this.junctionPoints[11]);

	this.junctionPoints[37].addConnected(this.junctionPoints[26]);






};