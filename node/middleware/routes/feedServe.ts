/* eslint-disable @typescript-eslint/camelcase */
import axios from 'axios'

import { setDefaultHeaders, handleError } from '../common/helpers'
import { MasterDataWrapper } from '../../clients/clientWrappers/masterData'

const feedServe = async (ctx: Context) => {
  setDefaultHeaders(ctx)

  const {
    clients: { masterdata },
    vtex,
  } = ctx

  const { id } = ctx.vtex.route.params

  try {
    const mdWrapper = new MasterDataWrapper(masterdata)
    const feed = await mdWrapper.getExportById(String(id))

    const { data: fileContent } = await axios.get(
      feed.download.replace('https', 'http'),
      {
        headers: {
          'Proxy-Authorization': vtex.authToken,
          'X-Vtex-Use-Https': true,
        },
      }
    )

    ctx.response.body = fileContent
    ctx.response.status = 200
  } catch (error) {
    handleError(ctx, error)
  }
}

export default feedServe
