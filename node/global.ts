import {
  ServiceContext as ServiceCtx,
  EventContext as EventCtx,
  ParamsContext,
  RecorderState,
  IOContext,
  SegmentData,
} from '@vtex/api'

import { Clients } from './clients'

declare global {
  interface State extends RecorderState {
    collectionId?: string
  }

  type Context = ServiceCtx<Clients, State>
  interface CustomIOContext extends IOContext {
    segment?: SegmentData
  }

  type EventContext = EventCtx<Clients, State>
  type ServiceContext = ServiceCtx<Clients, State, ParamsContext>

  interface State extends RecorderState, BroadcasterEvent, IndexRoutesEvent {
    nextPayload: IndexRoutesEvent
  }

  interface BroadcasterEvent {
    HasStockKeepingUnitModified: boolean
    IdSku: string
    indexBucket?: string
  }

  interface IndexRoutesEvent {
    indexBucket?: string
    from: number
    processedProducts: number
    productsWithoutSKU: number
    attempt?: number
  }

  interface IdentifiedCategory extends Category {
    parents: Pick<Category, 'name' | 'id'>[]
  }

  interface WorkerHistory {
    skuId: number
    jobId: number
    result: any
    info: object
  }

  type ID = string
  type Float = number
  type Int = number
}
