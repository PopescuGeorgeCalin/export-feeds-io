export const PRODUCT_QUERY = `query p($sku: ID!) {
  product(identifier: {field: id, value: $sku}) {
    brand
    brandId
    cacheId
    categoryId
    categoryTree {
      name
      slug
      hasChildren
      id
    }
    productClusters {
      id
    }
    items {
      itemId
      name
      nameComplete
      complementName
      ean
      measurementUnit
      unitMultiplier
      estimatedDateArrival
      images {
        imageId
        imageUrl
      }
      sellers {
        commertialOffer {
          Price
          ListPrice
          spotPrice
          PriceWithoutDiscount
          RewardValue
          PriceValidUntil
          AvailableQuantity
          Tax
          taxPercentage
          CacheVersionUsedToCallCheckout
        }
      }
    }
    description
    link
    linkText
    productId
    productName
    productReference
    titleTag
    metaTagDescription
    jsonSpecifications
    releaseDate
  }
}`

export const getProduct = async (graphql: any, sku: number) => {
  try {
    const product = (
      await graphql.query(
        PRODUCT_QUERY,
        { sku },
        {
          persistedQuery: {
            provider: 'vtex.search-graphql@0.x',
            sender: 'vtex.export-feeds-io@0.x',
          },
        }
      )
    ).data.product
    return product
  } catch (e) {
    return null
  }
}
