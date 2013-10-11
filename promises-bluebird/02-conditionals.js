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

fs.statAsync(testFile).then(function () {
  return fs.unlinkAsync(testFile);
}).finally(function () { //Either gets here immediately from the error, or waits for the unlink
  var evenness;
  fs.writeFileAsync(testFile, "Hello World").then(function () {
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
    return fs.readFileAsync(testFile);
  }).then(function (data) {
    data = data.toString();
    data.should.equal("Hello World! " + evenness);
    return fs.unlinkAsync(testFile);
  }).then(function () {
    console.log("Done!");
  });
});