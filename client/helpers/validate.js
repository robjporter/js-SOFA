import axios from "axios";

export const validate = (token = null) => {
  const url = `/api/auth/validate`;
  const data = "";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
  return axios.post(url, data, { headers: headers });
};
