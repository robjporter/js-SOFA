var path = require("path");
const Store = require("data-store");
const verify = require("../helpers/verify");

module.exports = {
	usage
};

async function usage(toke) {
	const token = toke.split(" ")[1].trim();
	return verify(token).then(response => {
		const store = new Store({
			path: path.join(__dirname, "../data", "sec-usage.json")
		});
		return {
			counter: store.get("counter", "0"),
			value: store.get("value", "0"),
			opps: store.get("opportunities", "0"),
			avg: store.get("average", "0")
		};
	});
}

async function updateUsage(toke, counter, value, opps, avg) {
	const token = toke.split(" ")[1].trim();
	return verify(token).then(response => {
		const store = new Store({
			path: path.join(__dirname, "../data", "secs-usage.json")
		});
		if (store) {
			store.set("counter", counter);
			store.set("value", value);
			store.set("opportunities", opps);
			store.set("average", avg);
		}
	});
}
