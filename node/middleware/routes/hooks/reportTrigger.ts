/* eslint-disable @typescript-eslint/camelcase */
import { json } from 'co-body'
import axios from 'axios'

import { setDefaultHeaders } from '../../common/helpers'
import { MasterDataWrapper } from '../../../clients/clientWrappers/masterData'
import { saveFeed } from '../../feeds/collectFeed'
import { FEED_TYPES } from '../../../constants'
import {
  mapCustomerToReveal,
  mapOrderToReveal,
  parseContentToRevealProducts,
} from '../../feeds/reveal/mappings'

const filterDefinedUser = (item: any) => !!item.customer_eid

const getFileContent = async (
  linkToDownload: string,
  authToken: string
): Promise<any> =>
  axios.get(linkToDownload.replace('https', 'http'), {
    headers: {
      'Proxy-Authorization': authToken,
      'X-Vtex-Use-Https': true,
    },
  })

const parseFileContentByFeedType = (
  { feedType }: FeedInfo,
  fileContent: any
): RevealFeed | null => {
  let parsedContent = null
  switch (feedType) {
    case FEED_TYPES.RevealCustomers:
      parsedContent = ({
        customers: fileContent
          .filter(filterDefinedUser)
          .map(mapCustomerToReveal) as RevealCustomer[],
      } as unknown) as RevealCustomerFeed
      break
    case FEED_TYPES.RevealOrders:
      parsedContent = ({
        orders: fileContent.filter(filterDefinedUser).map(mapOrderToReveal),
      } as unknown) as RevealOrderFeed
      break
    case FEED_TYPES.RevealProducts:
      parsedContent = ({
        products: parseContentToRevealProducts(fileContent),
      } as unknown) as RevealProductFeed
      break
    default:
      break
  }

  return parsedContent
}

const reportTrigger = async (ctx: Context) => {
  const {
    clients: { masterdata },
    vtex,
  } = ctx
  const { logger, authToken } = vtex
  const mdWrapper = new MasterDataWrapper(masterdata)

  setDefaultHeaders(ctx)

  const body: ReportTriggerBody = await json(ctx.req)
  const { Id: reportId, LinkToDownload: linkToDownload } = body

  // get vtex report content
  const { data: fileContent } = await getFileContent(linkToDownload, authToken)

  // get id of feed
  const { idFeed } = await mdWrapper.getReportToFeed(reportId)
  // get info
  const feed: Feed = await mdWrapper.getExportById(idFeed)
  const feedInfo: FeedInfo = {
    id: String(feed.id),
    collectionId: String(feed.collectionId),
    size: fileContent.length,
    fileformat: feed.fileformat,
    feedType: feed.feedType,
    updateDay: feed.updateDay,
    updateHour: feed.updateHour,
  }

  // parse content
  const parsedContent = parseFileContentByFeedType(feedInfo, fileContent)

  ctx.response.status = 200
  if (parsedContent) {
    await saveFeed(ctx, feedInfo, parsedContent)
    // cleanup aux data
    await mdWrapper.deleteReportToFeed(reportId)
    ctx.response.body = 'OK'
  } else {
    logger.warn({ message: 'Feed type not supported', body })
    ctx.response.body = 'Feed type not supported'
  }
}

export default reportTrigger
