/* eslint-disable padding-line-between-statements */
import { useState, useEffect } from 'react'

import {
  getServices,
  deleteService,
  // generate2Performant,
  // generateProfitShare,
  // generateRetargeting,
  generateFeed,
} from './feedAPI'
import { Service, ServiceRequest } from '../typings/custom.d'

export const useFeeds = (): [Service[], any, any] => {
  const [feeds, setFeeds] = useState<Service[]>([])

  const getFeeds = async () => {
    const response = await getServices()

    setFeeds(response.data)
  }

  useEffect(() => {
    getFeeds()
  }, [])

  const deleteFeed = async (filename: string) => {
    const toDelete = feeds.find(feed => feed.filename === filename)

    if (!toDelete) {
      return
    }

    setFeeds(feeds.filter(val => val.filename !== filename))

    const resp = await deleteService(toDelete.id)

    console.log(resp)
  }

  const addFeed = async (newFeed: ServiceRequest) => {
    let result: any
    const pendingFeed: Service = {
      fileformat: newFeed.fileformat,
      collectionId: newFeed.collectionId,
      feedType: newFeed.feedType,
      date: 'pending',
      download: 'pending',
      filename: 'pending',
      size: 0,
      id: 'pending',
    }

    setFeeds([pendingFeed, ...feeds])

    switch (newFeed.feedType) {
      // case '2Performant':
      //   result = await generate2Performant(newFeed.collectionId)
      //   break

      // case 'ProfitShare':
      //   result = await generateProfitShare(newFeed.collectionId)
      //   break

      // case 'Retargeting':
      //   result = await generateRetargeting(newFeed.collectionId)
      //   break

      default:
        result = await generateFeed(newFeed)
    }

    const {
      DocumentId: id,
      filename,
      fileformat,
      feedType,
      download,
      date,
      size,
    } = result.data

    if (result?.data) {
      const feed: Service = {
        id,
        filename,
        fileformat,
        feedType,
        date,
        download,
        size,
        collectionId: newFeed.collectionId,
      }

      setFeeds([feed, ...feeds])
    }
  }

  return [feeds, deleteFeed, addFeed]
}
