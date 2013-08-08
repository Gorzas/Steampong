/**
 * ScoreBoard
 * 
 * Every one of the objects is one of the numbers in the scoreBoard.
 * 
 * @class ScoreBoad
 * @constructor
 * 
 */
Scoreboard = Interface.extend({
    /**
     * Constructs a new ScoreBoard object.
     * 
     * @method init
     * @param {int|char} value Init value of the marker (usually, 0)
     * @param {int} x Position in x axis
     * @param {int} y Position in y axis
     */
    init: function(value, x, y) {
        var spriteName =  value + '.png';
        
        this._super(
                spriteName, 
                x, 
                y, 
                gSpriteSheet.sprites[spriteName].w, 
                gSpriteSheet.sprites[spriteName].h, 
                0
        );
    },
    /**
     * Changes the current value of the marker.
     * 
     * @method changeValue
     * @param {int|char} value New value of the marker
     */        
    changeValue: function(value) {
        this.sprite = value + '.png';
    }
});