const express = require("express");
const router = express.Router();
const root = require("../rootname");

router.get("/", (req, res) => {
  console.log("Home route");
  res.render("landing.html");
});

module.exports = router;
