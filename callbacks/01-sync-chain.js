var path = require('path')
  , fs = require('fs')
  , should = require('should')
  , testFile = path.resolve("..", "testFile.txt");

fs.writeFile(testFile, "Hello World", function(err) {
  setTimeout(function() {
    fs.appendFile(testFile, "!", function(err) {
      fs.appendFile(testFile, " :-)", function(err) {
        fs.readFile(testFile, function(err, data) {
          data = data.toString();
          data.should.equal("Hello World! :-)");
          fs.unlink(testFile, function(err) {
            console.log("Done!");
          });
        });
      });
    });
  }, 500);
});
