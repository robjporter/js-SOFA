import React from "react";
import Button from "react-bootstrap/Button";
import { TiDelete } from "react-icons/ti";
import SweetAlert from "react-bootstrap-sweetalert";

class DeleteUser extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		console.log(this.props);
		this.state = {
			id: this.props.pos,
			alert: null
		};
		console.log(this.state);
		this._handleDelete = this._handleDelete.bind(this);
		this._deleteUser = this._deleteUser.bind(this);
		this._cancelDelete = this._cancelDelete.bind(this);
		this._hideAlert = this._hideAlert.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
	}
	componentWillUnmount() {
		this._isMounted = false;
		this.setState({
			alert: null
		});
	}
	_deleteUser(pos) {
		console.log("DELETING USER: ", pos);
		/*

			DeleteUser(localStorage.getItem("sofatoken"), this.state.list[pos - 1])
				.then(response => {
					console.log(response);
					return "";
				})
				.catch(err => {
					console.log(err);
				});
        */
	}
	_cancelDelete() {
		console.log("CANCELED DELETE");
		this._hideAlert();
	}
	_handleDelete(pos) {
		if (this._isMounted) {
			this.setState({
				alert: (
					<SweetAlert
						warning
						showCancel
						confirmBtnText="Yes, delete it!"
						confirmBtnBsStyle="danger"
						cancelBtnBsStyle="default"
						title="Are you sure?"
						onConfirm={this._deleteUser.bind(this, pos)}
						onCancel={this._cancelDelete}
					>
						You will not be able to recover this User!
					</SweetAlert>
				)
			});
		}
	}
	_hideAlert() {
		console.log("Hiding alert...");
		if (this._isMounted) {
			this.setState({
				alert: null
			});
		}
	}
	render() {
		return (
			<>
				<Button
					variant="danger"
					key={"d" + this.state.id}
					name={"d" + this.state.id}
					style={{ minWidth: "20px" }}
					onClick={this._handleDelete.bind(this, this.state.id)}
				>
					<TiDelete size="25px" />
				</Button>
				{this.state.alert}
			</>
		);
	}
}

export default DeleteUser;
