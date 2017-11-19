'use strict';

const AWS = require('aws-sdk');
const queue = require('d3-queue').queue;
const fs = require('fs');
const readline = require('readline');

module.exports = function(dir, options, callback) {
  if (!callback || typeof callback !== 'function') throw new Error('No callback function provided');
  if (typeof dir !== 'string') return callback(new Error('Directory name must be a string'));
  if (!options.accessKeyId) return callback(new Error('Missing options.accessKeyId'));
  if (!options.secretAccessKey) return callback(new Error('Missing options.secretAccessKey'));
  if (!options.s3bucket) return callback(new Error('Missing options.s3Bucket'));
  if (!options.s3prefix) return callback(new Error('Missing options.s3prefix'));
  if (!options.albumName) return callback(new Error('Missing options.albumName'));

  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    return callback(err);
  }

  AWS.config.accessKeyId = options.accessKeyId;
  AWS.config.secretAccessKey = options.secretAccessKey;
  const s3 = new AWS.S3();
  const album = niceName(options.albumName);
  const date = new Date();
  const dateKey = `${date.getUTCMonth()+1}-${date.getUTCDate()}-${date.getUTCFullYear()}`;
  let count = 0;

  const q = queue(10);
  files.forEach(function(f, i) {
    q.defer(sendImage, f);
  });

  q.awaitAll(function(err) {
    if (err) return callback(err);
    return callback();
  });

  function sendImage(file, cb) {
    let key = `${options.s3prefix}/${dateKey}-${album}/${file}`;

    let params = {
      Bucket: options.s3bucket,
      Key: key,
      Body: fs.readFileSync(dir + '/' + file),
      ContentType: 'image/jpeg'
    };

    s3.putObject(params, function(err, data) {
      if (err) return cb(err);
      count++;
      if (options.progress) {
        readline.clearLine(process.stdout, 0)
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${Math.round(((count/files.length)*100)*100)/100}%`);
      }
      return cb();
    });
  }
};

function niceName(string) {
  string = string.replace(/[^\w\s ]/gi, ''); // special characters
  string = string.replace(/ /g,'_'); // spaces
  return string;
}




function error(message) {
  console.error('ERROR:', message);
  console.log(usage);
  process.exit(1);
}
