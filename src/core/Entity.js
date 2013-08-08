/**
 * Entity
 * 
 * A base Entity class for all the objects that will be showing in the
 * scenary.
 * 
 * @class Entity 
 */
Entity = Class.extend({
    /**
     * Position of the Entity.
     * 
     * @property pos
     * @type Object 
     */
    pos: {
        x: 0,
        y: 0
    },
    /**
     * Size of the Entity
     * 
     * @property size
     * @type Object
     * 
     */
    size: {
        h: 0,
        w: 0
    },
    /**
     * Name of the sprite of the Entity
     * 
     * @property sprite
     * @type String
     * 
     */
    sprite: '',
    /**
     * Indicates z-index of the Entity.
     * 
     * @property z-index
     * @type int
     */
    zindex: 0,
    /**
     * Creates a new Entity.
     * Base structure for most objects.
     * 
     * @method init
     * @param {String} sprite Sprite name of the Entity.
     * @param {int} x Initial x position
     * @param {int} y Initial y position
     * @param {int} w Width of the object
     * @param {int} h Height of the object
     * @param {int} zindex Initial z-index of the object
     */
    init: function(sprite, x, y, w, h, zindex) {
        this.sprite = sprite;
        this.pos = {};
        this.pos.x = x;
        this.pos.y = y;
        this.size = {};
        this.size.w = w;
        this.size.h = h;
        this.zindex = zindex;
    },
    /**
     * Abstract method.
     * Moves the Entity.
     * 
     * @method move
     * 
     */
    move: function() {
        
    },
    /**
     * Abstract method to check collisions
     * 
     * @method onTouch
     */        
    onTouch: function() {

    }
});