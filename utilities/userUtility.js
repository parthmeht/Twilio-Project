var UserSchema = require('../model/userSchema.js');
var User = require('mongoose').model('users');
var checkUser = function(phoneNumber){
  console.log("Ew");
  return new Promise((resolve, reject)=>{
    UserSchema.findOne({
      phone: phoneNumber
    }).then(data => {
      if(data){
        console.log("Valid");
        // resolve(data);
      }else
        console.log("Invalid");
      resolve(data);
    }).catch(err => {
      return reject(err);
    });
  });
  // var isValid = UserSchema.findOne({phone: phoneNumber}, function(err, res){
  //   if(err){
  //     console.log("ERROR");
  //   }
  //   // if(res){
  //   //   console.log("Valid");
  //   //   // return true;
  //   // }else{
  //   //   // var userData = {
  //   //   //   phone: phoneNumber
  //   //   // };
  //   //   var userData = new UserSchema({
  //   //     rounds: 0,
  //   //     phone: phoneNumber
  //   //   });
  //   //   userData.save(function(err) {
  //   //     if(err)
  //   //       console.log("ERROR WHILE SAVING USER");
  //   //     else
  //   //       console.log("Saved");
  //   //   })
  //   //   console.log("Invalid");
  //   //   // return false;
  //   // }
  //   console.log("find "+ res);
  //   return res;
  // })
}

var addUser = function(phoneNumber){

  return new Promise((resolve, reject)=>{
    var userData = new UserSchema({
          rounds: 1,
          phone: phoneNumber,
          currentQuestion: 0
      });
      userData.save(function(err) {
      if(err)
        console.log("ERROR WHILE SAVING USER");
      else
        console.log("Saved");
      });
      resolve(userData);
  });
}

var updateUser = function(phoneNumber, rounds){
  return new Promise((resolve, reject)=>{
    var usr = new UserSchema();
    var userData = {
          rounds: rounds+1,
      };
      User.findOneAndUpdate({phone: phoneNumber}, userData).exec(function(err){
        if(err){
          console.log("ERROR "+err);
        }
        else {
          console.log("Saved");
        }
      });
      resolve(userData);
  });
}

module.exports = { checkUser: checkUser, addUser: addUser, updateUser: updateUser};
