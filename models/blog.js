const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  author: String,
  url: String,
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Blog', blogSchema);