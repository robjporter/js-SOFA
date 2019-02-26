import React, { Component } from "react";
import { enData } from "../helpers/endata";
import { dcData } from "../helpers/dcdata";
import { colData } from "../helpers/coldata";
import { secData } from "../helpers/secdata";
import { AuthConsumer } from "react-check-auth";
import DataBoxes from "../components/DataBoxes";
import UserReportOptions from "../components/UserReportOptions";

class UserReports extends Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			pType: this.props.type[0]
		};
		this.displayEN = this.displayEN.bind(this);
		this.displayDC = this.displayDC.bind(this);
		this.displayCOL = this.displayCOL.bind(this);
		this.displaySEC = this.displaySEC.bind(this);
		this.loadENData = this.loadENData.bind(this);
		this.loadDCData = this.loadDCData.bind(this);
		this.loadCOLData = this.loadCOLData.bind(this);
		this.loadSECData = this.loadSECData.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
		this.loadENData();
		this.loadDCData();
		this.loadCOLData();
		this.loadSECData();
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	loadENData() {
		enData(localStorage.getItem("sofatoken"))
			.then(response => {
				if (this._isMounted) {
					this.setState({
						enCounter: response.data.counter,
						enValue: response.data.value,
						enOpps: response.data.opps,
						enAvg: response.data.avg
					});
				}
			})
			.catch(err => {
				console.log(err);
			});
	}
	loadDCData() {
		dcData(localStorage.getItem("sofatoken"))
			.then(response => {
				if (this._isMounted) {
					this.setState({
						dcCounter: response.data.counter,
						dcValue: response.data.value,
						dcOpps: response.data.opps,
						dcAvg: response.data.avg
					});
				}
			})
			.catch(err => {
				console.log(err);
			});
	}
	loadCOLData() {
		colData(localStorage.getItem("sofatoken"))
			.then(response => {
				if (this._isMounted) {
					this.setState({
						colCounter: response.data.counter,
						colValue: response.data.value,
						colOpps: response.data.opps,
						colAvg: response.data.avg
					});
				}
			})
			.catch(err => {
				console.log(err);
			});
	}
	loadSECData() {
		secData(localStorage.getItem("sofatoken"))
			.then(response => {
				if (this._isMounted) {
					this.setState({
						secCounter: response.data.counter,
						secValue: response.data.value,
						secOpps: response.data.opps,
						secAvg: response.data.avg
					});
				}
			})
			.catch(err => {
				console.log(err);
			});
	}
	displayEN() {
		return (
			<DataBoxes
				title="Enterprise Networks"
				counter={this.state.enCounter}
				counterMessage="Reports Generated"
				value={this.state.enValue}
				valueMessage="Processed Value"
				opps={this.state.enOpps}
				oppsMessage="Processed Opportunities"
				average={this.state.enAvg}
				avgMessage="Average Deal Value"
			/>
		);
	}
	displayDC() {
		return (
			<DataBoxes
				title="DataCenter"
				counter={this.state.dcCounter}
				counterMessage="Report Counter"
				value={this.state.dcValue}
				valueMessage="Total Value"
				opps={this.state.dcOpps}
				oppsMessage="Total Opportunities"
				average={this.state.dcAvg}
				avgMessage="Average Value"
			/>
		);
	}
	displayCOL() {
		return (
			<DataBoxes
				title="Collaboration"
				counter={this.state.colCounter}
				counterMessage="Report Counter"
				value={this.state.colValue}
				valueMessage="Total Value"
				opps={this.state.colOpps}
				oppsMessage="Total Opportunities"
				average={this.state.colAvg}
				avgMessage="Average Value"
			/>
		);
	}
	displaySEC() {
		return (
			<DataBoxes
				title="Security"
				counter={this.state.secCounter}
				counterMessage="Report Counter"
				value={this.state.secValue}
				valueMessage="Total Value"
				opps={this.state.secOpps}
				oppsMessage="Total Opportunities"
				average={this.state.secAvg}
				avgMessage="Average Value"
			/>
		);
	}
	render() {
		return (
			<div style={{ height: "100%" }}>
				<div style={{ height: "40px" }} />
				<div>
					<AuthConsumer>
						{({ userInfo }) => {
							if (userInfo) {
								if (userInfo.access.includes("en")) {
									return this.displayEN();
								} else {
									return <div />;
								}
							}
						}}
					</AuthConsumer>
				</div>
				<div>
					<AuthConsumer>
						{({ userInfo }) => {
							if (userInfo) {
								if (userInfo.access.includes("dc")) {
									return this.displayDC();
								} else {
									return <div />;
								}
							}
						}}
					</AuthConsumer>
				</div>
				<div>
					<AuthConsumer>
						{({ userInfo }) => {
							if (userInfo) {
								if (userInfo.access.includes("col")) {
									return this.displayCOL();
								} else {
									return <div />;
								}
							}
						}}
					</AuthConsumer>
				</div>
				<div>
					<AuthConsumer>
						{({ userInfo }) => {
							if (userInfo) {
								if (userInfo.access.includes("sec")) {
									return this.displaySEC();
								} else {
									return <div />;
								}
							}
						}}
					</AuthConsumer>
				</div>
				<AuthConsumer>
					{({ userInfo }) => {
						if (userInfo) {
							if (userInfo.role.toUpperCase() === "USER") {
								return (
									<div
										className="row mt-1"
										style={{ height: "calc(100vh - 450px)" }}
									>
										<div
											className="col"
											style={{ height: "calc(100vh-450px)" }}
										>
											<UserReportOptions type={this.props.type} />
										</div>
									</div>
								);
							}
						}
					}}
				</AuthConsumer>
			</div>
		);
	}
}

export default UserReports;
