var QuestionsSchema = require('../model/questionsSchema.js');
var questionNumber = function(round){
  return new Promise((resolve, reject) =>{
    QuestionsSchema.findOne({
      message_step: round
    }).then(data => {
      console.log("Inside Questions " + data);
      resolve(data);
    }).catch(err => {
      return reject("Invalid text");
    });
  })
}
module.exports = { questionNumber: questionNumber};
