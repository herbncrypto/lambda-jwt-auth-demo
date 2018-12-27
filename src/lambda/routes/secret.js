// ─────────────────────────────────────────────────────────────────────────────
// import
// ─────────────────────────────────────────────────────────────────────────────

const validateJWT = require('../utils/validateJWT');
const validateHttpMethod = require('../utils/validateHttpMethod');

// ─────────────────────────────────────────────────────────────────────────────
// handler
// ─────────────────────────────────────────────────────────────────────────────

exports.handler = async (event, context) => {
  try {
    // check http method
    await validateHttpMethod(event, ['GET']);

    // check auth, throws if JWT invalid
    await validateJWT(event.headers);

    // all went well, respond with payload
    return {
      statusCode: 200,
      body:       JSON.stringify('SECRET'),
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
