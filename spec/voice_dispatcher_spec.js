var connFu = require('../index');
var https = require('https');
var spy_https_request = require('./spies/https_request');
var spy_https_get = require('./spies/https_get');

describe('Dispatching voice events', function(){

  var app;

  beforeEach(function() {
    // Reset global options
    connFu.setOptions();
    
    app = connFu.createApp("1234");
    
    // Create mock for getting the stream
    spy_https_request.returnStream(null, '1234', 'connfu-stream-final');
  });

  it("should call the join handler when receiving a join event from the server", function(){
  
    var events = [
      '["join",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-1/#conference","from":"4917663000001","to":"498966679151"}]'
    ];
    spy_https_get.streamEvents(null, '1234', events);

    app.on("voice", {
      join: function(event) {
        expect(event.channelType).toEqual('voice');
        expect(event.messageType).toEqual('join');
        expect(event.channelName).toEqual('channel-1');
        expect(event.from).toEqual('4917663000001');
        expect(event.to).toEqual('498966679151');
        asyncSpecDone();
      }
    });
    app.listen();
    
    asyncSpecWait();
  });
  
  it("should call the leave handler when receiving a leave event from the server", function(){
  
    var events = [
      '["leave",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-1/#conference","from":"4917663000001","to":"498966679151"}]'
    ];
    spy_https_get.streamEvents(null, '1234', events);

    app.on("voice", {
      leave: function(event) {
        expect(event.channelType).toEqual('voice');
        expect(event.messageType).toEqual('leave');
        expect(event.channelName).toEqual('channel-1');
        expect(event.from).toEqual('4917663000001');
        expect(event.to).toEqual('498966679151');
        asyncSpecDone();
      }
    });
    app.listen();
    
    asyncSpecWait();
  });
  
  it("should call join and leave when receiving the two events", function(){
  
    var events = [
      '["join",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-1/#conference","from":"4917663000001","to":"498966679151"}]',
      '["leave",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-1/#conference","from":"4917663000001","to":"498966679151"}]'
    ];

    spy_https_get.streamEvents(null, '1234', events, 100);

    var leave = false;
    app.on("voice", {
      join: function(event){
        expect(event.channelType).toEqual('voice');
        expect(event.messageType).toEqual('join');
        expect(event.channelName).toEqual('channel-1');
        expect(event.from).toEqual('4917663000001');
        expect(event.to).toEqual('498966679151');
        asyncSpecDone();
      },
      leave: function(event){
        leave = true;
        expect(event.channelType).toEqual('voice');
        expect(event.messageType).toEqual('leave');
        expect(event.channelName).toEqual('channel-1');
        expect(event.from).toEqual('4917663000001');
        expect(event.to).toEqual('498966679151');
      }
    });
    app.listen();
    
    asyncSpecWait();
    
    waitsFor(function(){
      return leave !== false;
    }, "receiving the leave event from connFu", 1000);
    
  });
  
  it("should call join twice when receiving two join events", function(){
  
    var events = [
      '["join",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-1/#conference","from":"4917663000001","to":"498966679151"}]',
      '["join",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-2/#conference","from":"4917663000011","to":"498966679152"}]'
    ];

    spy_https_get.streamEvents(null, '1234', events, 100);

    var numberJoins = 0;
    app.on("voice", {
      join: function(event){
        expect(event.channelType).toEqual('voice');
        expect(event.messageType).toEqual('join');
        switch(numberJoins) {
          case 0:
            expect(event.channelName).toEqual('channel-1');
            expect(event.from).toEqual('4917663000001');
            expect(event.to).toEqual('498966679151');
            break;
          case 1:
            expect(event.channelName).toEqual('channel-2');
            expect(event.from).toEqual('4917663000011');
            expect(event.to).toEqual('498966679152');
            asyncSpecDone();
        }
        numberJoins++;
      }
    });
    app.listen();
    
    asyncSpecWait();
  });
  
  it("should not fail if receiving some spaces from server", function(){
  
    var events = [
      ' ', // Empty string received from stream server
      '   ["join",{"appId":"connfu-stream-final","conferenceId":"connfu://channel-1/#conference","from":"4917663000001","to":"498966679151"}]   '
    ];
  
    spy_https_get.streamEvents(null, '1234', events, 100);

    app.on("voice", {
      join: function(event){
        expect(event.channelType).toEqual('voice');
        expect(event.messageType).toEqual('join');
        expect(event.channelName).toEqual('channel-1');
        expect(event.from).toEqual('4917663000001');
        expect(event.to).toEqual('498966679151');
        asyncSpecDone();
      }
    });
    app.listen();
    
    asyncSpecWait();
  });
});