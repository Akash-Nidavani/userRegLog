const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../config');
const JWT_SECRET = "my-secret-key"

const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = decodedToken;
    // req.userId = decodedToken.id;
    // req.userRole = decodedToken.role;
    console.log(decodedToken)
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate;
