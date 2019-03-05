import axios from "axios";

export const DeleteUploadedReport = (token = null, file = null) => {
	const url = "/api/files/deleteuploadedreport";
	const headers = {
		"Content-Type": "application/json",
		Authorization: "Bearer " + token
	};
	const data = {
		file: file
	};
	return axios.post(url, data, { headers: headers });
};
