import axios from "axios";

export const adminData = (token = null) => {
	const url = `/api/admin/usagedata`;
	const headers = {
		"Content-Type": "application/json",
		Authorization: "Bearer " + token
	};
	return axios.get(url, { headers: headers });
};
