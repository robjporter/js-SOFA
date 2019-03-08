import axios from "axios";

export const DeleteAUser = (token = null, user = null) => {
	const url = "/api/users/deleteuser";
	const headers = {
		"Content-Type": "application/json",
		Authorization: "Bearer " + token
	};
	const data = {
		user: user
	};
	return axios.post(url, data, { headers: headers });
};
