# connFu Node.js DSL [![Build Status](https://secure.travis-ci.org/bluevialabs/connfu-node.png)](http://travis-ci.org/bluevialabs/connfu-node)

connfu package provides an easy way to get access to connFu platform using the defined DSL.

## How to install

Downloading it from `npm` repository:

```bash
    $ npm install connfu
```

If you'd prefer to install the latest master version of connFu, you can clone the `connfu-node` source repository
from GitHub and then install it using `npm`:

```bash
    $ git clone https://github.com/dogfood20/connfu-node.git
    
    $ npm install -g connfu-node/
```

## How to use

### Connecting to streams

First, require `connfu` package:

```js
var connFu = require('connfu');
```

Next, create a basic application using your connFu API KEY:

```js
var app = connFu.createApp(<your_api_key>);
```

Then, attach some event handlers:

```js
app.on("voice", {
  join: function(params){
    console.log("The number " + params.from + " joined to the conference with number " + params.to);
  },
  leave: function(params){
    console.log("The number " + params.from + " left the conference with number " + params.to);
  }
});
```

Finally, just listen!

```js
app.listen();
```

### Sending commands

The `connFu` package can also send commands to handle some aspects of the application:

```js
var connFu = require('connfu');

// Init application
var app = connFu.createApp(<your_api_key>);

// Create a voice channel with a UK number
app.commands.voice().create("conference", "uk", {welcome_message: "Welcome to the conference"}, function(){
  // Add a number to the whitelist
  app.commands.voice("conference").whitelist().create("+44xxxxxx", "rafeca", function(){    
    // Update the name of the recently whitelisted number
    app.commands.voice("conference").whitelist("+4444xxxxxx").update("the wizard");
  });
});

(...)

// Delete the voice channel
app.commands.voice("conference").delete();
```

For more thorough examples, look at the `examples/` directory.

## Running Tests

To run the test suite first invoke the following command within the repo, installing the development dependencies:

```bash
    $ npm install
```

then run the tests:

```bash
    $ npm test
```

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
