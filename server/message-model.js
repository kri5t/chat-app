/**
 * Created by kristian on 12/05/15.
 */

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const messageSchema = mongoose.Schema({
	name: String,
	date: Date,
	stamp: String,
	message: String
});

mongoose.model('Message', messageSchema);