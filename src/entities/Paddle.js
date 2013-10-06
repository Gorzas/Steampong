/**
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
     * Needs a ball associated.
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
                this.speed += (this.speed > 0) ? -5 : 5;            
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
});