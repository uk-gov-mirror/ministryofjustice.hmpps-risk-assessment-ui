const { SNS: SNSClient, PublishCommand } = require('@aws-sdk/client-sns')
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

    this.client = new SNSClient(options)
    this.topicArn = config.aws.sns.topicArn
  }

  async publishJson(message) {
    return this.client
      .send(
        new PublishCommand({
          Message: JSON.stringify(message),
          MessageAttributes: {
            eventType: {
              DataType: 'String',
              StringValue: message.eventType,
            },
          },
          TopicArn: this.topicArn,
        }),
      )
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
