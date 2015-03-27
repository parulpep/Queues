Assignment 3
=========================

### Setup

* Run `npm install`.
* Install redis and run on localhost:6379
* The file main.js has the code for routes /get, /set, /upload, /meow and /recent. The file proxy.js demonstrates a proxy      server using a simple redirect method. The server can be instantiated using the following command from the git shell         command line.

node main.js

The tasks are explained as below and the code files main.js and proxy.js have the comments to show each task:

## Task 1: Complete set/get

* Run the server using 'node main.js'. The server is listening at ports 3000 and 3001.
* Run localhost:3000 in the browser. 
* Run localhost:3000/set. This will store the key-value pair in database.
* Run localhost:3000/get. This will display the message 'This message will self-destruct in 10 secs'
* Try localhost:3000/get again in 10 secs. The message will dissapear from screen because expire function sets the timer for   the message as 10 sec.


## Task 2: Complete /recent

* Run localhost:3000/set, localhost:3000/get and then localhost:3000/recent, the page displays the urls visited. This can be done after vising /meow. It will show 5 urls and it keeps on changing with each visiting url and page refresh. It shows the latest 5 urls.

## Task 3: Complete upload/meow

* While the server is listening at localhost:3000, upload the images using the command below. In place of 'image=@C:\Users', give the complete path of your image file. You can load any number of images. 

$ curl -F "image=@C:\Users\parulpep\Documents\GitHub\Queues/img/morning.jpg" localhost:3000/upload

* Then, run localhost:3000/meow, the latest uploaded image is shown. With each refresh, the next image is shown thus showing removal of the displayed image.


## Task 4: Additional service instance running

* When the main.js file is run, we can see two server instances running at port 3000 and 3001. 
* The above routes will run succesfully on the instance localhost:3001.

## Task 5: Proxy server

* Run proxy.js using the command 'node proxy.js'
* If we try running localhost:3002, it will get redirected to local:3000.
* 3002 acts as a proxy server. 









### A simple web server

Use [express](http://expressjs.com/) to install a simple web server.

	var server = app.listen(3000, function () {
	
	  var host = server.address().address
	  var port = server.address().port
	
	  console.log('Example app listening at http://%s:%s', host, port)
	})

Express uses the concept of routes to use pattern matching against requests and sending them to specific functions.  You can simply write back a response body.

	app.get('/', function(req, res) {
	  res.send('hello world')
	})

### Redis

You will be using [redis](http://redis.io/) to build some simple infrastructure components, using the [node-redis client](https://github.com/mranney/node_redis).

	var redis = require('redis')
	var client = redis.createClient(6379, '127.0.0.1', {})

In general, you can run all the redis commands in the following manner: client.CMD(args). For example:

	client.set("key", "value");
	client.get("key", function(err,value){ console.log(value)});

### An expiring cache

Create two routes, `/get` and `/set`.

When `/set` is visited, set a new key, with the value:
> "this message will self-destruct in 10 seconds".

Use the expire command to make sure this key will expire in 10 seconds.

When `/get` is visited, fetch that key, and send value back to the client: `res.send(value)` 


### Recent visited sites

Create a new route, `/recent`, which will display the most recently visited sites.

There is already a global hook setup, which will allow you to see each site that is requested:

	app.use(function(req, res, next) 
	{
	...

Use the lpush, ltrim, and lrange redis commands to store the most recent 5 sites visited, and return that to the client.

### Cat picture uploads: queue

Implement two routes, `/upload`, and `/meow`.
 
A stub for upload and meow has already been provided.

Use curl to help you upload easily.

	curl -F "image=@./img/morning.jpg" localhost:3000/upload

Have `upload` store the images in a queue.  Have `meow` display the most recent image to the client and *remove* the image from the queue.

### Proxy server

Bonus: How might you use redis and express to introduce a proxy server?

See [rpoplpush](http://redis.io/commands/rpoplpush)
