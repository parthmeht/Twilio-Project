var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    MessagingResponse = require('twilio').twiml.MessagingResponse;


var app = express();
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/', function(req, res) {
    var twiml = new MessagingResponse();
    console.log(req.body.Body);
    if (req.body.Body == 'hello') {
        twiml.message('Hi!');
    } else if(req.body.Body == 'bye') {
        twiml.message('Goodbye');
    } else {
        twiml.message('No Body param match, Twilio sends this in the request to your server.');
    }
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

http.createServer(app).listen(1337, function () {
    console.log("Express server listening on port 1337");
});