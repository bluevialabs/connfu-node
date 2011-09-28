var connFu = require('../index');
var https = require('https');
var spy_https_request = require('./spies/https_request');
var spy_https_get = require('./spies/https_get');

describe('Dispatching twitter events', function(){

  var app;

  beforeEach(function() {
    // Reset global options
    connFu.setOptions();
    
    app = connFu.createApp("1234");
    
    // Create mock for getting the stream
    spy_https_request.returnStream(null, '1234', 'connfu-stream-final');
  });

  it("should call the 'new' handler when receiving a tweet from the server", function(){
  
    var events = [
      '{"id": "source:twitter/94cc51b0-e5e3-11e0-a5f3-12313b050905","occurred_at": "2011-09-23T12:57:23.000Z","actor":{"object_type": "person","id": "connfudev","display_name": "connfudev","published": "2011-07-03T11:02:39.000Z","image": {"url": "http://a3.twimg.com/profile_images/1424588002/ninja_normal.jpg"},"statuses_count": 128,"profile_text_color": "333333","geo_enabled": true,"show_all_inline_media": false,"protected": false,"friends_count": 1,"favourites_count": 0,"description": "","profile_image_url_https": "https://si0.twimg.com/profile_images/1424588002/ninja_normal.jpg","profile_use_background_image": true,"following": null,"follow_request_sent": null,"listed_count": 0,"default_profile_image": false,"profile_link_color": "0084B4","profile_sidebar_border_color": "C0DEED","profile_sidebar_fill_color": "DDEEF6","profile_background_image_url_https": "https://si0.twimg.com/images/themes/theme1/bg.png","default_profile": true,"profile_background_tile": false,"utc_offset": 0,"lang": "en","is_translator": false,"notifications": null,"verified": false,"profile_background_image_url": "http://a0.twimg.com/images/themes/theme1/bg.png","contributors_enabled": false,"time_zone": "London","followers_count": 0,"profile_background_color": "C0DEED"},"verb": "post","object": {"object_type": "note","id": "117221019508424704","url": "http://twitter.com/connfudev/status/117221019508424704","published": "2011-07-04T13:16:15.000Z","content": "hello, world!","in_reply_to_status_id": null,"retweeted": false,"entities": {"urls": [],"user_mentions": ["rafeca","juandebravo"]},"truncated": false,"place": null,"retweet_count": 0,"favorited": false,"contributors": null},"target": {"object_type": "list","display_name": "connfudev\'s Twitter Timeline","summary": "connfudev\'s Twitter Timeline","image": {"url": "http://a3.twimg.com/profile_images/1424588002/ninja_normal.jpg"}},"title": "yoooooosss","provider": {"object_type": "service","id": "http://twitter.com","display_name": "Twitter","url": "http://twitter.com"},"backchat": {"source": "TWITTER","bare_uri": "twitter://connfudev/","user_path": ["twitter-listener"],"journal": ["backchat.tracker.TwitterJValueProcessor"],"uuid": "94cd1500-e5e3-11e0-a5f3-12313b050905","channels": ["twitter://connfudev/"]}}'
    ];
    
    spy_https_get.streamEvents(null, '1234', events);

    app.on('twitter', {
      new: function(tweet){
        var expectedResult = {
          id: '117221019508424704',
          content: 'hello, world!',
          from: 'connfudev',
          to: ["rafeca", "juandebravo"],
          messageType: "new",
          channelType: "twitter",
          timeStamp: new Date(Date.UTC(2011, 6, 4, 13, 16, 15))
        };
        expect(tweet).toEqual(expectedResult);
        
        asyncSpecDone();
      }
    });
    app.listen();
    
    asyncSpecWait();
  });  
});