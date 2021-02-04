/* eslint-disable no-console */
import { setDefaultHeaders, handleError } from '../common/helpers'
import { MasterDataWrapper } from '../../clients/clientWrappers/masterData'

const feedList = async (ctx: Context) => {
  setDefaultHeaders(ctx)
  const {
    clients: { masterdata },
  } = ctx

  try {
    const mdWrapper = new MasterDataWrapper(masterdata)
    const exported = await mdWrapper.getAllExports()

    console.log('Exported result is ', exported)

    ctx.response.body = exported.map((item: any) => ({
      ...item,
      extension: '.csv',
    }))
    ctx.response.status = 200
  } catch (error) {
    console.log(error)
    handleError(ctx, error)
  }
}

export default feedList
