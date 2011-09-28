/**
 * Autotester to execute the tests when a file is modified and notify the results to Growl
 **/
var watch = require('nodewatch');
var growl = require('growl');
var Path= require('path');
var jasmine = require('jasmine-node');
var sys = require('sys');

growl.binVersion(function(err, version){
  if (err) {
    sys.puts('You have to install growlnotifier to be able to use autotest');
    process.exit(1);
  }

  watch.add('./spec').add('./spec/spies').add('./lib').onChange(function(file,prev,curr){

    sys.puts('File ' + file + ' modified... Executing tests...');

    var specFolder = Path.join(process.cwd(), 'spec');
    var libFolder = Path.join(process.cwd(), 'lib');
    var indexFile = Path.join(process.cwd(), 'index.js');

    // Configure jasmine-node
    jasmine.dev_mode = 'src';
    for (var key in jasmine) {
      global[key] = jasmine[key];
    }
    jasmine.loadHelpersInFolder(specFolder, new RegExp("[-_]helper\\.(js)$"));

    jasmine.executeSpecsInFolder(
      specFolder,
      function(runner, log){
        if (runner.results().failedCount == 0) {
          growl.notify(
            'All tests passed! (' + runner.results().passedCount + '/' + runner.results().totalCount + ')',
            {title: 'connFu-dsl Unit Tests', image: 'resources/tests-pass.png'}
          );
        } else {
          // Get the desc of the first failing test
          var description = '1';
          runner.results().items_.forEach(function(value){
            if (value.failedCount !== 0) {
              value.items_.forEach(function(val){
                if (val.failedCount !== 0) {
                  description = val.description;
                }
              });
            }
          });

          growl.notify(
            runner.results().failedCount + ' tests failed! (' + runner.results().passedCount + '/' + runner.results().totalCount + ')',
            {title: description, image: 'resources/tests-fail.png'}
          );
        }

        // Restart jasmine environment after executing the test suite
        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.currentRunner_ = new jasmine.Runner(jasmineEnv);

        // Remove loaded files from cache
        for (var required in require.cache) {
          if (required.indexOf(specFolder) === 0 || required.indexOf(libFolder) === 0 || required.indexOf(indexFile) === 0) {
            delete require.cache[required];
          }
        }
      },
      true, // Verbose mode
      true , // Show colors
      new RegExp(".spec\\.(js)$", 'i')
    );
  });
});
