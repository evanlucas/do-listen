'use strict'

const tap = require('tap')
const doListen = require('../')
const major = process.version.split('.')[0].slice(1)
if (+major < 8) return tap.pass('skip on node 7 and below')

require('./async-await')
