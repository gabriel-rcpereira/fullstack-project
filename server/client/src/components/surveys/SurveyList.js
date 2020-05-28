import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import { fetchSurveys, sendSurvey, deleteSurvey } from '../../actions';

import ModalConfirm from '../modals/ModalConfirm';

const optionsToSort = [
	{ value: '1', label: 'Sent Date', column: 'dateSent'},
	{ value: '2', label: 'Survey Title', column: 'title'}
];

class SurveyList extends React.Component {

	state = {
		surveyIdToDelete: null,
		surveyTitleToDelete: null,
		columnSelectedToSort: null
	}

	componentDidMount() {
		this.props.fetchSurveys();
	}

	setSurveyToDelete = (id, title) => {
		this.setState({
			surveyIdToDelete: id, 
			surveyTitleToDelete: title
		});
	}

	setColumnToSort = columnSelectedToSort => {
		this.setState({ 
			columnSelectedToSort 
		});
	};

	setModalRef = (e) => {
		this.modalRef = e;
	}

	cleanSurveyIdToDelete = () => {
		this.setState({
			surveyIdToDelete: null,
			surveyTitleToDelete: null
		});
	}

	sortSurveys = () => {
		const valueSelected = this.state.columnSelectedToSort;
		const surveys = this.props.surveys;

		if (valueSelected.column === 'title') {
			return surveys
				.sort((a, b) => a.title?.localeCompare(b.title));
		} else {
			return surveys
				.sort((a, b) => a.dateSent?.localeCompare(b.dateSent));
		}
	}
		
	handleDeleteSurvey = (e, { _id, title }) => {
		e.preventDefault();

		this.setSurveyToDelete(_id, title);
		this.modalRef.click();
	}

	handleSendSurvey = (e, { _id }) => {
		e.preventDefault();

		this.props.sendSurvey(_id);
	}
	
	handleOkDelete = (e) => {
		e.preventDefault();

		this.props.deleteSurvey(this.state.surveyIdToDelete);
	}

	renderScreen = () => {
		const surveys = this.props.surveys;

		if (surveys && surveys.length > 0) {
			return (
				<div>
					<div style={{marginTop: '20px'}}>
						<Select
							value={this.state.columnSelectedToSort}
							onChange={this.setColumnToSort}
							options={optionsToSort}
							placeholder="Sort by..."
						/>
					</div>
					{this.renderGrid()}
				</div>
			);
		}
		
		return this.renderNoSurveysMessage();		
	}
	
	renderNoSurveysMessage = () => {
		return (
			<h5 className="center-align">
				You could start creating a new Survey
			</h5>
		);
	}

	renderSentOnMessage = (survey) => {
		return (
			`Sent On: ${new Date(survey.dateSent).toLocaleString()}`
		);
	}

	renderSendButton = (survey) => {
		return (
			<button 
				className="teal lighten-2 btn-flat black-text" 
				onClick={(e) => this.handleSendSurvey(e, survey)}
			>
				<i className="small material-icons">send</i>
			</button>
		);
	}

	renderGrid = () => {
		const surveys = this.state.columnSelectedToSort ? this.sortSurveys() : this.props.surveys;

		return surveys?.map(survey => {
			return (
				<div className="card teal lighten-4" key={survey._id}>
					<div className="card-content">
						<span className="card-title">{survey.title}</span>
						<p>
							{survey.body}
						</p>
						<p className="right">
							{survey.dateSent ? this.renderSentOnMessage(survey) : 'Draft'}
						</p>
					</div>
					<div className="card-action teal lighten-2 white-text">
						<a className="white-text">Yes: {survey.yes}</a>
						<a className="white-text">No: {survey.no}</a>
						<div className="right">
							{ !survey.dateSent && this.renderSendButton(survey) }
							<button className="teal lighten-2 btn-flat right black-text" onClick={(e) => this.handleDeleteSurvey(e, survey)}>
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
					onOk={this.handleOkDelete} 
					onCloseEnd={this.cleanSurveyIdToDelete} 
				>
					The Survey <b>{this.state.surveyTitleToDelete}</b> will be deleted. Could you confirm?
				</ModalConfirm>
				{this.renderScreen()}
			</div>
		);
	}
}

const mapStateToProps = ({ surveys }) => {
	return { 
		surveys
	};
};

export default connect(mapStateToProps, { fetchSurveys, sendSurvey, deleteSurvey })(SurveyList);