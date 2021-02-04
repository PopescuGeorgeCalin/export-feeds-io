import { Readable } from 'stream'

import { IOContext, InstanceOptions, AppClient } from '@vtex/api'
import { pathEq, pick } from 'ramda'

const appId = process.env.VTEX_APP_ID
const [runningAppName] = appId ? appId.split('@') : ['']

const FORWARD_FIELDS = ['status', 'statusText', 'data', 'stack', 'stackTrace']

const routes = {
  Assets: () => `/assets/${runningAppName}`,
  FileUpload: (bucket: string, path: string) =>
    `${routes.Assets()}/save/${bucket}/${path}`,
  FileUrl: (bucket: string, path: string) =>
    `${routes.Assets()}/route/${bucket}/${path}`,
  FileDelete: (bucket: string, path: string) =>
    `${routes.Assets()}/delete/${bucket}/${path}`,
  File: (path: string, bucket: string) =>
    `${routes.Assets()}/${bucket}/${path}?`,
}

const toStream = (data: any): Readable => {
  const stream = new Readable()

  stream.push(data)
  stream.push(null)
  // stream.resume()

  return stream
}

class FileNotFound extends Error {
  public extensions: any
  public statusCode: number

  public constructor(
    extensions: any,
    message = 'File Not Found',
    statusCode = 404
  ) {
    super(message)
    this.extensions = extensions
    this.statusCode = statusCode
  }
}

export default class FileManager extends AppClient {
  private static readonly bucket = 'csvfeeds'

  public constructor(ioContext: IOContext, opts: InstanceOptions = {}) {
    super('vtex.file-manager@0.x', ioContext, opts)
  }

  public getFile = async (path: string) => {
    try {
      return await this.http.get(routes.File(path, FileManager.bucket))
    } catch (e) {
      if (e.statusCode === 404 || pathEq(['response', 'status'], 404, e)) {
        throw new FileNotFound(pick(FORWARD_FIELDS, e.response))
      } else {
        throw e
      }
    }
  }

  public getFileUrl = async (path: string) => {
    try {
      return await this.http.get(routes.FileUrl(FileManager.bucket, path))
    } catch (e) {
      if (e.statusCode === 404 || pathEq(['response', 'status'], 404, e)) {
        throw new FileNotFound(pick(FORWARD_FIELDS, e.response))
      } else {
        throw e
      }
    }
  }

  public saveFile = async (
    filename: string,
    filecontent: string
  ): Promise<any> => {
    const headers = {
      'Content-Type': 'application/octet-stream',
    }

    return this.http.put(
      routes.FileUpload(FileManager.bucket, filename),
      toStream(filecontent),
      { headers }
    )
  }

  public deleteFile = async (path: string) => {
    try {
      return await this.http.delete(routes.FileDelete(FileManager.bucket, path))
    } catch (e) {
      if (e.statusCode === 404 || pathEq(['response', 'status'], 404, e)) {
        throw new FileNotFound(pick(FORWARD_FIELDS, e.response))
      } else {
        throw e
      }
    }
  }
}
