const { Rental, validate } = require("../Schema/rentalschema");
const { movieModel } = require("../Schema/movieschema");
const { User } = require("../Schema/userschema");

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Fawn = require("fawn");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  var rentals = Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const error = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const customer = await User.findById(req.body.customerId);
  if (!customer) {
    return res.status(400).send("Invalid Customer");
  }
  const movie = await movieModel.findById(req.body.movieId);
  if (!movie) {
    return res.status(400).send("Invalid movie ID");
  }
  if (movie.numberInStock === 0) {
    return res.status(400).send("Movie not in stock");
  }
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  // Now we need to update 2 databases and that to in a
  // atomic fashion therfore the concept of transaction is there
  // Now mongodb simulates a transaction via 2 phase commits but
  // we will use a npm package called fawn to ease our work
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: {
            numberInStock: -1
          }
        }
      )
      .run();
    res.send(rental);
  } catch (err) {
    res.status.send("Someting Failed");
  }
});

module.exports = router;
