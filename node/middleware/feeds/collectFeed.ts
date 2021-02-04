// eslint-disable-next-line lodash/import-scope
import _ from 'lodash'
import { parse as parseJson2csv } from 'json2csv'

import { categoryFeed } from './reveal/mappings/'
import { MasterDataWrapper } from '../../clients/clientWrappers/masterData'
import { RevealReports } from './reveal/revealReports'
import { getProducts } from '../common/queries/productQuery'
import { mappingFunctions as mappingsReveal } from './reveal/productMappings'
import { mappingFunctions as mappingsRetargeting } from './retargeting/productMappings'
import { mappingFunctions as mappings2Performant } from './performant/productMappings'
import { mappingFunctions as mappingsProfitshare } from './profitshare/productMappings'
import { FEED_TYPES, FORMATS } from '../../constants'

const getSizeByFeedType = (feed: FeedInfo, collectResult: any) => {
  switch (feed.feedType) {
    case FEED_TYPES.RevealCategories:
      return collectResult.categories?.length
    case FEED_TYPES.RevealOrders:
      return collectResult.orders?.length
    case FEED_TYPES.RevealCustomers:
      return collectResult.customers?.length
    case FEED_TYPES.RevealProducts:
      return collectResult.products?.length
    default:
      return collectResult.length
  }
}

export const saveFeed = async (
  ctx: Context,
  feed: FeedInfo,
  collectResult: any
) => {
  const {
    clients: { masterdata, fileManager },
  } = ctx

  const filename = `${feed.feedType}-${feed.collectionId ?? ''}.${
    feed.fileformat
  }`

  // const parsedResult = parseResult(feed, collectResult)

  const parsedResult =
    feed.fileformat === FORMATS.JSON
      ? JSON.stringify(collectResult)
      : parseJson2csv(collectResult)

  if (!parsedResult) return

  // save to file manager
  const publicDownload = await fileManager.saveFile(filename, parsedResult)

  const size = getSizeByFeedType(feed, collectResult)

  const finalResult: Feed = {
    id: feed.id,
    filename,
    feedType: feed.feedType,
    date: new Date().toISOString(),
    size: size,
    download: publicDownload,
    updateHour: feed.updateHour,
    updateDay: feed.updateDay,
  }

  if (feed.collectionId) finalResult.collectionId = feed.collectionId

  const mdWrapper = new MasterDataWrapper(masterdata)
  await mdWrapper.updateExport(finalResult, feed.id)

  return {
    ...finalResult,
    id: feed.id,
  }
}

export const saveReport = async (
  ctx: Context,
  feed: FeedInfo,
  reportInfo: any
) => {
  const {
    clients: { masterdata },
  } = ctx

  const finalResult: any = {
    feedType: feed.feedType,
    date: new Date().toISOString(),
    fileformat: feed.fileformat,
    filename: 'pending',
    size: 0,
    download: 'pending',
  }

  const finalResultReportToFeed: any = {
    id: reportInfo.id,
    idFeed: feed.id,
  }

  if (feed.collectionId) finalResult.collectionId = feed.collectionId

  const mdWrapper = new MasterDataWrapper(masterdata)

  const pUpdateFeed = mdWrapper.updateExport(finalResult, feed.id)
  const pSaveReport = mdWrapper.saveExportReport(finalResultReportToFeed)

  await Promise.all([pUpdateFeed, pSaveReport])

  return {
    ...finalResult,
    id: feed.id,
  }
}

export const applyMapping = (products: any, mapping: any) => {
  return products.map((product: any) =>
    _.reduce(
      mapping,
      (acc, currentMap: any) => {
        const mappedField: string | number = currentMap.mapping(product)
        let formatedField: any
        if (currentMap.type == 'number')
          formatedField = currentMap.formatting(mappedField as number)
        else formatedField = currentMap.formatting(mappedField as string)
        return {
          ...acc,
          [currentMap.name]: formatedField,
        }
      },
      {}
    )
  )
}

export const collectFeed = async (
  ctx: Context,
  feed: FeedInfo,
  isScheduler = false
) => {
  const {
    clients: { vtexReport, catalogSystem, graphqlServer, scheduler },
  } = ctx

  let collectResult: any
  let report = false

  switch (feed.feedType) {
    case FEED_TYPES.RevealCategories: {
      collectResult = await categoryFeed(catalogSystem)
      // feed.fileformat = FORMATS.JSON
      break
    }

    case FEED_TYPES.RevealCustomers: {
      // start the report job
      const revealReports = new RevealReports(vtexReport)
      collectResult = await revealReports.customersReport()
      report = true
      // feed.fileformat = FORMATS.JSON

      break
    }

    case FEED_TYPES.RevealOrders: {
      const revealReports = new RevealReports(vtexReport)
      collectResult = await revealReports.ordersReport()
      report = true
      // feed.fileformat = FORMATS.JSON

      break
    }

    case FEED_TYPES.RevealProducts: {
      const revealReports = new RevealReports(vtexReport)
      collectResult = await revealReports.productsReport()
      report = true
      // feed.fileformat = FORMATS.JSON

      break
    }

    case FEED_TYPES.RevealProductsLimit: {
      let products = await getProducts(graphqlServer, feed.collectionId)
      collectResult = applyMapping(products, mappingsReveal)
      // feed.fileformat = FORMATS.JSON

      break
    }

    case FEED_TYPES.RetargetingProduct: {
      report = true
      feed.fileformat = FORMATS.CSV

      break
    }

    case FEED_TYPES.RetargetingProductLimit: {
      let products = await getProducts(graphqlServer, feed.collectionId)
      collectResult = applyMapping(products, mappingsRetargeting)
      feed.fileformat = FORMATS.CSV

      break
    }

    case FEED_TYPES.ProfitShareProduct: {
      feed.fileformat = FORMATS.CSV

      report = true
      break
    }

    case FEED_TYPES.ProfitShareProductLimit: {
      let products = await getProducts(graphqlServer, feed.collectionId)
      collectResult = applyMapping(products, mappingsProfitshare)
      feed.fileformat = FORMATS.CSV

      break
    }

    case FEED_TYPES.PerformantProduct: {
      report = true
      feed.fileformat = FORMATS.CSV
      break
    }

    case FEED_TYPES.PerformantProductLimit: {
      let products = await getProducts(graphqlServer, feed.collectionId)
      collectResult = applyMapping(products, mappings2Performant)
      feed.fileformat = FORMATS.CSV

      break
    }

    default:
      collectResult = null
      break
  }

  if (!collectResult) {
    throw new Error('Feed not implemented')
  }

  // console.log('Collect Result is ')
  // console.log(collectResult)

  if (!report) {
    // not using vtex.report - data available right away

    feed.size = collectResult.length

    const resp = await saveFeed(ctx, feed, collectResult)
    console.log('Save feed response', resp)
  } else {
    // using vtex.report save reference to report id
    const resp = await saveReport(ctx, feed, collectResult)
    console.log('Save report response', resp)
  }

  // if not called by scheduler, create one
  if (!isScheduler) scheduler.create(feed)
}
