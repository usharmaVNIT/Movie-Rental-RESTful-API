const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).render("login.html", {
      loginError: "* Log-in To Continue"
    });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).render("login.html", {
      loginError: "* Log-in To Continue"
    });
  }
}

module.exports = auth;
