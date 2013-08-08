Vec2 = Box2D.Common.Math.b2Vec2;
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

var gPhysicsEngine = new PhysicsEngine();