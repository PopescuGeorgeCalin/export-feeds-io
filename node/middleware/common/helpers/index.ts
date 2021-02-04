import { IOContext, InstanceOptions } from '@vtex/api'

export const handleError = (ctx: Context, e: Error) => {
  const {
    vtex: { logger },
  } = ctx

  logger.error(e)

  ctx.response.status = 400
  ctx.response.body = e.message
}

export const setDefaultHeaders = (ctx: Context) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'GET')
  ctx.set('Access-Control-Allow-Headers', 'X-Requested-With, content-type')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.set('cache-Control', 'no-cache, no-store')
  ctx.set('X-VTEX-Use-Https', 'true')
  ctx.set('Content-Type', 'application/json')
}

export const withAuthToken = (options: InstanceOptions | undefined) => ({
  adminUserAuthToken,
  authToken,
}: IOContext) => {
  return {
    ...options?.headers,
    ...(adminUserAuthToken
      ? {
          Authorization: adminUserAuthToken,
          VtexIdclientAutCookie: adminUserAuthToken,
        }
      : { VtexIdclientAutCookie: authToken }),
    'Proxy-Authorization': authToken,
    'X-Vtex-Use-Https': 'true',
    cookie: `_ssid=${adminUserAuthToken}`,
  }
}
