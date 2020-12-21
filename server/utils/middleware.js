const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  let token = req.headers.authorization || req.body;
  const tokenIsEmpty = token === 'Bearer null' || typeof token === 'undefined' || JSON.stringify(token) === JSON.stringify({});

  if (tokenIsEmpty) {
    return res.status(403).json({ success: false, message: 'No token.' });
  }

  token = token.includes('Bearer') ? token.slice(7) : token;

  return jwt.verify(token, process.env.JWT_SECRET, {}, (error, authentic) => {
    if (error) {
      return res
        .status(403)
        .json({ success: false, message: 'Invalid token.' });
    }

    if (authentic.exp < Date.now()) {
      // return res.status(403).json({success: false, message: 'Expired token.'})
      // refresh token here
    }

    return next();
  });
};

const isNotAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  const tokenIsEmpty = token === 'Bearer null' || typeof token === 'undefined';

  return tokenIsEmpty ? next() : res.status(403).json({ success: false, message: 'Authorization credentials found.' });
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
};
