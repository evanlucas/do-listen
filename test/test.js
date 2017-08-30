'use strict'

const http = require('http')
const net = require('net')
const test = require('tap').test
const doListen = require('../')

test('net.Server', (t) => {
  t.test('success', (tt) => {
    const s = net.createServer()
    s.listen(0)
    doListen(s, (err) => {
      tt.error(err)
      tt.deepEqual(s._events, {}, 'event handlers are cleaned up')
      s.close()
      tt.end()
    })
  })

  t.test('invalid perms', (tt) => {
    const s = net.createServer()
    s.listen(1)
    doListen(s, (err) => {
      tt.equal(err.code, 'EACCES')
      tt.deepEqual(s._events, {}, 'event handlers are cleaned up')
      s.close()
      tt.end()
    })
  })

  t.test('unix socket - already exists', (tt) => {
    const s = net.createServer()
    s.listen(__filename)
    doListen(s, (err) => {
      tt.equal(err.code, 'EADDRINUSE')
      tt.deepEqual(s._events, {}, 'event handlers are cleaned up')
      s.close()
      tt.end()
    })
  })

  t.end()
})

test('http.Server', (t) => {
  t.test('success', (tt) => {
    const s = http.createServer()
    s.listen(0)
    doListen(s, (err) => {
      tt.error(err)
      s.close()
      tt.end()
    })
  })

  t.test('invalid perms', (tt) => {
    const s = http.createServer()
    s.listen(1)
    doListen(s, (err) => {
      tt.equal(err.code, 'EACCES')
      s.close()
      tt.end()
    })
  })

  t.test('unix socket - already exists', (tt) => {
    const s = http.createServer()
    s.listen(__filename)
    doListen(s, (err) => {
      tt.equal(err.code, 'EADDRINUSE')
      s.close()
      tt.end()
    })
  })

  t.end()
})
