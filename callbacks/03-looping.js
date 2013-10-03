var path = require('path')
  , fs = require('fs')
  , should = require('should')
  , testFile = path.resolve("..", "testFile.txt");

fs.writeFile(testFile, "Hello World!", function(err) {
  var maxNum = 10;
  var curNum = 0;
  var writeNums = function(cb) {
    fs.appendFile(testFile, " " + curNum, function(err) {
      curNum++;
      if (curNum <= maxNum) {
        writeNums(cb);
      } else {
        cb();
      }
    });
  };
  writeNums(function() {
    fs.readFile(testFile, function(err, data) {
      data = data.toString();
      data.should.equal("Hello World! 0 1 2 3 4 5 6 7 8 9 10");
      fs.unlink(testFile, function(err) {
        console.log("Done!");
      });
    });
  });
});


