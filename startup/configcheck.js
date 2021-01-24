const config = require("config");

module.exports = function () {
  console.log("Config Check");
  if (!config.get("jwtPrivateKey")) {
    throw new Error("jwtPrivatekey not defined");
  } else {
    console.log(config.get("jwtPrivateKey"));
    console.log("Application name " + config.get("name"));
    console.log("Mail name " + config.get("mail.host"));
  }
  if (!config.get("dbUser")) {
    throw new Error("dbUser not added");
  } else {
    console.log(config.get("dbUser"));
  }
  if (!config.get("dbUserpassword")) {
    throw new Error("dbUserpassword not set");
  } else {
    console.log(config.get("dbUserpassword"));
  }
  if (!config.get("dbName")) {
    throw new Error("dbName not set");
  } else {
    console.log(config.get("dbName"));
  }
};
