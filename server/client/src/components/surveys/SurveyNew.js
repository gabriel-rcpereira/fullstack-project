import React from 'react';

import SurveyForm from './SurveyForm';
import SurveyReview from './SurveyReview';

class SurveyNew extends React.Component {
	state = { showReview: false };

	renderForm = () => {
		if (this.state.showReview) {
			return (
				<SurveyReview onCancel={this.showNewForm}/>
			);
		}
			
		return (
			<SurveyForm onSurveySubmit={this.showReviewForm} />
		);
	}

	showReviewForm = () => {
		this.setState({ showReview: true });
	}

	showNewForm = () => {
		this.setState({ showReview: false });
	}

	render() {
		return (
			<div>
				{ this.renderForm() }
			</div>
		);
	}
}

export default SurveyNew;