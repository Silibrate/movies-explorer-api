const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUsersMe, updateUser } = require('../controllers/users');

usersRouter.get('/users/me', getUsersMe);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}, {
  params: Joi.object().keys({
    _id: Joi.string()
      .alphanum()
      .hex()
      .required()
      .length(24),
  }),
}), updateUser);

module.exports = usersRouter;
