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

'''
$ curl -F "image=@C:\Users\parulpep\Documents\GitHub\Queues/img/morning.jpg" localhost:3000/upload
'''

* Then, run localhost:3000/meow, the latest uploaded image is shown. With each refresh, the next image is shown thus showing removal of the displayed image.


## Task 4: Additional service instance running

* When the main.js file is run, we can see two server instances running at port 3000 and 3001. 
* The above routes will run succesfully on the instance localhost:3001.

## Task 5: Proxy server

* Run proxy.js using the command 'node proxy.js'
* If we try running localhost:3002, it will get redirected to local:3000.
* 3002 acts as a proxy server. 


### Cat picture uploads: queue

Implement two routes, `/upload`, and `/meow`.
 
A stub for upload and meow has already been provided.

Use curl to help you upload easily.

      	curl -F "image=@./img/morning.jpg" localhost:3000/upload

Have `upload` store the images in a queue.  Have `meow` display the most recent image to the client and *remove* the image from the queue.

### Proxy server

Bonus: How might you use redis and express to introduce a proxy server?

See [rpoplpush](http://redis.io/commands/rpoplpush)
