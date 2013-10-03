var path = require('path')
  , fs = require('fs')
  , should = require('should')
  , testFile = path.resolve("..", "testFile.txt");

var gratuitousFileFunction = function(cb) {
  fs.stat(testFile, function(err) {

    var next = function() {
      fs.writeFile(testFile, "Hello World", function(err) {
        if (err) return cb(err);
        setTimeout(function() {
          var evenness = '';

          var next2 = function() {
            fs.appendFile(testFile, "!", function(err) {
              if (err) return cb(err);
              fs.appendFile(testFile, " " + evenness, function(err) {
                if (err) return cb(err);
                var maxNum = 10;
                var curNum = 0;
                var writeNums = function(cb) {
                  fs.appendFile(testFile, " " + curNum, function(err) {
                    if (err) return cb(err);
                    curNum++;
                    if (curNum <= maxNum) {
                      writeNums(cb);
                    } else {
                      cb();
                    }
                  });
                };
                writeNums(function(err) {
                  if (err) return err;
                  fs.readFile(testFile, function(err, data) {
                    if (err) return cb(err);
                    data = data.toString();
                    data.should.equal("Hello World! " + evenness +
                                      " 0 1 2 3 4 5 6 7 8 9 10");
                    fs.unlink(testFile, cb);
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
        if (err) return cb(err);
        next();
      });
    }

  });
};

gratuitousFileFunction(function(err) {
  if (err) return console.log(err);
  console.log("Done!");
});
