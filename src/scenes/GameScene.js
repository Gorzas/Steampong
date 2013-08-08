/**
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
});