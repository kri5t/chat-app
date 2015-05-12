var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	express = require('express'),
	moment = require('moment'),
	SHA256 = require('crypto-js/sha256'),
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

app.get('/messages/from', function(req, res){
	var date = moment(req.query.date);
	Message.where('date').gt(date.toDate()).exec(function(err, messages){
		var sortedMessages = sortMessages(messages);
		res.send({messages: sortedMessages});
	});
});

app.get('/messages', function(req, res){
	Message.find().exec(function(err, messages){
		var sortedMessages = sortMessages(messages);
		res.send({messages: sortedMessages});
	});
});
//End: Routes

//Socket io:
io.on('connection', function(socket){
	socket.on('message', function(msg){
		var date = moment(msg.date);
		var stamp = SHA256(msg.name+msg.message);

		new Message({
			stamp: date.format('YYYY-MM-DDTHH:mm:ss:SSS') + stamp,
			name: msg.name,
			date: date,
			message: msg.message
		}).save(function(err, message){
			socket.broadcast.emit('message', message);
		});
	});
});
//End: Socket io

//Helpers
function sortMessages(messages){
	var sortedMessages = {};

	for(var i = 0; i < messages.length; i++){
		var message = messages[i];
		sortedMessages[message.stamp] = message;
	}
	return sortedMessages;
}
//End helpers

http.listen(3000, function(){
	console.log('listening on *:3000');
});