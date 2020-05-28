const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');

const requireLogin = require('../middlewares/requireLogin');
const requireCredit = require('../middlewares/requireCredit');

const mongoose = require('mongoose');
const Survey = mongoose.model('surveys');
const { DRAFT, SENT } = require('../models/surveyStatus');

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
		const columnToExclude = { recipients: false };
		const surveys = await Survey.find(surveyFilter)
			.select(columnToExclude);

		res.status(200).send(surveys);
	});	

	app.post(
		'/api/v2/surveys/drafts', 
		requireLogin, 
		async (req, res) => {
			const user = req.user;
			await saveSurveyDraft(req.body, user.id);

			res.status(201).send(user);
		}
	);

	app.post(
		'/api/v2/surveys/:id', 
		requireLogin, requireCredit,
		async (req, res) => {
			const surveyUpdated = await updateSurveyToSent(req.params.id);
			await mailer(surveyUpdated, surveyTemplate(surveyUpdated));			
			const userSaved = await discountUserCredit(req);

			res.status(208).send(userSaved);
		}
	);

	app.post(
		'/api/surveys', 
		requireLogin, requireCredit, 
		async (req, res) => {
			try {
				const surveySaved = await saveSurveySent(req.body, req.user.id);
				await mailer(surveySaved, surveyTemplate(surveySaved));
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

async function saveSurveySent(survey, userId) {
	const { title, subject, body, recipients } = survey;
	const surveySaved = new Survey({
		title,
		subject,
		body,
		recipients,
		_user: userId,
		dateSent: Date.now(),
		status: SENT
	});
	await surveySaved.save();
	return surveySaved;
}

async function updateSurveyToSent(surveyId) {
	const byIdFilter = { _id: surveyId };
	const fieldsToUpdate = {
		dateSent: Date.now(),
		status: SENT
	};
	const configToReturnUpdated = { returnOriginal: false };
	
	const surveyUpdated = await Survey.findOneAndUpdate(byIdFilter, fieldsToUpdate, configToReturnUpdated);

	return surveyUpdated;
}

async function saveSurveyDraft(survey, userId) {
	const { title, subject, body, recipients } = survey;
	const surveySaved = new Survey({
		title,
		subject,
		body,
		recipients,
		_user: userId,
		status: DRAFT
	});
	await surveySaved.save();
}

function discountUserCredit(req) {
	const creditToDiscountAfterSendEmail = 1;
	req.user.credits -= creditToDiscountAfterSendEmail;
	return req.user.save();
}
