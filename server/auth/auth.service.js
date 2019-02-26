const config = require("../config.json");
const jwt = require("jsonwebtoken");
const users = require("../users.json");
const bcrypt = require("bcrypt-nodejs");

module.exports = {
	authenticate,
	validate,
	role,
	access,
	logout
};

async function logout(toke) {
	const token = toke.split(" ")[1].trim();
	return true;
}

async function authenticate({ username, password }) {
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
	if (toke && toke !== "Bearer") {
		const token = toke.split(" ")[1].trim();

		return jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				return {};
			}

			const userId = decoded.sub;

			const user = users.find(u => u.id === userId);
			if (user) {
				user.firstName = capitalizeFirstLetter(user.firstName);
				user.lastName = capitalizeFirstLetter(user.lastName);
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
