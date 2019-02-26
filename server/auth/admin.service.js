const verify = require("../helpers/verify");

module.exports = {
	usage
};

async function usage(toke) {
	const token = toke.split(" ")[1].trim();
	return verify(token).then(response => {
		return "HERE";
	});
}
