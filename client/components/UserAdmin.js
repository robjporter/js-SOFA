import React from "react";
import { FetchUsers } from "../helpers/fetchusers";
import { AuthConsumer } from "react-check-auth";
import AddUser from "../components/AddUser";
import EditUser from "../components/EditUser";
import DeleteUser from "../components/DeleteUser";
import { compareDesc } from "date-fns";

class UserAdmin extends React.Component {
	constructor(props) {
		super(props);
		this._isMounted = false;
		this.state = {
			list: []
		};
		this.updateUsers = this.updateUsers.bind(this);
	}
	componentDidMount() {
		this._isMounted = true;
		this.updateUsers();
	}
	componentWillUnmount() {
		if (this._isMounted) {
			this.state = {
				list: []
			};
		}
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
	code(count, index) {
		return (
			<div className="list" key={"lm" + count.toString()}>
				<div className="listItem mt-3" key={"lma" + count.toString()}>
					{this.leftFillNum(count, 3)}
				</div>
				<div
					className="listItem2 mt-3 text-left"
					key={"lmb" + count.toString()}
				>
					{index}
				</div>
				<div className="listItem mt-1" key={"li" + count.toString()}>
					<EditUser key={"eu" + count.toString()} pos={count} />
					<AuthConsumer>
						{({ userInfo }) => {
							if (userInfo) {
								if (userInfo.username !== index) {
									console.log(count);
									return (
										<DeleteUser
											key={"du" + count.toString()}
											pos={count.toString()}
										/>
									);
								} else {
									return <span style={{ width: "20px" }}> </span>;
								}
							}
						}}
					</AuthConsumer>
				</div>
			</div>
		);
		/*
return (
								<div className="list" key={"l" + count.toString()}>
									<div className="listItem mt-3">
										{this.leftFillNum(count, 3)}
									</div>
									<div className="listItem2 mt-3 text-left">{index}</div>
									<div className="listItem mt-1" key={"li" + count.toString()}>
										<EditUser
											key={"eu" + count.toString()}
											pos={count.toString()}
										/>
										<AuthConsumer>
											{({ userInfo }) => {
												if (userInfo) {
													if (userInfo.username !== index) {
														console.log(count);
														return (
															<DeleteUser
																key={"du" + count.toString()}
																pos={count.toString()}
															/>
														);
													} else {
														return <span style={{ width: "20px" }}> </span>;
													}
												}
											}}
										</AuthConsumer>
									</div>
								</div>
							);
        */
	}
	render() {
		let count = 0;
		let content = "";
		const list = this.state.list;
		if (list.length > 0) {
			content = (
				<div>
					<AddUser />
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
							return this.code(count, index);
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
