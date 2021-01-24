const mongoose = require("mongoose");
const winsten = require("winston");
const config = require("config");

module.exports = function () {
  console.log("Database Connect");
  // dbUser->dbUserpassword
  var dbUser = config.get("dbUser");
  var dbUserpassword = config.get("dbUserpassword");
  var dbName = config.get("dbName");
  var mongooseurl ;
  mongoose
    .connect(mongooseurl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() =>
      winsten.info(
        `Connected to mongodb of , ${dbUser} , ${dbUserpassword} , ${dbName}`
      )
    );
  // .catch((err) => console.log("Could not connect ", err));
  // Will be handled in unhandled Promise code of winston
};
