var path = require('path')
  , fs = require('fs')
  , should = require('should')
  , testFile = path.resolve("..", "testFile.txt");

var gratuitousFileFunction = function(cb) {
  fs.writeFile(testFile, "Hello World", function(err) {
    if (err) return cb(err);
    setTimeout(function() {
      fs.appendFile(testFile, "!", function(err) {
        if (err) return cb(err);
        fs.appendFile(testFile, " :-)", function(err) {
          if (err) return cb(err);
          fs.readFile(testFile, function(err, data) {
            if (err) return cb(err);
            data = data.toString();
            data.should.equal("Hello World! :-)");
            fs.unlink(testFile, cb);
          });
        });
      });
    }, 500);
  });
};

gratuitousFileFunction(function(err) {
  if (err) return console.log(err);
  console.log("Done!");
});
