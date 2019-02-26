import axios from "axios";

export const colData = (token = null) => {
  const url = `/api/col/usage`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
  return axios.get(url, { headers: headers });
};
