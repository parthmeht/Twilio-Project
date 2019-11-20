var UserSchema = require('../model/userSchema.js');
var checkUser = function(phoneNumber){
  console.log("Ew");
  // return new Promise((resolve, reject)=>{
  //   UserSchema.findOne({
  //     {
  //       phone: phoneNumber
  //     }
  //   }).then(data => {
  //     if(data){
  //       console.log("Valid");
  //     }else{
  //       console.log("Invalid");
  //     }
  //   });
  // });
  var isValid = UserSchema.findOne({phone: phoneNumber}, function(err, res){
    if(res){
      console.log("Valid");
      // return true;
    }else{
      // var userData = {
      //   phone: phoneNumber
      // };
      var userData = new UserSchema({
        rounds: 0,
        phone: phoneNumber
      });
      userData.save(function(err) {
        if(err)
          console.log("ERROR WHILE SAVING USER");
        else
          console.log("Saved");
      })
      console.log("Invalid");
      // return false;
    }
    return res;
  })
}
module.exports = { checkUser: checkUser};
