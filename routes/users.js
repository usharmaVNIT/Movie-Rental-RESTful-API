const USERS = require("../Schema/userschema");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/forauth");

// The auth middleware sets the user in req parameter
// and it is more secure

router.get("/me", auth, async (req, res) => {
  var user = await USERS.User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const error = USERS.validate(req.body);
  if (error) {
    console.log("error : ", error);
    // return res.status(400).send(error.details[0].message);
    return res.status(400).render("signup.html", {
      signupError: error.details[0].message
    });
  }
  var user = await USERS.User.findOne({
    $or: [
      {
        username: req.body.username
      },
      {
        email: req.body.email
      }
    ]
  });

  if (user) {
    return res.status(400).render("signup.html", {
      signupError: "* Username or Email already registered..."
    });
  }
  user = new USERS.User(req.body);
  const salt = await bcrypt.genSalt(10);
  const hashpass = await bcrypt.hash(req.body.password, salt);
  user.password = hashpass;
  user = await user.save();
  console.log("Saved or Registered .");
  const token = user.generateAuthToken();
  req.user = {
    _id: user.id,
    username: user.username,
    name: user.name
  };
  res.header("x-auth-token", token); // it is an arbitrary header therefore started with x-
  res.send(_.pick(user, ["_id", "name", "email", "username"]));
});

module.exports = router;

// ********************** PROGRAMMING CONCEPT ******************************

// BECAUSE OF THE NPM PACKAGE  EXPRESS-ASYNC-ERRORS WE DO NOT NEED
// TO MANUALLY PASS THE ASYNCMIDDLEWARE FUNCTION JUST MAKE A CALL TO IT IN
// THE STARET I.E index.JS AND WE WILL HAVE THE SAME FUNCTIONALITY AS EARLIER
// BUT IF IT DOSENT WORK YOU NEED TO DO MANUALLY LIKE EARLIER

// const USERS = require("../Schema/userschema");
// const express = require("express");
// const router = express.Router();
// const _ = require("lodash");
// const bcrypt = require("bcrypt");
// const auth = require("../middleware/forauth");
// const asyncMiddleware = require("../middleware/asyncmiddleware");

// // The auth middleware sets the user in req parameter
// // and it is more secure

// router.get(
//   "/me",
//   auth,
//   asyncMiddleware(async (req, res) => {
//     var user = await USERS.User.findById(req.user._id).select("-password");
//     res.send(user);
//   })
// );

// router.post(
//   "/",
//   asyncMiddleware(async (req, res) => {
//     console.log(req.body);
//     const error = USERS.validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     var user = await USERS.User.findOne({
//       email: req.body.email
//     });
//     if (user) return res.status(400).send("User already Registered.");

//     user = new USERS.User(_.pick(req.body, ["name", "email", "password"]));
//     const salt = await bcrypt.genSalt(10);
//     const hashpass = await bcrypt.hash(req.body.password, salt);
//     user.password = hashpass;
//     user = await user.save();
//     console.log("Saved or Registered .");
//     const token = user.generateAuthToken();

//     res.header("x-auth-token", token); // it is an arbitrary header therefore started with x-
//     res.send(_.pick(user, ["_id", "name", "email"]));
//   })
// );

// module.exports = router;
