var connFu = require('../index');
var https = require('https');
var spy_https_request = require('./spies/https_request');
var spy_https_get = require('./spies/https_get');

describe('Reconnection to streams', function(){

  var app;

  beforeEach(function() {
    // Reset global options
    connFu.setOptions();
    
    app = connFu.createApp("1234");
    
    // Create mock for getting the stream
    spy_https_request.returnStream(null, '1234', 'connfu-stream-final');
  });

  it("should reconnect if the server closes the HTTP connection", function(){
  
    var events = [
      '["join",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-1/#conference","from":"4917663000001","to":"498966679151"}]',
      '["join",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-1/#conference","from":"4917663000002","to":"498966679151"}]'
    ];
    // Mock the server to send two events and after 100ms disconnect
    spy_https_get.streamEvents(null, '1234', events, 100, 120);
  
    var tweetsReceived = 0;
    app.on("voice", {
      join: function(params){
        if (tweetsReceived < 3) {
          expect(params.to).toEqual('498966679151');
          tweetsReceived++;
        } else {
          app.end();
          asyncSpecDone();
        }
      }
    });
    app.listen();

    asyncSpecWait();
  });
  
  it("should reconnect if there is a socket error", function(){
  
    var events = [
      '["join",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-1/#conference","from":"4917663000001","to":"498966679151"}]',
      '["join",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-1/#conference","from":"4917663000002","to":"498966679151"}]'
    ];
    // Mock the server to send two events and after 100ms disconnect
    spy_https_get.streamEvents(null, '1234', events, 100, 120, true);
  
    var tweetsReceived = 0;
    var error = false;
    app.on("voice", {
      join: function(params){
        if (tweetsReceived < 3) {
          expect(params.to).toEqual('498966679151');
          tweetsReceived++;
        } else {
          app.end();
          asyncSpecDone();
        }
      }
    }).on("error", function(e) {
        expect(e).toEqual({message: 'Got an error from the stream: Socket error!', code: 500});
        error = true;
    });
    app.listen();

    asyncSpecWait();
    
    waitsFor(function(){
      return error == true;
    }, "error callback to be called", 400);
  });
  
});