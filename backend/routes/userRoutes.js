const express = require('express');
const userRouter = express.Router();
const {signup,login,getUserProfile}  = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authentication');

// Signup route
userRouter.post('/signup', signup);
userRouter.post('/login',login);
userRouter.get('/profile', authenticateJWT, getUserProfile);

module.exports = userRouter;