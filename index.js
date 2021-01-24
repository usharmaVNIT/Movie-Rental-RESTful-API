const express = require("express");
const app = express();
const winsten = require("winston");
require("express-async-errors");

require("./startup/configcheck")();

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.set("views", "./views");

require("./startup/loggingerrors")();
require("./startup/databaseconnect")();
require("./startup/routes")(app);
require("./startup/production")(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listining at ${port} ... `);
  winsten.info(`Listining at ${port} ... `);
});

module.exports = server;
