var connFu = require('../index');

describe('connFu basic initialization', function(){

  var app;

  beforeEach(function() {
    app = connFu.createApp("1234");
  });

  it("should initialize correctly", function(){
    expect(app).toBeDefined();
  });

  it("should initialize properly the token attribute", function(){
    expect(app.token).toEqual("1234");
  });

  it("should not be able to write the token attribute", function(){
    expect(function(){
      app.token = "1111";
    }).toThrow("Cannot set property token of #<Object> which has only a getter");
  });
  
  it("should accept a hash as a single constructor argument with all the handlers", function(){
    app = connFu.createApp({
      apiKey: "1234",
      handlers: {
        twitter: {
          new: function(){}
        },
        voice: {
          join: function(){},
          leave: function(){}
        },
        error: function(){}
      }
    });
    
    expect(app.token).toEqual("1234");
    expect(app.handlers.twitter.new).toBeDefined();
    expect(app.handlers.voice.join).toBeDefined();
    expect(app.handlers.error).toBeDefined();
  });
});