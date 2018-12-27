// ─────────────────────────────────────────────────────────────────────────────
// import
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();

const User = require('../models/User');

const validateHttpMethod = require('../utils/validateHttpMethod');

// ─────────────────────────────────────────────────────────────────────────────
// handler
// ─────────────────────────────────────────────────────────────────────────────

exports.handler = async (event, context) => {
  try {
    // check http method
    await validateHttpMethod(event, ['POST']);

    // parse request payload
    const { username, email, password } = JSON.parse(event.body);

    // create new user
    const token = await User.signup(username, email, password);

    // all went well, respond with JWT token
    return {
      statusCode: 201,
      body:       '', // empty body, token send in headers
      headers:    {
        'Cache-Control': 'no-store', // prevent caching of response
        Pragma:          'no-cache', // prevent caching of response
        Authorization:   `Bearer: ${token}`,
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
