'use strict'
/**
 * Created by kristian on 12/05/15.
 */
const mongoose = require('mongoose'),
	  Message = mongoose.model('Message'),
	  moment = require('moment'),
	  SHA256 = require('crypto-js/sha256');

module.exports = function(io){
	io.on('connection', function(socket){
		socket.on('message', function(msg){
			const date = moment(msg.date);
			const stamp = SHA256(msg.name+msg.message);

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
};