import React from "react";
import { FetchUsers } from "../helpers/fetchusers";
import Button from "react-bootstrap/Button";
import { TiEdit, TiDelete } from "react-icons/ti";

class UserAdmin extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			list: []
		};
		this.handleDelete = this.handleDelete.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.updateUsers = this.updateUsers.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
		this.updateUsers();
	}
	leftFillNum(num, width) {
		return num.toString().padStart(width, "0");
	}
	updateUsers() {
		if (this._isMounted) {
			FetchUsers(localStorage.getItem("sofatoken"))
				.then(response => {
					var list = [];
					if (response) {
						if (response.data.length > 0) {
							for (let i = 0; i < response.data.length; i++) {
								list.push(response.data[i].username);
							}
						}
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
	handleEdit(pos) {
		console.log("Editing User: ", pos);
	}
	handleDelete(pos) {
		if (this._isMounted) {
			DeleteUser(localStorage.getItem("sofatoken"), this.state.list[pos - 1])
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
				<div>
					<Button
						variant="primary"
						style={{ marginTop: "-15px", float: "left" }}
					>
						Add New User
					</Button>
					<div className="list-wrapper2">
						<div className="list">
							<div className="listItem mt-3">
								<b>ID</b>
							</div>
							<div className="listItem2 mt-3 text-left">
								<b>Username</b>
							</div>
							<div className="listItem mt-1">
								<b>Functions</b>
							</div>
						</div>
						{list.map(index => {
							count = count + 1;
							return (
								<div className="list" key={count}>
									<div className="listItem mt-3">
										{this.leftFillNum(count, 3)}
									</div>
									<div className="listItem2 mt-3 text-left">{index}</div>
									<div className="listItem mt-1">
										<Button
											variant="warning"
											key={"e" + count}
											style={{ padding: "2px !important", minWidth: "20px" }}
											onClick={this.handleEdit.bind(this, count)}
										>
											<TiEdit size="25px" color="white" />
										</Button>
										<Button
											variant="danger"
											key={"d" + count}
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
				</div>
			);
		} else {
			content = <div>No users to remove</div>;
		}
		return <div>{content}</div>;
	}
}

export default UserAdmin;
