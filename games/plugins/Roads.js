// Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.road1 = function(){
//     var tempPoint1 = new Kiwi.Geom.Point(420, 1370);
//     var tempPoint2 = new Kiwi.Geom.Point(600, 1350);
//     var tempPoint3 = new Kiwi.Geom.Point(670, 1340);


//     var tempGroup = [];
//     tempGroup[0] = tempPoint1;
//     tempGroup[1] = tempPoint2;
//     tempGroup[2] = tempPoint3;
//     return tempGroup;

// }



// Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad1 = function(){
//     this.lineOnePoints = [];
//     for(var i = 0; i <= 100; i += 1){
//         this.road1Points[i] = this.splinePoint(this.road1(), i * 0.01)[0];
//         this.road1Points[i].isOn = false;
//     }


// }
// Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.drawRoad1 = function(){
//     this.ctx.beginPath();

//     this.ctx.lineCap="round";
//     this.ctx.moveTo(this.road1Points[0].x, this.road1Points[0].y);

//     for(var i = 0; i < this.lineOnePoints.length; i ++){
//         //console.log("Yes");
//         if(this.road1Points[i].isOn){
//             this.ctx.lineTo(this.road1Points[i].x, this.road1Points[i].y);
//         }
//         else {
//             this.ctx.moveTo(this.road1Points[i].x, this.road1Points[i].y);
//         }
//     }
//     this.ctx.stroke();

// }
