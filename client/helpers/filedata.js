import axios from "axios";

export const FileData = (token = null) => {
	const url = `/api/files/reports`;
	const headers = {
		"Content-Type": "application/json",
		Authorization: "Bearer " + token
	};
	return axios.get(url, { headers: headers });
};
