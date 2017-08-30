'use strict'

const tap = require('tap')

if (require.main === module) {
  return tap.pass('skip')
}

const http = require('http')
const net = require('net')
const {promisify} = require('util')
const doListen = promisify(require('../'))
const {test} = tap

async function main() {
  await test('net.Server', async (t) => {
    await t.test('success', async (tt) => {
      const s = net.createServer()
      s.listen(0)
      try {
        await doListen(s)
      } catch (err) {
        tt.threw(err)
      }
      tt.deepEqual(s._events, {}, 'event handlers are cleaned up')
      s.close()
      tt.end()
    })

    await t.test('invalid perms', async (tt) => {
      const s = net.createServer()
      s.listen(1)
      try {
        await doListen(s)
        tt.fail('should have thrown')
      } catch (err) {
        tt.equal(err.code, 'EACCES')
      }
      tt.deepEqual(s._events, {}, 'event handlers are cleaned up')
      s.close()
      tt.end()
    })

    await t.test('unix socket - already exists', async (tt) => {
      const s = net.createServer()
      s.listen(__filename)
      try {
        await doListen(s)
        tt.fail('should have thrown')
      } catch (err) {
        tt.equal(err.code, 'EADDRINUSE')
      }
      tt.deepEqual(s._events, {}, 'event handlers are cleaned up')
      s.close()
      tt.end()
    })
  })

  await test('http.Server', async (t) => {
    await t.test('success', async (tt) => {
      const s = http.createServer()
      s.listen(0)
      try {
        await doListen(s)
      } catch (err) {
        tt.threw(err)
      }
      s.close()
      tt.end()
    })

    await t.test('invalid perms', async (tt) => {
      const s = http.createServer()
      s.listen(1)
      try {
        await doListen(s)
        tt.fail('should have thrown')
      } catch (err) {
        tt.equal(err.code, 'EACCES')
      }

      s.close()
      tt.end()
    })

    await t.test('unix socket - already exists', async (tt) => {
      const s = http.createServer()
      s.listen(__filename)
      try {
        await doListen(s)
        tt.fail('should have thrown')
      } catch (err) {
        tt.equal(err.code, 'EADDRINUSE')
      }
      s.close()
      tt.end()
    })

    t.end()
  })
}

main()
