const AWS = require('aws-sdk')
const config = require('../../config')
const logger = require('../../logging/logger')

class SNS {
  constructor() {
    const options = {
      region: 'eu-west-2',
      credentials: {
        accessKeyId: config.aws.sns.accessKeyId,
        secretAccessKey: config.aws.sns.secretAccessKey,
      },
    }

    if (config.aws.useLocalStack) {
      options.endpoint = 'http://localhost:4566'
    }

    this.client = new AWS.SNS(options)
    this.topicArn = config.aws.sns.topicArn
  }

  async publishJson(message) {
    return this.client
      .publish({
        Message: JSON.stringify(message),
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: message.eventType,
          },
        },
        TopicArn: this.topicArn,
      })
      .promise()
      .then(() => {
        logger.info(`Publishing message to SNS topic: ${this.topicArn}`)
        return { ok: true }
      })
      .catch((error) => {
        logger.error(`Failed to publish to SNS topic: ${this.topicArn}`)
        return { ok: false, error }
      })
  }
}

module.exports = {
  SNS,
}
