// Don't be mistaken by the name, this is a very stupid example of how should a 
// **connFu** application look like. This application only listens to voice
// and twitter events and prints them on the terminal.
//
// Running this example
// --------------------
//
// * First of all, you have to register into [connFu.com](http://connfu.com and create)
// an application. You will receive an **application token** which will be very useful ;)
//
// * Then, install the connFu npm package:
//
//          $ npm install connfu
//
// * Then get the source of this example from [here](https://github.com/dogfood20/connfu-node/blob/master/examples/fancy-connfu-application.js)
//   and run it!
//
//          $ node fancy-connfu-application.js <application_token>

// Application code explanation
// ----------------------------

// As we plan to launch this application via the command line,
// we should receive the application token as an argument, so we need 
// to check that the application token is passed as a parameter
if (process.argv.length < 3) {
  console.log("Usage: node fancy-connfu-application.js <application_token>");
  process.exit(1);
}

//### Initializing the connFu application

// First of all, we have to require the connFu package...
//
// ...and then initialize the connFu application using the application
//token received from the command line
var connFu = require('connfu');

var app = connFu.createApp(process.argv[2]);

//### Adding a voice channel listener
//
// Voice channels have three different events: `join`, `leave` and `change_topic`.
// Inside the event listener we can add different handlers for each of those events
//
// The `params` received in the event handler is an array with all the information about the event.
// Check the docs for more detailed info about this object

// Add the voice channel listener
app.on('voice', {
  // Add `join` event handler
  join: function(params) {
    console.log('The number ' + params.from + ' joined to the conference with number ' + params.to);
  },

  // And then a `leave` event handler
  leave: function(params) {
    console.log('The number ' + params.from + ' left the conference with number ' + params.to);
  }
});

//### Adding a Twitter channel listener

// We can add a Twitter event listener very easily too:
app.on('twitter', {
  
  // Twitter channels only have the `new` event, which is received when a tweet is received
  new: function(data) {
    console.log(data);
  }
});

//### Start listening to the channels

// This is how we start listening! Pretty easy, huh?
app.listen();
