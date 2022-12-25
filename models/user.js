const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    validator: (value) => {
      if (validator.isEmail(value)) {
        return true;
      }
      return false;
    },
    unique: true,
  },
}, { toObject: { useProjection: true }, toJSON: { useProjection: true }, versionKey: false });

module.exports = mongoose.model('user', userSchema);
