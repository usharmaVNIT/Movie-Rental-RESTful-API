const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 5,
    max: 255,
    required: true
  },
  email: {
    type: String,
    min: 5,
    required: true,
    unique: true
  },
  username: {
    type: String,
    min: 3,
    required: true,
    unique: true
  },
  password: {
    type: String,
    min: 5,
    required: true,
    max: 1024
  },
  isGold: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});
// Applying the    I.E.P for login see auth.js line 23
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      username: this.username,
      isAdmin: this.isAdmin,
      isGold: this.isGold
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
// ************************** CONCEPT **************************
// cannot use arrow function in generateAuthToken as then
// we will lose the this reference instead of referencing the scema
// object arrow function's this will refer to the object which
// called the arrow function itself . (in this case global object)
// ************************** XXX *************************

const User = mongoose.model("USER", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    phone: Joi.string().min(10).max(10).required()
  });
  return schema.validate(user).error;
}

exports.User = User;
exports.validate = validateUser;
