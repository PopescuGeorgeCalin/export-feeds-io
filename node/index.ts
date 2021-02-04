/* eslint-disable no-undef */
/* eslint-disable no-console */
import {
  LRUCache,
  Service,
  // RecorderState,
  ParamsContext,
  Cached,
  method,
} from '@vtex/api'

import { Clients } from './clients'
import feedList from './middleware/routes/feedList'
import feedDelete from './middleware/routes/feedDelete'
import feedCreate from './middleware/routes/feedCreate'
import feedUpdate from './middleware/routes/feedUpdate'
import feedGet from './middleware/routes/feedGet'

import productUpdate from './middleware/routes/hooks/productUpdate'
import reportTrigger from './middleware/routes/hooks/reportTrigger'
import startJob from './middleware/routes/startJob'
import feedServe from './middleware/routes/feedServe'
import initMasterdata from './middleware/routes/initMasterdata'

import { oneSkuGetWorker } from './events/oneSkuGetWorker'
import { oneSkuUpdateWorker } from './events/oneSkuUpdateWorker'
import { jobCheck } from './events/jobCheck'

const segmentCache = new LRUCache<string, any>({ max: 10000 })

metrics.trackCache('segment', segmentCache)

const TREE_SECONDS_MS = 3 * 1000
const CONCURRENCY = 10

const tenantCacheStorage = new LRUCache<string, Cached>({
  max: 3000,
})

const segmentCacheStorage = new LRUCache<string, Cached>({
  max: 3000,
})

metrics.trackCache('tenant', tenantCacheStorage)
metrics.trackCache('segment', segmentCacheStorage)

export default new Service<Clients, State, ParamsContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        exponentialTimeoutCoefficient: 2,
        exponentialBackoffCoefficient: 2,
        initialBackoffDelay: 50,
        retries: 1,
        timeout: TREE_SECONDS_MS,
        concurrency: CONCURRENCY,
      },
      tenant: {
        // memoryCache: tenantCacheStorage,
        timeout: TREE_SECONDS_MS,
      },
      segment: {
        // memoryCache: segmentCacheStorage,
        timeout: TREE_SECONDS_MS,
      },
      events: {
        timeout: TREE_SECONDS_MS,
      },
    },
  },
  events: {
    productFeed: [oneSkuGetWorker],
    productUpdate: [oneSkuUpdateWorker],
    jobCheck: [jobCheck],
  },
  routes: {
    feedCreate: method({
      POST: [feedCreate],
    }),
    feedUpdate: method({
      POST: [feedUpdate],
    }),
    feedDelete: method({
      DELETE: [feedDelete],
    }),
    feedList: method({
      GET: [feedList],
    }),
    feedGet: method({
      GET: [feedGet],
    }),
    feedServe: method({
      GET: [feedServe],
    }),
    reportTrigger: [reportTrigger],
    productUpdate: [productUpdate],
    startJob: method({
      POST: [startJob],
    }),
    initMasterdata: method({
      POST: [initMasterdata],
    }),

    // feedTypes: [defaultFeedTypes],
  },
})
