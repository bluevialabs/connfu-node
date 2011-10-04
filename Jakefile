desc("create examples");
task("examples",function(){
    var exec = require('child_process').exec;
    
    console.log('\n\033[33mcreating examples documentation...\033[0m');
    
    exec('docco examples/*', function(err, stdout, stderr){
      process.stdout.write(stdout);          
      process.stderr.write(stderr);
      if (err !== null) {
        process.stderr.write('exec error: ' + err);
      }
      complete();
    });
}, true);

desc("create docs");
task("docs",function(){
    var exec = require('child_process').exec;
    var command = 'redcarpet README.md | cat docs/_header.html - docs/_footer.html > docs/index.html';
    
    console.log('\n\033[33mCreating index page based on README.md...\033[0m');
     
    console.log('executing command "' + command + '"');
    exec(command, function(err, stdout, stderr){
      process.stdout.write(stdout);          
      process.stderr.write(stderr);
      if (err !== null) {
        process.stderr.write('exec error: ' + err);
      }
      complete();
    });
}, true);

desc("execute tests");
task("test",function(){
    var spawn = require('child_process').spawn;
    var child = spawn('npm', ['test']);
    
    console.log('\n\033[33mexecuting the tests...\033[0m');
    
    child.stderr.on('data', function(stderr){
      process.stderr.write(stderr);
    });
    child.stdout.on('data', function(stdout){
      process.stdout.write(stdout);
    });
    child.on('exit', function(code) {
      if (code !== 0) {
        fail(code);
      } else {
        complete();
      }
    });
}, true);

desc('build the complete package');
task('default', ['test', 'examples', 'docs'], function(){});