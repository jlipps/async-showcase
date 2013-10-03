var path = require('path')
  , fs = require('monocle-fs')
  , monocle = require('monocle-js')
  , sleep = monocle.utils.sleep
  , should = require('should')
  , testFile = path.resolve("..", "testFile.txt");

monocle.run(function*() {
  yield fs.writeFile(testFile, "Hello World!");
  var maxNum = 0;
  for (var i = 0; i <= maxNum; i++) {
    yield fs.appendFile(testFile, " " + i);
  }
  var data = yield fs.readFile(testFile);
  data = data.toString();
  data.should.equal("Hello World! 0 1 2 3 4 5 6 7 8 9 10");
  yield fs.unlink(testFile);
  console.log("Done!");
});

