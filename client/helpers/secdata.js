import axios from "axios";

export const secData = (token = null) => {
  const url = `/api/sec/usage`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
  return axios.get(url, { headers: headers });
};
