// Example of a very simple Express.js web application
// that exposes all the connFu commands to a very simple REST API
//
// To run it, execute this file with the application key as the 
// first parameter:
//
//     $ node commands.js <application_token>
//

// ### BOOTSTRAP EXPRESS APPLICATION ###
//
// -------------------------------------

// #### Include dependencies

var connFu = require('connfu');
var sys = require('sys');
var express = require('express');

// #### Express Configuration

var app = module.exports = express.createServer();
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

// #### Initialize connFu application
var connfuApp = connFu.createApp(process.argv[2]);

// ### GENERAL METHODS ###
//
// -----------------------

// #### Get application information
//
// *Response:*
//
//     {
//       "description": "This is a connFu application.",
//       "name": "awesome-conference",
//       "stream_name": "connfu-stream-awesome-conference"
//     }
//
app.get('/', function(req, res){
  connfuApp.commands.getApp(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// ### VOICE CHANNEL METHODS ###
//
// -----------------------------

// #### Get all voice channels
//
// *Response:*
//
//     [{
//       "privacy": "whitelisted",
//       "rejected_message": "Not allowed!",
//       "topic": "Conference powered by connFu.",
//       "uid": "channel-1317040879",
//       "welcome_message": "Welcome to the conference",
//       "phones": [{
//         "country": "UK",
//         "phone_number": "44xxxx"
//       }
//     ]}
//
app.get('/voice', function(req, res){
  connfuApp.commands.voice().get(
    function(err, data) { 
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Get a voice channel by uid
//
// Similar response as get all voice channels
app.get('/voice/:uid', function(req, res){
  connfuApp.commands.voice(req.params.uid).get(
    function(err, data) { 
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Create a voice channel
//
// *Parameters:*
//
// `privacy`, `welcome_message`, `rejected_message` and `topic` are optional.
// `country` must be 'UK', 'US' or 'IL'
app.post('/voice', function(req, res){
  connfuApp.commands.voice().create(
    req.body.uid,
    req.body.country,
    {
      privacy: req.body.privacy,
      welcome_message: req.body.welcome_message,
      rejected_message: req.body.rejected_message,
      topic: req.body.topic
    },
    function(err, data) { 
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Update a voice channel
// *Parameters:*
//
// `privacy`, `welcome_message`, `rejected_message` and `topic` are optional.
// `country` must be 'UK', 'US' or 'IL'
app.put('/voice/:uid', function(req, res){
  connfuApp.commands.voice(req.params.uid).update({
      privacy: req.body.privacy,
      welcome_message: req.body.welcome_message,
      rejected_message: req.body.rejected_message,
      topic: req.body.topic
    },
    function(err, data) { 
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Delete a voice channel
//
// *This method doesn't return anything*
app.delete('/voice/:uid', function(req, res){
  connfuApp.commands.voice(req.params.uid).remove(
    function(err, data) { 
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// ### Whitelist methods ###
//
// -------------------------

// #### Get the full whitelist of a voice channel
//
// *Response:*
//
//     [{
//       "name": "rafeca",
//       "phone": "44xxxx"
//     }]
//
app.get('/voice/:uid/whitelist', function(req, res){
  connfuApp.commands.voice(req.params.uid).whitelist().get(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Get a whitelist entry of a voice channel
//
// Similar response as get the full whitelist
app.get('/voice/:uid/whitelist/:phone', function(req, res){
  connfuApp.commands.voice(req.params.uid).whitelist(req.params.phone).get(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Create a whitelist entry in a voice channel
//
// *Parameters:*
//
// `phone` must be in international format (44xxx)
app.post('/voice/:uid/whitelist', function(req, res){
  connfuApp.commands.voice(req.params.uid).whitelist().create(
    req.body.phone,
    req.body.name,
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Update the name of a whitelist entry in a voice channel
//
// *Parameters:*
//
// `phone` must be in international format (44xxx)
app.put('/voice/:uid/whitelist/:phone', function(req, res){
  connfuApp.commands.voice(req.params.uid).whitelist(req.params.phone).update(
    req.body.phone,
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Delete a whitelist entry of a voice channel
//
// *This method doesn't return anything*
app.delete('/voice/:uid/whitelist/:phone', function(req, res){
  connfuApp.commands.voice(req.params.uid).whitelist(req.params.phone).remove(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Delete the full whitelist of a voice channel
//
// *This method doesn't return anything*
app.delete('/voice/:uid/whitelist', function(req, res){
  connfuApp.commands.voice(req.params.uid).whitelist().remove(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// ### Phone allocation methods ###
//
// --------------------------------

// #### Get all the associated phones of a voice channel
//
// *Response:*
//
//     [{
//       "country": "UK",
//       "phone": "44xxxx"
//     }]
//
app.get('/voice/:uid/phones', function(req, res){
  connfuApp.commands.voice(req.params.uid).phones().get(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Allocate a phone number in a voice channel
//
// *Params:*
//
// `country` must be 'UK', 'US' or 'IL'
app.post('/voice/:uid/phones', function(req, res){
  connfuApp.commands.voice(req.params.uid).phones().create(
    req.body.country,
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Deallocate a phone number in a voice channel
//
// *This method doesn't return anything*
app.delete('/voice/:uid/phones/:phone', function(req, res){
  connfuApp.commands.voice(req.params.uid).phones(req.params.phone).remove(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// ### RSS CHANNEL METHODS ###
//
// ---------------------------

// #### Get all the RSS channels
//
// *Response:*
//
//     [{
//       "uid": "google-blog",
//       "uri": "http://googleblog.blogspot.com/atom.xml"
//     }]
//
app.get('/rss', function(req, res){
  connfuApp.commands.rss().get(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Get an RSS channel by UID
//
// *Response:*
//
// Similar to get all RSS channels response
app.get('/rss/:uid', function(req, res){
  connfuApp.commands.rss(req.params.uid).get(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Create an RSS channel
//
// `url` refers to the full URL of the RSS feed 
app.post('/rss', function(req, res){
  connfuApp.commands.rss().create(
    req.body.uid,
    req.body.url,
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Update an RSS channel
//
// `url` refers to the full URL of the RSS feed
app.put('/rss/:uid', function(req, res){
  connfuApp.commands.rss(req.params.uid).update(
    req.body.url,
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Remove an RSS channel
//
// *This method doesn't return anything*
app.delete('/rss/:uid', function(req, res){
  connfuApp.commands.rss(req.params.uid).remove(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// ### TWITTER CHANNEL METHODS ###
//
// --------------------------------

// #### Get all the Twitter channels
//
// *Response:*
//
//     [{
//       "accounts": [
//         { "name": "rafeca" },
//         { "name": "juandebravo" }
//       ],
//       "filter": "text:(ruby AND nodejs)",
//       "uid": "twitter-filter"
//     }]
//
app.get('/twitter', function(req, res){
  connfuApp.commands.twitter().get(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Get a Twitter channel by UID
//
// *Response:*
//
// Similar to get all Twitter channels response
app.get('/twitter/:uid', function(req, res){
  connfuApp.commands.twitter(req.params.uid).get(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Create a Twitter channel
// (only for tweets mentioning the specified account)
//
// *Info about parameters:*
//
// `account` is the single account to follow (must be a string)
//
// `filters` is a hash with all the search filters, with the following format:
//
//
//        var filters = {
//          tags: ["barcelona", "london"],
//          text: ["sun", "rain"]
//        };
//
app.post('/twitter_mentioned', function(req, res){
  connfuApp.commands.twitter().create(
    req.body.uid,
    "mentioned",
    req.body.account,
    req.body.filters,
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Create a Twitter channel
// (only for tweets origined from the specified accounts)
//
// *Info about parameters:*
//
// `accounts` is an array of twitter accounts to follow
//
// `filters` is a has with all the search filters (refer above for more info)
app.post('/twitter_origin', function(req, res){
  connfuApp.commands.twitter().create(
    req.body.uid,
    "origin",
    req.body.accounts,
    req.body.filters,
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// #### Remove a Twitter channel
//
// *This method doesn't return anything*
app.delete('/twitter/:uid', function(req, res){
  connfuApp.commands.twitter(req.params.uid).remove(
    function(err, data) {
      if (err) { return res.json(err.message, err.code); }
      res.json(data);
    }
  );
});

// ### MAKE EXPRESS LISTEN TO PORT 5000 ###
//
// ----------------------------------------

app.listen(5000);
console.log(
  "Express server listening on port %d in %s mode", 
  app.address().port, 
  app.settings.env
);