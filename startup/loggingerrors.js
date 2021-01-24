const winston = require("winston");
require("winston-mongodb");
const config = require("config");

module.exports = function () {
  console.log("Logging Errors");
  var dbUser = config.get("dbUser");
  var dbUserpassword = config.get("dbUserpassword");
  var dbName = config.get("dbName");
  var mongooseurl ;
  winston.add(
    new winston.transports.File({
      filename: "logfile.log"
    })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: mongooseurl
    })
  );
  winston.add(
    new winston.transports.Console({
      colorize: true,
      pretty: true
    })
  );

  process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception : ", err.message);
  });

  winston.exceptions.handle(
    new winston.transports.File({
      filename: "uncaughtException.log"
    })
  );
  // winston.exceptions.handle(
  //   new winston.transports.Console({
  //     colorize: true,
  //     pretty: true
  //   })
  // );

  process.on("unhandledRejection", (err) => {
    throw err;
  });
};

// This module will catch error outside the express
