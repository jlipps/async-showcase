Async JS Control Flow Showcase
==============================

This is a project designed to showcase different ways to handle asynchronous
control flow in Javascript. If you're familiar with this concept, you might
want to skip to the [list of projects](#alternatives) or the [description of
callback issues](#issues).

Note that this is meant to be an informational, not a competitive, guide to
all the approaches to flow control on offer.

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

<a name="issues"></a>The impact of callbacks
-----------------------
There are a number of issues that arise as part of a callback-based
architecture. These issues range from the aesthetic to the practical (e.g.,
some argue callbacks lead to less readable or less maintainable code).

### Rightward drift

It often happens that you want to run a number of asynchronous methods, one
after the other. In this case, each method must be called in the callback of
the previous method. Using the anonymous function strategy detailed above, you
end up with code that looks like this:

```js
asyncFn1(function() {
    asyncFn2(function() {
        asyncFn3(function() {
            asyncFn4(function() {
                console.log("We're done!");
            });
        });
    });
});
```

To some people, once you start filling these functions out with their own
particular logic, it's very easy to lose track of where you are in the logical
flow.

### Branching logic

Sometimes you might want to call a function `bar()` only if the result of
another function `foo()` matches some criteria. If these are synchronous
functions, the logic looks like this:

```js
var res = foo();
if (res === "5") {
    res = bar(res);
}
res = baz(res);
console.log("After transforming, res is " + res);
```

If `foo` and `bar` are asynchronous functions, however, it gets a little more
complicated. One option is to duplicate code:

```js
foo(function(res) {
    if (res === "5") {
        bar(res, function(res2) {
            baz(res2, function(res3) {
                console.log("After transforming, res is " + res3);
            });
        });
        return;
    }
    baz(res, function(res2) {
        console.log("After transforming, res is " + res2);
    });
});
```

In this case, we've duplicated the calls to `baz`. An alternative is to create
a `next` function that encapsulates the `baz` call and subsequent log
statement:

```js
var next = function(res) {
    baz(res, function(res2) {
        console.log("After transforming, res is " + res2);
    });
};

foo(function(res) {
    if (res === "5") {
        bar(res, function(res2) {
            next(res2);
        });
        return;
    }
    next(res);
});
```

This is more DRY, but at the cost of creating a function whose only purpose is
to continue the logical flow of the code, called in multiple places.

### Looping

If you need to perform an async method on a number of objects, it can be
a little mind-bending. Synchronously, we can do something like this:

```js
var collection = [objA, objB, objC];
var response = [];
for (var i = 0; i < collection.length; i++) {
    response.push(transformMyObject(collection[i]));
}
console.log(response);
```

If `transformMyObject` is actually asynchronous, and we need to transform each
object one after the other, we need to do something more like this:

```js
var collection = [objA, objB, objC];
var response = [];
var doTransform = function() {
    var obj = collection.unshift();
    if (typeof obj === "undefined") {
        console.log(response);
    } else {
        transformMyObject(obj, function(err, newObj) {
            response.push(newObj);
            doTransform();
        });
    }
};
doTransform();
```

### Error handling

You can't use Javascript's basic error handling techniques (try/catch) to
handle errors in callbacks, even if they're defined in the same scope. In other
words, this doesn't work:

```js
var crashyFunction = function(cb) {
    throw new Error("uh oh!");
};

var runFooBar = function(cb) {
    foo(function() {
        crashyFunction(function() {
            bar(function() {
                cb();
            });
        });
    });
};

try {
    runFooBar(function() {
        console.log("We're done");
    });
} catch (err) {
    console.log(err.message);
}
```

This is why Node.js uses a convention of passing errors into callbacks so they
can be handled:

```js
var crashyFunction = function(cb) {
    try {
        throw new Error("uh oh!");
    } catch (e) {
        cb(e);
    }
};

var runFooBar = function(cb) {
    foo(function(err) {
        if (err) return cb(err);
        crashyFunction(function(err) {
            if (err) return cb(err);
            bar(function(err) {
                if (err) return cb(err);
                cb();
            });
        });
    });
};

runFooBar(function(err) {
    if (err) return console.log(err.message);
    console.log("We're done!");
});

```

As you can see, the result of this is that we have to check the error state in
every callback so we can short-circuit the chain and pass the error to the
top-level callback. This is a bit redundant at best.

Node.js now has domains, which makes this problem a little easier to
handle.

<a name="alternatives"></a>Alternatives to callbacks
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

Hint: take a look at the "kitchen sink" example file in each of the projects to
see how they handle all the issues in one script.

* [Callbacks](callbacks/) (i.e., the "standard" or "naive" approach above)

Other approaches:

* [Bluebird](promises-bluebird/) [[project](https://github.com/petkaantonov/bluebird)]
* Caolan/async [[project](https://github.com/caolan/async)]
* Co [[project](https://github.com/visionmedia/co)]
* IcedCoffeeScript [[project](http://maxtaco.github.io/coffee-script/)]
* [Max Ogden style callbacks](maxogden-style/) [[website](http://callbackhell.com)]
* [Monocle-js](monocle-js/) [[project](https://github.com/jlipps/monocle-js)]
* Q [[project](https://github.com/kriskowal/q)]
* When [[project](https://github.com/cujojs/when)]
