const helper = require('@sendgrid/mail');
const keys = require('../config/keys');

const Mailer = async ({ subject, recipients }, content) => {
	setApiKey();
	const recipientsTreated = mapRecipients(recipients);
	const message = buildMessage(recipientsTreated, subject, content);
	await helper.sendMultiple(message);
};

function buildMessage(recipientsTreated, subject, content) {
	return {
		to: recipientsTreated,
		from: 'gabrielrcpereira@gmail.com',
		subject,
		text: 'and easy to do anywhere, even with Node.js',
		html: content
	};
}

function setApiKey() {
	helper.setApiKey(keys.sendGridKey);
}

function mapRecipients(recipients) {
	return recipients.map(({ email }) => email);
}

module.exports = Mailer;