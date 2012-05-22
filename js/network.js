/*var configJSON =  {
    name:'Config',
    debug:  true,
    connections:[
    {
        id: "conn",
        url:  "http://developers.realtime.livehtml.net/",
        appKey:  "OL8JGg",
        authToken:  "44ea2b877cf34b10b4b6e7f0e83c7db2",
        active: true,
        authenticate:  false,
        channels:[{
            name:  "Lobby",
            permission:  "write"
        }],
        onsubscribed: onSubscribed
    }]
};

var broadcastJSON =  {
    name:'BroadCast',
    channelId:  "Lobby",
    triggers:[
    {
        name:  "myTrigger"
    }],

    dispatchers:[{
        message:  "{\"xrtml\":{\"trigger\":\"myTrigger\", \"action\":\"delegate\", \"data\":{\"msg\": \"Static Default Message\" }}}"
    }]
};

var executeJSON =  {
    name:'Execute',
    callback:  "callback1",
    receiveOwnMessages: false,
    triggers:[
    {
        name:  "myTrigger"
    }]
 
};

/*Events.Manager.addEventListener(xRTML, 'ready', function() {
    xRTML.createTag(broadcastJSON);
    xRTML.createTag(executeJSON);
    
    console.log("xRTML>>> Created tags");
    
    for(var i= 0, len = configJSON.connections.length; i < len; i++){
        xRTML.createConnection(configJSON.connections[i]);
    }
});*/

var onSubscribed = function (e) {
    console.log("xRTML>>> Subscribed!");
    
    sendMessage();
    sendMyAction();
}

var onConnected = function (e) {
    console.log("xRTML>>> Connected!");
}
                              
function sendMessage() {
    xRTML.createMessage('myTrigger', 'abc', '{ "msg": "Initial Broadcast Message"}');
    console.log("xRTML>>> Initial broadcast message sent");
}

function sendMyAction(){
    xRTML.createMessage("broadcastChangesTrigger", "", '{"action":"myAction", "arg":"myarg"}');
    console.log("xRTML>>> myAction sent");
}

function doSomething(message) {
    console.log("Doing something");
    
    var action = message.data.action;
    
    switch (action){
        case "myAction":
            console.log("xRTML>>> myAction recieved!");
            break;
        default:
            console.log("xRTML>>> No specific action recieved");
            break;
    }                

}