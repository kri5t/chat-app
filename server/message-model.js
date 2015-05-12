/**
 * Created by kristian on 12/05/15.
 */

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
	name: String,
	date: Date,
	stamp: String,
	message: String
});

mongoose.model('Message', messageSchema);