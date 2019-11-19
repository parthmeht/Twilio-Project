//const accountSid = process.env.TWILIO_ACCOUNT_SID;
//const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = "AC190bb82d5b750b8e635f0952d047c8b7";
const authToken = "3124ef1e393c0e08063f02816b5d0fae"
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Hello Dikshali Margaj!!!',
     from: '+12052739396',
     to: '+17047563542'
   })
  .then(message => console.log(message.sid));