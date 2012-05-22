/*
 * Define the player component
 */
Crafty.c("player", {
    init: function() {
        this.addComponent("2D, Canvas, guy_idle, Box2D, SpriteAnimation");
        this.crop(0, 0, 24, 38);
        this.box2d({
            bodyType: 'dynamic',
            density : 8,
            friction : 0,
            restitution : 0,
            shape: "box",
            isSensor: true
        });
        this.body.SetBullet(true);
        this.body.SetSleepingAllowed(false);
        this.body.SetFixedRotation(true);
        this.animate("idle", 0, 1, 3);
        this.animate("walk", 0, 0, 3);
        this.bind("EnterFrame", function() {
            if (!this.isPlaying("walk"))
            {
                this.animate("idle", 20);
            }
        });
        console.log("Components.js - player>>> Player component defined and initialized");
    }
});

/*
 * Define the enemy component
 */
Crafty.c("enemy", {
    init: function() {
        this.addComponent("2D, Canvas, enemy_blob, Box2D");
        this.crop(0, 0, 46, 27);
        this.box2d({
            bodyType: 'kinematic',
            shape: "box"
        });
        this.bind("EnterFrame", function() {
            this.body.SetLinearVelocity(new b2Vec2(-game_speed, 0));
            //this.body.SetPosition(new b2Vec2(this._x + game_speed, this._y));
            if(this._x < -46) {
                //console.log("components.js - enemy>>> Destroying enemy; out of screen");
                this.destroy();
            }
        })
    //this.body.SetBullet(true);
    //console.log("Components.js - Blob>>> Enemy component defined and initialized");
    }
});

/*
 * Define the rocket component
 */
Crafty.c("rocket", {
    init: function() {
        this.addComponent("2D, Canvas, enemy_rocket, Box2D");
        this.crop(0, 0, 56, 28);
        this.box2d({
            bodyType: 'kinematic',
            shape: "box"
        });
        this.body.SetLinearVelocity(new b2Vec2(-(game_speed+3), 0));
        this.bind("EnterFrame", function() {
            if(this._x < -66) {
                //console.log("components.js - enemy>>> Destroying rocket; out of screen");
                this.destroy();
            }
        })
    //this.body.SetBullet(true);
    //console.log("Components.js - Rocket>>> Rocket component defined and initialized");
    }
});

/*
 * Define the coin component
 */
Crafty.c("coin", {
    init: function()
    {
        this.addComponent("2D, Canvas, coin_normal, Box2D");
        this.box2d({
            bodyType: 'kinematic',
            shape: "box"
        });
        
        this.fixtures[0].m_isSensor = true;
        
        this.body.SetLinearVelocity(new b2Vec2(-game_speed, 0));
        this.bind("EnterFrame", function()
        {
            if(this._x < -14) this.destroy();
        });
    }
});

/*
 * Define the scrolling background component
 */
Crafty.c("scrollingBG", {
    init: function() {
        this.addComponent("2D, Canvas, bg_stars, Persist");
        this.crop(0,0, Crafty.viewport.width, 2000);
        this.bind("EnterFrame", function() {
            this._x -= game_speed-1;
            if(this._x <= -Crafty.viewport.width) {
                this._x = Crafty.viewport.width;
            }
        })
    }
});
