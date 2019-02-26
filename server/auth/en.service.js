var path = require("path");
const Store = require("data-store");
const verify = require("../helpers/verify");

module.exports = {
	usage,
	updateUsage
};

async function usage(toke, type) {
	const token = toke.split(" ")[1].trim();
	return verify(token).then(response => {
		const store = new Store({
			path: path.join(__dirname, "../data", "en-usage.json")
		});
		return {
			counter: store.get("counter", 0),
			value: store.get("value", "0"),
			opps: store.get("opportunities", "0"),
			avg: store.get("average", "0")
		};
	});
}

async function updateUsage(toke, value, opps, avg) {
	const token = toke.split(" ")[1].trim();
	return verify(token).then(response => {
		const store = new Store({
			path: path.join(__dirname, "../data", "en-usage.json")
		});
		if (store) {
			let c = store.get("counter", 0);
			let v = store.get("value", 0);
			let o = store.get("opportunities", 0);
			let a = 0;
			let v1 = unCommarize(v);

			c += 1;
			v1 += value;
			o += opps;
			a = v1 / o;

			store.set("counter", c);
			store.set("value", commarize(v1));
			store.set("opportunities", o);
			store.set("average", commarize(a));
		}
	});
}

function commarize(value) {
	// Alter numbers larger than 1k
	if (value >= 1e3) {
		var units = ["k", "M", "B", "T"];

		var order = Math.floor(Math.log(value) / Math.log(1000));

		var unitname = units[order - 1];
		var num = Math.floor(value / 1000 ** order);

		// output number remainder + unitname
		return num + unitname;
	}

	// return formatted original number
	return value.toLocaleString();
}

function unCommarize(value) {
	if (String(value).indexOf("k") >= 0) {
		value = value.replace("k", "");
		let n = parseInt(value);
		return n * 1000;
	} else if (String(value).indexOf("M") >= 0) {
		value = value.replace("M", "");
		let n = parseInt(value);
		return n * 1000000;
	} else if (String(value).indexOf("B") >= 0) {
		value = value.replace("M", "");
		let n = parseInt(value);
		return n * 1000000000;
	} else if (String(value).indexOf("T") >= 0) {
		value = value.replace("M", "");
		let n = parseInt(value);
		return n * 1000000000000;
	}
	return value;
}
