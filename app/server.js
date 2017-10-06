#!/usr/bin/env node

var express = require('express'),
    app     = express(),
	server  = require('http').Server(app),
	io      = require('socket.io')(server),
	cors    = require('cors'),
	path    = require('path');
	router  = express.Router(),
	http    = require('http');

app.use(cors());

var interval = null;

interval = setInterval(function(){
	console.log("Hello");

	var response = '';
	var req      = http.request({
		host  : 'localhost',
		port  : 8004,
		path  : '/vol/news/',
		method: 'GET',
	}, function(res) {
		console.log(`STATUS: ${res.statusCode}`);
		console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

		res.setEncoding('utf8');

		res.on('data', (chunk) => {
			response = response + chunk;
		});
		res.on('end', () => {
			console.log(JSON.parse(response));
		});
	});

	req.on('error', (e) => {
		console.log(`problem with request: ${e.message}`);
	});

	req.end();
}, 1000); //End of setInterval

app.listen(8005);
module.exports = app;
