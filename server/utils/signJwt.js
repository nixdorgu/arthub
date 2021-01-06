const jwt = require('jsonwebtoken');
require('dotenv').config();

function signToken(res, user, expiresIn = '1d') {
  return jwt.sign(
    user,
    process.env.JWT_SECRET,
    { expiresIn },
    (err, token) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: 'Something went wrong' });
      }
      return res.status(200).json({ token });
    },
  );
}

module.exports = signToken;
