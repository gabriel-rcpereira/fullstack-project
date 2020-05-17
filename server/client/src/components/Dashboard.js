import React from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';

import SurveyList from '../components/surveys/SurveyList';

const Dashboard = () => {
	return (
		<div>
			<SurveyList ></SurveyList>
			<div className="fixed-action-btn">
				<Link to="/surveys/new" className="btn-floating btn-large red">
					<i className="material-icons">add</i>
				</Link>
			</div>
		</div>
	);
};

const reduxFormConfigs = {
	form: 'surveyForm'
};
export default reduxForm(reduxFormConfigs)(Dashboard);