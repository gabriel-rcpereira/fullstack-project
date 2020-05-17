// eslint-disable-next-line no-useless-escape
const emailMatcher = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default (emails) => {
	
	const invalidEmails = emails.split(',')
		.map(email => email.trim())
		.filter(email => email && emailMatcher.test(email) === false);

	if (invalidEmails.length) {
		return `Invalid emails: ${invalidEmails}`;
	}
	
	return;
};