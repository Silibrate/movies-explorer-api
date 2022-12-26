const mongoose = require('mongoose');
const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return next(e);
      }
      return next(e);
    });
};

const getMovie = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch(() => {
      const err = new Error('На сервере произошла ошибка');
      err.statusCode = 500;
      return next(err);
    });
};

const removeMovie = async (req, res, next) => {
  Movie
    .findById(req.params.movieId).orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return Movie.findByIdAndRemove(req.params.movieId);
      }
      throw new ForbiddenError('Нельзя удалять чужие фильмы');
    })
    .then(() => res.send([]))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Не корректный id'));
      }
      return next(e);
    });
};

module.exports = { createMovie, getMovie, removeMovie };
