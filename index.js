'use strict'

module.exports = function doListen(server, cb) {
  const done = (err) => {
    server.removeListener('error', done)
    server.removeListener('listening', done)
    cb(err)
  }

  server.on('error', done)
  server.on('listening', done)
}
