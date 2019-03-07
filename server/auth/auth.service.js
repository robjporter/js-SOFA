const path = require("path");
const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
var fs = require("fs");

const userFilename = path.dirname(module.parent.filename) + "/users.json";

module.exports = {
	authenticate,
	validate,
	role,
	access,
	logout,
	updatePassword,
	fetchUsers,
	addNewUser
};

let users = null;
reloadUsers();

function reloadUsers() {
	users = null;
	users = JSON.parse(fs.readFileSync(userFilename, "utf8"));
}

async function logout(toke) {
	const token = toke.split(" ")[1].trim();
	return true;
}

async function addNewUser(toke, user) {
	return validate(toke).then(response => {
		if (response) {
			reloadUsers();

			user = user.user;
			const exists = users.find(u => u.username === user.username);
			if (exists) {
				return false;
			}
			var fs = require("fs");
			var fileName = userFilename;
			var file = require(fileName);
			let count = users.length;

			user.id = count;
			user.password = bcrypt.hashSync(user.password);
			if (user.admin) {
				user.role = "admin";
			} else {
				user.role = "user";
			}
			delete user.admin;

			file.push(user);

			fs.writeFileSync(fileName, JSON.stringify(file), function(err) {
				if (err) {
					console.log(err);
					return { AddedUser: false };
				}
			});
			return { AddedUser: true };
		}
		return { AddedUser: false };
	});
}

async function fetchUsers(toke) {
	return validate(toke).then(response => {
		if (response) {
			reloadUsers();
			console.log("fetchUsers: ", users.length);
			for (i = 0; i < users.length; i++) {
				users[i].password = undefined;
				delete users[i].password;
			}
			return users;
		} else {
			return {};
		}
	});
}

async function authenticate({ username, password }) {
	reloadUsers();
	const user = users.find(
		u => u.username === username && bcrypt.compareSync(password, u.password)
	);
	if (user) {
		const options = { expiresIn: 60 * 60 };
		const token = jwt.sign({ sub: user.id }, config.secret, options);
		const { password, ...userWithoutPassword } = user;
		return {
			...userWithoutPassword,
			token
		};
	}
}

async function updatePassword(toke, { cPassword, nPassword }) {
	return validate(toke).then(response => {
		if (response) {
			const user = users.find(
				u =>
					u.username === response.username &&
					bcrypt.compareSync(cPassword, u.password)
			);
			if (user) {
				var fs = require("fs");
				var fileName = userFilename;
				var file = require(fileName);

				file[user.id - 1].password = bcrypt.hashSync(nPassword);

				setTimeout(function() {
					fs.writeFileSync(fileName, JSON.stringify(file), function(err) {
						if (err) {
							return { passwordChange: false };
						}
					});
				}, 5);
				return { passwordChange: true };
			}
		}
		return { passwordChange: false };
	});
}

async function role(toke, role) {
	return validate(toke).then(response => {
		if (response) {
			if (response.role.trim() === role.role.trim()) {
				return true;
			} else {
				return false;
			}
		}
	});
}

async function access(toke, access) {
	reloadUsers();
	return validate(toke).then(response => {
		if (response) {
			if (access.access != "*" && access.access != "all") {
				if (response.access.indexOf(access.access) != -1) {
					return true;
				}
				return false;
			}
			return true;
		}
	});
}

async function validate(toke) {
	reloadUsers();
	if (toke && toke !== "Bearer") {
		const token = toke.split(" ")[1].trim();

		return jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				return {};
			}

			const userId = decoded.sub;

			const user = users.find(u => u.id === userId);
			if (user) {
				user.firstname = capitalizeFirstLetter(user.firstname);
				user.lastname = capitalizeFirstLetter(user.lastname);
				const { password, ...userWithoutPassword } = user;
				return {
					...userWithoutPassword
				};
			}
		});
	}
	return {};
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
