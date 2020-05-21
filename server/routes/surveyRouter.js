const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');

const requireLogin = require('../middlewares/requireLogin');
const requireCredit = require('../middlewares/requireCredit');

const mongoose = require('mongoose');
const Survey = mongoose.model('surveys');

const mailer = require('../services/Mailer');
const surveyTemplate = require('../emailTemplate/surveyTemplate');

module.exports = app => {	

	app.get('/api/surveys/thanks', (req, res) => {
		const message = 'Thanks for your answer!';
		res.status(200).send(message);
	});

	app.post('/api/surveys/webhook', (req, res) => {
		const p = new Path('/api/surveys/:surveyId/:choice');
		try {
			_.chain(req.body)
				.map(req.body, ({ email, url }) => {
					const match = p.test(new URL(url).pathname);
					if (match) {
						return {
							surveyId: match.surveyId,
							choice: match.choice,
							email
						};
					}
				})
				.compact()
				.uniqBy('email', 'surveyId')
				.each((surveyId, email, choice) => {
					Survey.updateOne({
						_id: surveyId,
						recipients: {
							$elemMatch: { email, responded: false }
						}
					}, {
						$inc: { [choice]: 1 },
						$set: { 'recipients.$.responded': true }
					}).exec();
				})
				.value();
		} catch (error) {
			console.error(error);
		}

		res.status(200).send();
	});

	app.get('/api/surveys', requireLogin, async (req, res) => {	
		const surveyFilter = { _user: req.user.id };
		const excludeColumn = { recipients: false };
		const surveys = await Survey.find(surveyFilter)
			.select(excludeColumn);

		res.status(200).send(surveys);
	});	

	app.post(
		'/api/surveys', 
		requireLogin, requireCredit, 
		async (req, res) => {
			const { title, subject, body, recipients } = req.body;
			const survey = new Survey({
				title,
				subject,
				body,
				recipients,
				_user: req.user.id,
				dateSent: Date.now()
			});

			try {
				await mailer(survey, surveyTemplate(survey));
				await survey.save();
				const userSaved = await discountUserCredit(req);

				res.status(201).send(userSaved);
			} catch (error) {
				res.status(422).send(error);
			}
		});	

	app.delete('/api/surveys/:id', requireLogin, async (req, res) => {
		await Survey.deleteOne({ _id: req.params.id });
		res.status(204).send();
	});

};

function discountUserCredit(req) {
	const creditToDiscountAfterSendEmail = 1;
	req.user.credits -= creditToDiscountAfterSendEmail;
	return req.user.save();
}
