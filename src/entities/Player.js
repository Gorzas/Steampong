/**
 * Player
 * 
 * Main player class. It's the main character of the game. It has the input
 * listeners.
 * 
 * @class Player
 * @constructor
 */
Player = Paddle.extend({
    /**
     * It has all the posible actions with their current trigger key
     * 
     * @property bindings
     * @type Object
     */
    bindings: {},
    /**
     * Array with all the available actions and a boolean value that indicates
     * if the Entity is moving and direction
     * 
     *  @property actions
     *  @type Object 
     */
    actions: {},
    
    init: function(x, y, w, h) {
        this._super('left', x, y, w, h);
        
        var player = this;
        
        this.bind(87, 'move-up');
        this.bind(38, 'move-up');
        this.bind(83, 'move-down');
        this.bind(40, 'move-down');
        
        document.addEventListener('keydown', function(ev) {
            player.onKeyDown(ev);
        });
        document.addEventListener('keyup', function(ev) {
            player.onKeyUp(ev);
        });       
    },
    /**
     * From HTML5 Udacity course.
     */               
    onKeyDown: function (event) {            
        var action = this.bindings[event.keyCode];

        if (action) {
            this.actions[action] = true;
        }
    },
    /**
     * From HTML5 Udacity course.
     */               
    onKeyUp: function(event) {
        var action = this.bindings[event.keyCode];

        if (action) {
            this.actions[action] = false;
        }
    },
    /**
     * From HTML5 Udacity course.
     */        
    bind: function (key, action) {
        this.bindings[key] = action;
    },
    
    move: function() {
        if (this.actions['move-up'] && 
            this.pos.y > (this.size.h >> 1) && 
            (this.speed > -this.maxSpeed)) {
            this.speed--;
        } else if (this.actions['move-down'] && 
                    this.pos.y < (720 - (this.size.h >> 1))&& 
                    (this.speed < this.maxSpeed)) {
            this.speed++;
        } else if (this.speed !== 0) {
            this.speed += (this.speed > 0) ? -1 : 1;            
        }
        
        this._super();
    }
});