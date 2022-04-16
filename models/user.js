const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isDriver: {
    type: Boolean,
    required: true,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  locationX: {
    type: Number,
    required: true,
    default: 0,
  },
  locationY: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = model("User", userSchema);
