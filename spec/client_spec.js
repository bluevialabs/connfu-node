var connFu = require('../index');
var https = require('https');
var spy_https_request = require('./spies/https_request');

describe('API Client', function(){

  var app;
  
  var apiVersion = 'v1';

  beforeEach(function() {
    // Clear connFu options
    connFu.setOptions();
    app = connFu.createApp('1234');
  });

  it("should call the errorCallback when the server returns an HTTP error", function(){
    // Create mock that returns a 401 HTTP error
    spy_https_request.throwHttpError(null, '1234', 401);
  
    app.commands.getApp(function(err, data) {
      expect(err).toEqual({message:'Server returned a 401 HTTP error', code: 401});
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("should call the errorCallback when there is a general error on the HTTP request", function(){
    // Create mock that returns a general error
    spy_https_request.throwGeneralError("ENOTFOUND, Domain name not found", "ENOTFOUND");
  
    app.commands.getApp(function(err, data) {
      expect(err).toEqual({message:'ENOTFOUND, Domain name not found', code: "ENOTFOUND"});
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });

  it("should find stream by api_key correctly", function(){    
    // Create mock for getting the stream
    spy_https_request.returnStream(null, '1234', 'test');
    
    app.commands.getApp(function(err, data){
      expect(err).toEqual(null);
      expect(data.name).toEqual('test');
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("should get the info associated to a voice channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.headers.AUTH_TOKEN).toEqual("1234");
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test');
      setTimeout(function(){
        callback({
          statusCode: 200,
          on: function(data, newCallback) {

            setTimeout(function(){
              if (data === 'data') {
                newCallback('{"uid": "test", "phone": "+44100", "privacy":"public", "country":"uk", "topic":"conference", "created_at":"20110101T12:00+02:00","updated_at":"20110101T12:00+02:00"}');
              } else if(data === 'end') {
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
    
    app.commands.voice("test").get(function(err, data){
      expect(err).toEqual(null);
      expect(data.uid).toEqual('test');
      expect(data.phone).toEqual('+44100');
      expect(data.privacy).toEqual('public');
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("should update the voice channel topic", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.headers.AUTH_TOKEN).toEqual('1234');
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test');
      expect(options.method).toEqual('PUT');
      setTimeout(function(){
        callback({
          statusCode: 200,
          on: function(data, newCallback) {
            setTimeout(function(){
              if (data === 'data') {
                newCallback('');
              } else if(data === 'end') {
                newCallback();
              }
            }, 0);
          },
          end: function(){}
        });
      }, 0);
      return {
        write: function(data) {
          expect(data).toEqual('{"topic":"new topic"}');
        },
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.voice('test').update({topic: 'new topic'}, function(err, data){
      expect(err).toEqual(null);
      expect(data).toEqual(null);
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("should update the voice channel welcome message", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.headers.AUTH_TOKEN).toEqual('1234');
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test');
      expect(options.method).toEqual('PUT');
      setTimeout(function(){
        callback({
          statusCode: 200,
          on: function(data, newCallback) {
            setTimeout(function(){
              if (data === 'data') {
                newCallback('');
              } else if(data === 'end') {
                newCallback();
              }
            }, 0);
          },
          end: function(){}
        });
      }, 0);
      return {
        write: function(data) {
          expect(data).toEqual('{"welcome_message":"Hello, world"}');
        },
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.voice('test').update({welcome_message: 'Hello, world'}, function(err, data){
      expect(err).toEqual(null);
      expect(data).toEqual(null);
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("should update the voice channel rejected message", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.headers.AUTH_TOKEN).toEqual('1234');
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test');
      expect(options.method).toEqual('PUT');
      setTimeout(function(){
        callback({
          statusCode: 200,
          on: function(data, newCallback) {
            setTimeout(function(){
              if (data === 'data') {
                newCallback('');
              } else if(data === 'end') {
                newCallback();
              }
            }, 0);
          },
          end: function(){}
        });
      }, 0);
      return {
        write: function(data) {
          expect(data).toEqual('{"rejected_message":"Bye, world"}');
        },
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.voice('test').update({rejected_message: 'Bye, world'}, function(err, data){
      expect(err).toEqual(null);
      expect(data).toEqual(null);
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("should update the voice channel privacy", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.headers.AUTH_TOKEN).toEqual('1234');
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test');
      expect(options.method).toEqual('PUT');
      setTimeout(function(){
        callback({
          statusCode: 200,
          on: function(data, newCallback) {
            setTimeout(function(){
              if (data === 'data') {
                newCallback('');
              } else if(data === 'end') {
                newCallback();
              }
            }, 0);
          },
          end: function(){}
        });
      }, 0);
      return {
        write: function(data) {
          expect(data).toEqual('{"privacy":"public"}');
        },
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.voice('test').update({privacy: 'public'}, function(err, data){
      expect(err).toEqual(null);
      expect(data).toEqual(null);
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("should create a voice channel with all the optional parameters", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.headers.AUTH_TOKEN).toEqual('1234');
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice');
      expect(options.method).toEqual('POST');
      setTimeout(function(){
        callback({
          headers: {
            location: '/' + apiVersion + '/channels/voice/test'
          },
          statusCode: 201,
          on: function(data, newCallback) {
            setTimeout(function(){
              if (data === 'data') {
                newCallback('');
              } else if (data === 'end'){
                newCallback();
              }
            }, 0);
          },
          end: function(){}
        });
      }, 0);
      return {
        write: function(data) {
          expect(JSON.parse(data)).toEqual({
            uid: "conference",
            country: "uk",
            topic: "My first conference",
            welcome_message: "Hello, world",
            rejected_message: "Bye, world",
            privacy: "public"
          });
        },
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.voice().create("conference", "uk", {
      topic: 'My first conference',
      welcome_message: 'Hello, world',
      rejected_message: 'Bye, world',
      privacy: 'public',
    }, function(err, data) {
      expect(err).toEqual(null);
      expect(data).toEqual('/' + apiVersion + '/channels/voice/test');
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("should create a voice channel with no optional parameters", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.headers.AUTH_TOKEN).toEqual('1234');
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice');
      expect(options.method).toEqual('POST');
      setTimeout(function(){
        callback({
          headers: {
            location: '/' + apiVersion + '/channels/voice/test'
          },
          statusCode: 201,
          on: function(data, newCallback) {
            setTimeout(function(){
              if (data === 'data') {
                newCallback('');
              } else if (data === 'end'){
                newCallback();
              }
            }, 0);
          },
          end: function(){}
        });
      }, 0);
      return {
        write: function(data) {
          expect(JSON.parse(data)).toEqual({
            uid:"conference",
            country:"uk"
          });
        },
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.voice().create("conference", "uk", {}, function(err, data){
      expect(err).toEqual(null);
      expect(data).toEqual('/' + apiVersion + '/channels/voice/test');
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("should delete a voice channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.headers.AUTH_TOKEN).toEqual('1234');
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test');
      expect(options.method).toEqual('DELETE');
      setTimeout(function(){
        callback({
          headers: {},
          statusCode: 200,
          on: function(data, newCallback) {
            setTimeout(function(){
              if (data == 'data') {
                newCallback('');
              } else if (data == 'end') {
                newCallback();
              }
            }, 0);
          },
          end: function(){}
        });
      }, 0);
      return {
        write: function(data) {},
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.voice("test").remove(function(err, data){
      expect(err).toEqual(null);
      expect(data).toEqual(null);
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("should get the full whitelist of a voice channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test/whitelisted');
      expect(options.method).toEqual('GET');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.voice("test").whitelist().get();
  });
  
  it("should create a whitelist entry into a voice channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test/whitelisted');
      expect(options.method).toEqual('POST');
      setTimeout(function(){
        callback({
          headers: {
            location: '/' + apiVersion + '/channels/voice/test/whitelist/%"B440123"'
          },
          statusCode: 201,
          on: function(data, newCallback) {
            setTimeout(function(){
              if (data === 'data') {
                newCallback('{"name":"rafeca","phone":"+440123"}');
              } else if (data === 'end'){
                newCallback();
              }
            }, 0);
          },
          end: function(){}
        });
      }, 0);
      return {
        write: function(data) {
          expect(data).toEqual('{"name":"rafeca","phone":"+440123"}');
        },
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.voice('test').whitelist().create('+440123', 'rafeca', function(err, data){
      expect(err).toEqual(null);
      expect(data).toEqual({name: 'rafeca', phone: '+440123'});
      asyncSpecDone();
    });
    
    asyncSpecWait();
  });
  
  it("should delete all the whitelists entries of a voice channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test/whitelisted');
      expect(options.method).toEqual('DELETE');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.voice("test").whitelist().remove();
  });
  
  it("should get a whitelist entry of a voice channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test/whitelisted/%2B440123');
      expect(options.method).toEqual('GET');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.voice('test').whitelist('+440123').get();
  });
  
  it("should update a whitelist entry of a voice channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test/whitelisted/%2B440123');
      expect(options.method).toEqual('PUT');
      return {
        write: function(data) {
          expect(data).toEqual('{"name":"new_name"}');
        },
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.voice('test').whitelist('+440123').update('new_name');
  });
  
  it("should delete a whitelist entry of a voice channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test/whitelisted/%2B440123');
      expect(options.method).toEqual('DELETE');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.voice('test').whitelist('+440123').remove();
  });
  
  it("should get all the phone numbers of a voice channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test/phones');
      expect(options.method).toEqual('GET');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.voice("test").phones().get();
  });
  
  it("should create a new phone number on a voice channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test/phones');
      expect(options.method).toEqual('POST');
      return {
        write: function(data) {
          expect(data).toEqual('{"country":"uk"}');
        },
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.voice('test').phones().create('uk');
  });
  
  it("should delete a phone number from a voice channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/voice/test/phones/%2B440123');
      expect(options.method).toEqual('DELETE');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.voice("test").phones('+440123').remove();
  });
  
  it("should get all the RSS channels of an application", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/rss');
      expect(options.method).toEqual('GET');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.rss().get();
  });
  
  it("should get a specific RSS channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/rss/google_blog');
      expect(options.method).toEqual('GET');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.rss('google_blog').get();
  });
  
  it("should update a RSS channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/rss/google_blog');
      expect(options.method).toEqual('PUT');
      return {
        write: function(data) {
          expect(data).toEqual('{"uri":"http://new_uri"}');
        },
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.rss('google_blog').update('http://new_uri');
  });
  
  it("should create a RSS channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/rss');
      expect(options.method).toEqual('POST');
      return {
        write: function(data) {
          expect(data).toEqual('{"uid":"google_blog","uri":"http://uri"}');
        },
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.rss().create('google_blog', 'http://uri');
  });
  
  it("should delete a RSS channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/rss/google_blog');
      expect(options.method).toEqual('DELETE');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.rss('google_blog').remove();
  });
  
  it("should get all the Twitter channels of an application", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/twitter');
      expect(options.method).toEqual('GET');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.twitter().get();
  });
  
  it("should get a specific Twitter channel of an application", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/twitter/rafeca');
      expect(options.method).toEqual('GET');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.twitter('rafeca').get();
  });
  
  it("should create a Twitter channel with various origin accounts inside an application", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/twitter');
      expect(options.method).toEqual('POST');
      return {
        write: function(data) {
          expect(data).toEqual('{"uid":"rafeca_account","accounts":[{"name":"rafeca"},{"name":"juandebravo"},{"name":"PaSToReT"}]}');
        },
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.twitter().create("rafeca_account", "origin", ["rafeca", "juandebravo", "PaSToReT"]);
  });
  
  it("should create a Twitter channel with a mentioned account inside an application", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/twitter');
      expect(options.method).toEqual('POST');
      return {
        write: function(data) {
          expect(data).toEqual('{"uid":"rafeca_account","accounts":[{"name":"rafeca"}],"filter":"recipients:rafeca"}');
        },
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.twitter().create("rafeca_account", "mentioned", "rafeca");
  });

  it("should create a Twitter channel with various hashtags as filters inside an application", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/twitter');
      expect(options.method).toEqual('POST');
      return {
        write: function(data) {
          expect(data).toEqual('{"uid":"rafeca_account","accounts":[{"name":"rafeca"}],"filter":"tags:(barcelona AND london)"}');
        },
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.twitter().create("rafeca_account", "origin", ["rafeca"], {tags: ["barcelona", "london"]});
  });

  it("should create a Twitter channel with various hashtags and texts as filters inside an application", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/twitter');
      expect(options.method).toEqual('POST');
      return {
        write: function(data) {
          expect(data).toEqual(
            '{"uid":"rafeca_account","accounts":[{"name":"rafeca"}],"filter":"tags:(barcelona AND london) AND text:(rocks AND sucks)"}'
          );
        },
        end: function() {},
        on: function() {}
      };
    });
        
    app.commands.twitter().create("rafeca_account", "origin", ["rafeca"], {tags: ["barcelona", "london"], text:["rocks", "sucks"]});
  });
  
  it("should create a Twitter channel with various hashtags and texts as filters inside an application", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/twitter');
      expect(options.method).toEqual('POST');
      return {
        write: function(data) {
          expect(data).toEqual(
            '{"uid":"rafeca_account","accounts":[{"name":"rafeca"}],"filter":"tags:(barcelona AND london) AND text:(rocks AND sucks)"}'
          );
        },
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.twitter().create("rafeca_account", "origin", ["rafeca"], {tags: ["barcelona", "london"], text:["rocks", "sucks"]});
  });
  
  it("should raise an exception when trying to create a Twitter channel with invalid account type", function(){
    expect(function(){
      app.commands.twitter().create("rafeca_account", "invalid_type", ["rafeca", "juandebravo"]);
    }).toThrow("Invalid account type. Valid types are: 'origin', 'mentioned'");
  });
  
  it("should raise an exception when trying to create a Twitter channel with multiple mentioned accounts", function(){
    expect(function(){
      app.commands.twitter().create("rafeca_account", "mentioned", ["rafeca", "juandebravo"]);
    }).toThrow("Only one mentioned account is allowed to be added in a Twitter channel");
  });
  
  it("should delete a Twitter channel", function(){
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.path).toEqual('/' + apiVersion + '/channels/twitter/rafeca_account');
      expect(options.method).toEqual('DELETE');
      return {
        write: function() {},
        end: function() {},
        on: function() {}
      };
    });
    
    app.commands.twitter('rafeca_account').remove();
  });
  
});