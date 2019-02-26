import axios from "axios";

export const enData = (token = null) => {
  const url = `/api/en/usage`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
  return axios.get(url, { headers: headers });
};
