var path = require('path')
  , fs = require('monocle-fs')
  , monocle = require('monocle-js')
  , sleep = monocle.utils.sleep
  , should = require('should')
  , testFile = path.resolve("..", "testFile.txt");

monocle.run(function*() {
  yield fs.writeFile(testFile, "Hello World");
  yield sleep(0.5);
  yield fs.appendFile(testFile, "!");
  yield fs.appendFile(testFile, " :-)");
  var data = yield fs.readFile(testFile);
  data = data.toString();
  data.should.equal("Hello World! :-)");
  yield fs.unlink(testFile);
  console.log("Done!");
});
