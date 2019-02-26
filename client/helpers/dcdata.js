import axios from "axios";

export const dcData = (token = null) => {
  const url = `/api/dc/usage`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
  return axios.get(url, { headers: headers });
};
