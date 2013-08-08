/**
 * Main class.
 * 
 * Engine of the game. It has a parameter with the current scene in the canvas.
 * It loads all the core files and inits canvas.
 * 
 * @class Game
 * @constructor
 */
Game = Class.extend({
    /**
     * Base url of the server.
     * Used for load files without relative paths.
     * 
     * @property baseUrl
     * @type String
     */
    baseUrl: '',
    /**
     * Contains the main canvas.
     * 
     * @property canvas
     * @type DOMElement
     */
    canvas: null,
    /**
     * Drawing handler object.
     * 
     * @property drawEngine
     * @type DrawEngine
     */
    drawEngine: null,
    /**
     * Frames per second.
     * 
     * @property fps
     * @type int
     */
    fps: 30,
    /**
     * Current enable scene
     * 
     * @property scene
     * @type Scene
     */
    scene: null,
    /**
     * Size of the canvas. 
     * 
     * @property size
     * @type Object
     */
    size: {
        w: 0,
        h: 0
    },
    /**
     * Creates a new Game object.
     * 
     * @param {DOMElement} canvas Main canvas of the Game
     * @param {String} baseUrl Base url of the page
     */
    init: function(canvas, baseUrl) {
        this.baseUrl = baseUrl;
        this.canvas = canvas;
        
        this.size.w = canvas.width;
        this.size.h = canvas.height;
    },
    /**
     * Starts a new Game.
     * 
     * It handles the Loading Scene and, when everything has been loaded, it calls
     * the main scene of the game.
     * 
     * It's responsability is to load all the core files and mantain the Scene.
     * 
     */        
    start: function() {
        // First, we need the base classes:
        //  -. DrawEngine: whose responsability it's to draw the canvas
        //  -. Entity: base class for all the entities that will be populating the world
        //  -. Scene: class for all the posible scenes
        //  -. SpriteSheet: it handles the texture pack
        //  -. PhysicsEngine: using Box2D, it handles all the Physics objects in teh world
        var game = this;
        
        // We load the main core libraries
        require([
            'src/core/DrawEngine.js?v=' + version + '',
            'src/core/Entity.js?v=' + version + '',
            'src/core/Scene.js?v=' + version + '',
            'src/core/SpriteSheet.js?=v' + version + '',
            'src/core/PhysicsEngine.js?v=' + version + ''
        ], function() {
            require([
                'src/scenes/LoadingScene.js?v=' + version + '',
                'src/scenes/GameScene.js?v=' + version + '',
                'src/entities/base/Collisionable.js?v=' + version + '',
                'src/entities/base/Interface.js?v=' + version + ''
            ], function() {
                // initiate DrawEngine by setting the canvas context
                game.drawEngine = new DrawEngine(game.canvas.getContext('2d'));                
                game.scene = new LoadingScene(game.drawEngine);

                setTimeout(function() {
                    game.update();
                }, 1000 / game.fps);
                
                gSpriteSheet.load('assets/textures/spreadsheet.json', function() {
                    game.scene = new GameScene(game.drawEngine);
                });
            });
        });        
    },
    /**
     * Updates the canvas about FPS times a second.
     * 
     */        
    update: function() {
        var game = this;
        game.scene.update();
        
        setTimeout( function() {
            game.update();
        }, 1000 / game.fps);
    }
});