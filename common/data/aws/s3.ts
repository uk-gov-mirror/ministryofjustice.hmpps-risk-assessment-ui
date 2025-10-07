import { S3 as S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { aws } from '../../config'
import logger from '../../logging/logger'

export class S3 {
  constructor() {
    const options = {
      region: 'eu-west-2',
    }

    if (aws.useLocalStack) {
      options.forcePathStyle = true
    }

    this.client = new S3Client(options)
    this.bucketName = aws.s3.bucketName
  }

  async upload(key, file, type) {
    return this.client
      .send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file,
          ContentType: type,
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
