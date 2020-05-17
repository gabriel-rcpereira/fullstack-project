import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import _ from 'lodash';

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
			{fieldsToReview}
			<button 
				className="yellow darken-3 btn-flat" 
				onClick={onCancel}>
					Cancel
			</button>
			<button
				className ="green btn-flat right"
				onClick={() => submitSurvey(values, history)}
			>
				Send Survey
				<i className="material-icons right">email</i>
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