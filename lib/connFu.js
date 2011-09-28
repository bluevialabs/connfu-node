var Client = require('./client');

/**
 * connFu application code. It is exposed directly to outside
 *
 * @param apiKey
 * @param options
 * @return {connFu Application}
 */
exports = module.exports = connFu = function(apiKey, logger) {

  // Available streams
  var _availableStreams = ['voice', 'twitter', 'error', 'sms'];

  // Default options
  var _options = {
    streamHostname: 'stream.connfu.com',
    apiHostname: 'api.connfu.com',
    apiVersion: 'v1',
    useSsl: true
  };

  // Overwrite default options with global options
  if (this.options) {
    for (var x in this.options) {
      _options[x] = this.options[x];
    }
  }

  // REST API client
  var _client;

  // Stream request object
  var _streamRequest;

  // Array to store the event handlers
  var _handlers = [];

  // is the app ending?
  var _isEnding = false;
  
  // empty function
  var noop = function(){};

  // Starts listening to a stream
  var _listenToStream = function(streamName) {
    logger.info('Connecting to connFu stream ' + streamName + '...');

    // Get port based on hostname
    var host = _options.streamHostname.split(':', 2);
    var defaultPort = _options.useSsl ? 443 : 80;

    options = {
      host: host[0],
      port: host[1] ? parseInt(host[1], 10) : defaultPort,
      path: '/' + streamName,
      method: 'GET',
      headers: {
        Authorization: 'Backchat ' + apiKey
      }
    };

    var https = _options.useSsl ? require('https') : require('http');
    _streamRequest = https.get(options, function(response) {
      // Throw an error if the HTTP status code is not valid
      if (response.statusCode > 299) {
        var msg = 'Got an HTTP error while trying to connect to the stream: HTTP Code ' + response.statusCode;
        logger.error(msg);
        (methods.handlers.error||noop)({
          message: msg,
          code: response.statusCode
        });
        return;
      }

      logger.info('Connected to connFu stream, Waiting for events...');

      response.on('data', _processStreamChunk);

      response.on('end', function() {
        // Stream dropped us... Reconnect to stream!
        if (!_isEnding) {
          logger.warn('Got disconnected from connFu stream. Reconnecting...');
          methods.listen();
        }
      });
    });

    _streamRequest.on('error', function(e) {
      // if the application is not finishing, send error and reconnect to stream!
      if (!_isEnding) {
        logger.debug('Got disconnected from connFu. Reconnecting...');
        (methods.handlers.error||noop)({
          message: 'Got an error from the stream: ' + e,
          code: 500
        });
        methods.listen();
      }
    });
  };
  
  // Processes and parses an event received from the HTTP Stream
  var _processStreamChunk = function(chunk) {
    // Trim the data received from the server and check it's not empty
    chunk = chunk.toString().match(/^\s*(.*)\s*$/)[1];
    if (!chunk) {
      return;
    }
    logger.info('Event received from connFu: ' + chunk.toString());

    // Parse the data received from connFu server
    var data = JSON.parse(chunk);

    // Hack to split between Voice events and Twitter events
    if (data instanceof Array) {
      // Voice or SMS event
      var eventName = data[0];
      var params = data[1];
      
      var channelName = null;
      var content = null;
      
      switch(eventName) {
        case 'sms':
          var channelType = 'sms';
          eventName = 'new';
          content = params.message;
          break;
        default:
          // Remove the connfu:// & /#connference stuff from the conferenceId
          var channelType = 'voice';
          channelName = params.conferenceId.match(/^[A-Z]*:\/\/([^\/#]+)/i)[1];
          break;
      }
      
      // Create the event object
      var output = {
        id: null,
        content: content,
        from: params.from,
        to: params.to,
        messageType: eventName,
        channelType: channelType,
        channelName: channelName,
        timeStamp: null
      };
      if (methods.handlers[channelType]) {
        (methods.handlers[channelType][eventName]||noop)(output);
      } 
    } else {
      // Twitter event
      
      // Create the event object
      var output = {
        id: data.object.id,
        content: data.object.content,
        from: sender = data.actor.id,
        to: data.object.entities.user_mentions ? data.object.entities.user_mentions : [],
        messageType: "new",
        channelType: "twitter",
        timeStamp: new Date(Date.parse(data.object.published))
      };
      if (methods.handlers.twitter) {
        (methods.handlers.twitter['new']||noop)(output);
      }
    }
  };

  /**
   * Public interface
   **/
  var methods = {
    // Method used to add event handlers
    on: function(stream, events) {
      // Check if the stream name is valid
      if (_availableStreams.indexOf(stream) === -1) {
        throw('Stream name invalid');
      }

      // Initialize stream handler
      _handlers[stream] = events;

      // Implement fluent interface
      return methods;
    },

    // Listen method
    listen: function() {
      logger.debug('Starting listen()...');

      // Get the stream name using the REST API
      methods.commands.getApp(
        function(app) {
          _listenToStream('connfu-stream-' + app.name);
        },
        function(e) {
          logger.error('Error getting the stream name', e);
          (methods.handlers.error||noop)({
            message: 'Got a HTTP ' + e.code + ' error while trying to get the stream name',
            code: e.code
          });
        }
      );

      // Implement fluent interface
      return methods;
    },

    // End connection with connfu streaming server
    end: function() {
      logger.debug('Disconnecting from connFu...');
      _isEnding = true;
      _streamRequest.destroy();
    },

    // Accessor to apiKey
    get token() {
      return apiKey;
    },

    // Accessor to REST API Client
    get commands() {
      if (!_client) {
        return new Client(apiKey, logger, _options);
      }
    },

    // Accessor to defined handlers
    get handlers() {
      return _handlers;
    }
  };

  return methods;
};
