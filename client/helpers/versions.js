import axios from "axios";

export const Versions = () => {
	const url = "/api/version";
	const headers = {
		"Content-Type": "application/json"
	};
	return axios.get(url, { headers: headers });
};
