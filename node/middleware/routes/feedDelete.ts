import { setDefaultHeaders, handleError } from '../common/helpers'
import { MasterDataWrapper } from '../../clients/clientWrappers/masterData'
const feedDelete = async (ctx: Context) => {
  setDefaultHeaders(ctx)

  const {
    // vtex: { logger },
    clients: { masterdata, fileManager, scheduler },
  } = ctx

  const id = String(ctx.vtex.route.params.id)
  const mdWrapper = new MasterDataWrapper(masterdata)
  try {
    const feed: Feed = await mdWrapper.getExportById(id)
    Promise.all([
      mdWrapper.deleteExport(id),
      scheduler.delete(id),
      fileManager.deleteFile(feed.filename),
    ])

    ctx.response.body = 'Ok'
    ctx.response.status = 200
  } catch (error) {
    console.log(error)
    handleError(ctx, error)
  }
}

export default feedDelete
