import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { ReportData } from "../helpers/reportdata";
import { DownloadFile } from "../helpers/downloadfile";

class ViewUserReport extends React.Component {
	constructor(props, context) {
		super(props, context);

		this._isMounted = false;

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleDownload = this.handleDownload.bind(this);
		this.handleReportFileChange = this.handleReportFileChange.bind(this);

		this.state = {
			show: false,
			value: "?",
			options: [],
			type: this.props.type
		};
	}

	componentDidMount() {
		this._isMounted = true;
		this.getFileData();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}

	handleReportFileChange(e) {
		this.setState({ value: e.target.value });
	}

	handleDownload() {
		DownloadFile(localStorage.getItem("sofatoken"), this.state.value);
	}

	getFileData() {
		ReportData(localStorage.getItem("sofatoken"), this.state.type).then(
			response => {
				if (response.data) {
					if (response.data.length > 0) {
						for (let i = 0; i < response.data.length; i++) {
							if (i === 0) {
								this.setState({ value: response.data[0] });
							}
							this.setState(prevState => ({
								options: [
									...prevState.options,
									{ name: response.data[i], value: response.data[i] }
								]
							}));
						}
					}
				}
			}
		);
	}

	render() {
		return (
			<>
				<Button variant="primary" onClick={this.handleShow}>
					View Reports
				</Button>

				<Modal
					show={this.state.show}
					size="lg"
					onHide={this.handleClose}
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title>
							<b>{this.state.type}</b>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Label>
							Please select one of the following files exported from SalesForce.
							The produced report will extract all {this.state.type}{" "}
							opportunities from this SalesForce export.
						</Form.Label>
						<select
							onChange={this.handleReportFileChange}
							value={this.state.value}
							className="form-control"
						>
							{this.state.options.map(item => (
								<option key={item.value} value={item.value}>
									{item.name}
								</option>
							))}
						</select>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button variant="primary" onClick={this.handleDownload}>
							Download Report
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	}
}

export default ViewUserReport;
