/**
* @module Kiwi
* @submodule Kiwi.Plugins
* @namespace Kiwi.Plugins
* @class ParticlePack1
* @main
*/
Kiwi.Plugins.Lines = {
  
    /**
    * The name of this plugin.
    * @property name
    * @type String
    * @public
    */
    name: 'Lines',   

    /**
    * The version of this plugin in semver (semantic versioning) format
    * @property version
    * @type String
    * @public
    */
    version: '0.1.0',
    
    /**
    * The minimum version of Kiwi.js required to run this plugin in semver (semantic versioning) format
    * @property minimumKiwiVersion
    * @type String
    * @public
    */
    minimumKiwiVersion:'1.0.1'
};

Kiwi.PluginManager.register(Kiwi.Plugins.Lines);

Kiwi.Plugins.GameObjects = Kiwi.Plugins.GameObjects || {};
Kiwi.Plugins.GameObjects.Geom = Kiwi.Plugins.GameObjects.Geom || {};

Kiwi.Plugins.GameObjects.Geom.Rectangle = function(state) {

    var x = 0;
    var y = 0;

    Kiwi.Entity.call(this, state, 0, 0);

    if (this.game.renderOption === Kiwi.RENDERER_WEBGL) {
        this.glRenderer = this.game.renderer.requestSharedRenderer("TextureAtlasRenderer");
    }

    this._width = 2098;
    this._height = 2161;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.dirty = true;


    this.atlas = new Kiwi.Textures.SingleImage(this.game.rnd.uuid(), this.canvas);
    this.state.textureLibrary.add(this.atlas);
    this.atlas.dirty = true;
    this.state = state;

}

Kiwi.extend(Kiwi.Plugins.GameObjects.Geom.Rectangle, Kiwi.Entity);


Object.defineProperty(Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype, "width", {
    get: function () {
        return this._width;
    },
    set: function (val) {
        this._width = val;
        this.dirty = true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype, "height", {
    get: function () {
        return this._height;
    },
    set: function (val) {
        this._height = val;
        this.dirty = true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype, "color", {
    get: function () {
        return this._color;
    },
    set: function (val) {
        this._color = val;
        this.dirty = true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype, "rect", {
    get: function () {
        return new Kiwi.Geom.Rectangle(this.x, this.y, this.width, this.height);
    },
    enumerable: true,
    configurable: true
});


//Renders the raw rectangle to the stage
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype._renderRect = function() {

    //Calculate the Dimensions
    var width = this.width;
    var height = this.height;

    //Is the width base2?
    if (Kiwi.Utils.Common.base2Sizes.indexOf(width) == -1) {
        var i = 0;
        while (width > Kiwi.Utils.Common.base2Sizes[i]) i++;
        width = Kiwi.Utils.Common.base2Sizes[i];
    }

    //Is the height base2?
    if (Kiwi.Utils.Common.base2Sizes.indexOf(height) == -1) {
        var i = 0;
        while (height > Kiwi.Utils.Common.base2Sizes[i]) i++;
        height = Kiwi.Utils.Common.base2Sizes[i];
    }

    //size of stage map size 
    this.canvas.width = 2098;
    this.canvas.height = 2161;


    this.lineStyle();
    this.collisionDistance = 35;

    this.linePointsAmount = 100;
    this.lineDivideAmount = 0.01;
    this.allRoadPoints = [];



    //Draw on the canvas
    this.createRoad1Points();
    this.createRoad1aPoints();
    this.createRoad1bPoints();
    this.createRoad1cPoints();

    this.createRoad2Points();
    this.createRoad2aPoints();

    this.createRoad3Points();

    this.createRoad4Points();

    this.createRoad5Points();

    this.createRoad6Points();

    this.createRoad7Points();

    this.createRoad8Points();

    this.createRoad9Points();

    this.createRoad10Points();

    this.createRoad11Points();

    this.createRoad12Points();

    this.createRoad13Points();

    this.createRoad14Points();

    this.createRoad15Points();

    this.createRoad16Points();
    this.createRoad16aPoints();

    this.createRoad17Points();
    this.createRoad17aPoints();
    this.createRoad17bPoints();
    this.createRoad17cPoints();

    this.createRoad18Points();

    this.createRoad19Points();

    this.createRoad20Points();
    
    this.drawRectOne();

    



    this.dirty = false;
    this.atlas.dirty = true;
}


Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.drawRectOne = function(){
    this.ctx.fillStyle = '#00FF00';
    this.ctx.fillRect(100,100, 50, 50);
}

Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.lineStyle = function(){
    this.ctx.lineWidth = 10;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.shadowColor = '#0066ff';
    this.ctx.shadowBlur = 25;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
}



Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.splinePoint = function(points, prog){

    cursorPoints = [points.length - 1];
    
    for (var i = 0; i < points.length - 1;  i++) {
        cursorPoints[i] = this.lerp(points[i], points[i+1], prog);
       
    };
    if(cursorPoints.length > 1){
        cursorPoints = this.splinePoint(cursorPoints, prog);
    }
    return cursorPoints;

    

}
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.lerp = function(start, final, progress){

   var x = start.x + (final.x - start.x) * progress;
   var y = start.y + (final.y - start.y) * progress;
   var point = new Kiwi.Geom.Point(x, y);
   //console.log(point);
   return point;
    

}


//Canvas rendering method
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.render = function() {

    if(this.visible == false || this.alpha <= 0) return;

    if(this.dirty) this._renderRect();

    var ctx = this.game.stage.ctx;
    ctx.save();

    if (this.alpha > 0 && this.alpha <= 1) {
        ctx.globalAlpha = this.alpha;
    }

    //get entity/view matrix
    var t = this.transform;
    var m = t.getConcatenatedMatrix();

    ctx.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                 
    ctx.drawImage(this.canvas, 0, 0, 2098, 2161, 0, 0, 2098, 2161);
    ctx.restore();


}



Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.update = function() {


    for (var i = this.allRoadPoints.length - 1; i >= 0; i--) {
        for(var j = this.allRoadPoints[i].length - 1; j >= 0; j--){
            if(!this.allRoadPoints[i][j].isOn){
                if(this.allRoadPoints[i][j].distanceToXY(this.state.player.x + 35, this.state.player.y + 65) < this.collisionDistance){
                this.allRoadPoints[i][j].isOn = true;
            }
        }
        }
    };


    this.ctx.clearRect(0, 0, 2098,2161);
    this.drawRectOne();

    this.ctx.beginPath();
    for (var i = this.allRoadPoints.length - 1; i >= 0; i--) {
        this.drawRoad(this.allRoadPoints[i]);
    };
    this.ctx.stroke();


    //this.r6Points



}

Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.drawRoad = function(points){
    this.ctx.lineCap="round";
    this.ctx.moveTo(points[0].x, points[0].y);
    for(var i = 0; i < points.length; i ++){
        //console.log("Yes");
        if(points[i].isOn){
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        else {
            this.ctx.moveTo(points[i].x, points[i].y);
        }
    }
}


/////////////////////////////////////////////////////
//ROADS

//r1
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad1Points = function(){
    this.r1Points = [];

    for(var i = 0; i <= 100; i += 1){
        this.r1Points[i] = this.splinePoint(this.getPointsRoad1(), i * 0.01)[0];
        this.r1Points[i].isOn = false;
    }
    this.allRoadPoints[this.allRoadPoints.length] = this.r1Points;


}

Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad1 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(485, 800);
    var tempPoint2 = new Kiwi.Geom.Point(470, 720);
    var tempPoint3 = new Kiwi.Geom.Point(388, 676);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;

}


//r1a
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad1aPoints = function(){
    this.r1aPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        this.r1aPoints[i] = this.splinePoint(this.getPointsRoad1a(), i * this.lineDivideAmount)[0];
        this.r1aPoints[i].isOn = false;
    }
    this.allRoadPoints[this.allRoadPoints.length] = this.r1aPoints;


}

Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad1a = function(){
    var tempPoint1 = new Kiwi.Geom.Point(388, 673);
    var tempPoint2 = new Kiwi.Geom.Point(390, 610);
    var tempPoint3 = new Kiwi.Geom.Point(450, 567);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;

}


//r1b
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad1bPoints = function(){
    this.r1bPoints = [];

    for(var i = 0; i <= 100; i += 1){
        this.r1bPoints[i] = this.splinePoint(this.getPointsRoad1b(), i * 0.01)[0];
        this.r1bPoints[i].isOn = false;
    }
    this.allRoadPoints[this.allRoadPoints.length] = this.r1bPoints;


}

Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad1b = function(){
    var tempPoint1 = new Kiwi.Geom.Point(450, 567);
    var tempPoint2 = new Kiwi.Geom.Point(625, 610);
    var tempPoint3 = new Kiwi.Geom.Point(632, 680);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;

}

//r1c
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad1cPoints = function(){
    this.r1cPoints = [];

    for(var i = 0; i <= 100; i += 1){
        this.r1cPoints[i] = this.splinePoint(this.getPointsRoad1c(), i * 0.01)[0];
        this.r1cPoints[i].isOn = false;
    }
    this.allRoadPoints[this.allRoadPoints.length] = this.r1cPoints;


}

Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad1c = function(){
    var tempPoint1 = new Kiwi.Geom.Point(632, 680);
    var tempPoint2 = new Kiwi.Geom.Point(633, 730);
    var tempPoint3 = new Kiwi.Geom.Point(485, 789);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;

}

//r2//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad2Points = function(){

    /////HERE/////////////////////////
    this.r2Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE///////////////////////////////////HERE/////////////////////
        this.r2Points[i] = this.splinePoint(this.getPointsRoad2(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r2Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r2Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad2 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(482, 857);
    var tempPoint2 = new Kiwi.Geom.Point(760, 725);
    var tempPoint3 = new Kiwi.Geom.Point(760, 1120);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r2a//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad2aPoints = function(){

    /////HERE/////////////////////////
    this.r2aPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE///////////////////////////////////HERE/////////////////////
        this.r2aPoints[i] = this.splinePoint(this.getPointsRoad2a(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r2aPoints[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r2aPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad2a = function(){
    var tempPoint1 = new Kiwi.Geom.Point(760, 1120);
    var tempPoint2 = new Kiwi.Geom.Point(760, 1220);
    var tempPoint3 = new Kiwi.Geom.Point(860, 1355);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}




//r3//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad3Points = function(){

    /////HERE/////////////////////////
    this.r3Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE///////////////////////////////////HERE/////////////////////
        this.r3Points[i] = this.splinePoint(this.getPointsRoad3(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r3Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r3Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad3 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(482, 793);
    var tempPoint2 = new Kiwi.Geom.Point(493, 857);
    var tempPoint3 = new Kiwi.Geom.Point(422, 1005);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r4//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad4Points = function(){

    /////HERE/////////////////////////
    this.r4Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE///////////////////////////////////HERE/////////////////////
        this.r4Points[i] = this.splinePoint(this.getPointsRoad4(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r4Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r4Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad4 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(427, 1005);
    var tempPoint2 = new Kiwi.Geom.Point(600, 965);
    var tempPoint3 = new Kiwi.Geom.Point(760, 1120);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r5//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad5Points = function(){

    /////HERE/////////////////////////
    this.r5Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r5Points[i] = this.splinePoint(this.getPointsRoad5(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r5Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r5Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad5 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(425, 1005);
    var tempPoint2 = new Kiwi.Geom.Point(340, 1240);
    var tempPoint3 = new Kiwi.Geom.Point(470, 1400);
    var tempPoint4 = new Kiwi.Geom.Point(390, 1550);
    var tempPoint5 = new Kiwi.Geom.Point(510, 1730);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    tempGroup[3] = tempPoint4;
    tempGroup[4] = tempPoint5;
    return tempGroup;
}

//r6
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad6Points = function(){
    this.r6Points = [];

    for(var i = 0; i <= 100; i += 1){
        this.r6Points[i] = this.splinePoint(this.getPointsRoad6(), i * 0.01)[0];
        this.r6Points[i].isOn = false;
    }
    this.allRoadPoints[this.allRoadPoints.length] = this.r6Points;


}
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad6 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(420, 1370);
    var tempPoint2 = new Kiwi.Geom.Point(600, 1350);
    var tempPoint3 = new Kiwi.Geom.Point(670, 1340);


    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;

}

//r7//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad7Points = function(){

    /////HERE/////////////////////////
    this.r7Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r7Points[i] = this.splinePoint(this.getPointsRoad7(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r7Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r7Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad7 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(780, 1220);
    var tempPoint2 = new Kiwi.Geom.Point(690, 1250);
    var tempPoint3 = new Kiwi.Geom.Point(670, 1340);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}


//r8//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad8Points = function(){

    /////HERE/////////////////////////
    this.r8Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r8Points[i] = this.splinePoint(this.getPointsRoad8(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r8Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r8Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad8 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(670, 1340);
    var tempPoint2 = new Kiwi.Geom.Point(700, 1420);
    var tempPoint3 = new Kiwi.Geom.Point(810, 1450);
    var tempPoint4 = new Kiwi.Geom.Point(830, 1510);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    tempGroup[3] = tempPoint4;
    return tempGroup;
}

//r9//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad9Points = function(){

    /////HERE/////////////////////////
    this.r9Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r9Points[i] = this.splinePoint(this.getPointsRoad9(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r9Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r9Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad9 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(600, 1350);
    var tempPoint2 = new Kiwi.Geom.Point(630, 1530);
    var tempPoint3 = new Kiwi.Geom.Point(580, 1520);
    var tempPoint4 = new Kiwi.Geom.Point(445, 1550);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    tempGroup[3] = tempPoint4;
    return tempGroup;
}

//r10//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad10Points = function(){

    /////HERE/////////////////////////
    this.r10Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r10Points[i] = this.splinePoint(this.getPointsRoad10(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r10Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r10Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad10 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(855, 1444);
    var tempPoint2 = new Kiwi.Geom.Point(790, 1600);
    var tempPoint3 = new Kiwi.Geom.Point(780, 1730);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r11//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad11Points = function(){

    /////HERE/////////////////////////
    this.r11Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r11Points[i] = this.splinePoint(this.getPointsRoad11(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r11Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r11Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad11 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(510, 1730);
    var tempPoint2 = new Kiwi.Geom.Point(640, 1740);
    var tempPoint3 = new Kiwi.Geom.Point(780, 1730);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r12//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad12Points = function(){

    /////HERE/////////////////////////
    this.r12Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r12Points[i] = this.splinePoint(this.getPointsRoad12(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r12Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r12Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad12 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(780, 1730);
    var tempPoint2 = new Kiwi.Geom.Point(920, 1750);
    var tempPoint3 = new Kiwi.Geom.Point(990, 1740);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r13//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad13Points = function(){

    /////HERE/////////////////////////
    this.r13Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r13Points[i] = this.splinePoint(this.getPointsRoad13(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r13Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r13Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad13 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(780, 1730);
    var tempPoint2 = new Kiwi.Geom.Point(790, 1850);
    var tempPoint3 = new Kiwi.Geom.Point(755, 1870);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r14//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad14Points = function(){

    /////HERE/////////////////////////
    this.r14Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r14Points[i] = this.splinePoint(this.getPointsRoad14(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r14Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r14Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad14 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(755, 1870);
    var tempPoint2 = new Kiwi.Geom.Point(500, 1850);
    var tempPoint3 = new Kiwi.Geom.Point(330, 1960);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r15//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad15Points = function(){

    /////HERE/////////////////////////
    this.r15Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r15Points[i] = this.splinePoint(this.getPointsRoad15(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r15Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r15Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad15 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(755, 1870);
    var tempPoint2 = new Kiwi.Geom.Point(675, 2220);
    var tempPoint3 = new Kiwi.Geom.Point(550, 1940);
    var tempPoint4 = new Kiwi.Geom.Point(486, 2165);
    var tempPoint5 = new Kiwi.Geom.Point(330, 1960);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    tempGroup[3] = tempPoint4;
    tempGroup[4] = tempPoint5;
    return tempGroup;
}

//r16//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad16Points = function(){

    /////HERE/////////////////////////
    this.r16Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r16Points[i] = this.splinePoint(this.getPointsRoad16(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r16Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r16Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad16 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(990, 1740);
    var tempPoint2 = new Kiwi.Geom.Point(1150, 1720);
    var tempPoint3 = new Kiwi.Geom.Point(1150, 1600);
    var tempPoint4 = new Kiwi.Geom.Point(1232, 1660);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    tempGroup[3] = tempPoint4;
    return tempGroup;
}

//r16a//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad16aPoints = function(){

    /////HERE/////////////////////////
    this.r16aPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r16aPoints[i] = this.splinePoint(this.getPointsRoad16a(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r16aPoints[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r16aPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad16a = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1232, 1660);
    var tempPoint2 = new Kiwi.Geom.Point(1350, 1700);
    var tempPoint3 = new Kiwi.Geom.Point(1485, 1570);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}


//r17//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad17Points = function(){

    /////HERE/////////////////////////
    this.r17Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r17Points[i] = this.splinePoint(this.getPointsRoad17(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r17Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r17Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad17 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(990, 1740);
    var tempPoint2 = new Kiwi.Geom.Point(1075, 1780);
    var tempPoint3 = new Kiwi.Geom.Point(1110, 1850);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r17a//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad17aPoints = function(){

    /////HERE/////////////////////////
    this.r17aPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r17aPoints[i] = this.splinePoint(this.getPointsRoad17a(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r17aPoints[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r17aPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad17a = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1110, 1850);
    var tempPoint2 = new Kiwi.Geom.Point(1225, 1980);
    var tempPoint3 = new Kiwi.Geom.Point(1222, 1800);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r17b//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad17bPoints = function(){

    /////HERE/////////////////////////
    this.r17bPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r17bPoints[i] = this.splinePoint(this.getPointsRoad17b(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r17bPoints[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r17bPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad17b = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1222, 1800);
    var tempPoint2 = new Kiwi.Geom.Point(1230, 1730);
    var tempPoint3 = new Kiwi.Geom.Point(1360, 1820);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r17c//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad17cPoints = function(){

    /////HERE/////////////////////////
    this.r17cPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r17cPoints[i] = this.splinePoint(this.getPointsRoad17c(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r17cPoints[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r17cPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad17c = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1360, 1820);
    var tempPoint2 = new Kiwi.Geom.Point(1530, 1850);
    var tempPoint3 = new Kiwi.Geom.Point(1485, 1570);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r18//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad18Points = function(){

    /////HERE/////////////////////////
    this.r18Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r18Points[i] = this.splinePoint(this.getPointsRoad18(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r18Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r18Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad18 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1485, 1570);
    var tempPoint2 = new Kiwi.Geom.Point(1530, 1350);
    var tempPoint3 = new Kiwi.Geom.Point(1405, 1220);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r19//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad19Points = function(){

    /////HERE/////////////////////////
    this.r19Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r19Points[i] = this.splinePoint(this.getPointsRoad19(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r19Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r19Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad19 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1405, 1220);
    var tempPoint2 = new Kiwi.Geom.Point(1275, 1170);
    var tempPoint3 = new Kiwi.Geom.Point(1175, 1225);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r20//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad20Points = function(){

    /////HERE/////////////////////////
    this.r20Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r20Points[i] = this.splinePoint(this.getPointsRoad20(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r20Points[i].isOn = false;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r20Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad20 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1405, 1220);
    var tempPoint2 = new Kiwi.Geom.Point(1355, 1090);
    var tempPoint3 = new Kiwi.Geom.Point(1435, 1010);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}