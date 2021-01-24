const mongoose = require("mongoose");
const Joi = require("joi");

const { genreSchema } = require("./genreschema");

const movie = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 1000
  }
});

const Movie = mongoose.model("Movie", movie);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(5).required(),
    dailyRentalRate: Joi.number().min(5).max(1000).required()
  });
  return schema.validate(movie).error;
}

exports.movieSchema = movie;
exports.movieModel = Movie;
exports.validate = validateMovie;
