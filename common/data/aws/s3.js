const AWS = require('aws-sdk')
const config = require('../../config')
const logger = require('../../logging/logger')

class S3 {
  constructor() {
    const options = {
      region: 'eu-west-2',
      credentials: {
        accessKeyId: config.aws.s3.accessKeyId,
        secretAccessKey: config.aws.s3.secretAccessKey,
      },
    }

    if (config.aws.useLocalStack) {
      options.endpoint = 'http://localhost:4566'
      options.s3ForcePathStyle = true
    }

    this.client = new AWS.S3(options)
    this.bucketName = config.aws.s3.bucketName
  }

  async upload(key, file) {
    return this.client
      .upload({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
      })
      .promise()
      .then(() => {
        logger.info(`Uploaded file to S3: ${key}`)
        return { ok: true, key }
      })
      .catch((error) => {
        logger.error(`Failed to upload file to S3: ${error.message}`)
        return { ok: false }
      })
  }

  async fetch(key) {
    return this.client
      .getObject({
        Bucket: this.bucketName,
        Key: key,
      })
      .promise()
      .then(({ Body: body }) => {
        logger.info(`Fetched file from S3: ${key}`)
        return { ok: true, body }
      })
      .catch((error) => {
        logger.error(`Failed to fetch file from S3: ${error.message}`)
        return { ok: false, error }
      })
  }
}

module.exports = {
  S3,
}
