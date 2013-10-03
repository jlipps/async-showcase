Async JS Control Flow Shootout
==============================

This is a project designed to showcase different ways to handle asynchronous
control flow in Javascript.

Background
----------
Javascript applications, including Node.js-based software, are most frequently
structured around event-driven or asynchronous methods. It's possible that
a function `foo` or `bar` could kick off some logic that is not yet complete
when the functions themselves complete. One common example of this is
Javascript's `setTimeout()`. `setTimeout`, as the name implies, doesn't
actually pause execution for a designated amount of time. Instead, it schedules
execution for a later time, and meanwhile returns control to the script:

```js
var done = function() {
    console.log("set timeout finished!");
};

setTimeout(done, 1000);
console.log("hello world");
```

The output of this script is:

```
hello world
set timeout finished!
```

Callbacks
---------
Node.js has generalized this asynchronous control flow idea through the use of
callbacks. This is a convention whereby an asynchronous function takes
a parameter which is itself a function. This function, called a callback, is
then called whenever the asynchronous result is ready. In Node, callbacks are
called with the convention that an Error object is passed as the first
parameter for use in error handling, and further results are sent as subsequent
parameters. Let's take a look at an example:


```js
var fs = require('fs');

var readFileCallback = function(err, fileData) {
    if (err) {
        console.log("We got an error! Oops!");
        return;
    }
    console.log(fileData.toString('utf8'));
};

fs.readFile('/path/to/my/file', readFileCallback);
```

In this example, we use a callback-based method `fs.readFile()` to get the
contents of a file. The function `readFileCallback` is called when the file
data has been retrieved. If there was an error, say because the file doesn't
exist, we get that as the first parameter, and can log a helpful message.
Otherwise, we can display the file contents.

Because we can use anonymous functions, it's much more common to see code that
looks like this:

```js
var fs = require('fs');

fs.readFile('/path/to/my/file', function(err, fileData) {
    if (err) {
        console.log("We got an error! Oops!");
        return;
    }
    console.log(fileData.toString('utf8'));
});
```

This architecture can be quite powerful because it is non-blocking. We could
easily read two files at the same time just by putting calls to `fs.readFile`
one after the other:

```js
var fs = require('fs');

var readFileCallback = function(err, fileData) {
    if (err) {
        console.log("We got an error! Oops!");
        return;
    }
    console.log(fileData.toString('utf8'));
};

fs.readFile('/path/to/my/file', readFileCallback);
fs.readFile('/path/to/another/file', readFileCallback);
```

In this example, the file contents will be printed out in an undetermined order
because they're kicked off at roughly the same time, and their callbacks will
be called when the system is done reading each one, which could vary based on
many factors.

The impact of callbacks
-----------------------
There are a number of issues that arise as part of a callback-based
architecture. These issues range from the aesthetic to the practical (e.g.,
some argue callbacks lead to less readable or less maintainable code).

### Rightward drift

### Branching logic

### Error handling

Alternatives to callbacks
-------------------------
Of course, callbacks aren't the only way to do asynchronous control flow. There
are many helpful libraries that make using callbacks less prone to the issues
above. There are also alternatives which aren't callback-based at all, though
they might rely on callbacks under the hood. The point of this project is to
enable a side-by-side comparison of these approaches.

The [callbacks directory](callbacks/) of this repo has a number of reference
Javascript files which demonstrate in code how callback-based flow control
works. These files can all be run using Node.js.

The following projects have implemented, or are in the process of implementing,
revisions of the reference scripts using their particular approach to
asynchronous control flow. Please check them out, read the directory's README
to see how they address the issues above, run the code, and make an informed
decision about which approach to adopt in your own projects!

* [monocle-js](monocle-js/)
