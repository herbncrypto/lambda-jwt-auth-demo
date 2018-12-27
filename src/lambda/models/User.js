// ─────────────────────────────────────────────────────────────────────────────
// import
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();

const mongoose = require('mongoose');

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
// model
// ─────────────────────────────────────────────────────────────────────────────

// try exporting an already-existing schema first
// this prevents a "Cannot overwrite model once compiled." error
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
