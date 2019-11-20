var mongoose = require('mongoose');
var SymtomsSchema = new mongoose.Schema({
  symptom_name:{
    type: String,
    trim: true
  },
  symptom_id:{
    type: Number,
    trim: true
  }
});
module.exports = mongoose.model('symptoms', SymtomsSchema);
