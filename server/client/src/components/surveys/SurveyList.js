import React from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends React.Component {
	componentDidMount() {
		this.props.fetchSurveys();
	}

	renderGrid = () => {
		return this.props.surveys.reverse().map(survey => {
			return (
				<div className="card darken-1" key={survey._id}>
					<div className="card-content">
						<span className="card-title">{survey.title}</span>
						<p>
							{survey.body}
						</p>
						<p className="right">
							Sent On: {new Date(survey.dateSent).toLocaleString()}
						</p>
					</div>
					<div className="card-action">
						<a>Yes: {survey.yes}</a>
						<a>No: {survey.no}</a>
					</div>
				</div>
			);
		});
	}

	render() {
		return (
			<div>
				{this.renderGrid()}
			</div>
		);
	}
}

const mapStateToProps = ({ surveys }) => {
	return { 
		surveys
	};
};

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);