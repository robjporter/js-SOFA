import React from "react";
import { Helmet } from "react-helmet";
import { AuthConsumer } from "react-check-auth";
import { Redirect } from "react-router";
import AdminReports from "../../components/AdminReports";
import UserReports from "../../components/UserReports";

class Sofa extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div>
				<AuthConsumer>
					{({ userInfo }) => {
						// Redirect the user to login if they are not logged in
						if (!userInfo) {
							return <Redirect to="/" />;
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
						style={{ height: "calc(100vh - 163px)", backgroundColor: "white" }}
					>
						<AuthConsumer>
							{({ userInfo }) => {
								// Redirect the user to login if they are not logged in
								if (userInfo) {
									return (
										<div>
											<AdminReports type={userInfo.access} />
											<UserReports type={userInfo.access} />
										</div>
									);
								}
							}}
						</AuthConsumer>
					</div>
				</div>
			</div>
		);
	}
}

export default Sofa;
