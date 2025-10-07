import { SNS as SNSClient, PublishCommand } from '@aws-sdk/client-sns'
import config from '../../config'
import logger from '../../logging/logger'

export default class SNS {
  constructor() {
    const options = {
      region: 'eu-west-2',
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
