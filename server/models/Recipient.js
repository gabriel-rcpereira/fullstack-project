const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipient = new Schema({
	email: String,
	responded: { type: Boolean, default: false }
});

module.exports = recipient;