Promise kitchen-sink with topdown decomposition
===========================

This example takes a top-down design approach, adding some readability to the
original example at the expense of a slightly larger file size.

The top-down approach consists of the following 

1. Describe an overview of the problem in your head, with words.
2. Try to write code that is the closest to those words
3. For every unimplemented thing, repeat until done.

> This is the example description I started with. Descriptions are not always
> meant to be expressed in text - they can also be expressed in code. However,
> none of the current implementations were clear enough so I decided to start
> with a tiny overview of what the file is supposed to do

The kitchen sink creates a test file with some contents, then reads the file
and verifies whether its content is as specified.

1. It must ensure that the file is a new one
2. It must put the following content: Hello World, !, a string describing the 
   evenness of the current time and the numbers 0-10.
3. It must check whether that content is as expected.

# benefits

* This example reads perfectly well from top to bottom, almost like blocking
  I/O code. The point of promises is to achieve exactly that. The ES6 variant
  is even cleaner and closer, with even less noise.

  Of course, some things are different. Semicolons are replaced with `.then`
  chaining. Function application is `pvalue.then(fn)` rather than `fn(value)`
  or for multiple arguments `Promise.join(pArg1, pArg2).then(fn)` rathern than
  `fn(arg1, arg2)`. try/catch is replaced with `.catch` and errors are
  automatically bubbled until the appropriate catch handler is found.

  However, enough things are similar that you can write code without
  reinventing the entire language. You can return values from functions again.
  You can even use for loops to sequentially iterate over a list of numbers.
  You can use `Array.map` and `Array.reduce`. You can treat promises like
  variables in that they can remember the value and it can be accessed at any
  time.

  This resuls with very clean, straightforward looking code that reads almost
  like plain English.

* Bluebird is the only external library used. Regarding performance, bluebird
  is practically as fast as callbacks. [This blog post][switch-bluebird]
  contains the benchmarks.

  Debugging promise code with Bluebird is simply awesome. Just run

      BLUEBIRD_DEBUG=1 node 05-kitchen-sink.js

  to get long stack traces across multiple events. Bluebird's flavor of
  LST is optimized very well - the overhead of long stack traces support is
  [barely noticable in most I/O situations][benchmark-lsp]

* Since the example isn't by its nature generic code (yet), there is no need to
  make a package.json. Writing a nice API and a npm module is orthogonal to 
  proper code decomposition, which is orthogonal to using promises. You can
  have it all :D

[switch-bluebird]: http://spion.github.io/posts/why-i-am-switching-to-promises.html
[benchmark-lsp]: https://gist.github.com/spion/6990910

