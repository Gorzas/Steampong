
/**
 * DrawEngine
 * 
 * Has three main tasks:
 *      -. update the canvas clearing it first
 *      -. allow to draw images in the canvas
 *      -. allow to draw text and customing it as you wish
 * 
 * @tclass DrawEngine
 * @constructor
 */
DrawEngine = Class.extend({
    /**
     * Context of the canvas. Need in order to draw any image in the canvas
     * 
     * @property ctx
     * @type CanvasRenderingContext2D
     */
    ctx: null,    
    /**
     * Default font for the text written in the Canvas.
     * 
     * @property font
     * @type Object
     */
    font: {
        align: 'center',
        size: '40px',
        style: 'bold',
        family: 'Helvetica, Arial, sans-serif'
    },
    /**
     * Constructor of a new DrawEngine.
     * 
     * @method init
     * @param {CanvasRenderingContext2D} ctx Allows to draw in the canvas.
     */
    init: function(ctx) {
        this.ctx = ctx;
    },
    /**
     * Actually, draws an image in the canvas.
     * 
     * @method drawImage
     * @param {String} Name of the sprite
     * @param {int|float} position x in the canvas
     * @param {int|float} position y in the canvas
     * @param {int} width of the destination image
     * @param {int} height of the destination image
     * 
     */
    drawImage: function(sprite, x, y, w, h) {
        this.ctx.drawImage(
                gSpriteSheet.img, 
                gSpriteSheet.sprites[sprite].x, 
                gSpriteSheet.sprites[sprite].y, 
                gSpriteSheet.sprites[sprite].w, 
                gSpriteSheet.sprites[sprite].h, 
                Math.floor(x - (w >> 1)), 
                Math.floor(y - (h >> 1)), 
                w, 
                h
        );
    }, 
    /**
     * Draws any text in a position in the canvas.
     * 
     * @method drawText
     * @param {int|float} x Position x in the canvas
     * @param {int|float} y Position y in the canvas
     * @param {String} text Text to write in the canvas
     * @param {String} textFont Font-family of the new text
     *      
     */
    drawText: function(x, y, text, textFont) {
        var font = this.font;

        // if user prefers another scheme different than default
        if (textFont) {
            font = textFont;
        }

        this.ctx.textAlign = font.align;
        this.ctx.font = font.style + ' ' + font.size + ' ' + font.family;
        this.ctx.fillStyle = "";
        this.ctx.fillText(text, x, y);
    },
    /**
     * Clears the canvas
     * 
     * @method clear
     */        
    clear: function() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
});/**
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
});Vec2 = Box2D.Common.Math.b2Vec2;
BodyDef = Box2D.Dynamics.b2BodyDef;
Body = Box2D.Dynamics.b2Body;
FixtureDef = Box2D.Dynamics.b2FixtureDef;
Fixture = Box2D.Dynamics.b2Fixture;
World = Box2D.Dynamics.b2World;
MassData = Box2D.Collision.Shapes.b2MassData;
PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
CircleShape = Box2D.Collision.Shapes.b2CircleShape;
DebugDraw = Box2D.Dynamics.b2DebugDraw;
RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;

/**
 * Physics Engine of the game. Is the suggested engine by the
 * Udacity HTML5 course.
 * 
 * 
 */
PhysicsEngine = Class.extend({
    
    walls: [],
    world: null,
    
    PHYSICS_LOOP_HZ : 1.0 / 60.0,
    
    init: function() {
        
    },
            
    create: function() {
        gPhysicsEngine.world = new World ( 
                new Vec2(0, 0),
                true
        );
            
        // creation of the walls of the world
        var bodyDef = new BodyDef(),
            fixtureDefinition = new FixtureDef();
    
        fixtureDefinition.density = 1.0;
        fixtureDefinition.friction = 1;
        fixtureDefinition.restitution = 1.0;
        
        bodyDef.type = Body.b2_staticBody;
        bodyDef.position.Set(0, 720);
        fixtureDefinition.shape = new PolygonShape;
        fixtureDefinition.shape.SetAsEdge(new Vec2(0, 0), new Vec2(960, 0));
        this.walls['floor'] = this.world.CreateBody(bodyDef).CreateFixture(fixtureDefinition);

        bodyDef.position.Set(0, 0);
        this.walls['ceil'] = this.world.CreateBody(bodyDef).CreateFixture(fixtureDefinition);

        bodyDef.position.Set(0, 0);
        fixtureDefinition.shape = new PolygonShape;
        fixtureDefinition.shape.SetAsEdge(new Vec2(0, 0), new Vec2(0, 720));
        this.walls['left'] = this.world.CreateBody(bodyDef).CreateFixture(fixtureDefinition);

        bodyDef.position.Set(960, 0);
        fixtureDefinition.shape.SetAsEdge(new Vec2(0, 0), new Vec2(0, 720));
        this.walls['right'] = this.world.CreateBody(bodyDef).CreateFixture(fixtureDefinition);
    },
            
    update: function () {
        var start = Date.now();

        gPhysicsEngine.world.Step(
            gPhysicsEngine.PHYSICS_LOOP_HZ,    //frame-rate
            10,                 //velocity iterations
            10                  //position iterations
        );
        gPhysicsEngine.world.ClearForces();

        return(Date.now() - start);
    },
            
    addContactListener: function (callbacks) {
        var listener = new Box2D.Dynamics.b2ContactListener();

        if(callbacks.PostSolve) {
            
            listener.PostSolve = function(contact, impulse) {
                callbacks.PostSolve(contact,
                          contact.GetFixtureA().GetBody(),
                          contact.GetFixtureB().GetBody(),
                          impulse);
            };
        }

        gPhysicsEngine.world.SetContactListener(listener);
    },

    registerBody: function (bodyDef) {
        var body = gPhysicsEngine.world.CreateBody(bodyDef);
        return body;
    },

    addBody: function (entityDef) {
        var bodyDef = new BodyDef();

        if(entityDef.type === 'static') {
            bodyDef.type = Body.b2_staticBody;
        } else {
            bodyDef.type = Body.b2_dynamicBody;
        }

        bodyDef.position.x = entityDef.x;
        bodyDef.position.y = entityDef.y;
        
        if(entityDef.userData)  bodyDef.userData = entityDef.userData;

        var body = this.registerBody(bodyDef);
        var fixtureDefinition = new FixtureDef();
        
        fixtureDefinition.density = 2.0;
        fixtureDefinition.friction = 0;
        fixtureDefinition.restitution = 1.0;
        
        if (entityDef.shape !== 'circle') {
            // PrismaticJoint allows paddle to be a slider
            var jointDef = new PrismaticJointDef();
            
            fixtureDefinition.density = 5.0;
            fixtureDefinition.friction = 1;
            
            // Now we define the shape of this object as a box
            fixtureDefinition.shape = new PolygonShape();
            fixtureDefinition.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight); 
            
            jointDef.bodyA = body;
            jointDef.bodyB = this.walls[bodyDef.userData.pos].GetBody();
            jointDef.collideConnected = false;
            jointDef.localAxisA.Set(0.0, 1.0);
            if (bodyDef.userData.pos === 'left') {
                jointDef.localAnchorA.Set(-50, 0);                
            } else {
                jointDef.localAnchorA.Set(50, 0);                
            }
            jointDef.enableMotor = true;
            jointDef.maxMotorForce = 2;
            this.world.CreateJoint(jointDef);
        } else {            
            fixtureDefinition.shape = new CircleShape(entityDef.halfWidth);
        }
        
        body.CreateFixture(fixtureDefinition);

        return body;
    },

    removeBody: function (obj) {
        gPhysicsEngine.world.DestroyBody(obj);
    }
});

var gPhysicsEngine = new PhysicsEngine();/**
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
});/**
 * SpriteSheet
 * 
 * It handles the spritesheet of the game, creating the new sprites and
 * retrieveng theirs data if they are needed.
 * 
 * @class SpriteSheet
 * @constructor
 */
SpriteSheet = Class.extend({
    /**
     * Base image where the class is going to retrieve every sprite
     * of the game
     * 
     * @property img
     * @type Image
     */
    img: null,
    /**
     * Collection of sprites with the JSON data of the textures.
     * 
     * @property sprites
     * @type Array
     */
    sprites:[],
    /**
     * Cretes new SpriteSheet
     * 
     * @method init
     */
    init: function() {
        
    },
    /**
     * Loads a JSON file with the sprite image data. 
     * 
     * @method load
     * @param {File} jsonFile Has the data of the image project
     * @param {Function} callback Callback function to be called when the JSON file
     * is loaded
     */        
    load: function(jsonFile, callback) {
        var xhr = new XMLHttpRequest();
        
        xhr.open("GET", jsonFile, true);
        
        xhr.onload = function() {
            var parsedJSON;
            
            try {
                parsedJSON = JSON.parse(this.responseText);
            } catch(e) {
                alert("Spritesheet JSON file it's not in this directory");
            }
            
            gSpriteSheet.parseSprites(parsedJSON, callback);
        };
        
        xhr.send();        
        
    },
    /**
     * Reads parsed JSON and creates a colletion with all the posibilities
     * needed
     * 
     * @method parseSprites
     * @param {Object} parsed Parsed JSON
     * @param {function} callback Function to be called when all it's loaded
     * 
     */        
    parseSprites: function(parsed, callback) {
        var imageLoaded = false,    // image with the spritesheet map
            spritesLoaded = false,  // sprites added to the class
            img = new Image();
            
        img.onload = function() {
            imageLoaded = true;
            
            if (spritesLoaded) {
                callback();
            }
        };
        img.src = parsed.meta.image;   
        this.img = img; 
        
        for (var key in parsed.frames) {
            var elem = parsed.frames[key],
                sprite = {
                    x: elem.frame.x,
                    y: elem.frame.y,
                    w: elem.frame.w,
                    h: elem.frame.h,
                    cx: -elem.frame.w * 0.5,
                    cy: -elem.frame.h * 0.5
                };
                
            if (elem.trimmed) {
                sprite.cx = elem.spriteSourceSize.x - (elem.sourceSize.w * 0.5);
                sprite.cy = elem.spriteSourceSize.y - (elem.sourceSize.h * 0.5);
            }
            
            gSpriteSheet.sprites[key] = sprite;            
        }
        
        spritesLoaded = true;
        if (imageLoaded) {
            callback();
        }

    }
});

var gSpriteSheet = new SpriteSheet();/**
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
});/**
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
});/**
 * Ball
 * 
 * The ball of the game. The main character in the game.
 * 
 * Known issues:
 *      -. Because of the lack of time there are plenty of physics improvements
 *      to make the ball quicker and fluid
 *      
 * @class Ball
 * @constructor
 * 
 */
Ball = Collisionable.extend({
    /**
     * Creates a new Ball
     * 
     * @method init
     * @param {int} x Position x in the canvas
     * @param {int} y Position y in the canvas
     * @param {int} w Width of the ball
     * @param {int} h Height of the ball
     */
    init: function(x, y, w, h) {
        // Math.random() * 2 - 1 -> allows to get a random number in the
        // interval {-1, 1}
        var dir = this.initDir(), 
            entityDef = {},
            speed = 1800;
        
        this._super('bola.png', x, y, w, h, 10, dir, speed);
        
        entityDef = {
            shape: 'circle',
            x: x,
            y: y,
            halfWidth: (w >> 1),
            halfHeight: (h >> 1),
            type: 'dynamic',
            userData: {
                ent: this
            }
        };
        
        this.physBody = gPhysicsEngine.addBody(entityDef);       
        
        this.physBody.SetLinearVelocity(new Vec2(dir.x * speed,
                                                 dir.y * speed));
    },
    /**
     * Creates a new first direction to the ball
     * 
     * @method initDir
     * @return {Object} New direction of the ball
     */        
    initDir: function() {
        return { x: 1, y: (Math.random() * 2) - 1 };
    },
    /**
     * Restarts the ball, positioning it in middle of the canvas and
     * inits its direction
     * 
     * @method restart
     * @param {Object} pos Position in x,y Axis
     * @param {Object} dir Initial direction
     * 
     */        
    restart: function(pos, dir) {
        this.pos = pos;
        this.physBody.SetPosition(this.pos);
        this.dir = dir;
    },
    /**
     * Moves the ball in the canvas
     * 
     * @method move
     * 
     */        
    move: function() {
        /*this.physBody.SetLinearVelocity(new Vec2(this.dir.x * this.speed,
                                                 this.dir.y * this.speed));*/

        if(this.physBody !== null) {
            var pos = this.physBody.GetPosition();
            
            this.pos.x = pos.x;
            this.pos.y = pos.y;
        }
    },
    /**
     * NOT IMPLEMENTED YET
     * 
     * Handler that would be called when ball gets a collision
     */        
    onTouch: function(contact, body, impulse) {

    }
});/**
 * Paddle
 * 
 * Defines every paddle in the canvas (Player and Computer).
 * 
 * @class Paddle
 * @constructor
 */
Paddle = Collisionable.extend({
    /**
     * Ball of the game.
     * Needed for computer paddle in order to follow the ball's direction.
     * 
     * @property ball
     * @type Ball
     */
    ball: null,
    /**
     * Max speed of paddle.
     * Used for paddle flow and avoid to get excesive speeds of movement.
     * 
     * @property maxSpeed
     * @type int
     */
    maxSpeed: 10,
    /**
     * Creates a new paddle.
     * 
     * @param {String} Type of paddle. It can be 'left' or 'right'
     * @param {int} x position
     * @param {int} y position
     * @param {int} width of the paddle
     * @param {int} height of the paddle
     * 
     */
    init: function(position, x, y, w, h, ball) {
        var sprite = (position === 'left') ? 'pala1.png' : 'pala2.png',
            entityDef;
        
        this._super(sprite, x, y, w, h, 10, { x: 0, y: 0}, 0);
        this.ball = ball;
        
        entityDef = {
            shape: 'box',
            x: x,
            y: y,
            halfWidth: (w >> 1),
            halfHeight: (h >> 1),
            type: 'dynamic',
            userData: {
                ent: this,
                pos: position
            }
        };
        
        this.physBody = gPhysicsEngine.addBody(entityDef);       
        
        this.physBody.SetLinearVelocity(new Vec2(0, 0));
    },
    /**
     * Just for computer, changes position of paddle following the current
     * ball's position.
     * 
     * Needs a ball associtated.
     * 
     * @method followBall
     * 
     * 
     */        
    followBall: function() {
        if (this.ball) {
            if ((this.pos.y > this.ball.pos.y) && 
                this.pos.y > (this.size.h >> 1) && 
                (this.speed > -this.maxSpeed)) {
                this.speed--;
            } else if (this.pos.y < this.ball.pos.y && 
                        this.pos.y < (720 - (this.size.h >> 1))&& 
                        (this.speed < this.maxSpeed)) {
                this.speed++;
            } else if (this.speed !== 0) {
                this.speed += (this.speed > 0) ? -1 : 1;            
            }
        }
    },
    /**
     * Moves paddle on canvas
     * 
     * @method move
     * 
     */        
    move: function() {
        // we can't go out of the canvas       
        // this.physBody.ApplyImpulse(new Vec2(this.dir.x, this.dir.y), this.physBody.GetWorldCenter());
        this.followBall();        

        if(this.physBody !== null) {
            var pos = this.physBody.GetPosition();

            this.pos.x = pos.x;
            if (((pos.y + this.speed) > ((this.size.h >> 1) - this.maxSpeed)) && 
                ((pos.y + this.speed) < (720 - (this.size.h >> 1) + this.maxSpeed))) {
                this.pos.y = pos.y + this.speed;            
            }
                    
            
            this.physBody.SetPosition(this.pos);
        }
        
    }
});/**
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
});/**
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
});/**
 * GameScene
 * 
 * It's created when the user inits a new game. It handles all the entities in the
 * canvas drawing them and checking the current score of the game.
 * 
 * @class GameScene
 * @constructor
 */
GameScene = Scene.extend({
    audio: null,
    /**
     * Ball of the game.
     * 
     * @property ball
     * @type Ball
     */
    ball: null,
    /**
     * Current score in the game.
     * 
     * @property scorre
     * @type Object
     */
    score: {
        p1: 0,
        p2: 0
    },
    /**
     * An array with all the score boards in the game.
     * 
     * @property scoreBoards
     * @type Array
     * 
     */
    scoreBoards: [],
    /**
     * Creates a new GameScene object.
     * Inits the scene loading all the needed files and has a continuos 
     * checking of the current score.
     * 
     * @method init
     * @param {DrawEngine} drawEngine It handles all the entities in the scene
     * and draws them in the canvas.
     * 
     */
    init: function(drawEngine) {
        this._super(drawEngine);
        
        var gameScene = this;
        /**
         * Loads all the needed entities
         */
        require([
            'src/entities/Ball.js?v=' + version + '',
            'src/entities/Paddle.js?v=' + version + '',
            'src/interfaces/Scoreboard.js?v=' + version + '',
            'src/entities/Player.js?v=' + version + ''
        ], function() {
            var markerY = 60,
                markerX = 340,
                ball,
                player,
                computer;
            
            // need the physics world before we can create the elements
            gPhysicsEngine.create();
            
            // create the entities of the scene
            gameScene.ball = new Ball(480, 360, 34, 34);
            player = new Player(50, 360, 38, 182);
            computer = new Paddle('right', 910, 360, 38, 182, gameScene.ball);
            
            gameScene.entities.push( gameScene.ball );
            gameScene.entities.push( player );
            gameScene.entities.push( computer );
            
            gameScene.scoreBoards.push( new Scoreboard(0, markerX, markerY) );
            gameScene.scoreBoards.push( new Scoreboard(0, markerX + 80, markerY) );
            gameScene.scoreBoards.push( new Scoreboard(0, markerX + 200, markerY) );
            gameScene.scoreBoards.push( new Scoreboard(0, markerX + 280, markerY) );
            
            gameScene.scoreBoards.forEach( function(scoreBoard) {
                gameScene.entities.push(scoreBoard);
            });
            // creates a collision listener (not used)
            gPhysicsEngine.addContactListener({ 
                PostSolve: function(contact, bodyA, bodyB, impulse) {
                    var userDataA = bodyA.GetUserData();
                    var userDataB = bodyB.GetUserData();

                    if (userDataA && userDataA.ent) {
                        userDataA.ent.onTouch(
                            contact,
                            bodyB,
                            impulse
                        );
                    }
                    
                    if (userDataB && userDataB.ent) {
                        userDataB.ent.onTouch(
                            contact,
                            bodyA,
                            impulse
                        );
                    }
                } 
            });
            
            if ((new Audio()).canPlayType("audio/ogg; codecs=vorbis")) {
                gameScene.audio = new Audio('assets/audio/pf0003.ogg');
            } else {
                gameScene.audio = new Audio('assets/audio/pf0003.mp3');
            }
            
            gameScene.audio.loop = true;
            
            gameScene.audio.play();
        });
    },
    /**
     * Checks if ball has arrived to any of the walls
     * 
     * @method checkScore
     * @return {bool} If ball has touch any of the walls
     */
    checkScore: function() {
        var ball = this.ball;
        
        if (ball) {
            if (ball.pos.x <= (ball.size.w)) {
                ball.restart({ x: 480, y: 360}, ball.initDir());

                this.score.p2++;            
            } else if (ball.pos.x >= (960 - (ball.size.w))) {
                ball.restart({ x: 480, y: 360}, ball.initDir());
                this.score.p1++;            
            } else {
                return false;
            }        

            this.updateScore();
            
            return true;
        }
        
        return false;
    },
    /**
     * Actually, changes the values of the score board.
     * 
     * @method updateScore
     */        
    updateScore: function() {
        this.scoreBoards[0].changeValue(Math.floor(this.score.p1 / 10));
        this.scoreBoards[1].changeValue(Math.floor(this.score.p1 % 10));
        this.scoreBoards[2].changeValue(Math.floor(this.score.p2 / 10));
        this.scoreBoards[3].changeValue(Math.floor(this.score.p2 % 10));
    },
    /**
     * Updates physics engine of the world.
     */        
    update: function() {
        this.checkScore();
        
        if (gPhysicsEngine.world) {
            gPhysicsEngine.update();
        }
        
        this.entities.forEach( function(ent) {
            ent.move();
        });
        
        this._super();        
    }
});/**
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
});/**
 * CURRENTLY NOT USED
 * 
 * It would mantain de main list of options to an user after get the page loaded.
 * 
 */
MainScene = Scene.extend({
    
});/**
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