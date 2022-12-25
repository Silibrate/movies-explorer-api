/* eslint-disable consistent-return */
const express = require('express');
require('dotenv').config();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/usersRoutes');
const movesRouter = require('./routes/movesRouter');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect(MONGO_URL);
app.use(express.json());

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.use(usersRouter);
app.use(movesRouter);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errors());
app.use((err, req, res, next) => {
  if (!err.statusCode) {
    return res.status(500).send({ message: err.message });
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
