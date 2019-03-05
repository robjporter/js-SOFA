import axios from "axios";

export const UploadedReports = (token = null) => {
	const url = "/api/files/uploadedreports";
	const headers = {
		"Content-Type": "application/json",
		Authorization: "Bearer " + token
	};
	return axios.get(url, { headers: headers });
};
