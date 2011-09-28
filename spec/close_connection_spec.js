var connFu = require('../index');
var spy_https_request = require('./spies/https_request');
var spy_https_get = require('./spies/https_get');

describe('Close connections', function(){

  var app;

  beforeEach(function() {
    app = connFu.createApp("1234");
  });

  it("should not receive more events after calling end() on a connfu app", function(){

    // Mock the REST API to return one stream
    spy_https_request.returnStream(null, '1234', 'connfu-stream-final');
    
    // Mock the streaming API to send two events
    var events = [
      '["join",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-1/#conference","from":"4917663000001","to":"498966679151"}]',
      '["join",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-2/#conference","from":"4917663000011","to":"498966679152"}]'
    ];
    spy_https_get.streamEvents(null, '1234', events, 100);

    var numEvents = 0;
    app.on("voice", {
      join: function(params){
        numEvents++;
        // End the application after receiving the first event
        app.end();
      }
    });
    app.listen();
    
    // Wait a little bit to be sure that we don't receive any other event
    waits(1000);
    
    runs(function(){
      // Check that we have only received one event
      expect(numEvents).toEqual(1);
    })
  });
});