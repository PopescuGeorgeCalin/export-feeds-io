import { json } from 'co-body'

import { setDefaultHeaders } from '../../common/helpers'

const PRODUCT_UPDATE_EVENT = 'product.feed.update'

const productUpdate = async (ctx: Context) => {
  setDefaultHeaders(ctx)
  const {
    clients: { events },
  } = ctx

  const body = await json(ctx.req)

  await events.sendEvent('', PRODUCT_UPDATE_EVENT, body)

  ctx.response.status = 200
  ctx.response.body = {}
}

export default productUpdate
