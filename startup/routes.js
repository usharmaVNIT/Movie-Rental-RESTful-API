const express = require("express");
const bodyParser = require("body-parser");

const homeroute = require("../routes/home");
const movroute = require("../routes/movies");
const usersrouter = require("../routes/users");
const authrouter = require("../routes/auth");
const genreroute = require("../routes/genre");
const loginsignroute = require("../routes/loginsign");
const rentalRoute = require("../routes/rentals");

const errorhandler = require("../middleware/forerror");

function routeHandler(app) {
  app.use(express.json());
  app.use(express.static("public"));
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(express.static("public"));
  app.use("/", homeroute);
  app.use("/login-signup", loginsignroute);
  app.use("/api/movies", movroute);
  app.use("/api/genre", genreroute);
  app.use("/users", usersrouter);
  app.use("/auth", authrouter);
  app.use("/api/rentals", rentalRoute);

  // error handling
  app.use(errorhandler); // Not calling only passing a reference
}

module.exports = routeHandler;
