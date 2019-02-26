import React from "react";
import _ from "lodash";
import Button from "react-bootstrap/Button";
import { isEmail } from "../helpers/email";
import { login } from "../helpers/login";

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: null,
			user: {
				email: "",
				password: ""
			},

			error: {
				email: null,
				password: null
			}
		};
		this._onSubmit = this._onSubmit.bind(this);
		this._onTextFieldChange = this._onTextFieldChange.bind(this);
		this._formValidation = this._formValidation.bind(this);
	}

	_onSubmit(event) {
		event.preventDefault();
		const { user } = this.state;

		let fieldNeedToValidate = ["email", "password"];

		this._formValidation(fieldNeedToValidate, isValid => {
			if (isValid) {
				login(this.state.user.email, this.state.user.password)
					.then(response => {
						localStorage.setItem("sofatoken", response.data.token);
						this.setState({
							message: {
								type: "success",
								message: "Login Success",
								data: response.data.token
							}
						});
						window.location.href = "/sofa";
					})
					.catch(err => {
						// login not suscess.
						this.setState({
							message: {
								type: "error",
								message: "An error login!"
							}
						});
						console.log(err);
					});
			}
		});
	}

	_formValidation(fieldsToValidate = [], callback = () => {}) {
		const { user } = this.state;

		const allFields = {
			email: {
				message: "Email is not correct",
				doValidate: () => {
					const value = _.get(user, "email", "");

					if (value.length > 0 && isEmail(value)) {
						return true;
					}
					return false;
				}
			},
			password: {
				message: "Password shoud has more than 3 characters.",
				doValidate: () => {
					const value = _.get(user, "password", "");

					if (value && value.length > 3) {
						return true;
					}

					return false;
				}
			}
		};
		let errors = this.state.error;
		_.each(fieldsToValidate, field => {
			const fieldValidate = _.get(allFields, field);
			if (fieldValidate) {
				errors[field] = null;
				const isFieldValid = fieldValidate.doValidate();
				if (isFieldValid === false) {
					errors[field] = _.get(fieldValidate, "message");
				}
			}
		});
		this.setState(
			{
				error: errors
			},
			() => {
				console.log("After processed validation the for errors", errors);
				let isValid = true;
				_.each(errors, err => {
					if (err) {
						isValid = false;
					}
				});
				callback(isValid);
			}
		);
	}

	_onTextFieldChange(e) {
		let { user } = this.state;

		const fieldName = e.target.name;
		const fieldValue = e.target.value;

		user[fieldName] = fieldValue;

		this.setState({ user: user });
	}

	render() {
		const { message, user, error } = this.state;

		return (
			<div>
				<div style={{ height: "80px" }} />
				<div className="card shadow-sm text-center mt-4 w-75 mx-auto">
					<div className="card-header">
						<h4 className="my-0 font-weight-bold">Login</h4>
					</div>
					<div className="card-body">
						<form onSubmit={this._onSubmit}>
							{message ? (
								<div className="app-message">
									<p className={message.type}>{message.message}</p>
								</div>
							) : null}
							{error.email ? (
								<div className="app-message">
									<p className="error">{error.email}</p>
								</div>
							) : null}
							{error.password ? (
								<div className="app-message">
									<p className="error">{error.password}</p>
								</div>
							) : null}
							<div className="form-group">
								<input
									value={user.email}
									className="form-control"
									onChange={this._onTextFieldChange}
									placeholder="Your email address"
									id="email-id"
									type="email"
									name="email"
								/>
							</div>
							<div className="form-group">
								<input
									value={user.password}
									className="form-control"
									onChange={this._onTextFieldChange}
									placeholder="Your password"
									id="password-id"
									type="password"
									name="password"
								/>
							</div>
							<div className="form-group">
								<Button variant="outline-primary" type="submit" block>
									Login
								</Button>
							</div>
							<div className="form-group">
								<a href="#" className="ForgetPwd">
									Forget Password?
								</a>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}
