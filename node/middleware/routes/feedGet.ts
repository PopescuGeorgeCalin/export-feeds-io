import { setDefaultHeaders, handleError } from '../common/helpers'
import { MasterDataWrapper } from '../../clients/clientWrappers/masterData'

const feedGet = async (ctx: Context) => {
  setDefaultHeaders(ctx)

  const {
    clients: { masterdata },
  } = ctx

  const { id } = ctx.vtex.route.params

  try {
    const mdWrapper = new MasterDataWrapper(masterdata)
    const feed = await mdWrapper.getExportById(String(id))

    ctx.response.body = feed
    ctx.response.status = 200
  } catch (error) {
    handleError(ctx, error)
  }
}

export default feedGet
