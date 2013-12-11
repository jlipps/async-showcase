# gratuitous file function

a modular version of https://github.com/jlipps/async-showcase/blob/master/callbacks/05-kitchen-sink.js using callbacks

### install and run

```
cd maxogden-style/05-kitchen-sink
npm install
npm test
```

### usage

```
var gff = require('maxogden-style/05-kitchen-sink')
var fileToUse = 'some-filename.txt'
gff(fileToUse, cb)
```

`fileToUse` can either exist or not
`cb` will be called with `(err, data, evenness)`
