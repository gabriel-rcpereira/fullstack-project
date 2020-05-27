const moongose = require('mongoose');
const { Schema } = moongose;
const RecipientSchema = require('./Recipient');
const { DRAFT } = require('./surveyStatus');

const surveySchema = new Schema({
	title: String,
	body: String,
	subject: String,
	recipients: [RecipientSchema],
	yes: { type: Number, default: 0 },
	no: { type: Number, default: 0 },
	_user: { type: Schema.Types.ObjectId, ref: 'users' },
	dateSent: Date,
	lastResponded: Date,
	status: { type: String, default: DRAFT }
});

moongose.model('surveys', surveySchema);