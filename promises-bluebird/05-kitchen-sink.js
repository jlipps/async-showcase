var Promise = require("bluebird");
var path = require("path");
var fs = Promise.promisifyAll(require("fs"));
var should = require('should');
var testFile = path.resolve("..", "testFile.txt");

function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}
var gratuitousFileFunction = function () {
  return fs.statAsync(testFile).then(function () {
    return fs.unlinkAsync(testFile);
  }).then(next, next);

  function next() {
    var evenness;
    return fs.writeFileAsync(testFile, "Hello World").then(function () {
      return delay(500);
    }).then(function () {
      if (Date.now() % 2 === 0) {
        evenness = 'Time was even, doing nothing! ';
      } else {
        evenness = 'Time was odd, need to wait a ms...';
        return delay(1);
      }
    }).then(function () {
      return fs.appendFileAsync(testFile, "!");
    }).then(function () {
      return fs.appendFileAsync(testFile, " " + evenness);
    }).then(function () {
      var cur = Promise.fulfilled();
      for (var i = 0; i <= 10; ++i) {
        cur = cur.then(function(i) {
          return fs.appendFileAsync(testFile, " " + i);
        }.bind(null, i));
      }
      return cur;
    }).then(function (v) {
      return fs.readFileAsync(testFile);
    }).then(function (data) {
      data = data.toString();
      data.should.equal("Hello World! " + evenness +
        " 0 1 2 3 4 5 6 7 8 9 10");
      return fs.unlinkAsync(testFile);
    });
  }
};

gratuitousFileFunction().then(function () {
  console.log("Done!");
}).catch (function (err) {
  console.log(err);
});
