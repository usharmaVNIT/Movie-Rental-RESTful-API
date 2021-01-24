const express = require("express");
const router = express.Router();
const root = require("../rootname");

router.get("/login", (req, res) => {
  console.log("Login route");
  res.render("login.html", {
    loginError: null
  });
});

router.get("/signup", (req, res) => {
  console.log("Signup route");
  res.render("signup.html", { signupError: null });
});

module.exports = router;
