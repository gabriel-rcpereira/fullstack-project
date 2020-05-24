import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import _ from 'lodash';

import './styles/Survey.scss';

import formFields from './formFields';
import * as actions from '../../actions';

const SurveyReview = ({ onCancel, values, submitSurvey, history }) => {
	const fieldsToReview = _.map(formFields, ({ name, label }) => {
		return (
			<div key={name}>
				<label>{label}</label>
				<div>
					{values[name]}
				</div>
			</div>
		);
	});

	return (
		<div>
			<h5>Please confirm your entries</h5>
			<div className="form-new-survey">
				{fieldsToReview}
			</div>
			<button 
				className="yellow darken-3 btn-flat" 
				onClick={onCancel}>
					Cancel
			</button>
			<button
				className ="green btn-flat right custom-button"
				onClick={() => submitSurvey(values, history)}
			>
				Send
				<i className="material-icons right">send</i>
			</button>
			<button 
				className ="green btn-flat right custom-button"
			>
				Save
				<i className="material-icons right">save</i>
			</button>				
		</div>
	);
};

const mapStateToProps = ({ form: { surveyForm: { values } }}) => {
	return {
		values
	};
};

export default connect(mapStateToProps, actions)(withRouter(SurveyReview));