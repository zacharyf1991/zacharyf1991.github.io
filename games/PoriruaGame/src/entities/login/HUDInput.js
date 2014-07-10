var HUDInput = function(game, type, x, y) {

	Kiwi.HUD.HUDWidget.call(this, game, 'input', x, y);

	if(typeof placeholder == "undefined") placeholder = '';

    this.input = document.createElement("input");
    this.input.type = type;
    this.input.id = 'HUD-input-field' + this.game.rnd.uuid();
    this.input.placeholder = placeholder;
    this.input.className = 'HUD-input-widget';

    this.container.appendChild(this.input);

}



Kiwi.extend(HUDInput, Kiwi.HUD.HUDWidget);
