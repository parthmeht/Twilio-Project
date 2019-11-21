var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  user_id:{
    type: String,
    trim: true
  },
  rounds:{
    type: Number,
    trim: true
  },
  phone:{
    type: Number,
    unique: true,
    trim: true
  },
  created:{
    type: Date,
    trim: true
  },
  currentQuestion:{
    type: Number,
    trim: true
  },
  currentSympton: {
    type: String,
    trim: true
  },
  symptomHistory: [String],
  symptoms: [String]
});
module.exports = mongoose.model('User', UserSchema);
