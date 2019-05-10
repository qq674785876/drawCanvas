var ws = require("nodejs-websocket")

var AllUserData = new Array()
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    AllUserData.push({
        'user': conn
    })

    var sendText = '';
    console.log(conn)
    for(var i = 0 ; i < AllUserData.length; i++){
        sendText = JSON.stringify({
            dataType: 'string',
            str: "在线用户数量：" + AllUserData.length
        });
        console.log(sendText);
        AllUserData[i].user.sendText(sendText);
    }
    conn.on("text", function (str) {
        console.log("Received "+str);
        for(var i = 0 ; i < AllUserData.length; i++){
            if(AllUserData[i].user !== conn){
                AllUserData[i].user.sendText(JSON.stringify({
                    'dataType': 'base64',
                    'str': str
                }));
            }
        }
        // conn.sendText(str.toUpperCase() + i);
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
        // 当用户退出的时候捕捉到退出的用户
        for (var i=0 in AllUserData) {
            if (AllUserData[i].user == conn) {
                AllUserData.splice(i, 1);
                console.log("在线用户数量：" + AllUserData.length);
            }
        }
    })
}).listen(8001)