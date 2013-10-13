var Promise = require("bluebird");
var path = require("path");
var fs = Promise.promisifyAll(require("fs"));
var should = require('should');
var testFile = path.resolve("..", "testFile.txt");

fs.writeFileAsync(testFile, "Hello World!").then(function() {
  var cur = Promise.fulfilled();
    for(var i = 0; i <= 10; ++i) {
      cur = cur.then(function(i) {
        return fs.appendFileAsync(testFile, " " + i);
      }.bind(null, i));
    }
  return cur;
}).then(function(){
  return fs.readFileAsync(testFile);
}).then(function(data) {
  data = data.toString();
  data.should.equal("Hello World! 0 1 2 3 4 5 6 7 8 9 10");
  return fs.unlinkAsync(testFile);
}).then(function(){
  console.log("Done!");
});
