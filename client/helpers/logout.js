import axios from "axios";

export const logout = (token = null) => {
  const url = `/api/auth/logout`;
  const data = "";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
  return axios.post(url, data, { headers: headers });
};
