var path = require('path')
  , fs = require('monocle-fs')
  , monocle = require('monocle-js')
  , sleep = monocle.utils.sleep
  , should = require('should')
  , testFile = path.resolve("..", "testFile.txt");

monocle.run(function*() {
  try {
    yield fs.stat(testFile);
    yield fs.unlink(testFile);
  } catch (e) {}
  yield fs.writeFile(testFile, "Hello World");
  yield fs.appendFile(testFile, "!");
  var evenness = '';
  if (Date.now() % 2 === 0) {
    evenness = 'Time was even, doing nothing! ';
  } else {
    evenness = 'Time was odd, need to wait a ms...';
    yield sleep(0.001);
  }
  yield sleep(0.5);
  yield fs.appendFile(testFile, " " + evenness);
  var data = yield fs.readFile(testFile);
  data = data.toString();
  data.should.equal("Hello World! " + evenness);
  yield fs.unlink(testFile);
  console.log("Done!");
});

