# do-listen

[![Build Status](https://travis-ci.org/evanlucas/do-listen.svg)](https://travis-ci.org/evanlucas/do-listen)
[![Coverage Status](https://coveralls.io/repos/evanlucas/do-listen/badge.svg?branch=master&service=github)](https://coveralls.io/github/evanlucas/do-listen?branch=master)

Properly call callback on a node server on the listening or error event.

Why?

I continue to see the following:

```js
const http = require('http')
const server = http.createServer()
server.listen((err) => { // `err` won't be passed here
  if (err) throw err
})
```

The problem with that is that the `cb` passed to the `listen` function is
only added as an event listener for the `listening` event.

i.e. no `err` will ever be passed back.

In order to properly wait for either the listening event or error event
without leaking listeners:

```js
function doListen(server, cb) {
  var called = false
  const done = (err) => {
    if (called) return
    server.removeListener('error', done)
    server.removeListener('listening', done)
    called = true
    cb(err)
  }

  server.on('error', done)
  server.on('listening', done)
}
```

which is literally what the package is :]

## Install

```bash
$ npm install do-listen
```

## Examples

```js
'use strict'

const net = require('net')
const doListen = require('do-listen')

const server = net.createServer()
server.listen(0)
doListen(server, (err) => {
  if (err) throw err
  console.log('listening on', server.address().port)
})
```

This also works with http

```js
'use strict'

const http = require('http')
const doListen = require('do-listen')

const server = http.createServer()
server.listen(8080)
doListen(server, (err) => {
  if (err) throw err
  console.log('listening on', server.address().port)
})
```

Want to use with promises or async/await?

```js
'use strict'

const http = require('http')
const {promisify} = require('util')
const doListen = require('do-listen')

const server = http.createServer()
server.listen(8080)
async function main() {
  await doListen(server)
}

// or

'use strict'

const http = require('http')
const {promisify} = require('util')
const doListen = require('do-listen')

const server = http.createServer()
server.listen(8080)
doListen(server).then(() => {
  console.log('listening on', server.address().port)
}).catch((err) => {
  throw err
})
```

## Test

```bash
$ npm test
```

## Author

Evan Lucas

## License

MIT (See `LICENSE` for more info)
