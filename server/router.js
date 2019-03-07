const userService = require("./auth/auth.service");
const enService = require("./auth/en.service");
const dcService = require("./auth/dc.service");
const colService = require("./auth/col.service");
const secService = require("./auth/sec.service");
const fileService = require("./auth/file.service");
const adminService = require("./auth/admin.service");
const _ = require("lodash");
const fs = require("fs");
const IncomingForm = require("formidable").IncomingForm;

class AppRouter {
	constructor(app) {
		this.app = app;
		this.setupRouters();
	}
	setupRouters() {
		const app = this.app;
		//console.log(app.get("Test"));

		// -----------------------------------------------
		// SYSTEM - routes
		// -----------------------------------------------

		app.get("/api/version", (req, res, next) => {
			const { version, sofa } = require("../package.json");
			return res.status(200).json({
				appVersion: version,
				backendVersion: sofa.backendVersion,
				frontendVersion: sofa.frontendVersion
			});
		});

		// -----------------------------------------------
		// USER - routes
		// -----------------------------------------------

		app.post("/api/users/adduser", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}

			userService
				.addNewUser(token, req.body)
				.then(response => {
					if (response) {
						return res.status(200).json(response);
					}
					return res.status(200).json(false);
				})
				.catch(err => {
					console.log(err);
				});
		});

		app.get("/api/users/fetchusers", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}

			userService
				.fetchUsers(token)
				.then(response => {
					if (response) {
						return res.status(200).json(response);
					}
					return res.status(200).json(false);
				})
				.catch(err => {
					console.log(err);
				});
		});

		app.get("/api/users/deleteuser", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
		});

		// -----------------------------------------------
		// ADMIN - routes
		// -----------------------------------------------

		app.get("/api/admin/usagedata", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			adminService
				.usage(token)
				.then(response => {
					if (response) {
						res.status(200).json(response);
					}
				})
				.catch(err => next(err));
		});

		// -----------------------------------------------
		// FILE - routes
		// -----------------------------------------------

		app.post("/api/files/deleteuploadedreport", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			fileService
				.deleteFile(token, req.body)
				.then(response => {
					console.log(response);
					if (response) {
						res.status(200).json(response);
					}
				})
				.catch(err => next(err));
		});

		app.get("/api/files/uploadedreports", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			fileService
				.files(token)
				.then(response => {
					if (response) {
						res.status(200).json(response);
					}
					return;
				})
				.catch(err => next(err));
		});

		app.post("/api/files/uploadreport", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			var form = new IncomingForm();
			form.on("file", (field, file) => {
				fs.createReadStream(file.path).pipe(
					fs.createWriteStream("./server/uploads/reports/" + file.name)
				);
			});
			form.on("end", () => {
				res.json();
			});
			form.parse(req);
		});

		app.get("/api/files/reports", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			fileService
				.files(token)
				.then(response => {
					if (response) {
						res.status(200).json(response);
					}
				})
				.catch(err => next(err));
		});

		app.post("/api/files/generatedreports", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			fileService
				.generated(token, req.body)
				.then(response => {
					if (response) {
						res.status(200).json(response);
					}
				})
				.catch(err => next(err));
		});

		app.post("/api/files/generate", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			fileService
				.generate(token, req.body)
				.then(response => {
					if (response) {
						res.status(200).json(response);
					}
				})
				.catch(err => next(err));
		});

		app.get("/api/files/download", (req, res) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			fileService
				.download(token, req.headers["content-disposition"])
				.then(response => {
					if (response) {
						res.download(response);
						/*
						var img = fs.readFileSync(response);
						res.writeHead(200, { "Content-Type": "application/vnd.ms-excel" });
						res.end(img, "binary");
						*/
					}
				});
		});

		// -----------------------------------------------
		// EN - routes
		// -----------------------------------------------

		app.get("/api/en/usage", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			enService
				.usage(token)
				.then(response => {
					if (_.isEmpty(response)) {
						res.status(400).json({ message: "Unable to load data" });
					} else {
						res.status(200).json(response);
					}
				})
				.catch(err => next(err));
		});

		// -----------------------------------------------
		// DC - routes
		// -----------------------------------------------

		app.get("/api/dc/usage", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			dcService
				.usage(token)
				.then(response => {
					if (_.isEmpty(response)) {
						res.status(400).json({ message: "Unable to load data" });
					} else {
						res.status(200).json(response);
					}
				})
				.catch(err => next(err));
		});

		// -----------------------------------------------
		// COL - routes
		// -----------------------------------------------

		app.get("/api/col/usage", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			colService
				.usage(token)
				.then(response => {
					if (_.isEmpty(response)) {
						res.status(400).json({ message: "Unable to load data" });
					} else {
						res.status(200).json(response);
					}
				})
				.catch(err => next(err));
		});

		// -----------------------------------------------
		// SEC - routes
		// -----------------------------------------------

		app.get("/api/sec/usage", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			secService
				.usage(token)
				.then(response => {
					if (_.isEmpty(response)) {
						res.status(400).json({ message: "Unable to load data" });
					} else {
						res.status(200).json(response);
					}
				})
				.catch(err => next(err));
		});

		// -----------------------------------------------
		// AUTH - routes
		// -----------------------------------------------

		app.post("/api/auth/updatepassword", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			userService
				.updatePassword(token, req.body)
				.then(response => {
					if (response.passwordChange) {
						return res.status(200).json({ message: "DONE" });
					}
					return res.status(200).json({ message: "Failed to update password" });
				})
				.catch(err => next(err));
		});

		app.post("/api/auth/logout", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			userService
				.logout(token)
				.then(response => {
					//req.session.destroy();
					return res.status(200).json({ message: "Logout success" });
				}) //status(200).json({ message: "Logout success" }))
				.catch(err => next(err));
		});

		app.post("/api/auth/authenticate", (req, res, next) => {
			userService
				.authenticate(req.body)
				.then(user =>
					user
						? res.json(user)
						: res
							.status(400)
							.json({ message: "Username or password is incorrect" })
				)
				.catch(err => next(err));
		});

		app.post("/api/auth/validate", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			userService
				.validate(token)
				.then(response => {
					if (_.isEmpty(response)) {
						res.status(401).json({ message: "Invalid token provided." });
					} else {
						res.status(200).json(response);
					}
				})
				.catch(err => next(err));
		});

		app.post("/api/auth/queryrole", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			userService
				.role(token, req.body)
				.then(response => {
					if (response) {
						res.status(200).json(response);
					} else {
						res.status(400).json({ message: "Invalid role provided." });
					}
				})
				.catch(err => next(err));
		});

		app.post("/api/auth/queryaccess", (req, res, next) => {
			const token = req.headers.authorization;
			if (!token) {
				res.status(400).json({ message: "Invalid token provided." });
			}
			userService
				.access(token, req.body)
				.then(response => {
					if (response) {
						res.status(200).json(response);
					} else {
						res.status(400).json({ message: "Invalid access provided." });
					}
				})
				.catch(err => next(err));
		});
	}
}

module.exports = AppRouter;
