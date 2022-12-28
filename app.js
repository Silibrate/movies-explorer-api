const express = require('express');
require('dotenv').config();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/usersRoutes');
const moviesRouter = require('./routes/moviesRouter');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const { validateSignin, validateSignup } = require('./middlewares/validate');

mongoose.connect(MONGO_URL);
app.use(express.json());

app.use(requestLogger);

app.post('/signup', validateSignup, createUser);

app.post('/signin', validateSignin, login);

app.use(auth);
app.use(usersRouter);
app.use(moviesRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  if (!err.statusCode) {
    return res.status(500).send({ message: err.message });
  }
  res.status(err.statusCode).send({ message: err.message });
  return next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
