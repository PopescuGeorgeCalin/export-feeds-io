import { json } from 'co-body'
import { setDefaultHeaders, handleError } from '../common/helpers'
import { MasterDataWrapper } from '../../clients/clientWrappers/masterData'
import { collectFeed } from '../feeds/collectFeed'
import { FEED_TYPES, FORMATS } from '../../constants'

const sanityCheck = (ctx: Context, body: any) => {
  const { feedType, fileformat } = body

  if (Object.values(FEED_TYPES).indexOf(feedType) === -1) {
    ctx.response.status = 404
    ctx.response.body = 'Feed not found'
    return false
  }

  if (!fileformat || Object.values(FORMATS).indexOf(fileformat) === -1) {
    ctx.response.status = 400
    ctx.response.body = 'Format must be specified'
    return false
  }

  // if (
  //   Object.values(COLLECTION_FEEDS).indexOf(feedType) != -1 &&
  //   !collectionId
  // ) {
  //   ctx.response.status = 400
  //   ctx.response.body = 'Collection Id must be specified'
  //   return false
  // }

  return true
}

const feedCreate = async (ctx: Context) => {
  setDefaultHeaders(ctx)
  const body = await json(ctx.req)

  if (!sanityCheck(ctx, body)) {
    return
  }

  const {
    clients: { masterdata },
  } = ctx

  try {
    const {
      feedType,
      fileformat,
      collectionId = null,
      updateHour = -1,
      updateDay = -1,
    } = body

    const pendingResult: Feed = {
      id: '',
      filename: 'pending',
      fileformat,
      size: 0,
      download: 'pending',
      feedType: feedType,
      date: new Date().toISOString(),
      updateHour,
      updateDay,
    }

    const mdWrapper = new MasterDataWrapper(masterdata)
    const result = await mdWrapper.saveExport(pendingResult)
    collectFeed(ctx, {
      id: result.DocumentId,
      collectionId,
      fileformat,
      feedType,
      updateHour,
      updateDay,
    })

    ctx.response.status = 200
    ctx.response.body = {
      ...pendingResult,
      ...result,
    }
  } catch (e) {
    handleError(ctx, e)
  }
}

export default feedCreate
