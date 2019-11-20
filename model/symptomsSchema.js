var mongoose = require('mongoose');
var SymtomsSchema = new mongoose.Schema({
  symptom:{
    type: String,
    trim: true
  },
  symptom_id:{
    type: String,
    trim: true
  }
});
module.exports = mongoose.model('symptoms', SymtomsSchema);
