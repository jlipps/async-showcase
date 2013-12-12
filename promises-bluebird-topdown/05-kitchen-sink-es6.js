//jshint esnext:true

var Promise = require("bluebird");
var path = require("path");
var fs = Promise.promisifyAll(require("fs"));
var should = require('should');
var testFile = path.resolve("..", "testFile.txt");

function doNothing() {}


var gratuitousFileFunction = function() {
    return ensureFileDoesntExist()
    .then(writeData)
    .then(verifyData)
    .then(removeFile);
}

function ensureFileDoesntExist() {
    return fs.statAsync(testFile).then(
        removeFile, 
        doNothing);
}

function removeFile() { return fs.unlinkAsync(testFile); }

function writeData() {
    var rememberedEvenness;
    return  fs.writeFileAsync(testFile, "Hello World")
    .then(_ => Promise.delay(500))
    .then(writeTime)
    .then(timeEvenness_ => rememberedEvenness = timeEvenness_)
    .then(writeNumbers)
    .then(_ => {return rememberedEvenness});
}

function writeTime() {
    var rightMoment, evenness;
    if (Date.now() % 2 === 0) {
        evenness = 'Time was even, doing nothing!'
        rightMoment  = Promise.fulfilled();
    } else {
        evenness = 'Time was odd, need to wait a ms...'; 
        rightMoment = Promise.delay(1);
    }
    return rightMoment
    .then(_ => fs.appendFileAsync(testFile, "!"))
    .then(_ => fs.appendFileAsync(testFile, " " + evenness))
    .then(_ => {return evenness});
}

function writeNumbers() {
    var cur = Promise.fulfilled();
    for (var i = 0; i <= 10; ++i) {
        cur = cur.then(function(i) {
            return fs.appendFileAsync(testFile, " " + i);
        }.bind(null, i));
    }
    return cur;
}

function verifyData(timeEvenness) {
    return fs.readFileAsync(testFile, 'utf8')
    .then(data => data.should.equal("Hello World! " + timeEvenness 
                                    + " 0 1 2 3 4 5 6 7 8 9 10"));
}

gratuitousFileFunction().then(
    _ => console.log("Done!"),
    err =>console.log(err));

