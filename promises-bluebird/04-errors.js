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
  return fs.writeFileAsync(testFile, "Hello World").then(function () {
    return delay(500);
  }).then(function () {
    return fs.appendFileAsync(testFile, "!");
  }).then(function () {
    return fs.appendFileAsync(testFile, " :-)");
  }).then(function () {
    return fs.readFileAsync(testFile);
  }).then(function (data) {
    data = data.toString();
    data.should.equal("Hello World! :-)");
    return fs.unlinkAsync(testFile);
  });
};

gratuitousFileFunction().then(function () {
  console.log("Done!");
}).
catch (function (e) {
  console.log(e);
});