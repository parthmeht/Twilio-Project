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

var allSymptoms = function(symptomHistory){
  return new Promise((resolve, reject) =>{
    SymptomsSchema.find({}).then(data => {
      console.log("Inside Questions " + data);
      var s = " ";
      data = data.filter( function( el ) {
        return symptomHistory.indexOf( el.symptom) < 0;
      } );
      for (var i = 0; i < data.length; i++) {
        //if(symptomHistory.indexOf(data[i].symptom) == -1)
          s+= "\nPress " + i + " for " + data[i].symptom;
      }
      resolve(s);
    }).catch(err => {
      return reject("Invalid text");
    });
  })
}

/*function difference(first, second) {
  for (var i=0; i<first.length; i++) {
      var index = first[i];
      if ((index = first.indexOf(second[i])) !== -1) {
          first.splice(index, 1);
      }
  }
  return first;
}*/
module.exports = { symptomType: symptomType, allSymptoms: allSymptoms};
