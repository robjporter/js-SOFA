require("rootpath")();
const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");
const fs = require("fs");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const jwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
const AppRouter = require("./router");
const compression = require("compression");
var helmet = require("helmet");

// Express App port - used for development
const eport = 8000;
// Server http port - used for redirects
const usport = 80;
// Server https port - used for main content
const sport = 443;
const app = express();
const options = {
	key: fs.readFileSync("./server/keys/server-key.pem"),
	cert: fs.readFileSync("./server/keys/server-cert.pem")
};
const corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200
};

app.use(morgan("dev"));
app.use((req, res, next) => {
	if (req.secure) {
		// Already secure, move onto next express flow.
		next();
	} else {
		// Redirect to similar HTTPS address
		res.redirect(`https://${req.headers.host}${req.url}`);
	}
});

app.use(express.static("dist"));
app.use(express.static("./server/uploads"));

app.use(compression()); //Compress all routes
//app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	bodyParser.json({
		limit: "50mb"
	})
);
//app.use(cors());
app.use(cors(corsOptions));

// use JWT auth to secure the api
app.use(jwt());

// global error handler
app.use(errorHandler);

// Application wide settings
app.set("Test", "TESTING");
app.set("uploads", "./uploads");

// api routes
new AppRouter(app);

// Create an http endpoint, that will redirect to HTTPS.
http.createServer(app).listen(usport, () => {
	console.log(`Listening on port ${usport}....`);
});

// Creat an HTTPS endpoint - where content will be delivered.
https.createServer(options, app).listen(sport, () => {
	console.log(`Listening on port ${sport}....`);
});
