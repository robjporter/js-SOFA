import axios from "axios";

export const loadUser = (token = null, userid = null) => {
  const url = "/api/users/fetchuser";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
  const data = {
    userid: userid
  };
  return axios.post(url, data, { headers: headers });
};
