var https = require('https');

var defaultHostname = 'stream.connfu.com';

exports.streamEvents = function(hostname, apiKey, events, timeBetweenEvents, endRequest, socketError) {
  
  timeBetweenEvents = timeBetweenEvents || 0;
  endRequest = endRequest || 0;
  hostname = hostname || defaultHostname;
    
  spyOn(https, 'get').andCallFake(function(options, callback){
    
    expect(options.host).toEqual(hostname);
    expect(options.headers.Authorization).toEqual('Backchat ' + apiKey);
    
    var ended = false;
    
    callback({
      statusCode: 200,
      on: function(name, finalCallback) {
        if (name == 'data') {
          // Send the data in intervals separated by time
          events.forEach(function(ev,k){
            setTimeout(function(){
              if (!ended) {
                finalCallback(new Buffer(ev));
              }
            }, (k+1)*timeBetweenEvents);
          });
        } else if (name == 'end') {
          // Only close the connection if endRequest > 0
          if (endRequest > 0 && !socketError) {
            setTimeout(function() {
              ended = true;
              finalCallback();
            }, endRequest);
          }
        }
      }
    });
    return {
      on: function(name, callback) {
        if (name == 'error') {
          if (endRequest > 0 && socketError) {
            setTimeout(function(){
              ended = true;
              callback("Socket error!");
            }, endRequest);
          }
        }
      },
      destroy: function() {
        ended = true;
      }
    };
  });
};

