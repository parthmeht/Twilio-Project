const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const accountSid = "AC190bb82d5b750b8e635f0952d047c8b7";
const authToken = "3124ef1e393c0e08063f02816b5d0fae"
const client = require('twilio')(accountSid, authToken);

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
    if (data.rounds <= 3) {
      if (data.currentQuestion == '2') {
        if (req.body.Body == '0') {
          var ques = await questionUtility.questionNumber(req.body.Body);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds, data.currentQuestion - 1, null, data.symptomHistory);
          sendMessage(data.phone,ques.message_text);
        } else if (parseInt(req.body.Body, 10) <= 5 - data.symptomHistory.length) {
          console.log("round 2 - selection : " + req.body.Body);
          var ques = await questionUtility.questionNumber(data.currentQuestion);
          var sym = await symptomUtility.symptomType(req.body.Body);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds, data.currentQuestion + 1, sym.symptom, data.symptomHistory);
          sendMessage(data.phone,ques.message_text + " " + sym.symptom + " in the last 24 hours.");
        } else {
          var ques = await questionUtility.questionNumber(data.currentQuestion - 1);
          sendMessage(data.phone,ques.invalid_text);
        }
      } else if (data.currentQuestion == '3') {
        if (req.body.Body == '0') {
          sendMessage(data.phone,"You do not have a " + data.currentSympton);
          data.symptomHistory.push(data.currentSympton);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds + 1, 1, null, data.symptomHistory);
          triggerNextRound();
        } else if (req.body.Body == '1' || req.body.Body == '2') {
          var ques = await questionUtility.questionNumber(data.currentQuestion);
          sendMessage(data.phone,"You have a mild" + " " + data.currentSympton);
          data.symptomHistory.push(data.currentSympton);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds + 1, 1, null, data.symptomHistory);
          triggerNextRound();
        } else if (req.body.Body == '3') {
          var ques = await questionUtility.questionNumber(data.currentQuestion);
          sendMessage(data.phone,"You have a moderate" + " " + data.currentSympton);
          data.symptomHistory.push(data.currentSympton);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds + 1, 1, null, data.symptomHistory);
          triggerNextRound();
        } else if (req.body.Body == '4') {
          var ques = await questionUtility.questionNumber(data.currentQuestion);
          sendMessage(data.phone,"You have a severe" + " " + data.currentSympton);
          data.symptomHistory.push(data.currentSympton);
          var updateData = await userUtility.updateUser(req.body.From, data.rounds + 1, 1, null, data.symptomHistory);
          triggerNextRound();
        } else {
          var ques = await questionUtility.questionNumber(data.currentQuestion - 1);
          sendMessage(data.phone,ques.invalid_text);
        }
      }
    } else if (data.rounds == 4) {
      var ques = await questionUtility.questionNumber(4);
      sendMessage(data.phone,ques.message_text);
    }
  } else {
    if (req.body.Body == 'START') {
      var userData = await userUtility.addUser(req.body.From);
      data = await userUtility.checkUser(req.body.From);
      var ques = await questionUtility.questionNumber(-1);
      if (ques){
        bodyMessage = ques.message_text;
        sendMessage(req.body.From,bodyMessage);
        triggerNextRound();
      }
    } else {
      bodyMessage = 'You are not enrolled. Send START to enroll';
      sendMessage(data.phone,bodyMessage);
    }
  }
  async function sendMessage(from, bodyMessage) {
    await client.messages.create({
      to: from,
      from: '+12052739396',
      body: bodyMessage
    });
  }

  async function triggerNextRound(){
    var ques = await questionUtility.questionNumber(1);
    var sym = await symptomUtility.allSymptoms(data.symptomHistory);
    var updateData = await userUtility.updateUser(req.body.From, data.rounds, data.currentQuestion + 1, null, data.symptomHistory);
    if (ques && sym) {
      bodyMessage = ques.message_text + sym;
      sendMessage(req.body.From,bodyMessage);
    }
  }
  res.end();
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
