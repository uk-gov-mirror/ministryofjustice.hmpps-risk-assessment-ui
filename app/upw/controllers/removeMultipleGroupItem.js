import saveAndContinue from '../../common/controllers/saveAndContinue'
import { getErrorMessage } from '../../common/controllers/saveAndContinue.utils'
import { postAnswers, getAnswers } from '../../../common/data/hmppsAssessmentApi'
import logger from '../../../common/logging/mdc-aware-logger'
import { CACHE } from '../../../common/utils/constants'

class removeItemSaveAndContinue extends saveAndContinue {
  async locals(req, res, next) {
    const itemToDelete = req.params.index
    const { multipleGroupName } = res.locals

    if (!itemToDelete || !multipleGroupName) {
      logger.error(
        `Invalid parameters to delete multiple group item - itemToDelete: ${itemToDelete}, multipleGroupName: ${multipleGroupName}, assessment: ${req.session?.assessment?.uuid}`,
      )
      throw new Error('Failed to delete multiple group item')
    }

    const { user } = req
    const response = await getAnswers(
      req.session.assessment?.uuid,
      req.session.assessment?.episodeUuid,
      req.user?.token,
    )
    const persistedAnswers = response.answers || {}

    const groupAnswers = persistedAnswers[multipleGroupName] || []
    groupAnswers.splice(parseInt(itemToDelete, 10), 1)

    // delete the appropriate entry
    const updatedAnswers = {
      ...persistedAnswers,
      [multipleGroupName]: groupAnswers,
    }

    try {
      const [ok, apiResponse] = await postAnswers(
        req.session?.assessment?.uuid,
        req.session?.assessment?.episodeUuid,
        { answers: { [multipleGroupName]: groupAnswers } },
        user?.token,
      )

      if (ok) {
        req.sessionModel.set(CACHE.PERSISTED_ANSWERS, updatedAnswers)
        return super.successHandler(req, res, next)
      }

      return res.render('app/error', { subHeading: getErrorMessage(apiResponse.reason) })
    } catch (error) {
      logger.error(
        `Could not delete item ${itemToDelete} from ${multipleGroupName} ${req.session?.assessment?.uuid}, current episode, error: ${error}`,
      )
      return res.render('app/error', { error })
    }
  }
}

export default removeItemSaveAndContinue
