const usersRouter = require('express').Router();
const { validateUser } = require('../middlewares/validate');

const { getUsersMe, updateUser } = require('../controllers/users');

usersRouter.get('/users/me', getUsersMe);
usersRouter.patch('/users/me', validateUser, updateUser);

module.exports = usersRouter;
