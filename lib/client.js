var querystring = require('querystring');

/**
 * connFu application code. It is exposed directly to outside
 *
 * @param apiKey
 * @param options
 * @return {connFu api client}
 */
exports = module.exports = client = function(apiKey, logger, options) {

  var _logger = options.logger;

  var _request = function(method, path, data, callback, error) {
    // Define default error callback
    error = error ||
    function() {};

    // Add data to the query string (GET & DELETE requests)
    if (data.length && ['GET', 'DELETE'].indexOf(method) != -1) {
      path += '?' + querystring.stringify(data);
    }

    var headers = {
      AUTH_TOKEN: apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    // Add conent-length header for POST & PUT requests
    if (['POST', 'PUT'].indexOf(method) != -1) {
      headers['Content-Length'] = JSON.stringify(data).length;
    } else {
      headers['Content-Length'] = 0;
    }

    // Get port based on hostname
    var host = options.apiHostname.split(':', 2);
    var defaultPort = options.useSsl ? 443 : 80;

    var params = {
      host: host[0],
      port: host[1] ? parseInt(host[1], 10) : defaultPort,
      method: method,
      path: '/' + options.apiVersion + path,
      headers: headers
    };

    logger.info('Making HTTP request: ' + method + ' http://' + params.host + ':' + params.port + params.path);

    var https = options.useSsl ? require('https') : require('http');
    var req = https.request(params, function(res) {
      var output = '';
      var sys = require('sys');

      // Read all the data from the response
      res.on('data', function(chunk) {
        output += chunk;
      });

      // Send the response to the callback
      res.on('end', function() {
        // If the status code is different than 2xx throw an error
        if (res.statusCode > 299) {
          logger.error('Server returned a ' + res.statusCode + ' HTTP error. Body: ' + output);
          error({
            message: 'Server returned a ' + res.statusCode + ' HTTP error',
            code: res.statusCode
          });
          return;
        }

        logger.info('Response from server: ' + output);

        // Trim the data received from the server
        output = output.toString().match(/^\s*(.*)\s*$/)[1];

        // Parse & return in the callback the JSON response
        if (typeof output !== 'undefined' && output) {
          callback(JSON.parse(output));
        } else {
          // When creating resources, return the "location" header
          if (res.statusCode === 201) {
            callback(res.headers.location);
            return;
          }
          callback(null);
        }
      });

      res.on('error', function(e) {
        logger.error('There was an error making the request: ' + e);
        error({
          message: e.message,
          code: e.code
        });
      });
    });

    req.on('error', function(e) {
      logger.error('There was an error making the request: ' + e);
      error({
        message: e.message,
        code: e.code
      });
    });

    // Add data to the body of the request (POST & PUT requests)
    if (data && ['POST', 'PUT'].indexOf(method) != -1) {
      req.write(JSON.stringify(data));
    }

    req.end();
  };

  var _get = function(path, data, callback, error) {
    _request('GET', path, data, callback, error);
  };

  var _put = function(path, data, callback, error) {
    _request('PUT', path, data, callback, error);
  };

  var _post = function(path, data, callback, error) {
    _request('POST', path, data, callback, error);
  };

  var _delete = function(path, data, callback, error) {
    _request('DELETE', path, data, callback, error);
  };

  return {
    /**
     * Returns the app information
     **/
    getApp: function(callback, error) {
      _get('/', {}, callback, error);
    },

    voice: function(voiceName) {
      return {
        // client.voice(name).get()
        get: function(callback, error) {
          var path = '/channels/voice';
          path += voiceName ? '/' + voiceName : '';
          _get(path, {}, callback, error);
        },

        // client.voice(name).update(params)
        update: function(params, callback, error) {
          _put('/channels/voice/' + voiceName, params, callback, error);
        },

        // client.voice().create(name, country, params, topic)
        create: function(voiceName, country, params, callback, error) {
          params.uid = voiceName;
          params.country = country;
          _post('/channels/voice', params, callback, error);
        },

        // client.voice(name).remove()
        remove: function(callback, error) {
          _delete('/channels/voice/' + voiceName, {}, callback, error);
        },

        whitelist: function(phone) {
          if (!phone) {
            return {
              // client.voice(name).whitelist().get()
              get: function(callback, error) {
                _get('/channels/voice/' + voiceName + '/whitelisted', {}, callback, error);
              },

              // client.voice(name).whitelist().create(phone, name)
              create: function(phone, name, callback, error) {
                _post('/channels/voice/' + voiceName + '/whitelisted', {
                  name: name,
                  phone: phone
                }, callback, error);
              },

              // client.voice(name).whitelist().remove()
              remove: function(callback, error) {
                _delete('/channels/voice/' + voiceName + '/whitelisted', {}, callback, error);
              }
            };
          }

          return {
            // client.voice(name).whitelist(phone).get()
            get: function(callback, error) {
              _get('/channels/voice/' + voiceName + '/whitelisted/' + querystring.escape(phone), {}, callback, error);
            },

            // client.voice(name).whitelist(phone).update(name)
            update: function(name, callback, error) {
              _put('/channels/voice/' + voiceName + '/whitelisted/' + querystring.escape(phone), {
                name: name
              }, callback, error);
            },

            // client.voice(name).whitelist(phone).remove()
            remove: function(callback, error) {
              _delete('/channels/voice/' + voiceName + '/whitelisted/' + querystring.escape(phone), {}, callback, error);
            }
          };
        },
        
        phones: function(phoneNumber) {
          
          if (!phoneNumber) {
            return {
              // client.voice(name).phones().get()
              get: function(callback, error) {
                _get('/channels/voice/' + voiceName + '/phones', {}, callback, error);
              },
              // client.voice(name).phones().create(country)
              create: function(country, callback, error) {
               _post('/channels/voice/' + voiceName + '/phones', {
                  country: country
                }, callback, error);
              }
            };
          }
          
          return {
            // client.voice(name).phones(phoneNumber).remove()
            remove: function(callback, error) {
              _delete('/channels/voice/' + voiceName + '/phones/' + querystring.escape(phoneNumber), {}, callback, error);
            }
          }
        }
      };
    },
    
    rss: function(rssName) {
      return {
        // client.rss(name).get()
        get: function(callback, error) {
          var path = '/channels/rss';
          path += rssName ? '/' + rssName : '';
          _get(path, {}, callback, error);
        },

        // client.rss(name).update(newUri)
        update: function(newUri, callback, error) {
          _put('/channels/rss/' + rssName, {
            uri: newUri
          }, callback, error);
        },

        // client.rss().create(uri)
        create: function(rssName, uri, callback, error) {
          _post('/channels/rss', {
            uid: rssName,
            uri: uri
          }, callback, error);
        },

        // client.rss(name).remove()
        remove: function(callback, error) {
          _delete('/channels/rss/' + rssName, {}, callback, error);
        }
      };
    },
    
    twitter: function(twitterName) {
      return {
        // client.twitter(name).get()
        get: function(callback, error) {
          var path = '/channels/twitter';
          path += twitterName ? '/' + twitterName : '';
          _get(path, {}, callback, error);
        },

        // client.twitter().create(uri, "origin",  ["rafeca"], filters)
        create: function(uid, type, accounts, filters, callback, error) {
          var params = {
            uid: uid
          };
          
          var appliedFilters = [];
          
          if (type === 'origin') {
            params.accounts = accounts.map(function(account){
              return {name: account};
            });
          } else if (type === 'mentioned') {
            if (typeof(accounts) !== 'string') {
              throw('Only one mentioned account is allowed to be added in a Twitter channel');
            }
            params.accounts = [{name: accounts}];
            appliedFilters.push('recipients:' + accounts);
          } else {
            throw("Invalid account type. Valid types are: 'origin', 'mentioned'");
          }
          
          if (filters) {
            for (var k in filters) {
              appliedFilters.push(k + ':(' + filters[k].join(' AND ') + ')');
            }
          }
          
          if (appliedFilters.length) {
            params.filter = appliedFilters.join(' AND ');
          }
          
          _post('/channels/twitter', params, callback, error);
        },

        // client.twitter(name).remove()
        remove: function(callback, error) {
          _delete('/channels/twitter/' + twitterName, {}, callback, error);
        }
      };
    }
  };
};
