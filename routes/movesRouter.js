const movesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createMove, getMove, removeMove } = require('../controllers/move');

const url = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

movesRouter.get('/movies', getMove);

movesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(url),
    trailerLink: Joi.string().required().pattern(url),
    thumbnail: Joi.string().required().pattern(url),
    movieId: Joi.number().required().unsafe().integer(),
    nameRU: Joi.string().required(),
    nameEn: Joi.string().required(),
  }).unknown(true),
}), createMove);

movesRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string()
      .alphanum()
      .hex()
      .required()
      .length(24),
  }),
}), removeMove);

module.exports = movesRouter;
