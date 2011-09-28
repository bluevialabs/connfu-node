# Introduction
# ----------------
# This is a usage example of the **connFu** node DSL. This
# application must be run from the command line in an OSX machine
# with *Grow* and `growlnotifier` installed.
# 
# Once launched, it listens to all the configured events in the application
# and shows them as a Growl notification
#
### Running this example
#
# * First of all, you have to register into [connFu.com](https://connfu.com)
#   an application. You will receive an **application token** which will be very useful ;)
#
# * Then, install the `connFu` and `growl` npm packages:
#
#          $ npm install growl connfu
#
# * Then get the source of this example from [here](https://github.com/bluevialabs/connfu-node/blob/master/examples/growl-notifier.coffee)
#   and run it!
#
#          $ coffee growl-notifier.coffee <application_token>

# Annotated source
# ----------------

# Require `connfu` and `growl` packages
connFu = require 'connfu'
growl = require 'growl'

# Check that we receive the `application_token` as an argument
if process.argv.length < 3 
  console.log "Usage: coffee grow-notifier.coffee <application_token>"
  process.exit 1

# Check if we have `growlnotifier` installed. To install it, download the 
# `growl` installer from [here](http://growl.info/) and execute the installer 
# within `Extras` folder
#
# If `growlnotifier` is not installed, show an error
growl.binVersion (err, version) ->
  if err
    console.log "'growlnotifier' is required in order to run this application"
    process.exit 1

  # Create the connFu application
  connFu.createApp
    apiKey: process.argv[2]
    handlers:
      # When receiving any kind of event, send a notification to Growl
      voice:
        join: (call) ->
          growl.notify "The number #{call.from} joined to the conference with number #{call.to}"
        leave: (call) ->
          growl.notify "The number #{call.from} left the conference with number #{call.to}"
    
      twitter:
        new: (tweet) ->
          growl.notify tweet.content, title: "New Tweet from #{tweet.from}"
    
      sms:
        new: (sms) ->
          growl.notify sms.content, title: "New SMS from #{sms.from}"

  # Listen to `connFu` events!
  .listen()
