const mongoose = require("mongoose");

const genre = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Genre = mongoose.model("Genre", genre);

exports.genreSchema = genre;
exports.genreModel = Genre;
