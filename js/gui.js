var css_text_general = {
    "font-family" : "Pic0Regular",
    "text-align": "center", 
    "color": "#ffffff"
};

function GUI_createContainer_general(w, h)
{
    var menu = Crafty.e("DOM, Image, HTML, menu")
    .attr({
        w: w,
        h: h,
        x: (Crafty.viewport.width/2) - w/2,
        y: (Crafty.viewport.height/2) - h/2
    });
    
    menu.append('<div style="width: ' + menu._w + 'px; height: ' + menu._h + 'px"><div></div></div>');
    menu.append('<div id="menu_container"></div>');
    
    return menu;
}

function GUI_createText_clickable(container, message, fontsize, index)
{
    var css_text_clickable = css_text_general;
    css_text_clickable["font-size"] = fontsize+"px";
    css_text_clickable["cursor"] = "pointer";
    
    var margin = fontsize;
    if(index == 1) margin = (container._h/10) +5;
    
    var txt_clickable = Crafty.e("2D, DOM, Text, Mouse").attr({
        w: container._w, 
        h: fontsize, 
        x: container._x, 
        y: container._y + index*margin,
        z: 99
    })
    .text(message)
    .css(css_text_clickable)
    .bind("MouseOver", function(e){
        this.text("> " + message);
    })
    .bind("MouseOut", function(e){
        this.text(message);
    });
    
    return txt_clickable;
}

/*
 * Create a static text
 */
function GUI_createText_static(x, y, message, fontsize)
{
    var css_text_static = css_text_general;
    css_text_static["font-size"] = fontsize+"px";
    css_text_static["text-align"] = "left";
    css_text_static["cursor"] = "default";
    
    var txt_static = Crafty.e("2D, DOM, Text").attr({
        w: Crafty.viewport.width, 
        h: fontsize, 
        x: x, 
        y: y,
        z: 99
    })
    .text(message)
    .css(css_text_static);
    
    return txt_static;
}

/*
 * Create a static text using a container to center it and place it properly
 */
function GUI_createText_static_container(container, message, fontsize, index)
{
    var css_text_static_container = css_text_general;
    css_text_static_container["font-size"] = fontsize+"px";
    css_text_static_container["cursor"] = "default";
    
    var margin = fontsize;
    if(index == 1) margin = (container._h/10) +5;
    
    var txt_static = Crafty.e("2D, DOM, Text").attr({
        w: container._w, 
        h: fontsize, 
        x: container._x, 
        y: container._y + index*margin,
        z: 99
    })
    .text(message)
    .css(css_text_static_container);
    
    return txt_static;
}