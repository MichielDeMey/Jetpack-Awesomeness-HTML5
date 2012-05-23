var vel = -0.05; //Player velocity
var ptm = 32; //Pixels per meter

/*
 * Global variables for other stuff
 */
var world;
var plyr; //Global player variable
var _contacts = [];

/*
 * Variables needed to count the frame numbers
 */
var frame_number = 0;
var frame_number_blob = 0; //Count frames that have passed, used for the EnterFrame timer
var frame_number_rocket = 0;
var frame_number_coins = 0;

/*
 * Spawn delays
 */
var enemy_blob_delay = Crafty.math.randomInt(30,90);
var enemy_rocket_delay = Crafty.math.randomInt(180, 300);
var coins_delay = 600;

/*
 * Game variables
 */
var coin_structures = [coin_structure_bob , coin_structure_box, coin_structure_x];
var game_speed = 4;
var game_score = 0;

/*
 * Sound variables
 */
var music_menu;
var music_game;

var fx_coin;
var fx_explosion;

/*
 * Initialize the game when the window starts loading
 */
window.onload = function() {
  soundManager.onready(function(){
    //Initialize Crafty
    Crafty.init();
    Crafty.canvas.init();
    console.log("window.onload()>>> Crafty initialized");
    
    loadModules();
  });
};

/*
 * Load all modules for the game, then initialize the game
 */
function loadModules()
{
  Crafty.modules('http://cdn.craftycomponents.com', {
    CraftyBox2d: 'release'
  }, function() {
    console.log("loadGame()>>> Modules loaded!");
        
    initGame();
  });
}

/*
 * This function will initialize the game
 */
function initGame()
{
  var gx = 0;
  var gy = 10;
  var doSleep = true;
  Crafty.box2D.init(gx, gy, ptm, doSleep);
  //Crafty.box2D.showDebugInfo();
  world = Crafty.box2D.world;
  console.log("initGame()>>> Box2D initialized");
    
  Crafty.bind("EnterFrame", function(){
    //window.onblur = alert("Lost focus!");
    });
    
  //Add the contactlistener and bind the Crafty EnterFrame	
  var contactListener = new Box2D.Dynamics.b2ContactListener;
  contactListener.BeginContact = function(contact)
  {
    var myContact = { 
      fixtureA: contact.GetFixtureA(), 
      fixtureB: contact.GetFixtureB()
    };
    _contacts.push(myContact);
  //console.log("Contact!");
  }
								   
  contactListener.EndContact = function(contact)
  {										
    var myContact = { 
      fixtureA: contact.GetFixtureA(), 
      fixtureB: contact.GetFixtureB() 
    };
										
    var totalContacts = _contacts.length;
    for(var i = 0; i < totalContacts; ++i){
      if ((_contacts[i].fixtureA == myContact.fixtureA) && (_contacts[i].fixtureB == myContact.fixtureB)) {
        _contacts.splice(i, 1);
        return;
      }
    }
  };

  //console.log("Contact!");
        
  world.SetContactListener(contactListener);
  console.log("initGame()>>> Contact listener added");
    
  Crafty.scene("game_loading");
}

function loadGame()
{
  var loadingtext = Crafty.e("2D, DOM, Text").attr({
    w: 300, 
    h: 32, 
    x: (Crafty.viewport.width/2) - 150, 
    y: Crafty.viewport.height/2
  })
  .text("Loading..")
  .css({
    "font-family" : "Pic0Regular",
    "font-size" : "32px",
    "text-align": "center", 
    "color": "#ffffff"
  });
  $('body').prepend('<div id="progressbar" class="progress progress-info progress-striped active"> <div class="bar" style="width: 0%;"></div></div>');
    
  //Preload Crafty assets
  /*Crafty.load([
        "assets/images/stripe_grey.png",
        "assets/images/bg_2000.png", 
        "assets/sprites/hero_spritesheet.png", 
        "assets/sprites/blob.png",
        "assets/sprites/rocket.png",
        "assets/sprites/coin.png", 
        "assets/audio/music/Unreeeal_Superhero_3_Revamp.mp3",
        "assets/audio/music/Space_Music.mp3",
        "assets/audio/fx/explosion.wav",
        "assets/audio/fx/coin2.wav"
        ]*/
  Crafty.load([
    "assets/images/stripe_grey.png",
    "assets/images/bg_2000.png", 
    "assets/sprites/hero_spritesheet.png", 
    "assets/sprites/blob.png",
    "assets/sprites/rocket.png",
    "assets/sprites/coin.png",
    "assets/audio/music/Unreeeal_Superhero_3_Revamp.mp3",
    "assets/audio/fx/explosion.wav",
    "assets/audio/fx/coin2.wav"
    ], function() {
        
      createSprites();
        
      //Go to the main menu
      Crafty.scene("menu_main");
    },
    function(e) {
      $('.bar').css("width",e.percent + "%");
      console.log(e);
      console.log("Loaded:" + e.percent);
            
      if(e.loaded > 0) loadingtext.text("Loading images <br /> " + e.percent + "%");
      if(e.loaded >= 2) loadingtext.text("Loading sprites <br /> " + e.percent + "%");
      //if(e.loaded >= 6) loadingtext.text("Loading siund effects <br /> " + e.percent + "%");
      //if(e.loaded >= 8) loadingtext.text("Loading sound effects <br /> " + e.percent + "%");
        
      if(e.percent == 100)
      {
        $('#progressbar').detach();
      }
    },
    function(e){
      console.log("Error loading the game: ");
      console.log(e);
    });
}

/*
 * Load the music for the game
 */
function loadGameAudio()
{
  //soundManager.onready(function() {
        
  music_game = soundManager.createSound({
    id:  'music_game',
    url: './assets/audio/music/Unreeeal_Superhero_3_Revamp.mp3'
  });
        
  music_game.play();
  console.log("loadMusic()>>> Playing some background music!");
        
  fx_explosion = soundManager.createSound({
    id:  'fx_explosion',
    url: './assets/audio/fx/explosion.wav'
  });
        
  console.log("loadSound()>>> All audio loaded!");
        
//});
     
}

/*
 * This function will create the sprites needed for the game
 */
function createSprites()
{
  //Define crafty sprites
  Crafty.sprite(38, "assets/sprites/hero_spritesheet.png", {
    guy_idle: [0, 1],
    guy_walking: [0, 0]
  });
  Crafty.sprite(46, "assets/sprites/blob.png", {
    enemy_blob: [0, 0]
  });
  Crafty.sprite(56, "assets/sprites/rocket.png", {
    enemy_rocket: [0, 0]
  });
  Crafty.sprite(14, "assets/sprites/coin.png", {
    coin_normal: [0, 0]
  });
    
  console.log("createSprites()>>> Sprites defined and background set");
}

onEnterFrame = function() {
    
  //Check frame numbers (timers)
  if(frame_number % 60 == 0) // % is modulo
  {
    game_score++;
    game_speed += 0.5;
  }
    
  //Handle contacts
  var totalContacts = _contacts.length;
  //if(totalContacts>1) console.log(totalContacts);
  for(var i = 0; i < totalContacts; ++i)
  {
    var contact = _contacts[i];
        
    if(contact)
    {
      //Assign the bodies that are touching to a variable
      var bodyA = contact.fixtureA.GetBody();
      var bodyB = contact.fixtureB.GetBody();

      if ((bodyA.GetUserData()) && (bodyB.GetUserData())) //Get the userdata from the bodies (a Crafty entity)
      {
        var spriteA = bodyA.GetUserData();
        var spriteB = bodyB.GetUserData();

        // Check to see if you've hit an enemy
        if (spriteA.isPlayer && spriteB.isEnemy || spriteA.isEnemy && spriteB.isPlayer)
        {
          fx_explosion.play();
          Crafty.scene("game_over");
        }
                
        // Check to see if you're walking or flying
        if(spriteA.isPlayer && spriteB.isFloor || spriteA.isFloor && spriteB.isPlayer)
        {
          if (!plyr.isPlaying("walk"))
          {
            plyr.animate("walk", 10);
          }
        }
                
        // Check to see if you've hit a coin
        if(spriteA.isPlayer && spriteB.isCoin)
        {
          coin_hit(bodyB);
        }
        else if(spriteB.isPlayer && spriteA.isCoin)
        {
          coin_hit(bodyA);
        }
      }
    }
  }
}

function coin_hit(coinBody)
{
  //play the sound
  var fx_coin = soundManager.createSound({
    id:  'fx_coin',
    url: './assets/audio/fx/coin2.wav'
  });
    
  fx_coin.play();
    
  var sprite = coinBody.GetUserData();
  sprite.destroy();
  sprite = null;
  world.DestroyBody(coinBody);
  game_score++;
}

function createGameGUI()
{
  Crafty.e("2D, DOM, Text").attr({
    w: 180, 
    h: 16, 
    x: 5, 
    y: 5
  })
  .text("Score: " + game_score)
  .css({
    "font-family" : "Pic0Regular",
    "font-size" : "16px",
    "text-align": "left", 
    "color" : "#ffffff"
  })
  .bind("EnterFrame", function() {
    this.text("Score: " + game_score);
  });
}

function createBackground()
{
  Crafty.sprite(2000, "assets/images/bg_2000.png", {
    bg_stars: [0, 0]
  });
    
  var bg1 = Crafty.e("scrollingBG, Persist");
  var bg2 = Crafty.e("scrollingBG, Persist")
  .attr({
    x: Crafty.viewport.width
  });
}

function createWalls()
{
  //Create the floor
  var floor = Crafty.e("2D, Canvas, Box2D")
  .attr({
    isFloor: true
  })
  .box2d({
    bodyType: 'static',
    shape: [[0, Crafty.viewport.height], [Crafty.viewport.width, Crafty.viewport.height]]
  })
  /*.bind("stageResize", function() {
        console.log("Resize fired!");
        this.body.SetPosition(new b2Vec2(0,0));
    })*/;
    
  //Create the ceiling
  var ceiling = Crafty.e("2D, Canvas, Box2D")
  .box2d({
    bodyType: 'static',
    shape: [[0, 0], [Crafty.viewport.width, 0]]
  });
}

function createPlayer()
{
  //Define the player entity
  plyr = Crafty.e("player")
  .attr({
    w: 24, 
    h:38,
    isPlayer: true
  })
  .bind("KeyDown", function(e) {
    if(e.keyCode === Crafty.keys.UP_ARROW || e.keyCode === Crafty.keys.SPACE)
    {
      this.move.up = true;
    //console.log("Pressed UP, applying force!");
    }
  })
  .bind("KeyUp", function(e) {
    if(e.keyCode === Crafty.keys.UP_ARROW || e.keyCode === Crafty.keys.SPACE)
    {
      this.move.up = false;
    }
  })
  .bind("EnterFrame", function()
  {
    //Create a smooth movement when going up
    if(this.move.up)
    {
      //console.log(vel)
      this.body.SetLinearVelocity(new b2Vec2(0,vel*4));
      if (vel > -1.5) 
      {
        vel *= 1.5;
      }
    }
    else
    {
      vel = -0.1;
    }
  });

  plyr.body.SetPosition(new b2Vec2(120/ptm, 0));
  console.log("main scene>>> Player entity created");
}

function createCoinSpawner()
{
  //Enemy spawner (just an entity; not assigned to a variable)
  Crafty.e("coinSpawner").bind("EnterFrame", function(e) {
    if(frame_number_coins == coins_delay) {
      var rand = Crafty.math.randomInt(0, coin_structures.length-1);
      createCoinStructure(coin_structures[rand]);
      frame_number_coins = 0;
    }
        
    frame_number_coins++;
  });
}

function createEnemySpawner()
{
  //Enemy spawner (just an entity; not assigned to a variable)
  Crafty.e("enemySpawner").bind("EnterFrame", function(e) {
    if(frame_number_blob == enemy_blob_delay) {
      for (var i=0; i <= Crafty.math.randomInt(1, 3); i++)
      {
        createEnemy();
      }
            
      enemy_blob_delay = Crafty.math.randomInt(30,90);
      frame_number_blob = 0;
    }
    if(frame_number_rocket == enemy_rocket_delay) {
      createRocket();
      enemy_rocket_delay = Crafty.math.randomInt(180, 300);
      frame_number_rocket = 0;
    }
        
    frame_number++;
    frame_number_blob++;
    frame_number_rocket++;
  });
}

function createEnemy()
{   
  // Create enemy entity
  var enmy = Crafty.e("enemy")
  .attr({
    width: 52, 
    height:52,
    isEnemy: true
  });
    
  var rand_y = Crafty.math.randomInt(0, (Crafty.viewport.height-52)/ptm);
  var rand_x = (Crafty.viewport.width/ptm) + (Crafty.math.randomInt(0, enmy.width*4))/ptm;
    
  enmy.body.SetPosition(new b2Vec2(rand_x, rand_y));
//console.log("main scene>>> Enemy entity created");
}

function createRocket()
{   
  // Create enemy entity
  var enmy_rocket = Crafty.e("rocket")
  .attr({
    width: 66, 
    height: 66,
    isEnemy: true
  });
    
  enmy_rocket.body.SetPosition(new b2Vec2(Crafty.viewport.width/ptm, plyr.y/ptm));
  console.log("main scene>>> Rocket spawned!");
}

function createCoinStructure(structure)
{
  /*console.log("Columns: " + structure[0].length);
    console.log("Rows: " + structure.length);*/
    
  var randY = Crafty.math.randomInt(0, Crafty.viewport.height-(14*structure.length));
    
  for(row = 0; row <= structure.length-1; row++)
  {
    //console.log("Row: " + row);
    for(column = 0; column <= structure[0].length-1; column++)
    {
      if(structure[row][column] == 1){
        //console.log(structure[row][column]);
        var cn = Crafty.e("coin")
        .attr({
          x: (Crafty.viewport.width + (14*column))/ptm,
          y: (randY + (14*row))/ptm,
          isCoin: true
        });
        cn.body.SetPosition(new b2Vec2(cn._x, cn._y));
      //console.log(cn);
      //console.log(cn.fixtures);
      //console.log(cn.fixtures[0].m_isSensor);
      }
    }
  }
}
