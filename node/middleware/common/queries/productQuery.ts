import { GraphQLServer } from '../../../clients/graphqlServer'
import { SEARCH_QUERY } from './query'

const PAGE_SIZE = 50
const ITEMS_LIMIT = 2500

/**
 * Get Products by page range. VTEX limits to 50 items per request.
 * @param orderBy
 */
export const getProducts = async (
  graphqlServer: GraphQLServer,
  collection: Maybe<string>,
  orderBy = 'OrderByNameASC'
): Promise<Product[]> => {
  const from = 0
  let to = from + PAGE_SIZE - 1

  if (ITEMS_LIMIT < to) to = ITEMS_LIMIT - 1

  const firstSearch = (await graphqlServer.query(
    SEARCH_QUERY,
    { to, from, collection, orderBy },
    {
      persistedQuery: {
        provider: 'vtex.search-graphql@0.x',
        sender: 'vtex.export-feeds-io@0.x',
      },
    }
  )) as SearchResponse

  const {
    productSearch: { products, recordsFiltered },
  } = firstSearch.data

  const totalItems = Math.min(recordsFiltered, ITEMS_LIMIT)

  if (totalItems <= PAGE_SIZE) {
    return products
  }

  const nextPagging: any = []
  const nrPages = Math.ceil(totalItems / PAGE_SIZE)

  for (let index = 1; index < nrPages; ++index) {
    nextPagging.push({
      from: from + PAGE_SIZE * index,
      to: to + PAGE_SIZE * index,
    })
  }

  const moreProductSearch = await Promise.all(
    nextPagging.map(({ to, from }: { to: number; from: number }) =>
      graphqlServer.query(
        SEARCH_QUERY,
        { to, from, collection },
        {
          persistedQuery: {
            provider: 'vtex.search-graphql@0.x',
            sender: 'vtex.export-feeds-io@0.x',
          },
        }
      )
    )
  )

  moreProductSearch.forEach((searchResult: any) => {
    const { products: moreProducts } = searchResult.data?.productSearch

    products.push(...moreProducts)
  })

  return products
}

// const getOnePage = (graphqlServer: GraphQLServer, collection: string, orderBy: string, to: number, from: number) => {
//   return graphqlServer.query(
//     SEARCH_QUERY,
//     { to, from, collection, orderBy },
//     {
//       persistedQuery: {
//         provider: 'vtex.search-graphql@0.x',
//         sender: 'vtex.export-feeds-io@0.x',
//       },
//     }
//   )
// }

// const getBatch = async (toStart: number, fromStart: number, batchSize: number) => {
//   const nextPagging: any = []
//   const result: any[] = [];

//   for (let index = 1; index < batchSize; ++index) {
//     nextPagging.push({
//       from: fromStart + PAGE_SIZE * index,
//       to: toStart + PAGE_SIZE * index,
//     })
//   }

//   const moreProductSearch = await Promise.all(
//     nextPagging.map(({ to, from }: { to: number; from: number }) =>
//       getOnePage(graphqlServer, collection, orderBy, to, from)
//     )
//   )

//   moreProductSearch.forEach((searchResult: any) => {
//     const { products: moreProducts } = searchResult.data?.productSearch

//     result.push(...moreProducts)
//   })

//   return result
// }
