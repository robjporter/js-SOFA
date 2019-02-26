import axios from "axios";

export const ReportData = (token = null, type = null) => {
	const url = `/api/files/generatedreports`;
	const headers = {
		"Content-Type": "application/json",
		Authorization: "Bearer " + token
	};
	const data = {
		type: type
	};
	return axios.post(url, data, { headers: headers });
};
