import axios from 'axios'

const ALL_FIELDS = 'id,filename,feedType,date,download,size,collectionId'
const DATA_ENTITY = 'feed'
// const SCHEMA = 'feed'

const feed = axios.create({
  baseURL: `/_v/${DATA_ENTITY}`,
})

const masterData = axios.create({
  baseURL: `/api/dataentities/${DATA_ENTITY}`,
  params: {
    _schema: `feed`,
  },
})

export const getAll = () => {
  return masterData.get('/search?_fields=filename,feedType,date')
}

export const getServices = () => {
  return masterData.get(`/search?_fields=${ALL_FIELDS}&_sort=createdIn DESC`)
}

export const deleteService = (documentId: string) => {
  return feed.delete(`/delete/${documentId}`)
}

export const generateProfitShare = (collectionId: string) => {
  return feed.post(`/profitshare/${collectionId}`)
}

export const generate2Performant = (collectionId: string) => {
  return feed.post(`/performant/${collectionId}`)
}

export const generateRetargeting = (collectionId: string) => {
  return feed.post(`/retargeting/${collectionId}`)
}

export const generateFeed = data => {
  return feed.post(`/create`, data)
}

export default feed
