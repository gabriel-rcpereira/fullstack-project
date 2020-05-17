import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';

import _ from 'lodash';

import formFields from './formFields';
import validateEmails from '../../utils/validateEmails';

import SurveyField from './SurveyField';

class SurveyForm extends React.Component {
	
	renderFields = () => {
		return _.map(formFields, ({ name, label }) => {
			return (
				<Field 
					key={name} 
					type="text" 
					name={name} 
					label={label} 
					component={SurveyField} 
				/>
			);
		});
	}
	
	render() {
		return (
			<form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
				{this.renderFields()}
				<Link to="/surveys" className="red btn-flat left white-text" >Cancel</Link>
				<button type="submit" className="teal btn-flat right white-text">
					Next
					<i className="material-icons right">done</i>
				</button>
			</form>
		);
	}
}

function validate(values) {
	const errors = {};

	errors.recipients = validateEmails(values.recipients || '');

	_.each(formFields, ({ name, errorMessage }) => {
		if (!values[name]) {
			errors[name] = errorMessage;
		}
	});

	return errors;
}

const reduxFormConfigs = {
	validate,
	form: 'surveyForm',
	destroyOnUnmount: false
};
export default reduxForm(reduxFormConfigs)(SurveyForm);