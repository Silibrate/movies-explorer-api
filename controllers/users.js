const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const { password, email, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      name,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      if (e.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует!'));
      }
      if (e instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Ошибка валидации'));
      }
      return next(e);
    });
};

const getUsersMe = (req, res, next) => {
  User.findById(req.user._id).orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.message === 'NotFound') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return next(e);
    });
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const newUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    return res.send(newUser);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError || e instanceof mongoose.Error.CastError) {
      return next(new BadRequestError('Ошибка валидации. Переданные данные не корректны'));
    } if (e.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует!'));
    }
    return next(e);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          if (!token) {
            return Promise.reject(new Error('Ошибка токена'));
          }
          return res.status(200).send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUsersMe,
  updateUser,
};
