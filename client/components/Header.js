import React, { Component } from "react";
import {
	TiPointOfInterestOutline,
	TiUserOutline,
	TiUser
} from "react-icons/ti";
import { AuthConsumer } from "react-check-auth";
import { logout } from "../helpers/logout";
import { Redirect } from "react-router";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

class Header extends Component {
	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
		this.handlePreferences = this.handlePreferences.bind(this);
	}
	handleLogout() {
		return logout(localStorage.getItem("sofatoken"))
			.then(response => {
				localStorage.removeItem("sofatoken");
				return response.status;
			})
			.catch(err => {
				localStorage.removeItem("sofatoken");
				return err;
			});
	}
	handlePreferences() {
		console.log("LOADING PREFERENCES");
	}
	loggedInMenu() {
		return (
			<DropdownButton
				variant="primary"
				id="dropdown-variants-primary"
				key="primary"
				alignRight
			>
				<Dropdown.Item eventKey="1">Action</Dropdown.Item>
				<Dropdown.Item eventKey="2">Another action</Dropdown.Item>
				<Dropdown.Item eventKey="3">Active Item</Dropdown.Item>
				<Dropdown.Divider />
				<Dropdown.Item eventKey="4">
					<AuthConsumer>
						{({ refreshAuth }) => (
							<button
								onClick={() =>
									this.handleLogout() // This is a promise that calls a logout API
										.then(response => {
											refreshAuth();
											return <Redirect to="/" />;
										})
								}
							>
								Logout
							</button>
						)}
					</AuthConsumer>
				</Dropdown.Item>
			</DropdownButton>
		);
	}
	loggedInMenuOld() {
		return (
			<Dropdown alignRight>
				<Dropdown.Toggle variant="primary" id="dropdown-basic">
					<AuthConsumer>
						{({ userInfo }) => {
							if (userInfo) {
								return userInfo.firstName;
							}
						}}
					</AuthConsumer>
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<li>
						<div
							style={{
								width: "340px",
								padding: "10px",
								paddingBottom: "0px",
								height: "140px"
							}}
						>
							<div className="row">
								<div className="col-lg-4">
									<p className="text-center">
										<TiUser size="112" />
									</p>
								</div>
								<div className="col-lg-8">
									<p className="text-left">
										<strong>
											<AuthConsumer>
												{({ userInfo }) => {
													return userInfo.firstName + " " + userInfo.lastName;
												}}
											</AuthConsumer>
										</strong>
									</p>
									<p className="text-left small">
										<AuthConsumer>
											{({ userInfo }) => {
												return userInfo.username;
											}}
										</AuthConsumer>
									</p>
									<p className="text-left">
										<Button
											variant="primary"
											block
											size="sm"
											onClick={this.handlePreferences}
										>
											Preferences
										</Button>
									</p>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div
							style={{
								paddingBottom: "0px",
								paddingTop: "0px",
								marginBottom: "-24px"
							}}
						>
							<div className="row">
								<div className="col-lg-12">
									<p>
										<AuthConsumer>
											{({ userInfo, refreshAuth }) => {
												if (userInfo) {
													return (
														<Button
															variant="danger"
															block
															size="sm"
															onClick={() =>
																this.handleLogout() // This is a promise that calls a logout API
																	.then(response => {
																		refreshAuth();
																		return <Redirect to="/" />;
																	})
															}
														>
															Logout
														</Button>
													);
												}
											}}
										</AuthConsumer>
									</p>
								</div>
							</div>
						</div>
					</li>
				</Dropdown.Menu>
			</Dropdown>
		);
	}
	render() {
		return (
			<div
				style={{
					height: "63px",
					backgroundColor: "#1b65f6"
				}}
			>
				<nav className="navbar navbar-light">
					<a className="navbar-brand" href="#">
						<div className="row">
							<div className="col">
								<TiPointOfInterestOutline size="28" color="white" />
							</div>
							<div className="col pt-1">
								<span className="text-white">SOFA</span>
							</div>
						</div>
					</a>
					<div className="row">
						<AuthConsumer>
							{({ userInfo }) => {
								if (userInfo) {
									return this.loggedInMenuOld();
								}
							}}
						</AuthConsumer>

						<div className="col">
							<AuthConsumer>
								{({ userInfo }) => {
									if (userInfo) {
										return (
											<div
												className="avatar-r-sm"
												style={{ backgroundColor: "#c4c8ca" }}
											>
												<TiUserOutline
													size="40"
													color="white"
													style={{ paddingLeft: "0px", paddingTop: "0px" }}
												/>
											</div>
										);
									}
								}}
							</AuthConsumer>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}

export default Header;
