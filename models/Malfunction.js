const mongoose = require('mongoose');

const MalfunctionSchema = new mongoose.Schema({
  shift: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  subgroup: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  imgNames: [
    {
      path: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = Malfunction = mongoose.model('malfunction', MalfunctionSchema);
