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
    trim: true
  },
  created:{
    type: Date,
    trim: true
  },
  currentQuestion:{
    type: String,
    trim: true
  }
});
module.exports = mongoose.model('users', UserSchema);
