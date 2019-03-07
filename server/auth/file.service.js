var path = require("path");
const verify = require("../helpers/verify");
const csv = require("csv-parser");
const fs = require("fs");
const json2csv = require("json2csv").parse;
const en = require("./en.service");

module.exports = {
	files,
	generate,
	download,
	generated,
	deleteFile
};

async function files(toke) {
	const token = toke.split(" ")[1].trim();
	return verify(token).then(response => {
		if (response) {
			let data = [];
			fs.readdirSync(
				path.dirname(module.parent.filename) + "/uploads/reports"
			).forEach(file => {
				// Fix to ignore .DS_STORE files for MAC
				if (file.endsWith(".csv")) {
					data.push(file);
				}
			});
			return data;
		}
		return {};
	});
}

async function deleteFile(toke, { file }) {
	const token = toke.split(" ")[1].trim();
	return verify(token).then(response => {
		if (response) {
			fs.unlink(
				path.dirname(module.parent.filename) + "/uploads/reports/" + file,
				err => {
					if (err) {
						console.log("ERROR: ", err);
						return false;
					}
					return false;
				}
			);
			return true;
		}
		return false;
	});
}

async function generate(toke, { file, type }) {
	const token = toke.split(" ")[1].trim();
	return verify(token).then(response => {
		if (response) {
			return processData(
				path.dirname(module.parent.filename) + "/uploads/reports/" + file,
				type,
				toke
			)
				.then(response => {
					if (response) {
						return response;
					}
				})
				.catch(error => {
					console.log("ERROR: ", error);
					return error;
				});
		} else {
			return {};
		}
	});
}

async function download(toke, file) {
	const token = toke.split(" ")[1].trim();
	return verify(token).then(response => {
		if (response) {
			var filePath =
				path.dirname(module.parent.filename) + "/uploads/generated/";
			var splits = file.split("-");
			filePath = filePath.concat(splits[0], "/", file);
			return filePath;
		}
	});
}

async function generated(toke, type) {
	const token = toke.split(" ")[1].trim();
	return verify(token).then(response => {
		if (response) {
			let data = [];
			fs.readdirSync(
				path.dirname(module.parent.filename) +
					"/uploads/generated/" +
					getTypeShortName(type.type) +
					"/"
			).forEach(file => {
				// Fix to ignore .DS_STORE files for MAC
				if (file.endsWith(".csv")) {
					data.push(file);
				}
			});
			return data;
		}
	});
}

async function processData(file, type, toke) {
	const readFilePromise = (file, type, toke) => {
		return new Promise((resolve, reject) => {
			let results = [];
			fs.createReadStream(file)
				.pipe(csv())
				.on("data", data => results.push(data))
				.on("error", err => {
					reject(err);
				})
				.on("end", () => {
					if (results && results.length > 0) {
						processResults(results, type, toke).then(response => {
							resolve(response);
						});
					}
				});
		});
	};

	return readFilePromise(file, type, toke)
		.then(result => {
			return result;
		})
		.catch(error => {
			return error;
		});
}

async function processResults(results, type, toke) {
	const recordCount = results.length;
	const interested = loadInterestedData(type);
	let interesting = [];
	let processed = 0;
	let value = 0;
	let opportunities = 0;

	for (let i = 0; i < results.length; i++) {
		let lookAt = [];
		let original = [];
		let res = results[i]["Technologies"].split(";");

		// Iterate over the split record Technologies
		if (res.length > 0) {
			// res is an array
			for (let j = 0; j < res.length; j++) {
				lookAt.push(res[j]);
				original.push(res[j]);
			}
		} else {
			lookAt.push(res);
			original.push(res);
		}

		// Iterate over all split record technologies
		for (let j = 0; j < lookAt.length; j++) {
			lookAt[j] = lookAt[j].replace(/ *\([^)]*\) */g, "");
		}

		// Validate we have interesting technologies to process
		if (lookAt.length > 0 && lookAt[0] !== "") {
			// Iterate over the technologies
			for (let j = 0; j < lookAt.length; j++) {
				// Copy active record
				let record = Object.assign({}, results[i]);
				// Ensure the active record contains the interesting technology
				if (record["Technologies"].includes(lookAt[j])) {
					// replace the technology with the original containing percentage
					record["Technologies"] = original[j];
					opportunities += 1;
					value += record["Expected Product ($000s)"] * 1000;
					interesting.push(record);
				}
			}
			processed += 1;
		}
	}

	let complete = saveProcessedData(interesting, type);

	if (!complete) {
	} else {
		updateUsageInfo(toke, value, opportunities);
		return {
			success: true,
			file: getShortFileName(complete),
			type: type,
			interested: interested.length,
			records: recordCount,
			processed: processed,
			outputRecords: interesting.length
		};
	}
}

function updateUsageInfo(toke, value, opps) {
	const avg = value / opps;
	en.updateUsage(toke, value, opps, avg);
	console.log("VALUE: ", value);
	console.log("OPPS: ", opps);
	console.log("AVG: ", avg);
}

function loadInterestedData(type) {
	switch (type) {
	case "Enterprise Networks":
		return require("../data/en-interesting.json");
	case "DataCenter":
		return require("../data/dc-interesting.json");
	case "Collaboration":
		return require("../data/col-interesting.json");
	case "Security":
		return require("../data/sec-interesting.json");
	default:
		return "";
	}
}

function saveProcessedData(data, type) {
	if (data.length > 0) {
		const keys = Object.keys(data[0]);
		const location = getSaveLocation(type);
		try {
			const csv = json2csv(data, { keys });
			fs.writeFile(location, csv, err => {
				if (err) {
					return console.log(err);
				}

				console.log("The file was saved!");
			});
		} catch (err) {
			console.log(err);
		}
		return location;
	}
	return false;
}

function getSaveLocation(type) {
	let location = path.dirname(module.parent.filename) + "/uploads/generated";
	const shortName = getTypeShortName(type);
	location = location.concat("/", shortName, "/", getFileName(shortName));
	return location;
}

function getShortFileName(filename) {
	const splits = filename.split("/");
	return splits[splits.length - 1];
}

function getTypeShortName(type) {
	switch (type) {
	case "Enterprise Networks":
		return "en";
	case "DataCenter":
		return "dc";
	case "Collaboration":
		return "col";
	case "Security":
		return "sec";
	default:
		return "";
	}
}

function getFileName(name) {
	var currentDate = new Date();
	var date = currentDate.getDate();
	var month = currentDate.getMonth(); //Be careful! January is 0 not 1
	var year = currentDate.getFullYear();
	var hh = currentDate.getUTCHours();
	var mm = currentDate.getUTCMinutes();
	var ss = currentDate.getSeconds();

	let fileName = name;
	fileName = fileName.concat(
		"-",
		year,
		pad(month + 1),
		pad(date),
		pad(hh),
		pad(mm),
		pad(ss),
		".csv"
	);
	return fileName;
}

function pad(n) {
	return n < 10 ? "0" + n : n;
}
