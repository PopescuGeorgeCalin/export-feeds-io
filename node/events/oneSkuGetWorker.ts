/* eslint-disable no-console */
import { getProduct } from './product/getProduct'
import { saveProduct } from './product/mdSaveProduct'
import cluster from 'cluster'

// const CHECK_EVENT = 'product.feed.check'

export async function oneSkuGetWorker(
  ctx: EventContext,
  next: () => Promise<any>
) {
  const {
    clients: { /*events,*/ catalogSystem, graphqlServer, masterdata },
  } = ctx

  const { skuId, jobId } = ctx.body

  console.log('Worker Started ', skuId)

  if (!skuId || !jobId) {
    return next()
  }

  let checkEventPayload: any = {
    jobId,
    skuId,
  }

  try {
    const start = process.hrtime()
    const productId = await catalogSystem.getProductId(ctx.body.skuId)

    const prod = await getProduct(graphqlServer, productId)

    checkEventPayload.result = prod === null ? prod : 'ok'
    checkEventPayload.info = {
      productId,
      prod,
    }

    if (prod) {
      // add the product to master data
      await saveProduct(masterdata, prod)
    }

    // events.sendEvent('', CHECK_EVENT, checkEventPayload)
    const end = process.hrtime(start)
    console.log(
      'SKU ' +
        skuId +
        ' time ' +
        end[0] +
        ' s ' +
        end[1] / 1000000 +
        ' ms ' +
        (cluster.isMaster ? 'master' : cluster.worker.id)
    )

    next()
  } catch (e) {
    // console.log('Error', e.response.status)
    // If we get a not modified error we're ok
    if (e.response && e.response.status === 304) {
      // events.sendEvent('', CHECK_EVENT, checkEventPayload)
      next()
    } else {
      // Send the error report and retry by not calling next()
      // events.sendEvent('', CHECK_EVENT, {
      //   jobId,
      //   skuId,
      //   result: e.message,
      //   info: {
      //     error: e,
      //   },
      // })
    }
  }
}
