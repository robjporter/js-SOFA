import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../pages/Home/home";
import Sofa from "../pages/Sofa/sofa";

const Main = () => (
	<main>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/sofa" component={Sofa} />
		</Switch>
	</main>
);

export default Main;
