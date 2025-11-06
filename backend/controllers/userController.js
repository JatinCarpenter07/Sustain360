const userDataModel = require('../models/usersModel');
const { builtTheToken } = require('../services/auth');
const crypto = require('crypto'); // for createHmac

const signup = async (req, res) => {
  console.log("Sign up trigger");
  try {
    const {
      fullName,
      email,
      password,
      phone,
      age,
      gender,
      monthlyIncome,
      height,
      weight,
      bloodGroup,
    } = req.body;

    // Check if user already exists
    const existingUser = await userDataModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Create user document
    const newUser = new userDataModel({
      fullName,
      email,
      password,
      phone,
      age,
      gender,
      monthlyIncome,
      height,
      weight,
      bloodGroup,
    });

    await newUser.save();

    // Return response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userDataModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash incoming password with user's salt
    const userProvidedHash = crypto
      .createHmac('sha256', user.salt)
      .update(password)
      .digest('hex');

    if (user.password !== userProvidedHash) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = builtTheToken(user);

    // Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        Name: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports={ login,signup};
