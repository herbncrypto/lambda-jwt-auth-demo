// ─────────────────────────────────────────────────────────────────────────────
// import
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();

const User = require('../models/User');

const validateJWT = require('../utils/validateJWT');
const validateHttpMethod = require('../utils/validateHttpMethod');

// ─────────────────────────────────────────────────────────────────────────────
// handler
// ─────────────────────────────────────────────────────────────────────────────

exports.handler = async (event, context) => {
  try {
    // check http method
    await validateHttpMethod(event, ['DELETE']);

    // get user id from JWT sub, throws if JWT invalid
    const { sub } = await validateJWT(event.headers);

    // delete user account
    await User.delete(sub);

    // all went well, respond with empty JWT token
    return {
      statusCode: 200,
      body:       '', // empty body, token send in headers
      headers:    {
        'Cache-Control': 'no-store', // prevent caching of response
        Pragma:          'no-cache', // prevent caching of response
        Authorization:   '', // empty token
      },
    };
  } catch (error) {
    // something went wrong, respond with error
    return {
      statusCode: error.statusCode || 500,
      headers:    error.headers || {},
      body:       JSON.stringify(error.message),
    };
  }
};
