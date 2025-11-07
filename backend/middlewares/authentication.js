const { decodeTheToken } = require('../services/auth');

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  const decoded = decodeTheToken(token);
  if (!decoded) return res.status(401).json({ message: 'Unauthorized !!! , Not logIn' });
  req.user = decoded;
  next();
};

module.exports = authenticateJWT;