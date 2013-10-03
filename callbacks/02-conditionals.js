var path = require('path')
  , fs = require('fs')
  , should = require('should')
  , testFile = path.resolve("..", "testFile.txt");

fs.stat(testFile, function(err) {

  var next = function() {
    fs.writeFile(testFile, "Hello World", function(err) {
      setTimeout(function() {
        var evenness = '';

        var next2 = function() {
          fs.appendFile(testFile, "!", function(err) {
            fs.appendFile(testFile, " " + evenness, function(err) {
              fs.readFile(testFile, function(err, data) {
                data = data.toString();
                data.should.equal("Hello World! " + evenness);
                fs.unlink(testFile, function(err) {
                  console.log("Done!");
                });
              });
            });
          });
        };

        if (Date.now() % 2 === 0) {
          evenness = 'Time was even, doing nothing! ';
          next2();
        } else {
          evenness = 'Time was odd, need to wait a ms...';
          setTimeout(next2, 1);
        }
      }, 500);
    });
  };

  if (err) {
    // file doesn't exist
    next();
  } else {
    fs.unlink(testFile, function(err) {
      next();
    });
  }

});


