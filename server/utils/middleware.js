const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  let token = req.headers.authorization || req.body;
  const isHeader = token.contains('Bearer');

  if (!token) {
    return res.status(403).json({ success: false, message: 'No token.' });
  }

  token = isHeader ? token.slice(7) : token;

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

    return isHeader ? next() : res.status(200).json({ success: true, user: authentic });
  });
};

const isNotAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  return !token ? next() : res.status(403).json({ success: false, message: 'Authorization credentials found.' });
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
};
