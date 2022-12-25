const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongoose;

const moveSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: (value) => {
      if (validator.isURL(value)) {
        return true;
      }
      return false;
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: (value) => {
      if (validator.isURL(value)) {
        return true;
      }
      return false;
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: (value) => {
      if (validator.isURL(value)) {
        return true;
      }
      return false;
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('move', moveSchema);
