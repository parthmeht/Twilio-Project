const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express();
var mongoose = require('mongoose');
var userUtility = require('./utilities/userUtility.js');
var questionUtility = require('./utilities/questionsUtility.js');
mongoose.connect('mongodb://localhost/Twilio', {
  useNewUrlParser: true
});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.on('connected', function() {
  console.log("DB connection is open");
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', async function(req, res) {
  const twiml = new MessagingResponse();
  //  console.log(req.body.Body);
  // console.log(req.body);
   //console.log("response "+userUtility.checkUser(req.body.From));
   var data = await userUtility.checkUser(req.body.From);

   if(data){
      if(data.rounds == '1'){
        if(req.body.Body == 'START'){
          var updateData = await userUtility.updateUser(req.body.From, data.rounds);
          var ques = await questionUtility.questionNumber(data.rounds);
          if(ques)
            twiml.message(ques.message_text);
        }else{
          twiml.message('Invalid Input');
        }
      }
       // if(data.rounds == '0'){
       //   if(req.body.Body == 'START')
       // }
       // var ques = await questionUtility.questionNumber(data.rounds);
       // console.log(data.rounds + " -- " + ques);
       // if(ques)
       //   twiml.message(ques.message_text);
    }else{
      if(req.body.Body == 'START'){
        var userData = await userUtility.addUser(req.body.From);
        var ques = await questionUtility.questionNumber('0');
        if(ques)
          twiml.message(ques.message_text);
      }else {
        twiml.message('You are not enrolled. Send START to enroll');
      }

    }

   // if(req.body.Body == 'START'){
   //
   //
   // }
   //
   // var ques = await questionUtility.questionNumber('1');
   // if(ques)
   //  twiml.message(ques.message_text);





  // if (req.body.Body == 'hello') {
  //   twiml.message('Hi!');
  // } else if (req.body.Body == 'bye') {
  //   twiml.message('Goodbye');
  // } else {
  //   twiml.message(
  //     'No Body param match, Twilio sends this in the request to your server.'
  //   );
  // }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
