const { S3: S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const config = require('../../config')
const logger = require('../../logging/logger')

class S3 {
  constructor() {
    const options = {
      region: 'eu-west-2',
    }

    if (config.aws.useLocalStack) {
      options.forcePathStyle = true
    }

    this.client = new S3Client(options)
    this.bucketName = config.aws.s3.bucketName
  }

  async upload(key, file) {
    return this.client
      .send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file,
        }),
      )
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
      .send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      )
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
