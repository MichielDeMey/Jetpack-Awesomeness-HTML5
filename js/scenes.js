/*
 * The loading scene, loads all the game content here
 */
Crafty.scene("game_loading", function(){
    
    loadGame();
    
});

/*
 * The main menu
 */
Crafty.scene("menu_main", function() {
    soundManager.onready(function() {
        //Menu music
        music_menu = soundManager.createSound({
            id:  "music_menu",
            url: "./assets/audio/music/Space_Music.mp3"
        });
        if(SoundManager.enabled) music_menu.play();
        console.log("menu_main>>> Playing menu music");
    });
    
    //music_menu.play();
    
    //Create the background (shown in most scenes, so it need the 'Persist' component)
    createBackground();
    
    //Create the logo
    var css_text_logo = css_text_general;
    css_text_logo["font-size"] = 80+40+"px";
    css_text_logo["text-align"] = "center";
    css_text_logo["-webkit-text-stroke"] = "2px #373535";
    css_text_logo["cursor"] = "default";
    
    var title = Crafty.e("2D, DOM, Text").attr({
        w: Crafty.viewport.width, 
        h: 80 +40, 
        x: 0, 
        y: 10,
        z: 99
    })
    .text("Jetpack")
    .css(css_text_logo);
    
    css_text_logo["font-size"] = 45+25+"px";
    var title_sub = Crafty.e("2D, DOM, Text").attr({
        w: Crafty.viewport.width, 
        h: 45+25, 
        x: 0, 
        y: title._h -33,
        z: 99
    })
    .text("Awesomeness")
    .css(css_text_logo);
    
    css_text_logo["-webkit-text-stroke"] = "0px #373535";
    
    var menu_main_container =  GUI_createContainer_general(400, 260);
    
    //Singleplayer
    var menu_item_singleplayer = GUI_createText_clickable(menu_main_container, "Singleplayer", 45, 1);
    menu_item_singleplayer.bind("Click", function(e){
        if(SoundManager.enabled) music_menu.stop();
        Crafty.scene("game_main");
    });
    
    //Multiplayer
    var menu_item_multiplayer = GUI_createText_clickable(menu_main_container, "<del>Multiplayer</del>", 45, 2);
    menu_item_singleplayer.bind("Click", function(e){
        if(SoundManager.enabled) music_menu.stop();
    //Crafty.scene("game_main");
    });
    
    //Credits
    var menu_item_credits = GUI_createText_clickable(menu_main_container, "<del>Credits</del>", 45, 3);
});

/*
     * The main scene, most things will happen here
     */
Crafty.scene("game_main", function() {
    loadGameAudio();
    
    Crafty.bind("EnterFrame", onEnterFrame);
    
    createGameGUI();

    createWalls();

    createPlayer();
    
    createEnemySpawner();
    
    createCoinSpawner();

});

Crafty.scene("game_over", function ()
{ 
    Crafty.unbind("EnterFrame", onEnterFrame);
    Crafty("player").destroy();
    Crafty("enemySpawner").destroy();
    Crafty("coinSpawner").destroy();
    
    var container_score =  GUI_createContainer_general(400, 200);
    GUI_createText_static_container(container_score, "Game over!<br/><sub>Score: " + game_score + "</sub>", 64, 1);
    
//GUI_createText_static((Crafty.viewport.width/2) - 90, Crafty.viewport.height/2, "Game over!<br/><sub>Score: " + game_score + "</sub>", 32);
});