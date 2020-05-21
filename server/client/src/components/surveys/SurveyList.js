import React from 'react';
import { connect } from 'react-redux';

import axios from 'axios';

import { fetchSurveys } from '../../actions';

import ModalConfirm from '../modals/ModalConfirm';

class SurveyList extends React.Component {

	state = {
		surveyIdToDelete: null,
		surveyTitleToDelete: null
	}

	componentDidMount() {
		this.props.fetchSurveys();
	}

	renderScreen = () => {
		const surveys = this.props.surveys;

		if (surveys && surveys.length > 0) {
			return this.renderGrid();
		}
		
		return this.renderNoSurveysMessage();		
	}

	setModalRef = (e) => {
		this.modalRef = e;
	}
	
	renderNoSurveysMessage = () => {
		return (
			<h5 className="center-align">
				You could start creating a new Survey
			</h5>
		);
	}
	
	handleDeleteSurvey = ({ _id, title }) => {
		this.setSurveyToDelete(_id, title);
		this.modalRef.click();
	}
	
	deleteSurvey = async () => {
		await axios.delete(`/api/surveys/${this.state.surveyIdToDelete}`);
		this.props.fetchSurveys();
	}

	setSurveyToDelete = (id, title) => {
		this.setState({
			surveyIdToDelete: id, 
			surveyTitleToDelete: title
		});
	}

	cleanSurveyIdToDelete = () => {
		this.setState({
			surveyIdToDelete: null,
			surveyTitleToDelete: null
		});
	}

	renderGrid = () => {
		return this.props.surveys.reverse().map(survey => {
			return (
				<div className="card teal lighten-4" key={survey._id}>
					<div className="card-content">
						<span className="card-title">{survey.title}</span>
						<p>
							{survey.body}
						</p>
						<p className="right">
							Sent On: {new Date(survey.dateSent).toLocaleString()}
						</p>
					</div>
					<div className="card-action teal lighten-2">
						<a className="white-text">Yes: {survey.yes}</a>
						<a className="white-text">No: {survey.no}</a>
						<div className="right">
							<button className="teal lighten-2 btn-flat right black-text" onClick={() => this.handleDeleteSurvey(survey)}>
								<i className="small material-icons">delete</i>
							</button>
						</div>
					</div>
				</div>
			);
		});
	}

	render() {
		return (
			<div>
				<ModalConfirm 
					modalRef={this.setModalRef} 
					modalTitle={'Confirm'} 
					onOk={this.deleteSurvey} 
					onCloseEnd={this.cleanSurveyIdToDelete} 
				>
					The Survey <b>{this.state.surveyTitleToDelete}</b> will be deleted. Could you confirm?
				</ModalConfirm>
				{this.props.surveys && this.props.surveys.length > 0 ? this.renderGrid() : this.renderScreen()}
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