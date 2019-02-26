import React from "react";
import Card from "react-bootstrap/Card";
import NewUserReport from "../components/NewUserReport";
import ViewUserReport from "../components/ViewUserReport";

class UserReportOptions extends React.Component {
	constructor(props) {
		super(props);
		this.architectureName = this.architectureName.bind(this);
	}
	architectureName(name) {
		if (name.toUpperCase() === "EN") {
			return "Enterprise Networks";
		} else if (name.toUpperCase() === "DC") {
			return "DataCenter";
		} else if (name.toUpperCase() === "COL") {
			return "Collaboration";
		} else if (name.toUpperCase() === "SEC") {
			return "Security";
		}
	}
	render() {
		return (
			<div className="col h-100">
				<div style={{ height: "50px" }} />
				<div className="text-center align-center" style={{ height: "80%" }}>
					<div className="row h-100">
						<div className="col w-100">
							<Card className="h-100">
								<Card.Img variant="top" src="" />
								<Card.Body>
									<Card.Title>New Report</Card.Title>
									<Card.Text>
										Some quick example text to build on the card title and make
										up the bulk of the card's content.
									</Card.Text>
									<NewUserReport
										type={this.architectureName(this.props.type[0])}
									/>
								</Card.Body>
							</Card>
						</div>
						<div className="col">
							<Card className="h-100">
								<Card.Img variant="top" src="" />
								<Card.Body>
									<Card.Title>View Reports</Card.Title>
									<Card.Text>
										Some quick example text to build on the card title and make
										up the bulk of the card's content.
									</Card.Text>
									<ViewUserReport
										type={this.architectureName(this.props.type[0])}
									/>
								</Card.Body>
							</Card>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default UserReportOptions;
