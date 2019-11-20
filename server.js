const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express();
var mongoose = require('mongoose');
var userUtility = require('./utilities/userUtility.js');
mongoose.connect('mongodb://localhost/Twilio', {
  useNewUrlParser: true
});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.on('connected', function() {
  console.log("DB connection is open");
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', (req, res) => {
  const twiml = new MessagingResponse();
  //  console.log(req.body.Body);
  // console.log(req.body);
  // console.log(await userUtility.checkUser);
  if(userUtility.isValid)
    twiml.message("Welcome to the Jungle");
  else
    twiml.message("You are in the Jungle");

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
