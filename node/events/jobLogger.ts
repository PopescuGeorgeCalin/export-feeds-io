/* eslint-disable lodash/import-scope */
import _ from 'lodash'

import { MasterData } from '@vtex/api'

const JOBS_DE = 'job'
const JOBS_SCHEMA = 'job'
const WORKER_HISTORY_DE = 'workerHistory'
const WORKER_HISTORY_SCHEMA = 'workerHistory'

const RESULT_OK = 'ok'
const RESULT_NULL = 'not found'

export default class JobLogger {
  private static instance: JobLogger
  private masterdata: MasterData
  private constructor(masterdata: MasterData) {
    this.masterdata = masterdata
  }

  public static getInstance(masterdata: MasterData): JobLogger {
    if (!JobLogger.instance) JobLogger.instance = new JobLogger(masterdata)

    return JobLogger.instance
  }

  private getJobMetadata(histories: any[]) {
    const endTimestamps = histories.sort((a, b) =>
      a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0
    )

    let okCount = 0
    let nullCount = 0
    let errorCount = 0
    const uniqHistories = _.uniqBy(histories, 'skuId')

    uniqHistories.forEach((his: any) => {
      if (his.result === RESULT_OK) okCount++
      else if (his.result === RESULT_NULL) nullCount++
      else errorCount++
    })

    return {
      endTimestamp: endTimestamps[0].timestamp,
      okCount,
      nullCount,
      errorCount,
      instancesCount: uniqHistories.length,
    }
  }

  public async getJob(jobId: number) {
    const jobs = await this.masterdata.searchDocuments({
      dataEntity: JOBS_DE,
      schema: JOBS_SCHEMA,
      where: `jobId = ${jobId}`,
      fields: ['instances', 'timestampStart'],
      pagination: {
        page: 1,
        pageSize: 2,
      },
    })

    if (!jobs || jobs.length == 0) throw new Error('Job not found ' + jobId)
    let job = jobs[0] as object

    // get worker history
    let histories: any[] = []
    let page = 1,
      pageSize = 1000,
      hasNext = true

    while (hasNext) {
      // console.log('Inainte de worker history')
      const batch = await this.masterdata.searchDocuments({
        dataEntity: WORKER_HISTORY_DE,
        schema: WORKER_HISTORY_SCHEMA,
        where: `jobId = ${jobId}`,
        fields: ['skuId', 'result', 'timestamp', 'info'],
        pagination: {
          page,
          pageSize,
        },
      })
      // console.log(page)
      // console.log(batch[0])
      // console.log('Dupa worker history')

      if (page > 1) hasNext = false

      histories = histories.concat(batch)
      if (batch.length < pageSize) hasNext = false
      else page += 1
    }

    const metadata = this.getJobMetadata(histories)

    return {
      jobId,
      ...job,
      ...metadata,
      // history: histories,
    }
  }

  public logJob({ jobId, skuId, result, info }: WorkerHistory) {
    if (!result) {
      result = RESULT_NULL
    }

    const strInfo = JSON.stringify(info)

    return this.masterdata.createDocument({
      dataEntity: WORKER_HISTORY_DE,
      schema: WORKER_HISTORY_SCHEMA,
      fields: {
        result,
        info: strInfo,
        skuId,
        jobId,
        timestamp: new Date().toISOString(),
      },
    })
  }

  public startJob(jobId: number, instances: number) {
    return this.masterdata.createOrUpdateEntireDocument({
      dataEntity: JOBS_DE,
      schema: JOBS_SCHEMA,
      fields: {
        jobId,
        instances,
        timestampStart: new Date().toISOString(),
      },
    })
  }
}

// // Schema jobs
// const jobSchema = {
//   properties: {
//     jobId: { type: 'string' },
//     instances: { type: 'number' },
//     timestampStart: { type: 'string' },
//     timestampEnd: { type: 'string' },
//   },
//   'v-indexed': ['jobId', 'instances', 'timestampStart', 'timestampEnd'],
//   'v-cache': false,
//   'v-security': {
//     allowGetAll: true,
//     publicRead: ['jobId', 'instances', 'timestampStart', 'timestampEnd'],
//     publicWrite: ['jobId', 'instances', 'timestampStart', 'timestampEnd'],
//     publicFilter: ['jobId', 'instances', 'timestampStart', 'timestampEnd'],
//   },
// }

// // Schema workerHistory

// const workerHistorySchema = {
//   properties: {
//     jobId: { type: 'string' },
//     skuId: { type: 'number' },
//     result: { type: 'string' },
//     timestamp: {type: 'string'}
//   },
//   'v-indexed': ['jobId', 'skuId', 'result', 'timestamp'],
//   'v-cache': false,
//   'v-security': {
//     allowGetAll: true,
//     publicRead: ['jobId', 'skuId', 'result', 'timestamp'],
//     publicWrite: ['jobId', 'skuId', 'result', 'timestamp'],
//     publicFilter: ['jobId', 'skuId', 'result', 'timestamp'],
//   },
// }
