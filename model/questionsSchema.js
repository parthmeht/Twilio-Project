var mongoose = require('mongoose');
var QuestionsSchema = new mongoose.Schema({
  message_text:{
    type: String,
    trim: true
  },
  message_step:{
    type: Number,
    trim: true
  },
  invalid_text:{
    type: Text,
    trim: true
  },
  symptoms:{
    type: Array,
    trim: true
  }
});
module.exports = mongoose.model('questions', QuestionsSchema);
