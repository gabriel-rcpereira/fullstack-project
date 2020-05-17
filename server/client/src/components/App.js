import  React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';
import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew';

//FIXME
import axios from 'axios';
window.axios = axios;

class App extends Component {
	componentDidMount() {
		this.props.fetchUser();
	}

	render() {
		return (
			<div className="container">
				<BrowserRouter>
					<div className="container">
						<Header />
						<Route exact path="/" component={Landing} ></Route>
						<Route exact path="/surveys" component={Dashboard} ></Route>
						<Route path="/surveys/new" component={SurveyNew} ></Route>
					</div>
				</BrowserRouter>
			</div>
		);
	}
}

export default connect(null, actions)(App);