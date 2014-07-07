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
    this.startLineOn = false;
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
    this.createRoad5aPoints();
    this.createRoad5dPoints();

    this.createRoad6Points();

    this.createRoad7Points();

    this.createRoad8Points();

    this.createRoad9Points();

    this.createRoad10Points();

    this.createRoad11Points();

    this.createRoad12Points();
    this.createRoad12aPoints();

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

    this.createRoad21Points();

    this.createRoad22Points();

    this.createRoad23Points();

    this.createRoad24Points();

    this.createRoad25Points();
    this.createRoad25aPoints();
    this.createRoad25bPoints();
    this.createRoad25cPoints();
    this.createRoad25dPoints();

    this.createRoad26Points();
    this.createRoad26aPoints();

    this.createRoad27Points();

    this.createRoad28Points();

    this.createRoad29Points();
    this.createRoad29aPoints();

    this.createRoad30Points();
    this.createRoad30aPoints();
    this.createRoad30bPoints();
    this.createRoad30cPoints();
    

    



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
    // this.ctx.shadowColor = '#0066ff';
    // this.ctx.shadowBlur = 1;
    // this.ctx.shadowOffsetX = 0;
    // this.ctx.shadowOffsetY = 0;
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
        //console.log(game.cameras.defaultCamera.transform.x);
        if(points[i].isOn ){
            if(points[i].x > (game.cameras.defaultCamera.transform.x * -1) / 0.75 - 150 && points[i].x < (game.cameras.defaultCamera.transform.x * -1)/ 0.75 + game.stage.width + 150){
                if(points[i].y > (game.cameras.defaultCamera.transform.y * -1)/ 0.75 - 150 && points[i].y < (game.cameras.defaultCamera.transform.y * -1)/ 0.75 + game.stage.height + 150){
                    this.ctx.lineTo(points[i].x, points[i].y);
                }
            }
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
        this.r1Points[i].isOn = this.startLineOn;
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
        this.r1aPoints[i].isOn = this.startLineOn;
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
        this.r1bPoints[i].isOn = this.startLineOn;
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
        this.r1cPoints[i].isOn = this.startLineOn;
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
        this.r2Points[i].isOn = this.startLineOn;
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
        this.r2aPoints[i].isOn = this.startLineOn;
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
        this.r3Points[i].isOn = this.startLineOn;
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
        this.r4Points[i].isOn = this.startLineOn;
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
        this.r5Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r5Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad5 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(425, 1005);
    var tempPoint2 = new Kiwi.Geom.Point(390, 1200);
    var tempPoint3 = new Kiwi.Geom.Point(420, 1370);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}


//r5a//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad5aPoints = function(){

    /////HERE/////////////////////////
    this.r5aPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r5aPoints[i] = this.splinePoint(this.getPointsRoad5a(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r5aPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r5aPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad5a = function(){
    var tempPoint1 = new Kiwi.Geom.Point(420, 1370);
    var tempPoint2 = new Kiwi.Geom.Point(444, 1550);
    var tempPoint3 = new Kiwi.Geom.Point(510, 1730);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}



//r5d//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad5dPoints = function(){

    /////HERE/////////////////////////
    this.r5dPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r5dPoints[i] = this.splinePoint(this.getPointsRoad5d(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r5dPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r5dPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad5d = function(){
    var tempPoint1 = new Kiwi.Geom.Point(405, 1200);
    var tempPoint2 = new Kiwi.Geom.Point(330, 1200);
    var tempPoint3 = new Kiwi.Geom.Point(290, 1265);

    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r6
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad6Points = function(){
    this.r6Points = [];

    for(var i = 0; i <= 100; i += 1){
        this.r6Points[i] = this.splinePoint(this.getPointsRoad6(), i * 0.01)[0];
        this.r6Points[i].isOn = this.startLineOn;
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
        this.r7Points[i].isOn = this.startLineOn;
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
        this.r8Points[i].isOn = this.startLineOn;
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
        this.r9Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r9Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad9 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(600, 1350);
    var tempPoint2 = new Kiwi.Geom.Point(630, 1530);
    var tempPoint3 = new Kiwi.Geom.Point(580, 1520);
    var tempPoint4 = new Kiwi.Geom.Point(455, 1550);

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
        this.r10Points[i].isOn = this.startLineOn;
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
        this.r11Points[i].isOn = this.startLineOn;
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
        this.r12Points[i].isOn = this.startLineOn;
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

//r12a//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad12aPoints = function(){

    /////HERE/////////////////////////
    this.r12aPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r12aPoints[i] = this.splinePoint(this.getPointsRoad12a(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r12aPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r12aPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad12a = function(){
    var tempPoint1 = new Kiwi.Geom.Point(990, 1740);
    var tempPoint2 = new Kiwi.Geom.Point(940, 1970);
    var tempPoint3 = new Kiwi.Geom.Point(890, 2064);

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
        this.r13Points[i].isOn = this.startLineOn;
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
        this.r14Points[i].isOn = this.startLineOn;
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
        this.r15Points[i].isOn = this.startLineOn;
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
        this.r16Points[i].isOn = this.startLineOn;
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
        this.r16aPoints[i].isOn = this.startLineOn;
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
        this.r17Points[i].isOn = this.startLineOn;
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
        this.r17aPoints[i].isOn = this.startLineOn;
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
        this.r17bPoints[i].isOn = this.startLineOn;
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
        this.r17cPoints[i].isOn = this.startLineOn;
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
        this.r18Points[i].isOn = this.startLineOn;
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
        this.r19Points[i].isOn = this.startLineOn;
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
        this.r20Points[i].isOn = this.startLineOn;
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

//r21//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad21Points = function(){

    /////HERE/////////////////////////
    this.r21Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r21Points[i] = this.splinePoint(this.getPointsRoad21(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r21Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r21Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad21 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1175, 1225);
    var tempPoint2 = new Kiwi.Geom.Point(1295, 960);
    var tempPoint3 = new Kiwi.Geom.Point(1170, 742);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r22//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad22Points = function(){

    /////HERE/////////////////////////
    this.r22Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r22Points[i] = this.splinePoint(this.getPointsRoad22(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r22Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r22Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad22 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1435, 1010);
    var tempPoint2 = new Kiwi.Geom.Point(1360, 850);
    var tempPoint3 = new Kiwi.Geom.Point(1396, 750);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r23//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad23Points = function(){

    /////HERE/////////////////////////
    this.r23Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r23Points[i] = this.splinePoint(this.getPointsRoad23(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r23Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r23Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad23 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1585, 975);
    var tempPoint2 = new Kiwi.Geom.Point(1640, 930);
    var tempPoint3 = new Kiwi.Geom.Point(1540, 860);
    var tempPoint4 = new Kiwi.Geom.Point(1650, 770);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    tempGroup[3] = tempPoint4;
    return tempGroup;
}

//r24//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad24Points = function(){

    /////HERE/////////////////////////
    this.r24Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r24Points[i] = this.splinePoint(this.getPointsRoad24(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r24Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r24Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad24 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1435, 1010);
    var tempPoint2 = new Kiwi.Geom.Point(1520, 1050);
    var tempPoint3 = new Kiwi.Geom.Point(1585, 975);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r25//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad25Points = function(){

    /////HERE/////////////////////////
    this.r25Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r25Points[i] = this.splinePoint(this.getPointsRoad25(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r25Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r25Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad25 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1585, 975);
    var tempPoint2 = new Kiwi.Geom.Point(1645, 1060);
    var tempPoint3 = new Kiwi.Geom.Point(1645, 1145);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r25a//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad25aPoints = function(){

    /////HERE/////////////////////////
    this.r25aPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r25aPoints[i] = this.splinePoint(this.getPointsRoad25a(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r25aPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r25aPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad25a = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1645, 1145);
    var tempPoint2 = new Kiwi.Geom.Point(1760, 1220);
    var tempPoint3 = new Kiwi.Geom.Point(1850, 1140);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r25b//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad25bPoints = function(){

    /////HERE/////////////////////////
    this.r25bPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r25bPoints[i] = this.splinePoint(this.getPointsRoad25b(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r25bPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r25bPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad25b = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1850, 1140);
    var tempPoint2 = new Kiwi.Geom.Point(1875, 1120);
    var tempPoint3 = new Kiwi.Geom.Point(1840, 1030);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r25c//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad25cPoints = function(){

    /////HERE/////////////////////////
    this.r25cPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r25cPoints[i] = this.splinePoint(this.getPointsRoad25c(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r25cPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r25cPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad25c = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1840, 1030);
    var tempPoint2 = new Kiwi.Geom.Point(1955, 950);
    var tempPoint3 = new Kiwi.Geom.Point(1860, 890);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r25d//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad25dPoints = function(){

    /////HERE/////////////////////////
    this.r25dPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r25dPoints[i] = this.splinePoint(this.getPointsRoad25d(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r25dPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r25dPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad25d = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1860, 890);
    var tempPoint2 = new Kiwi.Geom.Point(1790, 880);
    var tempPoint3 = new Kiwi.Geom.Point(1785, 785);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r26//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad26Points = function(){

    /////HERE/////////////////////////
    this.r26Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r26Points[i] = this.splinePoint(this.getPointsRoad26(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r26Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r26Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad26 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1650, 770);
    var tempPoint2 = new Kiwi.Geom.Point(1730, 805);
    var tempPoint3 = new Kiwi.Geom.Point(1785, 785);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r26a//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad26aPoints = function(){

    /////HERE/////////////////////////
    this.r26aPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r26aPoints[i] = this.splinePoint(this.getPointsRoad26a(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r26aPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r26aPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad26a = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1785, 785);
    var tempPoint2 = new Kiwi.Geom.Point(1900, 740);
    var tempPoint3 = new Kiwi.Geom.Point(2015, 850);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r27//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad27Points = function(){

    /////HERE/////////////////////////
    this.r27Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r27Points[i] = this.splinePoint(this.getPointsRoad27(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r27Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r27Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad27 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1396, 750);
    var tempPoint2 = new Kiwi.Geom.Point(1490, 825);
    var tempPoint3 = new Kiwi.Geom.Point(1530, 740);
    var tempPoint4 = new Kiwi.Geom.Point(1650, 770);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    tempGroup[3] = tempPoint4;
    return tempGroup;
}

//r28//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad28Points = function(){

    /////HERE/////////////////////////
    this.r28Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r28Points[i] = this.splinePoint(this.getPointsRoad28(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r28Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r28Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad28 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1170, 742);
    var tempPoint2 = new Kiwi.Geom.Point(1290, 655);
    var tempPoint3 = new Kiwi.Geom.Point(1396, 750);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}


//r29//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad29Points = function(){

    /////HERE/////////////////////////
    this.r29Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r29Points[i] = this.splinePoint(this.getPointsRoad29(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r29Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r29Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad29 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1170, 742);
    var tempPoint2 = new Kiwi.Geom.Point(1080, 590);
    var tempPoint3 = new Kiwi.Geom.Point(1010, 340);
    var tempPoint4 = new Kiwi.Geom.Point(1200, 225);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    tempGroup[3] = tempPoint4;
    return tempGroup;
}
//r29a//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad29aPoints = function(){

    /////HERE/////////////////////////
    this.r29aPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r29aPoints[i] = this.splinePoint(this.getPointsRoad29a(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r29aPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r29aPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad29a = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1200, 225);
    var tempPoint2 = new Kiwi.Geom.Point(1250, 150);
    var tempPoint3 = new Kiwi.Geom.Point(1240, 90);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

//r30//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad30Points = function(){

    /////HERE/////////////////////////
    this.r30Points = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r30Points[i] = this.splinePoint(this.getPointsRoad30(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r30Points[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r30Points;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad30 = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1200, 225);
    var tempPoint2 = new Kiwi.Geom.Point(1360, 380);
    var tempPoint3 = new Kiwi.Geom.Point(1430, 200);
    var tempPoint4 = new Kiwi.Geom.Point(1520, 235);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    tempGroup[3] = tempPoint4;
    return tempGroup;
}

//r30a//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad30aPoints = function(){

    /////HERE/////////////////////////
    this.r30aPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r30aPoints[i] = this.splinePoint(this.getPointsRoad30a(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r30aPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r30aPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad30a = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1520, 235);
    var tempPoint2 = new Kiwi.Geom.Point(1600, 235);
    var tempPoint3 = new Kiwi.Geom.Point(1650, 355);
    var tempPoint4 = new Kiwi.Geom.Point(1790, 345);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    tempGroup[3] = tempPoint4;
    return tempGroup;
}

//r30b//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad30bPoints = function(){

    /////HERE/////////////////////////
    this.r30bPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r30bPoints[i] = this.splinePoint(this.getPointsRoad30b(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r30bPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r30bPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad30b = function(){
    var tempPoint1 = new Kiwi.Geom.Point(1790, 345);
    var tempPoint2 = new Kiwi.Geom.Point(1940, 405);
    var tempPoint3 = new Kiwi.Geom.Point(2010, 395);
    var tempPoint4 = new Kiwi.Geom.Point(2030, 520);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    tempGroup[3] = tempPoint4;
    return tempGroup;
}

//r30c//////////////////////////////////////////////////////HERE////////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.createRoad30cPoints = function(){

    /////HERE/////////////////////////
    this.r30cPoints = [];

    for(var i = 0; i <= this.linePointsAmount; i += 1){
        /////HERE////////////////////////////////////////////HERE/////////////////////
        this.r30cPoints[i] = this.splinePoint(this.getPointsRoad30c(), i * this.lineDivideAmount)[0];
        //////HERE////////////
        this.r30cPoints[i].isOn = this.startLineOn;
    }
    ////////////////////////////////////////////////////HERE//////
    this.allRoadPoints[this.allRoadPoints.length] = this.r30cPoints;
}
/////////////////////////////////////////////////////////////HERE/////////////
Kiwi.Plugins.GameObjects.Geom.Rectangle.prototype.getPointsRoad30c = function(){
    var tempPoint1 = new Kiwi.Geom.Point(2030, 520);
    var tempPoint2 = new Kiwi.Geom.Point(2045, 695);
    var tempPoint3 = new Kiwi.Geom.Point(2010, 890);
    var tempGroup = [];
    tempGroup[0] = tempPoint1;
    tempGroup[1] = tempPoint2;
    tempGroup[2] = tempPoint3;
    return tempGroup;
}

