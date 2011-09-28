var connFu = require('../index');
var https = require('https');
var spy_https_request = require('./spies/https_request');
var spy_https_get = require('./spies/https_get');

describe('Dispatching SMS events', function(){

  var app;

  beforeEach(function() {
    // Reset global options
    connFu.setOptions();
    
    app = connFu.createApp("1234");
    
    // Create mock for getting the stream
    spy_https_request.returnStream(null, '1234', 'connfu-stream-final');
  });

  it("should call the 'join' handler when receiving a SMS from the server", function(){
  
    var events = [
      '["sms", { "appId": "123456", "from": "+34677001122", "to": "+4475234444", "message":"Hello connFu application!" }]'
    ];
    
    spy_https_get.streamEvents(null, '1234', events);

    app.on('sms', {
      new: function(sms){
        var expectedResult = {
          id: null,
          content: 'Hello connFu application!',
          from: '+34677001122',
          to: '+4475234444',
          messageType: 'new',
          channelType: 'sms',
          channelName: null,
          timeStamp: null
        };
        expect(sms).toEqual(expectedResult);
        
        asyncSpecDone();
      }
    });
    app.listen();
    
    asyncSpecWait();
  });  
});