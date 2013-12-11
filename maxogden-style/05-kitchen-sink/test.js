var should = require('should')
var path = require('path')
var testFile = path.resolve("testFile.txt")
var gratuitousFileFunction = require('./')

gratuitousFileFunction(testFile, function(err, data, evenness) {
  if (err) return console.log(err)
  var result = "Hello World! " + evenness + " 0 1 2 3 4 5 6 7 8 9 10"
  data.should.equal(result)
  console.log("Done!")
})
