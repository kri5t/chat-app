var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	express = require('express'),
	moment = require('moment'),
	mongoose = require('mongoose');

//Setup mongoDb for persisting messages:
mongoose.connect('mongodb://localhost/chat-app');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

});

var messageSchema = mongoose.Schema({
	name: String,
	date: Date,
	stamp: String,
	message: String
});

var Message = mongoose.model('Message', messageSchema);
//End: Setup mongoDb

app.use(express.static('public'));

//Routes:
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/messages', function(req, res){
	Message.find(function(err, messages){
		var sortedMessages = {};

		for(var i = 0; i < messages.length; i++){
			var message = messages[i];
			sortedMessages[message.stamp] = message;
		}

		res.send({messages: sortedMessages});
	});
});
//End: Routes

//Socket io:
io.on('connection', function(socket){
	socket.on('message', function(msg){
		var savedTime = moment().add(-2, 'hours');
		var message = new Message();
		message.stamp = savedTime.format("YYYY-MM-DDTHH:mm:SSS");
		message.name = "kri5t";
		message.date = savedTime;
		message.message = msg;

		message.save(function(err, message){
			io.emit('message', message);
		});
	});
});
//End: Socket io

http.listen(3000, function(){
	console.log('listening on *:3000');
});