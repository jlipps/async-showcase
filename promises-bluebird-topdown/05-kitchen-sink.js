var Promise = require("bluebird");
var path = require("path");
var fs = Promise.promisifyAll(require("fs"));
var should = require('should');
var testFile = path.resolve("..", "testFile.txt");


var gratuitousFileFunction = function () {
    return ensureFileDoesntExist()
        .then(writeData)
        .then(verifyData)
        .then(removeFile);
}


function ensureFileDoesntExist() {
    return fs.statAsync(testFile)
        .then(removeFile, doNothing);
}

function removeFile() { return fs.unlinkAsync(testFile); }
function doNothing() {}

function writeData() {
    return writeHelloWorldAndWait()
        .then(writeTime)
        .then(function(timeEvenness) {
            return writeNumbers().thenReturn(timeEvenness);
        })
}

function writeHelloWorldAndWait() {
    return fs.writeFileAsync(testFile, "Hello World")
        .then(function() { 
            return Promise.delay(500); 
        });
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
    return rightMoment.then(function() {
        return fs.appendFileAsync(testFile, "!");
    }).then(function() { 
        return fs.appendFileAsync(testFile, " " + evenness);
    }).thenReturn(evenness);
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
    return fs.readFileAsync(testFile, 'utf8').then(function (data) {
        data.should.equal("Hello World! " + timeEvenness +
                          " 0 1 2 3 4 5 6 7 8 9 10");
    });
}

gratuitousFileFunction().then(function () {
    console.log("Done!");
}).catch (function (err) {
    console.log(err.stack);
});

