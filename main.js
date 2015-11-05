var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);
	client.lpush("sites",req.url);
	client.ltrim("sites",0,4);
	next(); // Passing the request to the next handler in the stack.
});

app.get('/', function(req, res) {
  res.send('hello world from localhost:'+process.argv[2])
})

app.get('/set', function(req, res) {
 client.set("key", "this message will self-destruct in 10 seconds");
 client.expire("key",10);
  res.send('set key value')
})

app.get('/get', function(req, res) {
client.get("key", function(err,value){
	res.send(value)});
})

app.get('/recent', function(req, res) {
client.lrange("sites",0,4,function(err,val){
	res.send(val);
})
})

app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files

    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
 	  		console.log(img);
 	  		client.rpush("images",img)
 		});
 	}

    res.status(204).end()
     }]);

app.get('/meow', function(req, res) {
 	
 	
 		client.lpop("images",function(err,val){
 	    //if(err) throw err;
 	    res.writeHead(200, {'content-type':'text/html'});
 		res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+val+"'/>");	
        res.end();
 		})
 })

// HTTP SERVER
var port_number = process.argv[2];
var server = app.listen(port_number, function () {
var host = server.address().address
var port = server.address().port
console.log('Example app listening at http://%s:%s', host, port_number)
})

