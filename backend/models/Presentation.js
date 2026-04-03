const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    favourite: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Presentation', presentationSchema);