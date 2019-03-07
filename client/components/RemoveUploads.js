import React from "react";
import Button from "react-bootstrap/Button";
import { UploadedReports } from "../helpers/uploadedreports";
import { DeleteUploadedReport } from "../helpers/deleteuploadedreport";
import { TiDelete } from "react-icons/ti";

class RemoveUploads extends React.Component {
	constructor(props) {
		super(props);

		this._isMounted = false;
		this.state = {
			list: []
		};
		this.handleDelete = this.handleDelete.bind(this);
		this.updateReports = this.updateReports.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
		this.updateReports();
	}
	updateReports() {
		if (this._isMounted) {
			UploadedReports(localStorage.getItem("sofatoken"))
				.then(response => {
					if (response) {
						let list = response.data;
						if (list.length > 0) {
							this.setState({ list: list });
						}
					}
					return "";
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
	leftFillNum(num, width) {
		return num.toString().padStart(width, "0");
	}
	handleDelete(pos) {
		if (this._isMounted) {
			DeleteUploadedReport(
				localStorage.getItem("sofatoken"),
				this.state.list[pos - 1]
			)
				.then(response => {
					console.log(response);
					this.updateReports();
					return "";
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
	render() {
		let count = 0;
		let content = "";
		const list = this.state.list;
		if (list.length > 0) {
			content = (
				<div className="list-wrapper">
					<div className="list">
						<div className="listItem mt-3">
							<b>ID</b>
						</div>
						<div className="listItem2 mt-3 text-left">
							<b>Report Name</b>
						</div>
						<div className="listItem mt-1">
							<b>Functions</b>
						</div>
					</div>
					{list.map(index => {
						count = count + 1;
						return (
							<div className="list" key={"ru" + count}>
								<div className="listItem mt-3">
									{this.leftFillNum(count, 3)}
								</div>
								<div className="listItem2 mt-3 text-left">{index}</div>
								<div className="listItem mt-1">
									<Button
										variant="danger"
										key={"rud" + count}
										style={{ minWidth: "20px" }}
										onClick={this.handleDelete.bind(this, count)}
									>
										<TiDelete size="25px" />
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			);
		} else {
			content = <div>No reports to remove</div>;
		}
		return <div>{content}</div>;
	}
}

export default RemoveUploads;
