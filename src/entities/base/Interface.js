/**
 * Interface
 * 
 * Visual interface in landing. It creates new elements that will be
 * working at the beach
 * 
 *  @class Interface
 * 
 */
Interface = Entity.extend({
    /** 
     * Creates a new Interface
     * 
     * 
     * @param {String} sprite Sprite of the Entity
     * @param {int} int Position x
     * @param {int} y Initial y position
     * @param {int} w Width of the object
     * @param {int} h Height of the object
     * @param {int} zindex Initial z-index of the object
     * */
    init: function(sprite, x, y, w, h, zindex) {
        this._super(sprite, x, y, w, h, zindex);
    }
});