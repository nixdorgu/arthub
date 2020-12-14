const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ success: false, message: "No token." });
  }

  token = token.slice(7);

  return jwt.verify(token, process.env.JWT_SECRET, {}, (error, authentic) => {
    if (error)
      return res
        .status(403)
        .json({ success: false, message: "Invalid token." });

    if (authentic.exp < Date.now()) {
      // return res.status(403).json({success: false, message: 'Expired token.'})
      // refresh token here
    }

    next();
  });
};

module.exports = {
  isAuthenticated,
};
