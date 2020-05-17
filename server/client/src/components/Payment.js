import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

import StripeCheckout from 'react-stripe-checkout';

class Payment extends Component {

	sendToken = (token) => {
		this.props.handleToken(token);
	}

	render() {
		return (
			<StripeCheckout
				name="EmailyApp"
				description="$5 for 5 e-mails"
				amount={500}
				token={this.sendToken}
				stripeKey={process.env.REACT_APP_STRIPE_KEY} 
			>
				<button className="btn" >Add Credits</button>
			</StripeCheckout>
		);
	}
}

export default connect(null, actions)(Payment);