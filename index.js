/*
Copyright (c) 2018 Avi Kapuya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict'

var Utils = require('./util');
var anymatch = require('anymatch');

function s3UnzipPlus(command, cb) {
  if (cb === undefined) { cb = function () { } }
  var vBucket, vFile, vTargetBucket, vTargetFolder, vFilter
  if (command.args && command.args.length >= 4) {
    vBucket = command.args[0]
    vFile = command.args[1]
    vTargetBucket = command.args[2]
    vTargetFolder = command.args[3]
  }
  if (command.bucket) {
    vBucket = command.bucket
  }
  if (command.file) {
    vFile = command.file
  }
  if (command.targetBucket) {
    vTargetBucket = command.targetBucket
  } else {
    vTargetBucket = command.bucket
  }
  if (command.targetFolder) {
    vTargetFolder = command.targetFolder
  } else {
    vTargetFolder = ''
  }

  if(command.filter){
    vFilter = anymatch(command.filter);
  }

  Utils.decompress({
    bucket: vBucket,
    file: vFile,
    targetBucket: vTargetBucket,
    targetFolder: vTargetFolder,
    deleteOnSuccess: command.deleteOnSuccess,
    copyMetadata: command.copyMetadata,
    s3options: command.s3options,
    filter: vFilter,
    verbose: command.verbose
  }, cb)
}

module.exports = s3UnzipPlus

module.exports.handler = function (event, context, callback) {
  if (callback === undefined) { callback = function () { } }
  Utils.decompress({
    bucket: event.Records[0].s3.bucket.name,
    file: event.Records[0].s3.object.key,
    deleteOnSuccess: true,
    verbose: true
  }, callback)
}
