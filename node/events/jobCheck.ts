import JobLogger from './jobLogger'

// Keep count of the running jobs and their execution
export async function jobCheck(ctx: EventContext, next: () => Promise<any>) {
  const {
    clients: { masterdata },
  } = ctx

  const jobLogger = JobLogger.getInstance(masterdata)

  if (ctx.body && ctx.body.start) {
    // A job start event was received - workers start
    // console.log('JOB Started ', ctx.body)
    const { jobId, instances } = ctx.body
    await jobLogger.startJob(jobId, instances)
  } else {
    // A worker's job has ended
    // const { skuId } = ctx.body
    // console.log('Worker END ', skuId)
    await jobLogger.logJob(ctx.body)
  }

  next()
}
