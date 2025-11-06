const express = require('express');
const userRouter = express.Router();
const {signup,login}  = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authentication');

console.log("Request come inside the User Route");
// Signup route
userRouter.post('/signup', signup);
userRouter.post('/login',login);

module.exports = userRouter;