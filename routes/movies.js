const express = require("express");
const router = express.Router();
const auth = require("../middleware/forauth");

const { movieModel, validate } = require("../Schema/movieschema");
const { genreModel } = require("../Schema/genreschema");
// const asyncMiddleware = require("../middleware/asyncmiddleware");

router.get("/", async (req, res) => {
  const movies = await movieModel.find();
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  console.log("id called");
  const mov = await movieModel.findById(req.params.id);
  if (!mov) return res.status(404).send("Error Id Not Found");
  res.send(mov);
});

// router.get("/:genre", async (req, res) => {
//   try {
//     console.log("genre called");
//     var gen = await genreModel.findOne({name:req.body.genre});
//     if(!gen){
//       return res.status(500).send("Invalid Genre");
//     }
//     const mov = await movieModel.find({
//       genre: {
//         _id: gen._id,
//         name : gen.name
//       }
//     });
//     if (!mov) return res.status(404).send("Genre Not Found");
//     res.send(mov);
//   } catch (err) {
//     console.log(err);
//     res.send(err);
//   }
// });

router.post("/", auth, async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  var gen = await genreModel.findById(req.body.genreId);
  if (!gen) {
    return res.status(500).send("Invalid Genre");
  }
  var obj = {
    title: req.body.title,
    genre: {
      _id: gen._id,
      name: gen.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  };
  const mov = new movieModel(obj);
  const result = await mov.save();
  res.send(result);
});

router.put("/:id", auth, async (req, res) => {
  const mov = await movieModel.findOne({ _id: req.params.id });
  if (!mov) return res.status(404).send("Invalid Id");
  var error = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  if (req.body.genreId) {
    const gen = await genreModel.findById(req.body.genreId);
    if (!gen) {
      return res.status(500).send("Invalid Genre");
    }
    mov.genre._id = gen._id;
    mov.genre.name = gen.name;
  }
  mov.title = req.body.title;
  const result = await mov.save();
  res.send(result);
});

module.exports = router;

// ********************** PROGRAMMING CONCEPT ******************************

// BECAUSE OF THE NPM PACKAGE  EXPRESS-ASYNC-ERRORS WE DO NOT NEED
// TO MANUALLY PASS THE ASYNCMIDDLEWARE FUNCTION JUST MAKE A CALL TO IT IN
// THE STARET I.E index.JS AND WE WILL HAVE THE SAME FUNCTIONALITY AS EARLIER
// BUT IF IT DOSENT WORK YOU NEED TO DO MANUALLY LIKE EARLIER

// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const validateInput = require("../validateInput");

// const { movieModel } = require("../Schema/movieschema");
// const { genreModel } = require("../Schema/genreschema");
// const asyncMiddleware = require("../middleware/asyncmiddleware");

// router.get(
//   "/",
//   asyncMiddleware(async (req, res) => {
//     const movies = await movieModel.find();
//     res.send(movies);
//   })
// );

// router.get(
//   "/:id",
//   asyncMiddleware(async (req, res) => {
//     console.log("id called");
//     const mov = await movieModel.findById(req.params.id);
//     if (!mov) return res.status(404).send("Error Id Not Found");
//     res.send(mov);
//   })
// );

// // router.get("/:genre", async (req, res) => {
// //   try {
// //     console.log("genre called");
// //     var gen = await genreModel.findOne({name:req.body.genre});
// //     if(!gen){
// //       return res.status(500).send("Invalid Genre");
// //     }
// //     const mov = await movieModel.find({
// //       genre: {
// //         _id: gen._id,
// //         name : gen.name
// //       }
// //     });
// //     if (!mov) return res.status(404).send("Genre Not Found");
// //     res.send(mov);
// //   } catch (err) {
// //     console.log(err);
// //     res.send(err);
// //   }
// // });

// router.post(
//   "/",
//   asyncMiddleware(async (req, res) => {
//     const error = validateInput(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     var gen = await genreModel.findOne({ name: req.body.genre });
//     if (!gen) {
//       return res.status(500).send("Invalid Genre");
//     }
//     var obj = {
//       name: req.body.name,
//       genre: {
//         _id: gen._id,
//         name: gen.name
//       }
//     };
//     const mov = new movieModel(obj);
//     const result = await mov.save();
//     res.send(result);
//   })
// );

// router.put(
//   "/:id",
//   asyncMiddleware(async (req, res) => {
//     const mov = await movieModel.findOne({ _id: req.params.id });
//     if (!mov) return res.status(404).send("Invalid Id");
//     var error = validateInput(req.body);
//     if (error) return res.status(404).send(error.details[0].message);
//     if (req.body.genre) {
//       const gen = await genreModel.findOne({ name: req.body.genre });
//       if (!gen) {
//         return res.status(500).send("Invalid Genre");
//       }
//       mov.genre._id = gen._id;
//       mov.genre.name = gen.name;
//     }
//     if (req.body.name) {
//       mov.name = req.body.name;
//     }
//     const result = await mov.save();
//     res.send(result);
//   })
// );

// module.exports = router;
