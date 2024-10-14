const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    console.log('Verifying token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if decoded.user exists
    if (!decoded.user) {
      console.error('Decoded token does not contain user information');
      return res.status(401).json({ msg: 'Token is not valid' });
    }
    
    req.user = decoded.user;
    console.log('Token verified, user:', req.user);
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};