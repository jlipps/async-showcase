var fs = require('fs')
  
module.exports = removeTestFile

function removeTestFile(testFile, cb) {
  fs.stat(testFile, function(err) {
    if (err) {
      // file doesn't exist
      createTestFile(testFile, cb);
    } else {
      fs.unlink(testFile, function(err) {
        if (err) return cb(err);
        createTestFile(testFile, cb);
      });
    }

  })
}

function createTestFile(testFile, cb) {
  fs.writeFile(testFile, "Hello World", function(err) {
    if (err) return cb(err);
    var evenness = '';
    if (Date.now() % 2 === 0) {
      evenness = 'Time was even, doing nothing! ';
      appendToTestFile(testFile, evenness, cb);
    } else {
      evenness = 'Time was odd, need to wait a ms...';
      setTimeout(function() {
        appendToTestFile(testFile, evenness, cb);
      }, 1);
    }
  });
};

function appendToTestFile(testFile, evenness, cb) {
  fs.appendFile(testFile, "! " + evenness, function(err) {
    if (err) return cb(err);
    var maxNum = 10;
    var curNum = 0;

    writeNums(function(err) {
      if (err) return err;
      fs.readFile(testFile, function(err, data) {
        if (err) return cb(err);
        data = data.toString();
        fs.unlink(testFile, function(err) {
          cb(err, data, evenness)
        });
      });
    });
    
    function writeNums(cb) {
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
  });
};

