const test = require('tape');
const MockAWS = require('@mapbox/mock-aws-sdk-js');
const path = require('path');
const exec = require('child_process').exec;
const uploader = require('../index');

// test('missing environment variables', assert => {
//   assert.end();
// });

test('success', assert => {
  MockAWS.stub('S3', 'putObject', (params, callback) => {
    const d = new Date();
    const date = `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
    assert.ok(params.Key.indexOf(`photos/${date}-parks_and_rec/`) > -1, 'has proper key');
    assert.equal(params.Bucket, 'test-bucket', 'expected bucket name');
    callback(null, {});
  });

  const options = {
    albumName: 'parks and rec!',
    accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
    s3bucket: 'test-bucket',
    s3prefix: 'photos'
  };

  uploader(path.resolve(__dirname + '/photos'), options, function(err) {
    assert.ifError(err, 'no error');
    MockAWS.S3.restore();
    assert.end();
  });
});

test('missing access key id', assert => {
  const options = {
    albumName: 'parks and rec!',
    // accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
    s3bucket: 'test-bucket',
    s3prefix: 'photos'
  };

  uploader(path.resolve(__dirname + '/photos'), options, function(err) {
    assert.ok(err);
    assert.equal(err.message, 'Missing options.accessKeyId', 'expected message');
    assert.end();
  });
});

test('missing secret key', assert => {
  const options = {
    albumName: 'parks and rec!',
    accessKeyId: 'test-key',
    // secretAccessKey: 'test-secret',
    s3bucket: 'test-bucket',
    s3prefix: 'photos'
  };

  uploader(path.resolve(__dirname + '/photos'), options, function(err) {
    assert.ok(err);
    assert.equal(err.message, 'Missing options.secretAccessKey', 'expected message');
    assert.end();
  });
});

test('missing s3bucket', assert => {
  const options = {
    albumName: 'parks and rec!',
    accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
    // s3bucket: 'test-bucket',
    s3prefix: 'photos'
  };

  uploader(path.resolve(__dirname + '/photos'), options, function(err) {
    assert.ok(err);
    assert.equal(err.message, 'Missing options.s3Bucket', 'expected message');
    assert.end();
  });
});

test('missing s3prefix', assert => {
  const options = {
    albumName: 'parks and rec!',
    accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
    s3bucket: 'test-bucket',
    // s3prefix: 'photos'
  };

  uploader(path.resolve(__dirname + '/photos'), options, function(err) {
    assert.ok(err);
    assert.equal(err.message, 'Missing options.s3prefix', 'expected message');
    assert.end();
  });
});

test('missing albumName', assert => {
  const options = {
    // albumName: 'parks and rec!',
    accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
    s3bucket: 'test-bucket',
    s3prefix: 'photos'
  };

  uploader(path.resolve(__dirname + '/photos'), options, function(err) {
    assert.ok(err);
    assert.equal(err.message, 'Missing options.albumName', 'expected message');
    assert.end();
  });
});

test('invalid directory name type', assert => {
  const options = {
    albumName: 'parks and rec!',
    accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
    s3bucket: 'test-bucket',
    s3prefix: 'photos'
  };

  uploader({}, options, function(err) {
    assert.ok(err);
    assert.equal(err.message, 'Directory name must be a string', 'expected message');
    assert.end();
  });
});

test('missing callback', assert => {
  try {
    uploader(path.resolve(__dirname + '/photos'), {});
    assert.fail();
  } catch (err) {
    assert.ok(err);
    assert.equal(err.message, 'No callback function provided', 'expected message');
    assert.end();
  }
});

test('cant find directory', assert => {
  const options = {
    albumName: 'parks and rec!',
    accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
    s3bucket: 'test-bucket',
    s3prefix: 'photos'
  };

  uploader('/does/not/exist', options, function(err) {
    assert.ok(err);
    assert.equal(err.message, 'ENOENT: no such file or directory, scandir \'/does/not/exist\'', 'expected message');
    assert.end();
  });
});

test('handles s3 error', assert => {
  MockAWS.stub('S3', 'putObject', (params, callback) => {
    callback(new Error('Something went wrong with s3'));
  });

  const options = {
    albumName: 'parks and rec!',
    accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
    s3bucket: 'test-bucket',
    s3prefix: 'photos'
  };

  uploader(path.resolve(__dirname + '/photos'), options, function(err) {
    assert.ok(err);
    assert.equal(err.message, 'Something went wrong with s3', 'expected message');
    MockAWS.S3.restore();
    assert.end();
  });
});

test('shows progress', assert => {
  MockAWS.stub('S3', 'putObject', (params, callback) => {
    callback(null);
  });

  const options = {
    albumName: 'parks and rec!',
    accessKeyId: 'test-key',
    secretAccessKey: 'test-secret',
    s3bucket: 'test-bucket',
    s3prefix: 'photos'
  };

  uploader(path.resolve(__dirname + '/photos'), options, function(err) {
    MockAWS.S3.restore();
    assert.end();
  });
});
