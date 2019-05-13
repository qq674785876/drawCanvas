var ws = require("nodejs-websocket")

var AllUserData = new Array()
var userNum = 0
// Scream server example: "hi" -> "HI!!!"

var server = ws.createServer(function (conn) {
    userNum++;
    var myName = '';
    AllUserData.push({
        'user': conn
    })

    conn.on("text", function (jsonData) {
        var obj = {};
        for(var i = 0 ; i < AllUserData.length; i++){
            obj = JSON.parse(jsonData);
            if(obj.dataType === 'chatInfo'){
                if(AllUserData[i].user !== conn){
                    obj.cont = myName + '说（' + dateFtt('hh:mm:ss', new Date()) + '）：' + obj.cont;
                }else{
                    obj.isMe = true;
                    obj.cont = '我说（' + dateFtt('hh:mm:ss', new Date()) + '）：' + obj.cont;
                }
            }else if(obj.dataType === 'setMyName'){
                myName = AllUserData[i].name = obj.cont;
                obj.onlineUserNum = userNum;
                obj.cont = AllUserData[i].name + '加入房间，目前房间人数为' + userNum + '人';
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
                        isOut: true,
                        name: AllUserData[0].name,
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