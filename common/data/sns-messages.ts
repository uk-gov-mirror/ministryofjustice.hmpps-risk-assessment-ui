import { DateTime } from 'luxon'
import config from '../config'

export const upwComplete = (episodeUuid, crn, eventId) => ({
  eventType: 'unpaid-work.assessment.completed',
  version: '2',
  description: 'UPW Assessment Completed',
  occurredAt: DateTime.now().toJSON(),
  detailUrl: `${config.domain}/api/upw/download/${episodeUuid}`,
  additionalInformation: {
    episodeId: episodeUuid,
    eventId,
  },
  personReference: {
    identifiers: [
      {
        type: 'CRN',
        value: crn,
      },
    ],
  },
})
