import axios from 'axios';
import _ from 'lodash';

import { FETCH_CURRENT_USER, LOGOUT_USER_AUTHENTICATED, FETCH_SURVEYS } from './types';

export const fetchUser = () => async dispatch => {
	const res = await axios.get('/api/users/current');    
	dispatchFetchUser(dispatch, res);
};

export const logoutUserAuthenticated = () => async dispatch => {
	const res = await axios.post('/api/users/logout');
	dispatch({
		type: LOGOUT_USER_AUTHENTICATED,
		payload: res.data
	});
};

export const handleToken = (token) => async dispatch => {
	const res = await axios.post('/api/token', token);
	dispatchFetchUser(dispatch, res);
};

export const submitSurvey = (values, history) => async dispatch => {
	const recipientsTreated = treatRecipients(values);

	const body = { 
		...values, 
		recipients: recipientsTreated
	};
	const res = await axios.post('/api/surveys', body);

	history.push('/surveys');
	dispatchFetchUser(dispatch, res);
};

export const saveSurveyDraft = (values, history) => async dispatch => {
	const recipientsTreated = treatRecipients(values);

	const body = { 
		...values, 
		recipients: recipientsTreated
	};
	const res = await axios.post('/api/v2/surveys/drafts', body);

	history.push('/surveys');
	dispatchFetchUser(dispatch, res);
};

export const sendSurvey = (id) => async dispatch => {
	await axios.post(`/api/v2/surveys/${id}`);
	await dispatchFetchSurveys(dispatch);
};

export const deleteSurvey = (id) => async dispatch => {
	await axios.delete(`/api/surveys/${id}`);
	await dispatchFetchSurveys(dispatch);
};

export const fetchSurveys = () => async dispatch => {
	await dispatchFetchSurveys(dispatch);
};

const dispatchFetchSurveys = async (dispatch) => {
	const res = await axios.get('/api/surveys');
	dispatch({
		type: FETCH_SURVEYS,
		payload: res.data
	});
};

const dispatchFetchUser = (dispatch, res) => {
	dispatch({
		type: FETCH_CURRENT_USER,
		payload: res.data
	});
};

const treatRecipients = (values) => {
	const arr = values.recipients.split(',');
	return _.map(arr, (email) => {
		return {
			email
		};
	});
};