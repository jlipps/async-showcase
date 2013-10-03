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
  yield fs.appendFile(testFile, "!");
  yield fs.appendFile(testFile, " :-)");
  var data = yield fs.readFile(testFile);
  data = data.toString();
  data.should.equal("Hello World! :-)");
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

