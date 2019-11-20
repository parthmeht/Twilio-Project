const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express();
var mongoose = require('mongoose');
var userUtility = require('./utilities/userUtility.js');
var questionUtility = require('./utilities/questionsUtility.js');
var symptomUtility = require('./utilities/symptomsUtility.js');
mongoose.connect('mongodb://admin:admin123@ds041934.mlab.com:41934/twilio', {
  useNewUrlParser: true
});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.on('connected', function () {
  console.log("DB connection is open");
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', async function (req, res) {
  const twiml = new MessagingResponse();
  var data = await userUtility.checkUser(req.body.From);

  if (data) {
    if(data.rounds<=3){
      if (data.currentQuestion == '1') {
        if (req.body.Body == 'START') {
          var ques = await questionUtility.questionNumber(1);
          var sym = await symptomUtility.allSymptoms(data.symptomHistory);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds, data.currentQuestion+1, null, data.symptomHistory);
          if (ques && sym){
            twiml.message(ques.message_text + sym);
          }
        } else {
          twiml.message('Invalid Input');
        }
      } else if (data.currentQuestion == '2') {
        if (req.body.Body == '0') {
          var ques = await questionUtility.questionNumber(req.body.Body);
          twiml.message(ques.message_text);
        } else if (parseInt(req.body.Body, 10) <= 5-data.symptomHistory.length) {
          console.log("round 2 - selection : "+req.body.Body);
          var ques = await questionUtility.questionNumber(data.currentQuestion);
          var sym = await symptomUtility.symptomType(req.body.Body);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds, data.currentQuestion+1, sym.symptom, data.symptomHistory);
          twiml.message(ques.message_text + " " + sym.symptom + " in the last 24 hours.");
        } else {
          var ques = await questionUtility.questionNumber(data.currentQuestion-1);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds, data.currentQuestion-1, null, data.symptomHistory);
          twiml.message(ques.invalid_text);
        }
      } else if (data.currentQuestion == '3') {
        if (req.body.Body == '0') {
          twiml.message("You do not have a "+data.currentSympton);
          data.symptomHistory.push(data.currentSympton);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds+1, 1, null, data.symptomHistory);
        } else if (req.body.Body == '1' || req.body.Body == '2') {
          var ques = await questionUtility.questionNumber(data.currentQuestion);
          twiml.message("You have a mild" + " " + data.currentSympton);
          data.symptomHistory.push(data.currentSympton);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds+1, 1, null, data.symptomHistory);
        } else if (req.body.Body == '3') {
          var ques = await questionUtility.questionNumber(data.currentQuestion);
          twiml.message("You have a moderate" + " " + data.currentSympton);
          data.symptomHistory.push(data.currentSympton);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds+1, 1, null, data.symptomHistory);
        } else if (req.body.Body == '4') {
          var ques = await questionUtility.questionNumber(data.currentQuestion);
          twiml.message("You have a severe" + " " + data.currentSympton);
          data.symptomHistory.push(data.currentSympton);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds+1, 1, null, data.symptomHistory);
        } else {
          var ques = await questionUtility.questionNumber(data.currentQuestion-1);
          twiml.message(ques.invalid_text);
        }
      }
    }else if(data.rounds==4){
      var ques = await questionUtility.questionNumber(4);
      twiml.message(ques.message_text);
    }
  } else {
    if (req.body.Body == 'START') {
      var userData = await userUtility.addUser(req.body.From);
      var ques = await questionUtility.questionNumber(-1);
      if (ques)
        twiml.message(ques.message_text);
    } else {
      twiml.message('You are not enrolled. Send START to enroll');
    }
  }
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
