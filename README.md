Assignment 3
=========================

### Setup

* Run `npm install`.
* Install redis and run on localhost:6379
* The file main.js has the code for routes /get, /set, /upload, /meow and /recent. The file proxy.js demonstrates a proxy      server using a simple redirect method. The file can be run using the following command from the git shell command line.

        node main.js

The tasks are explained as below and the code files main.js and proxy.js have the comments to show each task:

## Task 1: Complete set/get

* Run the server using 'node main.js'. The server is listening at ports 3000 and 3001.
* Run localhost:3000 in the browser. 
* Run localhost:3000/set. This will store the key-value pair in database.
* Run localhost:3000/get. This will display the message 'This message will self-destruct in 10 secs'
* Try localhost:3000/get again in 10 secs. The message will dissapear from screen because expire function sets the timer for   the message as 10 sec.
* Output:

![/set route]()


![/get route]()


![/get route after expiry]()



## Task 2: Complete /recent

* Run localhost:3000/set, localhost:3000/get and then localhost:3000/recent any number of times, the page displays the urls    visited. It will show 5 urls and it keeps on changing with each visiting url and page refresh. It shows the latest 5 urls.   The urls are displayed as below (in command line):

        $ node main.js
        Example app listening at http://:::3000
        Example app listening at http://:::3001
        [ '/recent', '/get', '/set', '/set', '/get' ]
        [ '/recent', '/meow', '/meow', '/meow', '/recent' ]

* Output

![/recent route]()


## Task 3: Complete upload/meow

* While the server is listening at localhost:3000, upload the images using the command below (in another git window). In       place of 'image=@C:\Users', give the complete path of the image file. You can load any number of images using the command    below. 


        $ curl -F "image=@C:\Users\parulpep\Documents\GitHub\Queues/img/morning.jpg" localhost:3000/upload


* Then, run localhost:3000/meow, the latest uploaded image is shown. With each refresh, the next image in list is shown thus showing removal of the displayed image.
*  Output:

![/meow route]()

## Task 4: Additional service instance running

* When the main.js file is run, we can see two server instances running at port 3000 and 3001. 
* The above routes will run succesfully on the instance localhost:3001.

## Task 5: Proxy server

* Run proxy.js using the command 'node proxy.js'
* If we try running localhost:3002, it will get redirected to localhost:3000.
* 3002 acts as a proxy server. 
