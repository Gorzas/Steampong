/**
 * LoadingScene
 * 
 * By loading this scene, we show something to the user while we are
 * loading the rest of files.
 * 
 * @class LoadingScene
 * @constructor
 */
LoadingScene = Scene.extend({
    /**
     * Loads a new LoadingScene.
     * 
     * @method init
     * @param {DrawEngine} drawEngine Draws all the entities in the scene
     */
    init: function(drawEngine) {
        this._super(drawEngine);
    },
    /**
     * Updates canvas
     * 
     * @method update
     */        
    update: function() {
        this._super();
        
        this.drawEngine.drawText(350, 281, "Loading...");
    }
});