import { MasterData } from '@vtex/api'

const ALL_FIELDS = 'id,filename,fileformat,feedType,collectionId,size,date,download'.split(
  ','
)

const ALL_FIELDS_REPORT = 'id,idFeed'.split(',')

export class MasterDataWrapper {
  private readonly dataEntity = 'feed'
  private readonly schemaName = 'feed'
  private readonly dataEntityReportToFeed = 'report_to_feed'
  private readonly schemaNameReportToFeed = 'report_to_feed'

  private masterdata: MasterData

  public constructor(masterdata: MasterData) {
    this.masterdata = masterdata
  }

  public saveExport = (data: Feed): Promise<any> => {
    return this.masterdata.createDocument({
      dataEntity: this.dataEntity,
      fields: data,
      schema: this.schemaName,
    })
  }

  public updateExport = (data: Feed, id: string): Promise<any> => {
    return this.masterdata.createOrUpdatePartialDocument({
      dataEntity: this.dataEntity,
      fields: data,
      id,
      schema: this.schemaName,
    })
  }

  public deleteExport = (id: string): Promise<any> => {
    return this.masterdata.deleteDocument({
      dataEntity: this.dataEntity,
      id,
    })
  }

  public getExportByFilename = (filename: string): Promise<any> => {
    return this.masterdata.searchDocuments({
      dataEntity: this.dataEntity,
      fields: ALL_FIELDS,
      pagination: {
        page: 0,
        pageSize: 50,
      },
      sort: 'createdIn DESC',
      schema: this.schemaName,
      where: `filename=${filename}`,
    })
  }

  public getExportById = (id: string): Promise<Feed> => {
    return this.masterdata.getDocument({
      dataEntity: this.dataEntity,
      id,
      fields: ALL_FIELDS,
    })
  }

  public getAllExports = async (): Promise<any> => {
    this.masterdata.searchDocuments({
      dataEntity: this.dataEntity,
      fields: ALL_FIELDS,
      pagination: {
        page: 0,
        pageSize: 50,
      },
      sort: 'createdIn DESC',
      schema: this.schemaName,
    })
  }

  public saveExportReport = (data: Feed): Promise<any> => {
    return this.masterdata.createDocument({
      dataEntity: this.dataEntityReportToFeed,
      fields: data,
      schema: this.schemaNameReportToFeed,
    })
  }

  public getReportToFeed = async (id: string): Promise<any> => {
    return this.masterdata.getDocument({
      dataEntity: this.dataEntityReportToFeed,
      id,
      fields: ALL_FIELDS_REPORT,
    })
  }

  public deleteReportToFeed = async (id: string): Promise<any> => {
    return this.masterdata.deleteDocument({
      dataEntity: this.dataEntityReportToFeed,
      id,
    })
  }
}

// SCHEMA feed
// const res = await saveSchemas('feed', 'feed', {
//   properties: {
//     filename: { type: 'string' },
//     collectionId: { type: 'string' },
//     size: { type: 'number' },
//     feedType: { type: 'string' },
//     date: { type: 'string' },
//     download: { type: 'string' },
//   },
//   'v-indexed': [
//     'filename',
//     'feedType',
//     'date',
//     'size',
//     'collectionId',
//     'download',
//   ],
//   'v-cache': false,
//   'v-security': {
//     allowGetAll: true,
//     publicRead: [
//       'filename',
//       'feedType',
//       'date',
//       'size',
//       'collectionId',
//       'download',
//     ],
//     publicWrite: [
//       'filename',
//       'feedType',
//       'date',
//       'size',
//       'collectionId',
//       'download',
//     ],
//     publicFilter: [
//       'filename',
//       'feedType',
//       'date',
//       'size',
//       'collectionId',
//       'download',
//     ],
//   },
// })
