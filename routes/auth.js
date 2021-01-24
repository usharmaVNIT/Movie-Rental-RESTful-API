const USERS = require("../Schema/userschema");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
  console.log(req.body);
  const error = validateUser(req.body);
  if (error) {
    return res.status(400).render("login.html", {
      loginError: error.details[0].message
    });
  }
  var user = await USERS.User.findOne({
    $or: [
      { email: req.body.usernameOrEmail },
      { username: req.body.usernameOrEmail }
    ]
  });
  if (!user) {
    console.log(user);
    return res.status(400).render("login.html", {
      loginError: "* Username/Email or Password not Valid"
    });
  }

  const validpass = await bcrypt.compare(req.body.password, user.password); // This will validate password and take care of the salt which was used for hashing
  if (!validpass) {
    console.log(user.password);
    return res.status(400).render("login.html", {
      loginError: "* Username/Email or Password not Valid"
    });
  }
  // valid user

  // ************************ CONCEPT ************************
  // const token = jwt.sign(
  //   {
  //     _id: user._id
  //   },
  //   config.get("jwtPrivateKey")
  // ); // getting the private key from environment variable
  // Now the above loginc makes sense but we generate tokens in every module
  // O.O.P has a concept of INFORMATION EXPERT PRINCIPAL i.e
  // the object which has the information and is expert should make
  // the decesions so we use the user object to generate the token and in this wat
  // it is much more managable

  // Now one can make another file and have a function like generateUserToken
  // but that will leave too much functions here and there so I.E.P is more suitable
  // ************************ XXX ************************

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["name", "email", "username"]));
});

function validateUser(req) {
  const schema = Joi.object({
    usernameOrEmail: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required()
  });
  return schema.validate(req).error;
}

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
// const Joi = require("joi");
// const asyncMiddleware = require("../middleware/asyncmiddleware");

// router.post(
//   "/",
//   asyncMiddleware(async (req, res) => {
//     console.log(req.body);
//     const error = validateUser(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     var user = await USERS.User.findOne({
//       email: req.body.email
//     });
//     if (!user) return res.status(400).send("Invalid email or password , e");

//     const validpass = await bcrypt.compare(req.body.password, user.password); // This will validate password and take care of the salt which was used for hashing
//     if (!validpass)
//       return res.status(400).send("Invalid email or password , p");
//     // valid user

//     // ************************ CONCEPT ************************
//     // const token = jwt.sign(
//     //   {
//     //     _id: user._id
//     //   },
//     //   config.get("jwtPrivateKey")
//     // ); // getting the private key from environment variable
//     // Now the above loginc makes sense but we generate tokens in every module
//     // O.O.P has a concept of INFORMATION EXPERT PRINCIPAL i.e
//     // the object which has the information and is expert should make
//     // the decesions so we use the user object to generate the token and in this wat
//     // it is much more managable

//     // Now one can make another file and have a function like generateUserToken
//     // but that will leave too much functions here and there so I.E.P is more suitable
//     // ************************ XXX ************************

//     const token = user.generateAuthToken();
//     res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
//   })
// );

// function validateUser(req) {
//   const schema = Joi.object({
//     email: Joi.string().min(5).max(255).required().email(),
//     password: Joi.string().min(5).max(255).required()
//   });
//   return schema.validate(req).error;
// }

// module.exports = router;
