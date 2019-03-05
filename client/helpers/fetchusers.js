import axios from "axios";

export const FetchUsers = (token = null) => {
	const url = "/api/users/fetchusers";
	const headers = {
		"Content-Type": "application/json",
		Authorization: "Bearer " + token
	};
	return axios.get(url, { headers: headers });
};
