#!/usr/bin/env node

'use strict';

const argv = require('minimist')(process.argv.slice(2));
const uploader = require('../index');
const usage = `
Usage
  upload-photos-s3 <photos_directory> --album="album name"

Required environment variables:
  - UPLOAD_PHOTOS_AWS_ACCESS_KEY
  - UPLOAD_PHOTOS_AWS_SECRET
  - UPLOAD_PHOTOS_S3_BUCKET
  - UPLOAD_PHOTOS_S3_PREFIX
`;

if (!argv._[0]) {
  console.error('No directory provided');
  console.log(usage);
  process.exit(1);
}

if (!argv.album) {
  console.error('No album provided');
  console.log(usage);
  process.exit(1);
}

const options = {
  albumName: argv.album,
  accessKeyId: process.env.UPLOAD_PHOTOS_AWS_ACCESS_KEY,
  secretAccessKey: process.env.UPLOAD_PHOTOS_AWS_SECRET,
  s3bucket: process.env.UPLOAD_PHOTOS_S3_BUCKET,
  s3prefix: process.env.UPLOAD_PHOTOS_S3_PREFIX,
  progress: true
};

uploader(argv._[0], options, function(err) {
  if (err) {
    console.error('No album provided');
    console.log(usage);
    process.exit(1);
  }
  console.log('\nDone!');
  process.exit(0);
});
