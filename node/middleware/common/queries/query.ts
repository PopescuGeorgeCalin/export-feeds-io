export const SEARCH_QUERY = `query ProductSearch($from: Int!, $to: Int!, $collection: String!) {
  productSearch(from: $from, to: $to, collection: $collection, hideUnavailableItems: true) {
    recordsFiltered
    products {
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
  }
}`
