/**
 * Collisionable
 * 
 * Abstract class used as base for the objects that admits collision.
 * 
 * @class Collisionable
 * 
 */
Collisionable = Entity.extend({
    /**
     * Direction of the Entity.
     * 
     * @property dir
     * @type Object
     */
    dir: {
        x: 0,
        y: 0
    },
    /**
     * It has a BodyDef object that would contain all the physics information.
     * 
     * @property physBody
     * @type BodyDef
     */
    physBody: null,  
    /**
     * Speed of the Entity
     * 
     * @property speed
     * @type int
     */
    speed: 0,
    /**
     * Creates a new Collisionable.
     * 
     * @method init
     * @param {String} sprite Sprite of the Entity
     * @param {int} int Position x
     * @param {int} y Initial y position
     * @param {int} w Width of the object
     * @param {int} h Height of the object
     * @param {int} zindex Initial z-index of the object
     * @param {Vec2} dir Direction where the ball will be going
     * @param {int} speed Speed of Entity
     */
    init: function(sprite, x, y, w, h, zindex, dir, speed) {
        this._super(sprite, x, y, w, h, zindex);
        this.dir = dir;
        this.speed = speed;
    }
});