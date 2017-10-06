var express     = require('express'),
    app         = express(),
	server      = require('http').Server(app),
	io          = require('socket.io')(server),
	router      = express.Router(),
	http        = require('http');

setInterval(function(){
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

// Alert.getAlert(function(warning){
// 	res.setHeader('Content-Type', 'application/json');
// 	res.send(JSON.stringify(warning));
// })

module.exports = router;
