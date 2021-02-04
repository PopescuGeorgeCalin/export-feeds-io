/* eslint-disable no-console */
import { v4 as uuidv4 } from 'uuid'

const PRODUCT_FEED_EVENT = 'product.feed'
const PRODUCT_CHECK_EVENT = 'product.feed.check'

// const sendEventBatch = (events: any, skuSlice: any[], jobId: string) => {
//   return Promise.all(skuSlice.map((skuId) =>
//     events.sendEvent('', PRODUCT_FEED_EVENT, {
//       skuId,
//       jobId
//     })
//   ))
// }

// const sliceEvents = (allSkus: any[], sliceSize: number) => {
//   const slices = []
//   for (let i = 0; i < allSkus.length; i += sliceSize) {
//     slices.push(allSkus.slice(i, i + sliceSize));
//   }

//   return slices;
// }

const asyncJob = async (ctx: Context) => {
  const {
    clients: { events, catalogSystem },
  } = ctx

  let allSkuIds = await catalogSystem.getAllSkuIds()

  console.log(allSkuIds.length)
  const jobId = uuidv4()

  console.log('JobId is ', jobId)

  allSkuIds = allSkuIds.slice(0, 50000)

  console.log('Sending to ', allSkuIds)

  if (allSkuIds.length > 0)
    // Notify the checker that the job starts now
    await events.sendEvent('', PRODUCT_CHECK_EVENT, {
      jobId,
      instances: allSkuIds.length,
      start: true,
    })

  // delay the sending to workers a bit so that the
  // start job is received first
  await new Promise<void>(resolve => {
    setTimeout(async () => {
      // const slicedEvents = sliceEvents(allSkuIds, 100);
      for (const skuId of allSkuIds) {
        events.sendEvent('', PRODUCT_FEED_EVENT, {
          skuId,
          jobId,
        })
      }
      resolve()
    }, 300)
  })
}

const startJob = async (ctx: Context, next: () => Promise<any>) => {
  asyncJob(ctx)

  ctx.response.status = 200
  ctx.response.body = 'Job started'

  next()
}

export default startJob
