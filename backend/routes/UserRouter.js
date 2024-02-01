const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/UserController');

userRouter.route('/')
  .post(UserController.createUser)
  .get(UserController.getUsers);
  
userRouter.route('/:_id')
  .get(UserController.getUserById)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser)
  .patch(UserController.patchRunner);
  userRouter.route('/token').post(UserController.getUserFromToken);

  userRouter.route('/login').post(UserController.login);
  userRouter.route('/companyaccount').post(UserController.createCompany);
module.exports = userRouter;
