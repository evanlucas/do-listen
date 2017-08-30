'use strict'

module.exports = function doListen(server, cb) {
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
