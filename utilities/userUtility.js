var UserSchema = require('../model/userSchema.js');
var User = require('mongoose').model('User');
var checkUser = function (phoneNumber) {
  console.log("Ew");
  return new Promise((resolve, reject) => {
    UserSchema.findOne({
      phone: phoneNumber
    }).then(data => {
      if (data) {
        console.log("Valid");
        // resolve(data);
      } else
        console.log("Invalid");
      resolve(data);
    }).catch(err => {
      return reject(err);
    });
  });
}

var addUser = function (phoneNumber) {

  return new Promise((resolve, reject) => {
    var userData = new UserSchema({
      rounds: 1,
      phone: phoneNumber,
      currentQuestion: 1,
      rounds: 1,
      symptomHistory: [],
      currentSympton: null
    });
    userData.save(function (err) {
      if (err)
        console.log("ERROR WHILE SAVING USER");
      else
        console.log("Saved");
    });
    resolve(userData);
  });
}

var updateUser = function (phoneNumber, rounds, currentQuestion, symptom, symptomHistory) {
  return new Promise((resolve, reject) => {
    var usr = new UserSchema();
    var userData = {
      rounds: rounds,
      currentQuestion: currentQuestion,
      currentSympton: symptom,
      symptomHistory: symptomHistory
    };
    User.findOneAndUpdate({ phone: phoneNumber }, userData).exec(function (err) {
      if (err) {
        console.log("ERROR " + err);
      }
      else {
        console.log("Saved");
      }
    });
    resolve(userData);
  });
}

module.exports = { checkUser: checkUser, addUser: addUser, updateUser: updateUser };
