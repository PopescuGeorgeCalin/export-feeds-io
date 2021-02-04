import { InstanceOptions, IOClient, IOContext } from '@vtex/api'

export class CatalogSystem extends IOClient {
  private CATALOG_BASE_URL = `https://${this.ctx.account}.vtexcommercestable.com.br/api/catalog_system`
  public constructor(private ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'cache-Control': 'no-cache',
        'REST-Rangeresources': '0-100',
        VtexIdclientAutCookie: ctx.authToken,
        // 'X-VTEX-Use-Https': 'true',
      },
    })
  }

  public getSkuIds(page: number, pageSize: number) {
    return this.http.get(
      `${this.CATALOG_BASE_URL}/pvt/sku/stockkeepingunitids?page=${page}&pagesize=${pageSize}`
    )
  }

  public async getAllSkuIds() {
    const MAX_PAGE_SIZE = 1000
    let hasNextPage = true
    let page = 1
    let allSkuIds: any[] = []

    while (hasNextPage) {
      try {
        const skuIds = await this.getSkuIds(page, MAX_PAGE_SIZE)
        console.log('Page:', page)

        allSkuIds = allSkuIds.concat(skuIds)

        if (skuIds.length !== MAX_PAGE_SIZE) {
          hasNextPage = false
        } else {
          page += 1
        }
      } catch (e) {
        hasNextPage = false
        console.log('Error ', e)
      }
    }

    return allSkuIds
  }

  public getAllCategories() {
    // A Very Big Value in order to return all the levels
    const categoryLevels = 1000

    return this.http.get(
      `${this.CATALOG_BASE_URL}/pub/category/tree/${categoryLevels}`
    )
  }

  private getSkuById(skuId: number) {
    return this.http.get(
      `${this.CATALOG_BASE_URL}/stockkeepingunitbyid/${skuId}`
    )
  }

  public async getProductId(skuId: number) {
    let skuResponse

    skuResponse = await this.getSkuById(skuId)
    if (!skuResponse) {
      throw new Error(`Error retriving sku ${skuId}`)
    }

    return skuResponse.ProductId
  }
}
