const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('./keys');

module.exports = {
  ensureAuth: async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);
    try {
      const { _id } = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(_id);
      if (user) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({
          message: 'please login first',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'somthing went wrong',
      });
    }
  },
};
