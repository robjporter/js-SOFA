import React, { Component } from "react";
import { AuthConsumer } from "react-check-auth";
import DataBoxes from "../components/DataBoxes";
import { adminData } from "../helpers/admindata";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Upload from "../components/Upload";

class AdminReports extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		adminData(localStorage.getItem("sofatoken")).then(response => {
			console.log(response);
		});
	}
	adminContent() {
		return (
			<div className="col h-100">
				<div style={{ height: "40px" }} />
				<div style={{ height: "100%" }}>
					<DataBoxes
						title="Administration"
						counter="$0/0"
						counterMessage="Enterprise Networks"
						value="0/0"
						valueMessage="DataCenter"
						opps="$0/0"
						oppsMessage="Collaboration"
						average="0/0"
						avgMessage="Security"
					/>
				</div>
				<div className="row mt-1" style={{ height: "calc(100vh - 400px)" }}>
					<div className="col" style={{ height: "calc(100vh-400px)" }}>
						<div className="text-center align-center" style={{ height: "80%" }}>
							<div className="row h-100">
								<div className="col w-100 ml-3">
									<Card className="h-100">
										<Tab.Container
											id="left-tabs-example"
											defaultActiveKey="first"
										>
											<Card.Header>
												<Nav variant="tabs" defaultActiveKey="#first">
													<Nav.Item>
														<Nav.Link eventKey="first">
															Upload new report
														</Nav.Link>
													</Nav.Item>
													<Nav.Item>
														<Nav.Link eventKey="second">
															Remove old reports
														</Nav.Link>
													</Nav.Item>
													<Nav.Item>
														<Nav.Link eventKey="third">Administration</Nav.Link>
													</Nav.Item>
												</Nav>
											</Card.Header>
											<Card.Body>
												<Tab.Content>
													<Tab.Pane eventKey="first">
														<Upload />
													</Tab.Pane>
													<Tab.Pane eventKey="second">SECOND</Tab.Pane>
													<Tab.Pane eventKey="third">THIRD</Tab.Pane>
												</Tab.Content>
											</Card.Body>
										</Tab.Container>
									</Card>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div style={{ height: "100%" }}>
				<AuthConsumer>
					{({ userInfo }) => {
						if (userInfo) {
							if (userInfo.role.toUpperCase() === "USER") {
								return <div />;
							} else {
								return this.adminContent();
							}
						}
					}}
				</AuthConsumer>
			</div>
		);
	}
}

export default AdminReports;
