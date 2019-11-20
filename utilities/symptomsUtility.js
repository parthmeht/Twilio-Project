var SymptomsSchema = require('../model/symptomsSchema.js');
var symptomType = function(symptomCode){
  return new Promise((resolve, reject) =>{
    SymptomsSchema.findOne({
      symptom_id: symptomCode
    }).then(data => {
      console.log("Inside Symptoms " + data);
      resolve(data);
    }).catch(err => {
      return reject("Invalid text");
    });
  })
}

var allSymptoms = function(){
  return new Promise((resolve, reject) =>{
    SymptomsSchema.find({}).then(data => {
      console.log("Inside Questions " + data);
      var s = " ";
      for (var i = 0; i < data.length; i++) {
        s+= "\nPress " + data[i].symptom_id + " for " + data[i].symptom;
      }
      resolve(s);
    }).catch(err => {
      return reject("Invalid text");
    });
  })
}
module.exports = { symptomType: symptomType, allSymptoms: allSymptoms};
