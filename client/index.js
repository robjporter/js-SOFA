import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./css/bootstrap.min.css";
import "./css/styles.min.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./routes/routes";
import { AuthProvider } from "react-check-auth";

const authUrl = "http://localhost:9000/api/auth/validate";
const reqOptions = {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer " + localStorage.getItem("sofatoken")
	}
};

const App = () => (
	<AuthProvider authUrl={authUrl} reqOptions={reqOptions}>
		<div>
			<Header />
			<Main />
			<Footer />
		</div>
	</AuthProvider>
);

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById("root")
);

export default App;
