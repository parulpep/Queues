var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var redis = require('redis')
var client = redis.createClient(6379, '127.0.0.1', {})


// Task 2
// Add hook to make it easier to get all visited URLS.
app.get('/recent', function(req, res, next) 
{
	 //  console.log(req.method, req.url); 
	 // lpush is to store the site urls visited
       client.lpush('urls',req.url);
	 // ltrim and lrange used below is to contain the number of urls to 5  
	   client.ltrim('urls', 0, 4);
	  
	   client.lrange('urls',0, 4, function(err,value){ console.log(value);});
	   client.lrange('urls',0, 4, function(err,value){ res.send(value);});  // Returning the recent visited urls back to client
       	   
	  // next(); // Passing the request to the next handler in the stack.   
	        
});

// Task 3
var items = [];
 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
//    console.log(req.body) // form fields
//    console.log(req.files) // form files
    
    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
			items.push(img);                      // On upload, the images are put in the queue list items
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
		res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+temp_Image+"'/>");     // For displaying the most recent image to the client
		items.pop();       // For deleting the recently displayed image
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
 // Task 4
 // Running another instance on different port (number 3001)
 var server1 = app.listen(3001, function () {

   var host1 = server1.address().address
   var port1 = server1.address().port

   console.log('Example app listening at http://%s:%s', host1, port1)
 })
 
 // Task 1: /get route
 app.get('/get', function(req, res) {
  client.get("key", function(err,value){ res.send(value) });
 
  client.lpush('urls',req.url);
 
})
// Task 1: /set route
 app.get('/set', function(req,res) {
  client.lpush('urls',req.url);
  client.set("key","this message will self-destruct in 10 seconds");
  client.expire("key",10);    // This will expire the key.
})

