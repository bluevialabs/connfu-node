var connFu = require('../index');
var https = require('https');
var spy_https_request = require('./spies/https_request');
var spy_https_get = require('./spies/https_get');

describe('Error handling', function(){

  var app;

  beforeEach(function() {
    // Reset global options
    connFu.setOptions();
    app = connFu.createApp("1234");
  });
    
  it("should throw an error when connFu stream responds with an HTTP error", function(){
    // Create mock for getting the stream
    spy_https_request.returnStream(null, '1234', 'connfu-stream-final');
    
    // Add a spier that throws a 404 error
    spyOn(https, 'get').andCallFake(function(options, callback){
      setTimeout(function(){
        callback({
          statusCode: 404
        });
      }, 0);
      return {
        on: function() {}
      };
    });

    // Add error handler
    app.on("error", function(err) {
      expect(err).toEqual({message:"Got an HTTP error while trying to connect to the stream: HTTP Code 404", code: 404});
      asyncSpecDone();
    });
    app.listen();
    
    asyncSpecWait();
  });

  it("should throw an error when stream name retrieval responds with an HTTP error", function(){
    // Create mock that returns a 401 HTTP error
    spy_https_request.throwHttpError(null, '1234', 401);
    
    // Add error handler
    app.on("error", function(err) {
      expect(err).toEqual({message: "Got a HTTP 401 error while trying to get the stream name", code: 401});
      asyncSpecDone();
    });
    app.listen();
    
    asyncSpecWait();
  });
  
  it("should not fail when there is an error and no error handler has been defined", function(){
    // Create mock that returns a 401 HTTP error
    spy_https_request.throwHttpError(null, '1234', 401);
    app.listen();
  });
  
  it("should not fail if receiving only spaces from server", function(){
    spy_https_request.returnStream(null, '1234', 'connfu-stream-final');
    spy_https_get.streamEvents(null, '1234', [' ']);
    
    app.listen();
    
    // TODO: assert something!!
  });
});