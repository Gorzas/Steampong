/**
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
            
            // this.physBody.SetPosition(pos);
        }
    },
    /**
     * NOT IMPLEMENTED YET
     * 
     * Handler that would be called when ball gets a collision
     */        
    onTouch: function(contact, body, impulse) {

    }
});