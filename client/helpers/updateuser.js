import axios from "axios";

export const updateUser = (token = null, user = null) => {
  const url = "/api/users/updateuser";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
  const data = {
    userid: user
  };
  return axios.post(url, data, { headers: headers });
};
