import { setDefaultHeaders } from '../common/helpers'

const initMasterdata = async (ctx: Context) => {
  setDefaultHeaders(ctx)
}

export default initMasterdata
