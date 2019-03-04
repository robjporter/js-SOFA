import axios from "axios";

export const updatePassword = (
	token = null,
	cPassword = null,
	nPassword = null
) => {
	const url = "/api/auth/updatepassword";
	const headers = {
		"Content-Type": "application/json",
		Authorization: "Bearer " + token
	};
	const data = {
		cPassword: cPassword,
		nPassword: nPassword
	};
	return axios.post(url, data, { headers: headers });
};
