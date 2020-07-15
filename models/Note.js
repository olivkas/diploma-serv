const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  note: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Note = mongoose.model('note', NoteSchema);
