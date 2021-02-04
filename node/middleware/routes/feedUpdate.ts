/* eslint-disable no-console */
/* eslint-disable lodash/import-scope */
import { json } from 'co-body'
import _ from 'lodash'

import { MasterDataWrapper } from '../../clients/clientWrappers'
import { setDefaultHeaders, handleError } from '../common/helpers'
import { FEED_TYPES, FORMATS } from '../../constants'
import { collectFeed } from '../feeds/collectFeed'
import { getFilenameFromLink } from '../../utils'

const IS_SCHEDULER = true

const sanityCheck = (ctx: Context, body: Feed) => {
  const { id, feedType, fileformat } = body

  if (!id) {
    ctx.response.status = 404
    ctx.response.body = 'Feed ID not provided'
    return false
  }

  if (_.values(FEED_TYPES).indexOf(feedType) === -1) {
    ctx.response.status = 404
    ctx.response.body = 'Feed not found'
    return false
  }

  if (!fileformat || Object.values(FORMATS).indexOf(fileformat) === -1) {
    ctx.response.status = 400
    ctx.response.body = 'Format must be specified'
    return false
  }

  return true
}

const feedCreate = async (ctx: Context) => {
  setDefaultHeaders(ctx)
  const {
    clients: { masterdata, fileManager },
  } = ctx

  const body = (await json(ctx.req)) as Feed
  if (!sanityCheck(ctx, body)) {
    return
  }
  const mdWrapper = new MasterDataWrapper(masterdata)

  const {
    id,
    fileformat,
    feedType,
    collectionId = null,
    updateHour = -1,
    updateDay = -1,
  } = body

  try {
    // get feed info before update
    const feed: Feed = await mdWrapper.getExportById(id)
    collectFeed(
      ctx,
      {
        id,
        collectionId,
        fileformat,
        feedType,
        updateHour,
        updateDay,
      },
      IS_SCHEDULER
    )
    // delete ex file
    fileManager.deleteFile(getFilenameFromLink(feed.download))
  } catch (e) {
    console.log(e)
    handleError(ctx, e)
  }

  ctx.response.status = 200
  ctx.response.body = 'OK'
}

export default feedCreate
