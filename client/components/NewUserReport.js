import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { FileData } from "../helpers/filedata";
import { ReportGenerate } from "../helpers/reportgenerate";
import { DownloadFile } from "../helpers/downloadfile";
import Results from "../components/Results";

class NewUserReport extends React.Component {
	constructor(props, context) {
		super(props, context);

		this._isMounted = false;
		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.getFileData = this.getFileData.bind(this);
		this.generateReport = this.generateReport.bind(this);
		this.handleReportFileChange = this.handleReportFileChange.bind(this);
		this.handleButtonClick = this.handleButtonClick.bind(this);

		this.state = {
			show: false,
			type: this.props.type,
			options: [],
			value: "",
			isReportGenerating: false,
			buttonText: "Generate Report",
			reportFileSelectDisabled: false,
			responseFile: "",
			showResults: false
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
		this.setState({
			buttonText: "Generate Report",
			responseFile: "",
			interested: "",
			records: "",
			processed: "",
			outputRecords: "",
			showResults: false,
			isReportGenerating: false,
			reportFileSelectDisabled: false,
			show: true
		});
	}

	handleReportFileChange(e) {
		this.setState({ value: e.target.value });
	}

	handleButtonClick() {
		if (this.state.buttonText === "Download") {
			console.log(this.state.responseFile);
			DownloadFile(localStorage.getItem("sofatoken"), this.state.responseFile);
		} else {
			this.generateReport();
		}
	}

	generateReport() {
		console.log("VALUE: ", this.state.value);
		this.setState({ isReportGenerating: true }, () => {
			this.setState({ reportFileSelectDisabled: true });
			ReportGenerate(
				localStorage.getItem("sofatoken"),
				this.state.value,
				this.state.type
			).then(response => {
				if (response) {
					this.setState({
						responseFile: response.data.file,
						interested: response.data.interested,
						records: response.data.records,
						processed: response.data.processed,
						outputRecords: response.data.outputRecords,
						showResults: true,
						isReportGenerating: false,
						buttonText: "Download"
					});
				}
			});
		});
	}

	getFileData() {
		FileData(localStorage.getItem("sofatoken")).then(response => {
			if (response.data) {
				if (response.data.length > 0) {
					for (let i = 0; i < response.data.length; i++) {
						if (i === 0) {
							if (this.state.value === "") {
								this.setState({ value: response.data[0] });
							}
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
		});
	}

	render() {
		const { options, value } = this.state;
		return (
			<>
				<Button variant="primary" onClick={this.handleShow}>
					Generate New Report
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
						<Form.Group controlId="NewReportGenerator">
							<Form.Label>
								Please select one of the following files exported from
								SalesForce. The produced report will extract all{" "}
								{this.state.type} opportunities from this SalesForce export.
							</Form.Label>
							{this.state.reportFileSelect}
							<select
								onChange={this.handleReportFileChange}
								value={value}
								className="form-control"
								disabled={this.state.reportFileSelectDisabled ? true : false}
							>
								{options.map(item => (
									<option key={item.value} value={item.value}>
										{item.name}
									</option>
								))}
							</select>
							{this.state.data}
						</Form.Group>
						<div style={{ height: "50px" }}>
							{this.state.showResults ? (
								<Results
									interested={this.state.interested}
									records={this.state.records}
									processed={this.state.processed}
									outputRecords={this.state.outputRecords}
								/>
							) : null}
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button
							variant="primary"
							disabled={this.state.isReportGenerating}
							onClick={() => {
								if (!this.state.isReportGenerating) {
									this.handleButtonClick();
								}
							}}
						>
							{this.state.isReportGenerating
								? "Generating…"
								: this.state.buttonText}
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	}
}

export default NewUserReport;
