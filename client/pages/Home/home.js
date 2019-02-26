import React, { Component } from "react";
import { Helmet } from "react-helmet";
import LoginForm from "../../components/LoginForm";
import NameColumn from "../../components/NameColumn";
import { Redirect } from "react-router";
import { AuthConsumer } from "react-check-auth";

class Home extends Component {
	render() {
		return (
			<div>
				<AuthConsumer>
					{({ userInfo }) => {
						// Redirect the user to login if they are not logged in
						if (userInfo) {
							return <Redirect to="/sofa" />;
						}
					}}
				</AuthConsumer>
				<div className="App">
					<Helmet>
						<meta charSet="utf-8" />
						<title>My Title</title>
						<link rel="canonical" href="http://mysite.com/example" />
					</Helmet>
					<div
						style={{
							height: "calc(100vh - 163px)",
							backgroundColor: "#1b65f6"
						}}
					>
						<div className="row h-100 w-100 align-self-center">
							<div className="col h-100 align-self-center ml-2 mt-4">
								<NameColumn />
							</div>
							<div className="col h-100 mt-4">
								<LoginForm />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
