var prompt = require("prompt");
prompt.message = "SOFA";
prompt.delimiter = ">";

var prompt_attributes = [
  {
    // The fist input text is assigned to username variable.
    name: "username",
    // The username must match below regular expression.
    validator: /^[a-zA-Z\s\-]+$/,
    // If username is not valid then prompt below message.
    warning:
      "Username is not valid, it can only contains letters, spaces, or dashes"
  },
  {
    // The second input text is assigned to password variable.
    name: "password",
    // Do not show password when user input.
    hidden: true
  },
  {
    // The third input text is assigned to email variable.
    name: "email",
    // Display email address when user input.
    hidden: false
  },
  {
    // The third input text is assigned to email variable.
    name: "firstname",
    // Display email address when user input.
    hidden: false
  },
  {
    // The third input text is assigned to email variable.
    name: "lastname",
    // Display email address when user input.
    hidden: false
  }
];

prompt.get(prompt_attributes, function(err, result) {
  if (err) {
    console.log("ERROR: ", err);
    return 1;
  } else {
    // Get user input from result object.
    var username = result.username;
    var password = result.password;
    var email = result.email;
    var firstname = result.firstname;
    var lastname = result.lastname;

    console.log("Username: ", username);
    console.log("Password: ", password);
    console.log("Email: ", email);
    console.log("Firstname: ", firstname);
    console.log("Lastname: ", lastname);
  }
});

prompt.start();
