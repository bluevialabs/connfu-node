var connFu = require('../index');
sys = require('sys');
winston = require('winston');

/**
 * Disable the logger for all the tests
 **/
var logger = new (winston.Logger)({
  transports: []
});
connFu.setLogger(logger);

describe('Attaching handlers', function(){

  var app;

  beforeEach(function() {
    app = connFu.createApp("1234");
  });

  it("should allow to attach handlers to a valid stream", function(){
    app.on("voice", {
      join: function(){
        console.log('Join method received');
      }
    });
    
    app.on("twitter", {
      new: function(){
        console.log('Join method received');
      }
    });
    
    expect(app.handlers.voice.join).toBeDefined();
    expect(app.handlers.twitter.new).toBeDefined();
  });
  
  it("should throw an error when attaching handlers to an invalid stream", function(){
    expect(function(){
      app.on("invalid-stream", {
        join: function(){
          console.log('Not valid stream');
        }
      });
    }).toThrow('Stream name invalid');
  });
  
  it("should work as a fluent interface", function(){
    app.on("voice", {
      join: function(){
        console.log('Join method received');
      }
    }).on("twitter", {
      new: function(){
        console.log('Join method received');
      }
    });
    
    expect(app.handlers.voice.join).toBeDefined();
    expect(app.handlers.twitter.new).toBeDefined();
  });
});