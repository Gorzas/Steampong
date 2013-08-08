/**
 * Scene
 * 
 * Abstract class. Base for all the Scenes in the game.
 * 
 * @class Scene
 * 
 */
Scene = Class.extend({
    /**
     * Drawing handler object.
     * 
     * @property drawEngine
     * @type DrawEngine
     */
    drawEngine: null,
    /**
     * Collection of entities created in the new Scene.
     * 
     * @property entities
     * @type Array
     * 
     */
    entities: [],
    /**
     * Creates a new Scene object.
     * 
     * @method init
     * @param {DrawEngine} drawEngine It handles all the entities in the scene
     * and draws them in the canvas.
     * 
     */
    init: function(drawEngine) {
        this.drawEngine = drawEngine;
    },
    /**
     * Updates every Scene FPS times per second.
     * 
     * @method update
     * 
     */        
    update: function() {
        var scene = this;

        this.drawEngine.clear();
        
        this.entities.forEach( function(ent) {
            scene.drawEngine.drawImage(ent.sprite, ent.pos.x, ent.pos.y, ent.size.w, ent.size.h);
        });
    }
});