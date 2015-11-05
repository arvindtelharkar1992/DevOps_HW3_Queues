Cache, Proxies, Queues
=========================

### Running main.js
 We Run the main.js file by specifying the port number as a command line argument. Hence for running the server on port 3000,
  we run the command
  ```
  nodejs main.js 3000
  ```


### Routes /get and /set
The /set route is used for setting a key in redis with the value "this message will self-destruct in 10 seconds". We run the following command to achieve the same:
```
curl localhost:3000/set
```

After the key has been set, the value persists for 10 seconds and can be retrieved using the /get route. We run the following command to verify the same:
```
curl localhost:3000/get
```
If the above command is executed after a time interval which is more than 10 seconds after setting the key value, the value cannot be recovered since the key is set to expire after 10 seconds

### Route /recent
The /recent gives the lastest 5 sites visited. The lpush,ltrim and lrange commands have been used to achieve the same. The related command is
```
curl localhost:3000/recent
```

### Routes /upload and /meow
The commands rpush and lpop are used to push images in a queue and then retrieve them back. The upload can be completed using the following command:
```
curl -F "image=@./img/morning.jpg" localhost:3000/upload
```
The upload can be tested by navigating to the browser and entering the following url
```
localhost:3000/meow
```

### Additional Service Instance
Another service instance can be run by specifying a different port which is 3001 in this case. The following command can be run to have another service instance running:
```
nodejs main.js 3001
```

### Proxy server
To demonstrate the operation of the proxy server, first we start 2 instances on ports 3000 and 3001 respectively(the commands for which are provided in the above discussion). Next, we start the proxy server on port 3010 by the following command
```
nodejs proxy.js
```
After the proxy server is up, we send a request to the proxy server by running
```
curl localhost:3010
```
The rpoplpush command is used for implementing the proxy mechanism. The redirection of requests can be seen in the screencasts.

### Screencast
[Caches, Proxies and Queues](https://youtu.be/2DJC813qm7U)
