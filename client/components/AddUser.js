import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import SweetAlert from "react-bootstrap-sweetalert";
import { sha256 } from "js-sha256";
import { SECURITY_ENCRYPTION_KEY } from "../../common/constants";
import { AddNewUser } from "../helpers/addnewuser";
import { TiPlus } from "react-icons/ti";

class AddUser extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;

		this.state = {
			show: false,
			alert: null,
			isAddingNew: false,
			accessLevels: "",
			user: {
				username: null,
				password: null,
				firstname: null,
				lastname: null,
				admin: false,
				access: "col"
			}
		};
		this.handleAdd = this.handleAdd.bind(this);
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this._hideAlert = this._hideAlert.bind(this);
		this._handleFormSubmission = this._handleFormSubmission.bind(this);
		this._getAccessLevels = this._getAccessLevels.bind(this);
		this._handleNewUsername = this._handleNewUsername.bind(this);
		this._handleNewPassword = this._handleNewPassword.bind(this);
		this._handleNewfirstname = this._handleNewfirstname.bind(this);
		this._handleNewlastname = this._handleNewlastname.bind(this);
		this._handleAdmin = this._handleAdmin.bind(this);
		this._handleTechnology = this._handleTechnology.bind(this);
	}
	handleAdd() {
		this.handleShow();
	}
	componentDidMount() {
		this._isMounted = true;
		this._getAccessLevels();
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	handleShow() {
		this.setState({ show: true, isAddingNew: false });
	}
	_hideAlert() {
		this.setState({
			alert: null
		});
	}
	handleClose() {
		this._getAccessLevels();
		this.setState({
			show: false,
			alert: null,
			isAddingNew: false,
			accessLevels: "",
			user: {
				username: null,
				password: null,
				firstname: null,
				lastname: null,
				admin: false,
				access: "col"
			}
		});
	}
	_handleTechnology(event) {
		if (this._isMounted) {
			let state = Object.assign({}, this.state);
			state.user.access = event.target.id;
			this.setState(state);
		}
	}
	_handleAdmin(event) {
		if (this._isMounted) {
			let state = Object.assign({}, this.state);
			state.user.admin = event.target.checked;
			this.setState(state);
			this._getAccessLevels();
		}
	}
	_handleNewUsername(event) {
		let state = Object.assign({}, this.state);
		state.user.username = event.target.value;
		this.setState(state);
	}
	_handleNewPassword(event) {
		let state = Object.assign({}, this.state);
		state.user.password = sha256.hmac(
			SECURITY_ENCRYPTION_KEY,
			event.target.value
		);
		this.setState(state);
	}
	_handleNewfirstname(event) {
		let state = Object.assign({}, this.state);
		state.user.firstname = event.target.value;
		this.setState(state);
	}
	_handleNewlastname(event) {
		let state = Object.assign({}, this.state);
		state.user.lastname = event.target.value;
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
	_getAccessLevels() {
		let accessLevels = "";

		if (this._isMounted) {
			if (this.state.user.admin) {
				let state = Object.assign({}, this.state);
				state.user.access = "*";
				this.setState(state);
			} else {
				accessLevels = (
					<Form.Group key="new_technology" onChange={this._handleTechnology}>
						<Form.Check
							inline
							defaultChecked
							type="radio"
							id="col"
							name="new_technology"
							label="Collaboration"
						/>
						<Form.Check
							inline
							type="radio"
							id="dc"
							name="new_technology"
							label="DataCenter"
						/>
						<Form.Check
							inline
							type="radio"
							id="en"
							name="new_technology"
							label="Enterprise Networks"
						/>
						<Form.Check
							inline
							type="radio"
							id="sec"
							name="new_technology"
							label="Security"
						/>
					</Form.Group>
				);
				let state = Object.assign({}, this.state);
				state.user.access = "col";
				this.setState(state);
			}
		}
		this.setState({ accessLevels: accessLevels });
	}
	_handleFormSubmission(event) {
		event.preventDefault();
		this.setState({ isAddingNew: true });
		AddNewUser(localStorage.getItem("sofatoken"), this.state.user)
			.then(response => {
				if (response.data.AddedUser) {
					this._successPasswordChange(
						"User Added Successfully",
						"",
						() => this.handleClose,
						null
					);
					return "";
				} else {
					this._failPasswordChange(
						"User Add Failed",
						"",
						() => this.handleClose,
						null
					);
					return "";
				}
			})
			.catch(err => {
				console.log(err);
			});
		this.setState({ isAddingNew: false });
	}
	render() {
		return (
			<div>
				<Button
					variant="primary"
					style={{ marginTop: "-15px", float: "left" }}
					onClick={this.handleAdd}
				>
					<TiPlus size="25px" color="white" />
					Add New User
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
							<b>New User</b>
						</Modal.Title>
					</Modal.Header>
					<form onSubmit={this._handleFormSubmission}>
						<Modal.Body>
							<Form.Group as={Row} controlId="username">
								<Form.Label column sm="2">
									Username
								</Form.Label>
								<Col sm="10">
									<Form.Control
										type="text"
										className="form-control"
										name="new_username"
										placeholder="Username"
										onChange={this._handleNewUsername}
										required
									/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="firstname">
								<Form.Label column sm="2">
									firstname
								</Form.Label>
								<Col sm="10">
									<Form.Control
										type="text"
										className="form-control"
										name="new_firstname"
										placeholder="First Name"
										onChange={this._handleNewfirstname}
										required
									/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="lastname">
								<Form.Label column sm="2">
									lastname
								</Form.Label>
								<Col sm="10">
									<Form.Control
										type="text"
										className="form-control"
										name="new_lastname"
										placeholder="lastname"
										onChange={this._handleNewlastname}
										required
									/>
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="password">
								<Form.Label column sm="2">
									Password
								</Form.Label>
								<Col sm="10">
									<Form.Control
										type="password"
										placeholder="password"
										onChange={this._handleNewPassword}
										pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
										required
									/>
									<Form.Text className="text-muted">
										1 x Capital - 1 x lower - 1 x digit - minimum 6 characters
									</Form.Text>
								</Col>
							</Form.Group>
							<Form.Group>
								<Form.Check
									type="checkbox"
									label="Admin User"
									onChange={this._handleAdmin}
								/>
							</Form.Group>
							{this.state.accessLevels}
							{this.state.error}
						</Modal.Body>
						<Modal.Footer style={{ backgroundColor: "#f5f5f5" }}>
							<Button variant="secondary" onClick={this.handleClose}>
								Close
							</Button>
							<Button
								variant="primary"
								type="submit"
								disabled={this.state.isAddingNew}
							>
								{this.state.isAddingNew ? "Adding New User" : "Add User"}
							</Button>
						</Modal.Footer>
					</form>
				</Modal>
			</div>
		);
	}
}

export default AddUser;
