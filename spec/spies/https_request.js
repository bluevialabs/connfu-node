var https = require('https');

var DEFAULT_HOSTNAME = 'api.connfu.com';
var API_VERSION = 'v1';

exports.returnStream = function(hostname, apiKey, nameToReturn) {
  spyOn(https, 'request').andCallFake(function(options, callback){
    
    hostname = hostname || DEFAULT_HOSTNAME;
    
    expect(options.host).toEqual(hostname);
    expect(options.headers.AUTH_TOKEN).toEqual(apiKey);
    expect(options.path).toEqual('/' + API_VERSION + '/');
    setTimeout(function(){
      callback({
        statusCode: 200,
        on: function(data, newCallback) {
          setTimeout(function(){
            if (data === 'data') {
              newCallback('{"name": "' + nameToReturn + '"}');
            } else if (data === 'end'){
              newCallback();
            }
          }, 0);
        },
        end: function(){}
      });
    }, 0);
    return {
      write: function() {},
      end: function() {},
      on: function() {}
    };
  });
};

exports.throwHttpError = function(hostname, apiKey, httpError) {
  spyOn(https, 'request').andCallFake(function(options, callback){
    if (hostname) {
      expect(options.host).toEqual(hostname);
    }
    expect(options.headers.AUTH_TOKEN).toEqual(apiKey);
    setTimeout(function(){
      callback({
        statusCode: httpError,
        on: function(event, newCallback){
          if (event === 'end') {
            setTimeout(function(){
              newCallback();
            },0);
          }
        },
        end: function(){}
      });
    }, 0);
    return {
      write: function() {},
      end: function() {},
      on: function() {}
    };
  });
};

exports.throwGeneralError = function(message, code) {
  spyOn(https, 'request').andCallFake(function(options, callback){
    return {
      write: function() {},
      end: function() {},
      on: function(event,callback) {
        if (event === 'error') {
          setTimeout(function(){
            callback({message: message, code:code});
          }, 0);
        }
      }
    };
  });
};
