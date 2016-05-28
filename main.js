var http = require('http');
var request = require('request');
var io = require('socket.io-client');
var api = require('./api.js');
var config = {
    baseurl: 'http://sonicfanon.wikia.com',
    chatpath: '/wikia.php?controller=Chat&format=json',
    apipath: '/api.php?action=query&meta=siteinfo&siprop=wikidesc&format=json',
    port: 80,
    username: 'gamedezyner'
}
var serverinfo = {};
function fetchInfo(callback) {
    request.get({
        url: config.baseurl + config.chatpath,
        json: true
    }, function(error,res,body){
        serverinfo.chatinfo = body;
        request.get({
            url: config.baseurl + config.apipath,
            json: true
        }, function(error,res,body){
            serverinfo.apiinfo = body;
            serverinfo.request_options = {
                name: config.username,
                key: serverinfo.chatinfo.chatkey,
                roomId: serverinfo.chatinfo.roomId,
                wikiId: serverinfo.apiinfo.query.wikidesc.id,
                serverId: serverinfo.apiinfo.query.wikidesc.id,
                EIO: 2,
                transport: 'polling'
            };
            callback();   
        })
    })
}
function connect() {
    //socket = io.connect("http://127.0.0.1:8088",{
    socket = io.connect(serverinfo.chatinfo.chatServerHost,{
        'force new connection': true,
        'try multiple transports': true,
        'query': serverinfo.request_options,
        'connect timeout': false,
        'max reconnection attempts': 8,
        'reconnect': true,
        'transports': [ 'polling' ]
    });
    socket.on('message',function(data){
        console.log('message')
    });
    socket.on('connect',function(data){
        console.log("connect");
        console.log(data);
    });
    socket.on('reconnecting',function(){
        console.log("connect");
    }); 
    
}

api.login('SFWBOT','PASSWORD',config.baseurl,function(){
    fetchInfo(connect);
});

