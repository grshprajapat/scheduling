const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Authentication failed! Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed! Invalid token.' });
  }
};

module.exports = authenticateUser;
