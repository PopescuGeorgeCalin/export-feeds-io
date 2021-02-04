export interface Service {
  id: string
  filename: string
  fileformat: string
  feedType: string
  date: string
  download: string
  size: number
  collectionId: string
  updateHour?: Maybe<number>
  updateDay?: Maybe<number>
}

export interface ServiceRequest {
  fileformat: string
  collectionId: string
  feedType: string
  updateHour?: Maybe<number>
  updateDay?: Maybe<number>
}
