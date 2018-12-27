// ─────────────────────────────────────────────────────────────────────────────
// import
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ServerError = require('../utils/ServerError');

// ─────────────────────────────────────────────────────────────────────────────
// database
// ─────────────────────────────────────────────────────────────────────────────

// connect to the db
mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true },
);

// ─────────────────────────────────────────────────────────────────────────────
// schema
// ─────────────────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema(
  {
    username: {
      type:     String,
      required: true,
      unique:   true, // used to generate user pages
      trim:     true,
    },
    email: {
      type:     String,
      required: true,
      trim:     true,
    },
    password: {
      type:     String,
      required: true,
    },
    loginDate: {
      type:    Date,
      default: Date.now(),
    },
    logoutDate: {
      type:    Date,
      default: null,
    },
  },
  { timestamps: true }, // adds createdAt and updatedAt automatic fields
);

// ─────────────────────────────────────────────────────────────────────────────
// statics
// ─────────────────────────────────────────────────────────────────────────────

UserSchema.statics.signup = async function signup(username, email, password) {
  try {
    // check if required data received
    if (!(username && email && password)) {
      throw new ServerError(400, 'Parameters "username" and "email" and "password" are required');
    }

    // create new user, will throw with code 11000 if user already exists
    const user = await this.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    // all went well, return JWT token
    return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP,
    });
  } catch (error) {
    // check if DB-specific error
    if (error.code === 11000) {
      throw new ServerError(409, 'User already exists');
    }

    // pass generic error up
    throw error;
  }
};

UserSchema.statics.login = async function login(username, email, password) {
  try {
    // check if required data received
    if (!((username || email) && password)) {
      throw new ServerError(400, 'Parameters "username" or "email" and "password" are required');
    }

    // search for a user based on username or email
    // update last login date
    const user = await this.findOneAndUpdate(
      {
        $or: [{ username }, { email }],
      },
      { loginDate: Date.now() },
    );

    // check if such user exists
    if (!user) {
      throw new ServerError(401, 'User not found');
    }

    // check if password matches
    if (!(await bcrypt.compare(password, user.password))) {
      throw new ServerError(401, 'Incorrect password');
    }

    // all went well, return JWT token
    return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP,
    });
  } catch (error) {
    // something went bad, pass error up
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// model
// ─────────────────────────────────────────────────────────────────────────────

// try exporting an already-existing schema first
// this prevents a "Cannot overwrite model once compiled." error
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
