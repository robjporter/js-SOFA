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

// Express App port - used for development
const eport = 9000;
// Server http port - used for redirects
const usport = 80;
// Server https port - used for main content
const sport = 9000;
const app = express();
//const options = {
//	key: fs.readFileSync("./server/keys/server-key.pem"),
//	cert: fs.readFileSync("./server/keys/server-cert.pem")
//};

const whitelist = [
	"http://localhost:8000",
	"http://js-SOFA-roporter985721.codeanyapp.com"
];

const corsOptions = {
	origin: whitelist,
	optionsSuccessStatus: 200,
	setHeaders: function(res, path, stat) {
		res.set("x-timestamp", Date.now());
	}
};

console.log("Environment: ", process.env.NODE_ENV);

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, Content-Length, X-Requested-With"
	);
	res.header("Access-Control-Allow-Credentials", "true");

	//intercepts OPTIONS method
	if ("OPTIONS" === req.method) {
		//respond with 200
		res.sendStatus(200);
	} else {
		//move on
		next();
	}
});

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.static("dist"));
app.use(express.static("./server/uploads"));
app.options("*", cors(corsOptions));
app.use(compression()); //Compress all routes
//app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	bodyParser.json({
		limit: "50mb"
	})
);

// use JWT auth to secure the api
app.use(jwt());

// global error handler
app.use(errorHandler);
// Application wide settings
app.set("Test", "TESTING");
app.set("uploads", "./uploads");

// api routes
new AppRouter(app);

app.get("*", async (req, res) => {
	return res.status(404).json({ data: "Not Found..." });
});

// Create an http endpoint, that will redirect to HTTPS.
//http.createServer(app).listen(usport, () => {
//	console.log(`Listening on port ${usport}....`);
//});

http.createServer(app).listen(sport, () => {
	console.log(`Listening on port ${sport}....`);
});

// Create an HTTPS endpoint - where content will be delivered.
//https.createServer(options, app).listen(sport, () => {
//	console.log(`Listening on port ${sport}....`);
//});
