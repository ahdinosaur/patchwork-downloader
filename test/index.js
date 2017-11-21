const test = require('tape')

const patchworkDownloader = require('../')

test('patchwork-downloader', function (t) {
  t.ok(patchworkDownloader, 'module is require-able')
  t.end()
})
