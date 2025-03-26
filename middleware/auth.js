require('dotenv').config();


/**
 * Middleware to authenticate requests using a JWT token.
 * 
 * This middleware checks for the presence of an authorization header
 * in the request, validates the JWT token, and extracts the user ID
 * from the token payload. If the token is invalid or missing, it responds
 * with a 401 status code and an appropriate error message.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.headers - The headers of the HTTP request.
 * @param {string} req.headers.authorization - The authorization header containing the JWT token.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The callback to pass control to the next middleware.
 * 
 * @throws {Error} Responds with a 401 status code if the token is missing or invalid.
 */
module.exports.authMiddleware = async (req, res, next) => {
  const token = req.session.token;
  console.log('TOKEN ', token)
  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    res.locals.userId = decoded.id; // Store user ID in res.locals for later use
    next();
  });
};