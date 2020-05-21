import React from 'react';
import M from 'materialize-css';
import PropTypes from 'prop-types';

// https://medium.com/@vaibhav1180/how-to-use-materialize-css-modal-in-react-53f9c85ba40d

class ModalConfirm extends React.Component {
	
	componentDidMount() {
		const options = {
		// 	onOpenStart: () => {
		// 		console.log('Open Start');
		// 	},
		// 	onOpenEnd: () => {
		// 		console.log('Open End');
		// 	},
			// onCloseStart: () => {
			// 	console.log('Close Start');
			// },
			onCloseEnd: (e) => {
				this.props.onCloseEnd(e);
			}
		// 	inDuration: 250,
		// 	outDuration: 250,
		// 	opacity: 0.5,
		// 	dismissible: false,
		// 	startingTop: '4%',
		// 	endingTop: '10%'
		};

		M.Modal.init(this.Modal, options);
	}

	setModalRef = (e) => {
		this.Modal = e;
	}

	render() {
		return (
			<div>
				<button
					className="waves-effect waves-light btn modal-trigger"
					data-target="modal1"
					ref={this.props.modalRef}
					style={{display: 'none'}}
				>
          Modal
				</button>

				<div 
					ref={this.setModalRef}
					id="modal1"
					className="modal"
				>
					<div className="modal-content">
						<h4>{this.props.modalTitle}</h4>
						<p>{this.props.children}</p>
					</div>
					<div className="modal-footer">
						<a className="modal-close waves-effect waves-red btn-flat" onClick={this.props.onCancel}>
              Cancel
						</a>
						<button className="modal-close waves-effect waves-green btn-flat" onClick={this.props.onOk}>
              Ok
						</button>
					</div>
				</div>
			</div>
		);
	}
}

ModalConfirm.propTypes = {
	children: PropTypes.element.isRequired,
	modalRef: PropTypes.func.isRequired,
	modalTitle: PropTypes.element.isRequired
};

export default ModalConfirm;