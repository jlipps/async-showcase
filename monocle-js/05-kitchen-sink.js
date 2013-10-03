var path = require('path')
  , fs = require('monocle-fs')
  , monocle = require('monocle-js')
  , o_O = monocle.o_O
  , sleep = monocle.utils.sleep
  , should = require('should')
  , testFile = path.resolve("..", "testFile.txt");

var gratuitousFileFunction = o_O(function*() {
  yield fs.writeFile(testFile, "Hello World");
  yield sleep(0.5);
  var evenness = '';
  if (Date.now() % 2 === 0) {
    evenness = 'Time was even, doing nothing! ';
  } else {
    evenness = 'Time was odd, need to wait a ms...';
    yield sleep(0.001);
  }
  yield fs.appendFile(testFile, "!");
  yield fs.appendFile(testFile, " " + evenness);
  var maxNum = 10;
  for (var i = 0; i <= maxNum; i++) {
    yield fs.appendFile(testFile, " " + i);
  }
  var data = yield fs.readFile(testFile);
  data = data.toString();
  data.should.equal("Hello World! " + evenness + " 0 1 2 3 4 5 6 7 8 9 10");
  yield fs.unlink(testFile);
});

monocle.run(function*() {
  try {
    yield gratuitousFileFunction();
  } catch (e) {
    return console.log(e);
  }
  console.log("Done!");
});


