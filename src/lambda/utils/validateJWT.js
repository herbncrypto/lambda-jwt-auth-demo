// ─────────────────────────────────────────────────────────────────────────────
// import
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();

const jwt = require('jsonwebtoken');

const ServerError = require('./ServerError');

// ─────────────────────────────────────────────────────────────────────────────
// component
// ─────────────────────────────────────────────────────────────────────────────

module.exports = async function validateJWT(headers) {
  try {
    // check if authorization header is present
    if (!headers.authorization) {
      throw new ServerError(401, 'Authorization header missing');
    }

    // check if authorization header begins with "Bearer "
    if (!headers.authorization.startsWith('Bearer ')) {
      throw new ServerError(401, 'Authorization header is not in the format "Bearer <token>"');
    }

    // get JWT out of authorization header
    const token = headers.authorization.substring(7).trim();

    // check if token exists
    if (!token) {
      throw new ServerError(401, 'Authorization header is not in the format "Bearer <token>"');
    }

    // return decoded JWT, throws if JWT invalid
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // check if JWT-specific error
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      throw new ServerError(401, error.message || 'Incorrect JWT');
    }

    // pass generic error
    throw error;
  }
};
