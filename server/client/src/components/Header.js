import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actions from '../actions';
import Payment from './Payment';


class Header extends Component {
	
	renderLogin = () => {
		return this.props.auth ? 
			this.renderLoggedOptions() : 
			this.renderSignInOption();
	};

	renderSignInOption = () => {
		return (
			<li>
				<a href="/auth/google">Sign in</a>
			</li>
		);
	};

	renderLoggedOptions = () => {
		return [
			<li key={'li_key_logged_1'}>
				<Payment />
			</li>,
			<li key={'li_key_logged_2'} style={{ margin: '0 10px' }}>
				Credits: {this.props.auth.credits}
			</li>,
			<li key={'li_key_logged_3'}>
				<Link to="#" onClick={() => this.props.logoutUserAuthenticated()}>Logout</Link>
			</li>
		];
	};

	render() {
		return (
			<nav>
				<div className="nav-wrapper">
					<Link
						className="left brand-logo"
						to={this.props.auth ? '/surveys' : '/'} >
						EmailyApp
					</Link>
					<ul id="nav-mobile" className="right hide-on-med-and-down">
						{this.renderLogin()}
					</ul>
				</div>
			</nav>
		);
	}
}

const mapStateToProps = ({ auth }) => {
	return {
		auth
	};
};

export default connect(mapStateToProps, actions)(Header);
