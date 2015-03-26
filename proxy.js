var express = require('express')
var fs      = require('fs')
var app = express()
var redis = require('redis')
var client = redis.createClient(6379, '127.0.0.1', {})
var http=require('http');


// Task 5
// requests to port 3002 are diverted to port 3000
var proxyServer = http.createServer(function(req,res){
	res.writeHead(301, {Location: 'http://localhost:3000'+ req.url});
       //res.redirect("http://localhost:3000" + req.url)
       res.end();
})
proxyServer.listen(3002);

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log('Example app listening at http://%s:%s', host, port)
 })