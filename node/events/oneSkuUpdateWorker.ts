/* eslint-disable no-console */
import { getProduct } from './product/getProduct'
import { saveProduct } from './product/mdSaveProduct'

export async function oneSkuUpdateWorker(
  ctx: EventContext,
  next: () => Promise<any>
) {
  const {
    clients: { masterdata, graphqlServer },
    vtex: { logger },
    body,
  } = ctx

  const { ProductId } = body
  const prod = await getProduct(graphqlServer, ProductId)
  console.log({ step: 'In update sku worker ', body, prod })
  logger.info({ step: 'In update sku worker ', body, prod })
  if (prod) {
    // add the product to master data
    try {
      const response = await saveProduct(masterdata, prod)
      console.log({ response })
      logger.info({ response })
    } catch (e) {
      // TODO don't ignore if error is not 302
      console.error({ step: 'end update sku worker', error: e.response })
      logger.error({ step: 'end update sku worker', error: e.response })
    }
  }

  next()
}
