import React from "react";
import Button from "react-bootstrap/Button";
import { TiEdit } from "react-icons/ti";

class EditUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.pos
		};
		this.handleEdit = this.handleEdit.bind(this);
	}
	handleEdit(pos) {
		console.log("Editing User: ", pos);
	}
	render() {
		return (
			<Button
				variant="warning"
				key={"e" + this.state.id}
				style={{ padding: "2px !important", minWidth: "20px" }}
				onClick={this.handleEdit.bind(this, this.state.id)}
			>
				<TiEdit size="25px" color="white" />
			</Button>
		);
	}
}

export default EditUser;
