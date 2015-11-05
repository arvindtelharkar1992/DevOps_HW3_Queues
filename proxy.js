var http      = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis')
var express = require('express')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
console.log('Proxy server listening at Port 3010')
client.lpush("availablePorts",'3000')
client.lpush("availablePorts",'3001')

var options = {};
var proxy   = httpProxy.createProxyServer(options);
var server  = http.createServer(function(req, res)
{
	client.rpoplpush('availablePorts','availablePorts',function(err,value) {
		if (err) throw err;
		proxy.web( req, res, {target: "http://127.0.0.1:"+value } );
		console.log("Redirecting to : http://127.0.0.1:"+value)
	})
});
server.listen(3010);