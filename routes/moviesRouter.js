const moviesRouter = require('express').Router();
const { validateMovie, validateMovieId } = require('../middlewares/validate');
const { createMovie, getMovie, removeMovie } = require('../controllers/movie');

moviesRouter.get('/movies', getMovie);

moviesRouter.post('/movies', validateMovie, createMovie);

moviesRouter.delete('/movies/:movieId', validateMovieId, removeMovie);

module.exports = moviesRouter;
