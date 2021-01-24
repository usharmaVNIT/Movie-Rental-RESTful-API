const GENRE = require("../Schema/genreschema");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/forauth");
const authAdmin = require("../middleware/foradmin");
// const asyncMiddleware = require("../middleware/asyncmiddleware");

router.get("/", async (req, res, next) => {
  var genres = await GENRE.genreModel.find();
  res.render("genres.html", {
    genreShow: genres
  });
});

router.get("/:id", auth, async (req, res) => {
  //find movies of genre id
  res.send(req.parems.id);
});

router.delete("/:id", [auth, authAdmin], async (req, res) => {
  const genre = await GENRE.genreModel.findByIdAndRemove(req.params.id);
  if (!genre) res.status(404).send("no genre");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  var obj = {
    name: req.body.name
  };
  var gen = GENRE.genreModel(obj);
  gen = await gen.save();
  res.send(gen);
});

module.exports = router;

// ********************** PROGRAMMING CONCEPT ******************************

// BECAUSE OF THE NPM PACKAGE  EXPRESS-ASYNC-ERRORS WE DO NOT NEED
// TO MANUALLY PASS THE ASYNCMIDDLEWARE FUNCTION JUST MAKE A CALL TO IT IN
// THE STARET I.E index.JS AND WE WILL HAVE THE SAME FUNCTIONALITY AS EARLIER
// BUT IF IT DOSENT WORK YOU NEED TO DO MANUALLY LIKE EARLIER

// const GENRE = require("../Schema/genreschema");
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/forauth");
// const authAdmin = require("../middleware/foradmin");
// const asyncMiddleware = require("../middleware/asyncmiddleware");

// router.get(
//   "/",
//   asyncMiddleware(async (req, res, next) => {
//     var genres = await GENRE.genreModel.find();
//     res.send(genres);
//   })
// );

// router.delete(
//   "/:id",
//   [auth, authAdmin],
//   asyncMiddleware(async (req, res) => {
//     const genre = await GENRE.genreModel.findByIdAndRemove(req.params.id);
//     if (!genre) res.status(404).send("no genre");
//     res.send(genre);
//   })
// );

// router.post(
//   "/",
//   auth,
//   asyncMiddleware(async (req, res) => {
//     var obj = {
//       name: req.body.name
//     };
//     var gen = GENRE.genreModel(obj);
//     gen = await gen.save();
//     res.send(gen);
//   })
// );

// module.exports = router;
