const router = require("express").Router();
const Movie = require("../models/Movie.model");
const Celebrity = require("../models/Celebrity.model");

// all your routes here
router.get("/", (req, res, next) => {
  Movie.find()
    .then((movies) => {
      res.render("movies/movies", { movies });
    })
    .catch((error) => {
      console.log("Error when listing movies", error);
      next(error);
    });
});

router.get("/create", (req, res, next) => {
  Celebrity.find()
    .then((celebrities) => {
      res.render("movies/new-movie", { celebrities });
    })
    .catch((error) => {
      console.log("Error when searching celebrities", error);
      next(error);
    });
});

router.post("/create", (req, res) => {
  const { title, genre, plot, cast } = req.body;
  Movie.create({ title, genre, plot, cast })
    .then((moviesFromDB) => {
      if (!moviesFromDB) {
        Movie.create({
          title,
          genre,
          plot,
          cast,
        }).then(() => {
          res.redirect("/movies");
        });
      } else {
        res.render("movies/new-movie", {
          message: "It seems you are already registered. 😁  ",
        });
        return;
      }
    })
    .catch((err) => console.log(`Error while creating a new movie: ${err}`));
});

router.get("/:movieId", async (req, res) => {
  const movie = await Movie.findById(req.params.movieId);
  res.render("movies/movie-details", { movie });
});

router.get("/:id/update", async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findById(id);
  res.render("movies/edit-movie", { movie });
});

router.post("/:id/update", async (req, res, next) => {
  const { id } = req.params;
  await Movie.findByIdAndUpdate(id, req.body);
  res.redirect("/movies");
});

router.post("/:id/delete", async (req, res) => {
  const { id } = req.params;
  await Movie.findByIdAndDelete(id);
  res.redirect("/movies");
});
module.exports = router;
