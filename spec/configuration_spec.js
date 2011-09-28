var https = require('https');
var connFu = require('../index');

describe('Advanced configuration of connFu', function(){

  it("should be able to configure the stream hostname globally", function(){
    
    connFu.setOptions({
      streamHostname: 'localhost'
    });
    
    var app = connFu.createApp("1234");
    
    spyOn(https, 'get').andCallFake(function(options, callback){      
      expect(options.host).toEqual('localhost');
      return {
        on: function() {}
      };
    });
    
    app.listen();    
  });
  
  it("should be able to set the port in the stream hostname property", function(){
    
    connFu.setOptions({
      streamHostname: 'localhost:3000'
    });
    
    var app = connFu.createApp("1234");
    
    spyOn(https, 'get').andCallFake(function(options, callback){      
      expect(options.host).toEqual('localhost');
      expect(options.port).toEqual(3000);
      return {
        on: function() {}
      };
    });
    
    app.listen();    
  });

  it("should be able to set the port in the stream hostname property", function(){
    
    connFu.setOptions({
      apiHostname: 'localhost:3000'
    });
    
    var app = connFu.createApp("1234");
    
    spyOn(https, 'request').andCallFake(function(options, callback){      
      expect(options.host).toEqual('localhost');
      expect(options.port).toEqual(3000);
      return {
        on: function() {},
        end: function() {}
      };
    });
    
    app.commands.getApp();    
  });
  
  it("should set the default port to 80 when not using SSL", function(){
    
    connFu.setOptions({
      apiHostname: 'localhost',
      useSsl: false
    });
    var app = connFu.createApp("1234");
    
    spyOn(require('http'), 'request').andCallFake(function(options, callback){
      expect(options.host).toEqual('localhost');
      expect(options.port).toEqual(80);
      return {
        on: function() {},
        end: function() {}
      };
    });
    app.commands.getApp();    
  });

  it("should set the default port to 443 when using SSL", function(){
    
    connFu.setOptions({
      apiHostname: 'localhost',
      useSsl: true
    });
    var app = connFu.createApp("1234");
    
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.host).toEqual('localhost');
      expect(options.port).toEqual(443);
      return {
        on: function() {},
        end: function() {}
      };
    });
    app.commands.getApp();    
  });
  
  it("should not change the port when it's specified in the hostname even if we use SSL", function(){
    
    connFu.setOptions({
      apiHostname: 'localhost:3000',
      useSsl: true
    });
    var app = connFu.createApp("1234");
    
    spyOn(https, 'request').andCallFake(function(options, callback){
      expect(options.host).toEqual('localhost');
      expect(options.port).toEqual(3000);
      return {
        on: function() {},
        end: function() {}
      };
    });
    app.commands.getApp();    
  });
  
});