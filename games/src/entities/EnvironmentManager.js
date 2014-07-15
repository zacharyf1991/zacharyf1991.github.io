var EnvironmentManager = function(state){
	Kiwi.Group.call(this, state);
	this.state = state;
	this.buildings = [];


	




}
Kiwi.extend(EnvironmentManager , Kiwi.Group);





EnvironmentManager.prototype.addBuildings = function(){
	this.buildings[00] = new Building(this.state, this.state.textures.roadblock1, 226, 0);
	this.buildings[01] = new Building(this.state, this.state.textures.roadblock2, 1971, 918);
	this.buildings[02] = new Building(this.state, this.state.textures.roadblock3, 805, 2084);
	this.buildings[03] = new Building(this.state, this.state.textures.roadblock4, 1115, 1257);
	this.buildings[04] = new Building(this.state, this.state.textures.roadblock5, 967, 1601);
	this.buildings[05] = new Building(this.state, this.state.textures.roadblock6, 803, 1361);
	this.buildings[06] = new Building(this.state, this.state.textures.roadblock7, 246, 1829);
	this.buildings[07] = new Building(this.state, this.state.textures.roadblock8, 1189, 0);
	this.buildings[08] = new Building(this.state, this.state.textures.boatShed, 264, 392);
	this.buildings[09] = new Building(this.state, this.state.textures.houses1, 309, 229);
	this.buildings[10] = new Building(this.state, this.state.textures.arena, 420, 1151);
	this.buildings[11] = new Building(this.state, this.state.textures.skate, 522, 1078);
	this.buildings[12] = new Building(this.state, this.state.textures.pataka, 382, 1015);
	this.buildings[13] = new Building(this.state, this.state.textures.cbdShops, 681, 1266);
	this.buildings[14] = new Building(this.state, this.state.textures.fitness, 602, 1601);
	this.buildings[15] = new Building(this.state, this.state.textures.tower, 644, 1468);
	this.buildings[16] = new Building(this.state, this.state.textures.council, 613, 1406);
	this.buildings[17] = new Building(this.state, this.state.textures.rugby, 949, 1888);

	this.buildings[18] = new Building(this.state, this.state.textures.playground, 1100, 1371);

	this.buildings[19] = new Building(this.state, this.state.textures.lighthouse, 1842, 619);
	this.buildings[20] = new Building(this.state, this.state.textures.houses12, 1605, 807);
	this.buildings[21] = new Building(this.state, this.state.textures.newWorld, 1691, 950);
	this.buildings[22] = new Building(this.state, this.state.textures.houses11, 1405, 799);
	this.buildings[23] = new Building(this.state, this.state.textures.bottleCreek, 1167, 564);
	this.buildings[24] = new Building(this.state, this.state.textures.plimmertonStation, 1035, 57);
	this.buildings[25] = new Building(this.state, this.state.textures.houses13, 1118, 251);
	this.buildings[26] = new Building(this.state, this.state.textures.cruisingClub, 859, 439);
	this.buildings[27] = new Building(this.state, this.state.textures.manaStation, 967, 370);
	this.buildings[28] = new Building(this.state, this.state.textures.houses10, 1209, 728);
	this.buildings[29] = new Building(this.state, this.state.textures.policeCollege, 1249, 1012);
	this.buildings[30] = new Building(this.state, this.state.textures.houses9, 1379, 1026);
	this.buildings[31] = new Building(this.state, this.state.textures.waitangaruaPark, 1459, 1205);
	this.buildings[32] = new Building(this.state, this.state.textures.adrenalineForest, 1198, 1195);
	this.buildings[33] = new Building(this.state, this.state.textures.cannonCreek, 1474, 1418);
	this.buildings[34] = new Building(this.state, this.state.textures.houses8, 1038, 1481);
	this.buildings[35] = new Building(this.state, this.state.textures.houses5, 978, 1807);
	this.buildings[36] = new Building(this.state, this.state.textures.houses6, 1201, 1817);
	this.buildings[37] = new Building(this.state, this.state.textures.houses4, 1047, 1667);
	this.buildings[38] = new Building(this.state, this.state.textures.houses7, 1283, 1652);
	this.buildings[39] = new Building(this.state, this.state.textures.poriruaStation, 869, 1552);
	this.buildings[40] = new Building(this.state, this.state.textures.esr, 409, 2048);
	this.buildings[41] = new Building(this.state, this.state.textures.kenepuru, 452, 1897);
	this.buildings[42] = new Building(this.state, this.state.textures.teRito, 308, 1744);
	this.buildings[43] = new Building(this.state, this.state.textures.teWanaga, 272, 1542);
	this.buildings[44] = new Building(this.state, this.state.textures.northCity, 456, 1519);
	this.buildings[45] = new Building(this.state, this.state.textures.police, 441, 1366);
	this.buildings[46] = new Building(this.state, this.state.textures.whittakers, 164, 1005);
	this.buildings[47] = new Building(this.state, this.state.textures.mega, 524, 904);
	this.buildings[48] = new Building(this.state, this.state.textures.whitireia, 493, 819);
	this.buildings[49] = new Building(this.state, this.state.textures.marae, 248, 791);
	this.buildings[50] = new Building(this.state, this.state.textures.houses2, 426, 597);
	this.buildings[51] = new Building(this.state, this.state.textures.houses3, 212, 683);
	this.buildings[52] = new Building(this.state, this.state.textures.tiki, 612, 522);
	this.buildings[53] = new Building(this.state, this.state.textures.golf, 429, 369);

	for (var i = this.buildings.length - 1; i >= 0; i--) {
		this.state.addChild(this.buildings[i]);
	};
	

	
}




EnvironmentManager.prototype.update = function(){
	Kiwi.Group.prototype.update.call(this);
	//this.checkPlayerCollision();

	
}





EnvironmentManager.prototype.checkPlayerCollision = function(){
	for (var i = this.buildings.length - 1; i >= 0; i--) {
		this.buildings[i].checkCollision(this.state.player);
	};
}