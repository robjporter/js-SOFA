const config = require("../config.json");
const jwt = require("jsonwebtoken");
const users = require("../users.json");

module.exports = verify;

async function verify(token) {
  return jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return false;
    }

    const userId = decoded.sub;

    const user = users.find(u => u.id === userId);
    if (user) {
      return true;
    }
    return false;
  });
}
