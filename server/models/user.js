const Store = require("openrecord/store/sqlite3");

class Users extends Store.BaseModel {
  static definition() {
    this.validatesPresenceOf("userName", "password");
  }

  fullName() {
    return this.firstName + " " + this.lastName;
  }
}

module.exports = Users;
