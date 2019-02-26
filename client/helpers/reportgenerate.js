import axios from "axios";

export const ReportGenerate = (token = null, file = null, type = null) => {
	const url = `/api/files/generate`;
	const headers = {
		"Content-Type": "application/json",
		Authorization: "Bearer " + token
	};
	const data = {
		file: file,
		type: type
	};
	return axios.post(url, data, { headers: headers });
};
