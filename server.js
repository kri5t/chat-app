var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	express = require('express'),
	mongoose = require('mongoose'),
	config = require('./server/config.js');

//Setup mongoDb for persisting messages:
mongoose.connect(config.db);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {});

require('./server/message-model.js');
//End: Setup mongoDb

app.use(express.static('public'));

//Routes:
require('./server/routes.js')(app, (__dirname + '/index.html'));
//End: Routes

//Socket io:
require('./server/socketio.js')(io);
//End: Socket io

http.listen(config.port, function(){
	console.log('listening on *:'+config.port);
});