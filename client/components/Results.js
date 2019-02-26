import React from "react";
import Table from "react-bootstrap/Table";

class Results extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Table size="sm" style={{ border: "none" }}>
				<tbody>
					<tr>
						<td>
							<b>Technology Interest:</b> {this.props.interested}
						</td>
						<td>
							<b>Original Records:</b> {this.props.records}
						</td>
					</tr>
					<tr>
						<td>
							<b>Processed Records:</b> {this.props.processed}
						</td>
						<td>
							<b>Output Records:</b> {this.props.outputRecords}
						</td>
					</tr>
				</tbody>
			</Table>
		);
	}
}

export default Results;
