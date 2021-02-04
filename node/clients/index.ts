import { IOClients } from '@vtex/api'
// import { masterDataFor } from '@vtex/clients'

// import { Search } from './http/search'
import { GraphQLServer } from './graphqlServer'
import FileManager from './fileManager'
import { VtexReport } from './vtexReport'
import { CatalogSystem } from './catalogSystem'
// import { Feeds, ReportToFeeds, Products} from 'vtex.export-feeds-io';
import Scheduler from './scheduler'

export class Clients extends IOClients {
  public get graphqlServer(): GraphQLServer {
    return this.getOrSet('graphqlServer', GraphQLServer)
  }

  public get fileManager() {
    return this.getOrSet('fileManager', FileManager)
  }

  public get vtexReport() {
    return this.getOrSet('vtexReport', VtexReport)
  }

  public get catalogSystem() {
    return this.getOrSet('catalogSystem', CatalogSystem)
  }

  public get scheduler() {
    return this.getOrSet('scheduler', Scheduler)
  }

  // public get feeds() {
  //   return this.getOrSet('feeds', masterDataFor<typeof Feeds>('feeds'))
  // }

  // public get reportToFeeds() {
  //   return this.getOrSet('reportToFeeds', masterDataFor<ReportToFeeds>('reportToFeeds'))
  // }

  // public get products() {
  //   return this.getOrSet('products', masterDataFor<Products>('products'))
  // }
}
