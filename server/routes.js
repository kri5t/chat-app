/**
 * Created by kristian on 12/05/15.
 */

var mongoose = require('mongoose'),
	Message = mongoose.model('Message');

module.exports = function(app, indexPath){
	app.get('/messages/from', function(req, res){
		var date = new Date(req.query.date);
		Message.where('date').gt(date).exec(function(err, messages){
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

	app.get('/', function(req, res){
		res.sendFile(indexPath);
	});

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
};