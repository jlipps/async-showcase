# gratuitous file function

A modular version of https://github.com/jlipps/async-showcase/blob/master/callbacks/05-kitchen-sink.js using callbacks.

This takes the original naive version from the `/callbacks` folder and applies the steps from http://callbackhell.com/.

First read the original, then read this version, and form your own opinion.

Some additional insight regarding my stance on async coding:

- I don't expect async JS code to read top-to-bottom like blocking I/O code. Attempts to do this (IMO) are like fitting a square peg in a round hole.
- This employs the node module pattern, e.g. it has a package.json, a readme with instructions, a generic module and a test showing how to consume the module API.
- There are no external flow control libraries used, only callbacks. The different between this one and the original callback implementation is simply coding style. I prefer callbacks mainly for [performance reasons](http://blog.trevnorris.com/2013/08/callbacks-what-i-said-was.html) (many of my projects in node are performance critical, so to speak) but also because I have found them easier to debug when things go wrong (Murphy's law).
- This is partially covered in callbackhell.com, but I find that naming anonymous functions and taking advantage of function hoisting go a long way towards writing readable async code. Turning your code into a module also forces you to write nice APIs.
- My own preference is to write simple code over clever code, to avoid messy abstractions and to publish as many node modules as possible to NPM!

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
