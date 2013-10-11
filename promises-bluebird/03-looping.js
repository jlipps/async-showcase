var Promise = require("bluebird");
var path = require("path");
var fs = Promise.promisifyAll(require("fs"));
var should = require('should');
var testFile = path.resolve("..", "testFile.txt");

fs.writeFileAsync(testFile, "Hello World!").then(function() {
    //Map series pattern
    var cur = Promise.fulfilled();
    var promises = [];
    for(var i = 0; i <= 10; ++i) {
        cur = cur.then(function(i) {
            return function() {
                return fs.appendFileAsync(testFile, " " + i);
            };
        }(i));
        promises.push(cur);
    }
    return promises;
}).all().then(function(){
    return fs.readFileAsync(testFile);
}).then(function(data) {
    data = data.toString();
    data.should.equal("Hello World! 0 1 2 3 4 5 6 7 8 9 10");
    return fs.unlinkAsync(testFile);
}).then(function(){
    console.log("Done!");
});