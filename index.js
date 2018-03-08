// Main starting point of app

const express = require("express");
const http = require("http"); // native node library. Library for working low level with incoming http requests
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express(); // An instance of express, which is our app. We'll be adding functionality to it over time
const router = require("./Router");
const mongoose = require("mongoose");
const cors = require("cors");

// Db setup
mongoose.connect("mongodb://localhost:/auth"); // creates a new DB inside of mongoDB called 'auth'
// ******** run by typing 'mongod' in the terminal in project directory

// App setup (get express working the way we want it to)
// Morgan and body-parser are Middleware (any incoming request is going to passed into these by default)
// *app.use registers these as middleware
app.use(morgan("combined")); // Morgan is a logging framework. It prints info on command line
app.use(cors());
app.use(bodyParser.json({ type: "*/*" })); // used to parse incoming requests - specifically into JSON. Attempts to
// parse no matter what the request type is.
router(app);

// Server setup (getting express to talk to the outside world)
const port = process.env.PORT || 3090; //Use port 3090 unless port already setup on your local computer
const server = http.createServer(app); //Create an http server that knows how to receive requests
// and anything that comes in, go ahead and forward onto our express application
server.listen(port);
console.log("server listening on port: ", port);

// ******** To run nodemon, run 'npm run dev'. This will run the script in package.json*/
