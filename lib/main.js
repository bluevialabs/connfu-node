/**
 * Module dependencies.
 */
var connFu = require('./connFu');
var winston = require('winston');

/**
 * connFu version.
 */
exports.version = '0.1.0';

/**
 * Set up default logger
 **/
var logger = new(winston.Logger)({
  transports: [
  new(winston.transports.Console)({
    level: "info"
  })]
}).cli();

/**
 * Function to set another logger
 **/
exports.setLogger = function(newLogger) {
  logger = newLogger;
};

/**
 * Creates a new connFu application
 *
 * @param params string|array
 * @return {connFu Application}
 */
exports.createApp = function(params) {

  if (typeof params === 'string') {
    return new connFu(params, logger);
  }

  var app = new connFu(params.apiKey, logger);

  for (stream in params.handlers) {
    app.on(stream, params.handlers[stream]);
  }
  return app;
};

/**
 * Sets the global options for connFu
 *
 * @param options
 */
exports.setOptions = function(options) {
  connFu.prototype.options = options;
};
