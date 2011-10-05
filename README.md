# connFu Node.js DSL [![Build Status](https://secure.travis-ci.org/bluevialabs/connfu-node.png)](http://travis-ci.org/bluevialabs/connfu-node)

connfu package provides an easy way to get access to [connFu platform](http://connfu.com) using Node.js

## How to install

The eassiest way is by installing it from the `npm` repository:

    
    $ npm install connfu

If you'd prefer to install the latest master version of connFu, you can clone the `connfu-node` source repository
from GitHub and then install it using `npm`:

    
    $ git clone "https://github.com/bluevialabs/connfu-node.git"
    
    $ npm install -g connfu-node/

## How to use it

### Connecting to streams

First, require `connfu` package:

    
    var connFu = require('connfu');

Next, create a basic application using your connFu API KEY:

    
    var app = connFu.createApp('<your_api_key>');

Then, attach some event handlers:

    
    app.on("voice", {
      join: function(params){
        console.log("The number " + params.from + " joined to the conference with number " + params.to);
      },
      leave: function(params){
        console.log("The number " + params.from + " left the conference with number " + params.to);
      }
    });

Finally, just listen!

    
    app.listen();

### Using the CLI

When you install connFu node package, you get a CLI that allows you to do some common tasks fast and easily:

![CLI interface](http://bluevialabs.github.com/connfu-node/images/screenshot_cli.png)

### Sending commands

The `connFu` package can also send commands to handle some aspects of the application:

    
    var connFu = require('connfu');
    
    // Init application
    var app = connFu.createApp('<your_api_key>');

    // Create a voice channel with a UK number
    app.commands.voice().create("conference", "uk", {welcome_message: "Welcome!"}, function(err, data){
      // Add a number to the whitelist
      app.commands.voice("conference").whitelist().create("+44xxxxxx", "rafeca", function(err, data){    
        // Update the name of the recently whitelisted number
        app.commands.voice("conference").whitelist("+4444xxxxxx").update("the wizard");
      });
    });

    /* (...) */
    
    // Delete the voice channel
    app.commands.voice("conference").delete();

For more thorough examples, look at the following examples

## Examples

[fancy-connfu-application.js](http://bluevialabs.github.com/connfu-node/fancy-connfu-application.html) - Very simple application that prints the events received from the streaming API

[growl-notifier.coffee](http://bluevialabs.github.com/connfu-node/growl-notifier.html) - CoffeeScript application that notfies via Growl the received events

[commands.js](http://bluevialabs.github.com/connfu-node/commands.html) - Express.js application that exposes all the DSL commands to a RESTful interface

## Running Tests

To run the test suite first invoke the following command within the repo, installing the development dependencies:

    
    $ npm install --dev

then run the tests:

    
    $ npm test

## License

(The MIT License)

Copyright (c) 2011 Rafael Oleza &lt;roa@tid.es&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
