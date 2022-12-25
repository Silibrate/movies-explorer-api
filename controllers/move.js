/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Move = require('../models/move');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const createMove = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, thumbnail, movieId, nameRU, nameEn,
  } = req.body;
  Move.create({
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
    nameEn,
    owner: req.user._id,
  })
    .then((move) => res.status(200).send({ data: move }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return next(e);
      }
      return next(e);
    });
};

const getMove = (req, res, next) => {
  Move.find({})
    .then((move) => {
      res.status(200).send(move);
    })
    .catch(() => {
      const err = new Error('На сервере произошла ошибка');
      err.statusCode = 500;
      return next(err);
    });
};

const removeMove = async (req, res, next) => {
  Move
    .findById(req.params.movieId).orFail(new NotFoundError('Фильм не найден'))
    .then((move) => {
      if (move.owner.toString() === req.user._id) {
        return Move.findByIdAndRemove(req.params.movieId);
      }
      throw new ForbiddenError('Нельзя удалять чужие карточки');
    })
    .then(() => res.send([]))
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Не корректный id'));
      }
      next(e);
    });
};

module.exports = { createMove, getMove, removeMove };
