var ItemManager = function(state){
    Kiwi.Group.call(this, state);
    this.state = state;
    this.items = new Kiwi.Group(state);
    this.itemGroup = new Kiwi.Group(state);

    this.addChild(this.items);
    this.addChild(this.itemGroup);
    this.enemiesLength = 0;

    




}
Kiwi.extend(ItemManager , Kiwi.Group);






ItemManager.prototype.addItem = function(type, x, y, num){
    if(type == 'cash'){
        var tempItem = new Cash(this.state, x, y);
        this.items.addChild(tempItem);
    }

    if(type == 'gem'){
        var tempItem = new Gem(this.state, x, y);
        this.items.addChild(tempItem);
    }
   
}




ItemManager.prototype.update = function(){
    Kiwi.Group.prototype.update.call(this);
    var itemsMem = this.items.members;
    this.itemsLength = itemsMem.length;
    //CHECK PLAYER COLLISIONS
    this.checkCollision();

    
}
ItemManager.prototype.removeItem = function(item) {
    var temp = this.items.members

    this.items.removeChild(item, true); 
};


ItemManager.prototype.checkCollision = function() {
    var itemsMem = this.items.members;
    this.itemsLength = itemsMem.length;

    for (var i = this.itemsLength - 1; i >= 0; i--) {
        if(itemsMem[i].hittable){
            if(itemsMem[i].physics.overlaps(this.state.player)){
                //console.log("YEah you did it!");
                itemsMem[i].hitPlayer();


            }
        }
        
    };
};

