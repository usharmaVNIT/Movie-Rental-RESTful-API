const Joi = require("joi");

function validateInput(inp) {
  const scema = Joi.object({
    name: Joi.string().min(2).required(),
    genre: Joi.string().min(2).required()
  });
  return scema.validate(inp).error;
}

module.exports = validateInput;
