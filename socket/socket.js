var ws = require("nodejs-websocket")

var AllUserData = new Array()
var userNum = 0
// Scream server example: "hi" -> "HI!!!"

var server = ws.createServer(function (conn) {
    userNum++;
    var myName = '玩家' + userNum;
    AllUserData.push({
        'user': conn,
        'name': '玩家' + userNum
    })

    var sendText = '';
    for(var i = 0 ; i < AllUserData.length; i++){
        sendText = {
            dataType: 'onlineUserNum',
            onlineUserNum: userNum,
            cont: ''
        };
        if(AllUserData[i].user == conn){
            sendText.cont = myName + '加入房间，目前房间人数为' + userNum + '人';
            // console.log(sendText);
        }else{
            sendText.cont = myName + '加入房间，目前房间人数为' + userNum + '人';
        }
        AllUserData[i].user.sendText(JSON.stringify(sendText));
    }
    conn.on("text", function (jsonData) {
        var obj = {};
        for(var i = 0 ; i < AllUserData.length; i++){
            obj = JSON.parse(jsonData);
            if(obj.dataType !== 'base64'){
                if(AllUserData[i].user !== conn){
                    obj.cont = myName + '说（' + dateFtt('hh:mm:ss', new Date()) + '）：' + obj.cont;
                }else{
                    obj.isMe = true;
                    obj.cont = '我说（' + dateFtt('hh:mm:ss', new Date()) + '）：' + obj.cont;
                }
            }
            AllUserData[i].user.sendText(JSON.stringify(obj));
        }
        // conn.sendText(str.toUpperCase() + i);
    })
    conn.on("close", function (code, reason) {
        userNum--;
        // 当用户退出的时候捕捉到退出的用户
        for (var i=0 in AllUserData) {
            if (AllUserData[i].user == conn) {
                AllUserData.splice(i, 1);
                for(var i = 0 ; i < AllUserData.length; i++){
                    sendText = {
                        dataType: 'onlineUserNum',
                        onlineUserNum: userNum,
                        cont: ''
                    };
                    sendText.cont = myName + '已退出房间，目前房间人数为' + userNum + '人';
                    AllUserData[i].user.sendText(JSON.stringify(sendText));
                }
            }
        }
    })
}).listen(8001)


function dateFtt(fmt,date)   
{ //author: meizz
  var o = {   
    "M+" : date.getMonth()+1,                 //月份
    "d+" : date.getDate(),                    //日
    "h+" : date.getHours(),                   //小时
    "m+" : date.getMinutes(),                 //分
    "s+" : date.getSeconds(),                 //秒
    "q+" : Math.floor((date.getMonth()+3)/3), //季度
    "S"  : date.getMilliseconds()             //毫秒
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 