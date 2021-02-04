import { InstanceOptions, IOClient, IOContext } from '@vtex/api'

export interface ReportField {
  header: string
  query: string
  usePath: boolean
  translationPrefix: string
  defaultLanguage: string
}

export interface ReportMap {
  id: string
  isGlobal: boolean
  path: string
  name: string
  columns: ReportField[]
}

export interface Report {
  canceled: boolean
  completedDate: string
  email: string
  enqueueDate: string
  finished: boolean
  id: string
  lastUpdateTime: string
  linkToDownload: string
  outputType: string
  recordsProcessed: number
  percentageProcessed: number
  recordsSum: number
  startDate: string
  zipped: boolean
  deliveryConfig: any
}

export class VtexReport extends IOClient {
  private REPORT_BASE_URL = `http://${this.ctx.account}.myvtex.com/api/report`

  private DELIVERY_URL = `https://${this.ctx.workspace}--${this.ctx.account}.myvtex.com/_v/feed/reportTrigger`

  public constructor(private ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'cache-Control': 'no-cache',
        'REST-Rangeresources': '0-100',
        VtexIdclientAutCookie: ctx.authToken,
        'X-VTEX-Use-Https': 'true',
      },
    })
  }

  public createMap(map: any): Promise<ReportMap> {
    return this.http.post(`${this.REPORT_BASE_URL}/map`, map)
  }

  public async deleteMap(mapId: string) {
    return this.http.delete(`${this.REPORT_BASE_URL}/map/${mapId}`)
  }

  public async generateSolrReport(mapId: string): Promise<Report> {
    return this.http.post(`${this.REPORT_BASE_URL}/solr`, {
      mapId: mapId,
      outputType: 'JSON', // Avalible types: CSV, XLSX, JSON
      zipped: false, // use the gzip compression, if multiple maps especified this attributes is automatic set
      where: '', // solr query
      deliveryConfig: {
        type: 'Endpoint',
        endpoint: this.DELIVERY_URL, // simple endpoint
      },
    })
  }

  public async generateMasterDataReport(
    mapId: string,
    entityname: string,
    schema: string
  ): Promise<Report> {
    return this.http.post(`${this.REPORT_BASE_URL}/masterdata`, {
      mapId,
      outputType: 'JSON', // Avalible types: CSV, XLSX, JSON
      zipped: false, // use the gzip compression, if multiple maps especified this attributes is automatic set
      where: '', // masterdata query
      entityname,
      schema,
      queryAllStores: 'true', // Query cross stores in the account
      deliveryConfig: {
        type: 'Endpoint',
        endpoint: this.DELIVERY_URL,
        testData: 'Hello World',
      },
    })
  }

  public async getReport(reportId: string): Promise<Report> {
    return this.http.get(`/${reportId}`)
  }
}
