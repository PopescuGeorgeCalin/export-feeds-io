import { VtexReport } from '../../../clients/vtexReport'

import revealOrderMap from './oms_report.json'
import revealCustomerMap from './customers_report.json'
import revealProductsMap from './products_report.json'

export class RevealReports {
  private vtexReport: VtexReport
  public constructor(vtexReport: VtexReport) {
    this.vtexReport = vtexReport
  }

  public ordersReport = async () => {
    const map = await this.vtexReport.createMap(revealOrderMap)
    try {
      const reportResult = await this.vtexReport.generateSolrReport(map.id)
      // delete the map
      await this.vtexReport.deleteMap(map.id)
      return {
        mapId: map.id,
        mapName: map.name,
        ...reportResult,
      }
    } catch (e) {
      console.log('Order report error ', e.message)

      throw e
    }
  }

  public customersReport = async () => {
    const map = await this.vtexReport.createMap(revealCustomerMap)

    const reportResult = await this.vtexReport.generateMasterDataReport(
      map.id,
      'CL',
      'mdv1'
    )

    // delete the map
    await this.vtexReport.deleteMap(map.id)

    return {
      mapId: map.id,
      mapName: map.name,
      ...reportResult,
    }
  }

  public productsReport = async () => {
    const map = await this.vtexReport.createMap(revealProductsMap)

    const reportResult = await this.vtexReport.generateMasterDataReport(
      map.id,
      'products',
      'mdv1'
    )

    // delete the map
    await this.vtexReport.deleteMap(map.id)

    return {
      mapId: map.id,
      mapName: map.name,
      ...reportResult,
    }
  }
}
