var mongoose = require('mongoose');
var SymtomsSchema = new mongoose.Schema({
  symptom:{
    type: String,
    trim: true
  },
  symptom_id:{
    type: Number,
    trim: true
  }
});
module.exports = mongoose.model('Symptom', SymtomsSchema);
