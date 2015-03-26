var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var redis = require('redis')
var client = redis.createClient(6379, '127.0.0.1', {})


///////////// WEB ROUTES 


// Add hook to make it easier to get all visited URLS.
app.get('/recent', function(req, res, next) 
{
	 //  console.log(req.method, req.url);
       client.lpush('urls',req.url);
	   
	   client.ltrim('urls', 0, 4);
	  
	   client.lrange('urls',0, 4, function(err,value){ console.log(value);});
	   client.lrange('urls',0, 4, function(err,value){ res.send(value);});
       	   
	  // next(); // Passing the request to the next handler in the stack.   
	        
});

var items = [];
 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
//    console.log(req.body) // form fields
//    console.log(req.files) // form files
    
    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
			items.push(img);
 	  	//	console.log(img);
 		});
 	}
   res.status(204).end()
 }]);

app.get('/meow', function(req, res) {
 	{
	    client.lpush('urls',req.url);
 	//	if (err) throw err
 		res.writeHead(200, {'content-type':'text/html'});
 		items.forEach(function (imagedata) 
 		{
    		temp_Image = imagedata;
		//	console.log(imagedata);
 		});
		res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+temp_Image+"'/>");
		items.pop();
    	res.end();
 	}
 })
 

// HTTP SERVER
 var server = app.listen(3000, function () {

   var host = server.address().address
   var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
 })
 
 // HTTP SERVER
 var server1 = app.listen(3001, function () {

   var host = server1.address().address
   var port = server1.address().port

   console.log('Example app listening at http://%s:%s', host, port)
 })
 
 
 app.get('/get', function(req, res) {
  client.get("key", function(err,value){ res.send(value) });
  //res.send('hello world')
    client.lpush('urls',req.url);
 //  res.send(client.get("key"));
})

 app.get('/set', function(req,res) {
  client.lpush('urls',req.url);
  client.set("key","this message will self-destruct in 10 seconds");
  client.expire("key",10);
})

