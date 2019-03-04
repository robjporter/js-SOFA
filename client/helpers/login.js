import axios from "axios";

export const login = (email = null, password = null) => {
	const url = "/api/auth/authenticate";
	return axios.post(url, {
		username: email,
		password: password
	});
};
