var Zombie = function(state, x, y) {
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['zombie'], x, y);
	
	// Sets relative speed; all zombies move with a slightly different rhythm to avoid visual monotony
	this.relSpeed = 1.0 + Math.random() * 0.1;
	
	// Add animations
	this.animation.add('walkUp', [0, 1, 2, 3, 4, 5, 6], 0.1 / this.relSpeed, true);
	this.animation.add('walkDown', [7, 8, 9, 10, 11, 12, 13], 0.1 / this.relSpeed, true);
	this.animation.add('walkRight', [14, 15, 16, 17, 18, 19, 20], 0.1 / this.relSpeed, true);
	this.animation.add('walkLeft', [21, 22, 23, 24, 25, 26, 27], 0.1 / this.relSpeed, true);
	this.animation.play('walkDown');
	
	// Add AI
	this.navCurrentRoad = null;
	this.navNextPoint = null;
	this.navDirection = 1;
	this.findNearestRoad();
	
	// Add physics
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
}
Kiwi.extend(Zombie, Kiwi.GameObjects.Sprite);


Zombie.prototype.WALKSPEED = 0.4;
Zombie.prototype.NAVRADIUS = 8;


Zombie.prototype.update = function() {
	Kiwi.GameObjects.Sprite.prototype.update.call(this);
	
	// Do AI
	// Super hacky version
	this.moveTowardsTarget();
	if(this.isAtNavpoint())
		this.followRoad();
	
	// Set facing
}

/*
* AI Functions
* These are super hacky right now, and should be replaced with a more ornate tree function ASAP.
*/

Zombie.prototype.findNearestRoad = function() {
	// Locates the nearest road segment, with a little bit of wiggle to induce random choice at intersections
	var roads = this.state.rect1.allRoadPoints;
	var bestPoint = 0;
	var bestRoad = 0;
	var distToNearestRoad = 999999;
	for( var i = 0;  i < roads.length;  i++ )
		for( var j = 0;  j < roads[i].length;  j++ )
		{
			if(i != this.navCurrentRoad)
			{
				var pt = roads[i][j];
				var distToCandidatePoint = pt.distanceToXY(this.x + this.rotPointX, this.y + this.rotPointY);
				// Wiggle
				//distToCandidatePoint += Math.random() * 16 * this.NAVRADIUS;
				
				if(distToCandidatePoint < distToNearestRoad)
				{
					bestRoad = i;
					bestPoint = j;
					distToNearestRoad = distToCandidatePoint;
				}
			}
		}
	// We have now identified a reasonably close road and point.
	this.navCurrentRoad = bestRoad;
	this.navNextPoint = bestPoint;
	// Determine direction to travel once we reach the road
	// Rule: Always go the long way
	if(this.navNextPoint < this.navCurrentRoad.length / 2)
		this.navDirection = 1;
	else
		this.navDirection = -1;
	/*
	// Pick a random direction
	if(Math.random() < 0.5)	this.navDirection = 1;
	else	this.navDirection = -1;
	*/
}

Zombie.prototype.moveTowardsTarget = function() {
	var pt = this.state.rect1.allRoadPoints[this.navCurrentRoad][this.navNextPoint];
	var dx = pt.x - (this.x + this.rotPointX);
	var dy = pt.y - (this.y + this.rotPointY);
	var ang = Math.atan2(dy, dx);
	var vx = Math.cos(ang) * this.WALKSPEED * this.relSpeed;
	var vy = Math.sin(ang) * this.WALKSPEED * this.relSpeed;
	this.x += vx;
	this.y += vy;
}

Zombie.prototype.followRoad = function() {
	// Updates targeting as the zombie follows a road
	// Update targeting
	this.navNextPoint += this.navDirection;
	// Get navpoint data
	var road = this.state.rect1.allRoadPoints[this.navCurrentRoad];
	var pt = road[this.navNextPoint];
	// Have we reached the limits of the road?
	if(this.navDirection == 1  &&  road.length - 1 < this.navNextPoint)
	{
		this.chooseNewRoadAtRandom();
		return;
	}
	if(this.navDirection == -1  &&  this.navNextPoint < 1)
	{
		this.chooseNewRoadAtRandom();
		return;
	}
}

Zombie.prototype.isAtNavpoint = function() {
	var pt = this.state.rect1.allRoadPoints[this.navCurrentRoad][this.navNextPoint];
	if(pt.distanceToXY(this.x + this.rotPointX, this.y + this.rotPointY) < this.NAVRADIUS)
		return( true );
	return( false );
}

Zombie.prototype.chooseNewRoadAtRandom = function() {
	// When the zombie reaches the end of a road, it must make a random choice
	// It gathers a series of nearby points and then chooses one at random

	var validPointRadius = 64;
	var candidatePoints = [];
	var roads = this.state.rect1.allRoadPoints;
	// Assemble all nearby points
	for( var i = 0;  i < roads.length;  i++ )
	{
		for( var j = 0;  j < roads[i].length;  j++ )
		{
			var pt = roads[i][j];
			var distToPt = pt.distanceToXY(this.x + this.rotPointX, this.y + this.rotPointY);
			if(distToPt < validPointRadius)
			{
				var roadPointPair = {road: i, point: j};
				candidatePoints.push(roadPointPair);
			}
		}
	}
	// Enforce regular spacing of points by culling the unnecessary ones
	var spacing = 4;
	for( var i = 0;  i < candidatePoints.length;  i++ )
	{
		var road = candidatePoints[i].road;
		var point = candidatePoints[i].point;
		var pt = roads[road][point];
		for( var j = i+1;  j < candidatePoints.length;  j++ )
		{
			var nextRoad = candidatePoints[j].road;
			var nextPoint = candidatePoints[j].point;
			var nextPt = roads[nextRoad][nextPoint];
			var distToPt = pt.distanceTo(nextPt);
			if(distToPt < spacing)
				candidatePoints.splice(j,1);
		}
	}
	// Choose a suitable candidate from the remaining points and set out along that road
	var target = Math.floor( Math.random() * candidatePoints.length );
	this.navCurrentRoad = candidatePoints[target].road;
	this.navNextPoint = candidatePoints[target].point;
	if(this.navNextPoint < 50)
		this.navDirection = 1;
	else
		this.navDirection = -1;
}