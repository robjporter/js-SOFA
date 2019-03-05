import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SweetAlert from "react-bootstrap-sweetalert";
import { sha256 } from "js-sha256";
import { SECURITY_ENCRYPTION_KEY } from "../../common/constants";
import { updatePassword } from "../helpers/updatepassword";

class UserPreferences extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this._hideAlert = this._hideAlert.bind(this);
		this._handleCurrentPassword = this._handleCurrentPassword.bind(this);
		this._handleNewPassword = this._handleNewPassword.bind(this);
		this._handleConfirmedPassword = this._handleConfirmedPassword.bind(this);
		this._handleFormSubmission = this._handleFormSubmission.bind(this);
		this._failPasswordChange = this._failPasswordChange.bind(this);
		this._successPasswordChange = this._successPasswordChange.bind(this);

		this.state = {
			show: false,
			isUpdatingPassword: false,
			alert: null,
			password: {
				current: null,
				new: null,
				match: null,
				confirmed: null
			}
		};
	}
	componentDidMount() {
		this._isMounted = true;
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	handleClose() {
		this.setState({
			show: false,
			isUpdatingPassword: false,
			alert: null,
			password: {
				current: null,
				new: null,
				match: null,
				confirmed: null
			}
		});
	}
	handleShow() {
		this.setState({ show: true, isUpdatingPassword: false });
	}
	_handleCurrentPassword(event) {
		let state = Object.assign({}, this.state);
		state.password.current = event.target.value;
		this.setState(state);
	}
	_handleNewPassword(event) {
		let state = Object.assign({}, this.state);
		state.password.new = event.target.value;
		this.setState(state);
	}
	_handleConfirmedPassword(event) {
		let state = Object.assign({}, this.state);
		state.password.confirmed = event.target.value;
		this.setState(state);
	}
	_successPasswordChange(title, message, callBack, style) {
		this.setState({
			alert: (
				<SweetAlert
					success
					title={title}
					onCancel={this._hideAlert}
					onConfirm={callBack()}
				>
					{message}
				</SweetAlert>
			)
		});
	}
	_failPasswordChange(title, message, callBack, style) {
		this.setState({
			alert: (
				<SweetAlert
					danger
					title={title}
					onCancel={this._hideAlert}
					onConfirm={callBack()}
				>
					{message}
				</SweetAlert>
			)
		});
	}
	_hideAlert() {
		console.log("Hiding alert...");
		this.setState({
			alert: null
		});
	}
	_handleFormSubmission(event) {
		event.preventDefault();
		return this._handlePasswordMatch()
			.then(success => {
				if (success) {
					this.setState({ isUpdatingPassword: true });
					updatePassword(
						localStorage.getItem("sofatoken"),
						this.state.password.current,
						this.state.password.confirmed
					)
						.then(response => {
							console.log(response);
							if (response.data.message === "DONE") {
								this.setState({ isUpdatingPassword: false });
								this._successPasswordChange(
									"Password Changed",
									"",
									() => this.handleClose,
									null
								);
							} else {
								this._failPasswordChange(
									"Password Change Failed",
									"",
									() => this.handleClose,
									null
								);
							}
						})
						.catch(err => console.log("ERROR: ", err));
				}
				return "";
			})
			.catch(err => {
				console.log(err);
			});
	}
	async _handlePasswordMatch() {
		let { password } = this.state;
		let state = Object.assign({}, this.state);
		state.password.match = false;
		state.error = "";
		if (password.new !== "" && password.new !== null) {
			if (password.new === password.confirmed) {
				password.match = true;
				password.confirmed = sha256.hmac(
					SECURITY_ENCRYPTION_KEY,
					password.confirmed
				);
				password.current = sha256.hmac(
					SECURITY_ENCRYPTION_KEY,
					password.current
				);
				password.new = "";
			} else {
				password.match = false;
				state.error = "Passwords do not match";
			}
		} else {
			password.match = false;
			state.error = "Passwords cannot be blank";
		}
		await this.setState(state);
		return {
			success: state.password.match
		};
	}
	render() {
		return (
			<>
				<Button variant="primary" block size="sm" onClick={this.handleShow}>
					Preferences
				</Button>
				<Modal
					show={this.state.show}
					size="md"
					onHide={this.handleClose}
					centered
				>
					{this.state.alert}
					<Modal.Header closeButton>
						<Modal.Title>
							<b>Change Password</b>
						</Modal.Title>
					</Modal.Header>
					<form onSubmit={this._handleFormSubmission}>
						<Modal.Body>
							<div className="form-group">
								<label htmlFor="current_password">Current Password</label>
								<input
									type="password"
									className="form-control"
									name="current_password"
									placeholder="Current Password"
									onChange={this._handleCurrentPassword}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="new_password">New Password</label>
								<input
									type="password"
									className="form-control"
									name="new_password"
									placeholder="New Password"
									onChange={this._handleNewPassword}
									pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
									required
								/>
								<small id="new_password_Help" className="form-text text-muted">
									1 x Capital - 1 x lower - 1 x digit - minimum 6 characters
								</small>
							</div>
							<div className="form-group">
								<label htmlFor="confirm_password">Confirm Password</label>
								<input
									type="password"
									className="form-control"
									name="confirm_password"
									placeholder="Confirm Password"
									onChange={this._handleConfirmedPassword}
									pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
									required
								/>
							</div>
							{this.state.error}
						</Modal.Body>
						<Modal.Footer style={{ backgroundColor: "#f5f5f5" }}>
							<Button variant="secondary" onClick={this.handleClose}>
								Close
							</Button>
							<Button
								variant="primary"
								type="submit"
								disabled={this.state.isUpdatingPassword}
							>
								{this.state.isUpdatingPassword
									? "Saving Changes"
									: "Save Changes"}
							</Button>
						</Modal.Footer>
					</form>
				</Modal>
			</>
		);
	}
}

export default UserPreferences;
