# upload-photos-s3

[![Build Status](https://travis-ci.org/mapsam/upload-photos-s3.svg?branch=master)](https://travis-ci.org/mapsam/upload-photos-s3)

CLI utility for uploading photos from your desktop to an S3 bucket. You can specify the bucket, prefix, and an album name. All file names will be used directly.

### Usage

```
upload-photos-s3 /Volumes/sandiskcamera/photos/ --album "my vacation in thailand"
```

All album names will be prefixed with a date and will not include special characters or spaces (replaced with underscores). The example above will look like:

```
11-19-2017-my_vacation_in_thailand/photo1.jpeg
11-19-2017-my_vacation_in_thailand/photo2.jpeg
11-19-2017-my_vacation_in_thailand/photo3.jpeg
```

### Setup

Clone this repository and set up the following environment variables in your bash_profile:

```shell
export UPLOAD_PHOTOS_AWS_ACCESS_KEY="1234"
export UPLOAD_PHOTOS_AWS_SECRET="abcd"
export UPLOAD_PHOTOS_S3_BUCKET="example-bucket"
export UPLOAD_PHOTOS_S3_PREFIX="custom/photos/path"
```

Install dependencies and link the bin command so you can use it elsewhere:

```shell
npm install
npm link
```
