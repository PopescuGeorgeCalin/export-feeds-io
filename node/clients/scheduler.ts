import { InstanceOptions, IOClient, IOContext } from '@vtex/api'
import moment from 'moment'

const APP_NAME = 'export-feeds-io'
const BASE_ID_PREFIX = 'scheduler-feeds'
class Scheduler extends IOClient {
  private BASE_URL: string
  private BASE_URL_SUFIX: string
  private BASE_UPDATE_URL: string

  public constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'cache-Control': 'no-cache',
        VtexIdclientAutCookie: ctx.authToken,
        // 'X-VTEX-Use-Https': 'true',
      },
    })
    const { account, workspace, host } = ctx
    this.BASE_URL = `https://${account}.vtexcommercestable.com.br/api/scheduler/${workspace}`
    this.BASE_URL_SUFIX = '?version=4'
    this.BASE_UPDATE_URL = `http://${host}/_v/feed/update`
  }

  // * * * * * => minute hour day month year
  private buildExpression = ({ updateHour, updateDay }: FeedInfo): string => {
    const parsedHour = updateHour ?? -1
    const parsedDay = updateDay ?? -1
    return `0 ${parsedHour >= 0 ? updateHour : '*'} ${
      parsedDay >= 0 ? updateDay : '*'
    } * *`
  }

  public create = async (feed: FeedInfo) => {
    const endDate = moment()
      .add(1, 'month')
      .format()

    const expression = this.buildExpression(feed)

    const body = {
      id: `scheduler-feeds-${feed.id}`,
      scheduler: {
        expression,
        endDate,
      },
      request: {
        uri: `${this.BASE_UPDATE_URL}`,
        method: 'POST',
        body: feed,
      },
    }
    return this.http.post(
      `${this.BASE_URL}/${APP_NAME}${this.BASE_URL_SUFIX}`,
      body
    )
  }

  public delete = async (id: string) => {
    return this.http.delete(
      `${this.BASE_URL}/${APP_NAME}/${BASE_ID_PREFIX}-${id}${this.BASE_URL_SUFIX}`
    )
  }
}

export default Scheduler
