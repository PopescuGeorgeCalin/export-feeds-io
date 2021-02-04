// eslint-disable-next-line lodash/import-scope
import _ from 'lodash'

interface DefaultMappers {
  productId: (product: Product) => string
  productName: (product: Product) => string
  productReference: (product: Product) => string
  productTitle: (product: Product) => string
  brand: (product: Product) => string
  brandId: (product: Product) => string
  categoryId: (product: Product) => string
  category: (product: Product) => string
  categories: (product: Product) => string
  parentCategory: (product: Product) => string
  parentCategoryId: (product: Product) => string
  description: (product: Product) => string
  link: (product: Product) => string
  mainImage: (product: Product) => string
  allImages: (product: Product) => string[]
  priceWithoutVAT: (product: Product) => number
  discountedPriceWithoutVAT: (product: Product) => number
  discountedPriceWithVAT: (product: Product) => number
  priceWithVAT: (product: Product) => number
  availability: (product: Product) => number
  currency: () => string
  firstSKU: (product: Product) => string
  releaseDate: (product: Product) => string
}

export const defaultFunctions = (host: string): DefaultMappers => ({
  productId: ({ productId }: Product) => {
    return productId
  },
  productName: ({ productName }: Product) => {
    return productName
  },
  productReference: ({ productReference }: Product) => {
    return productReference
  },
  productTitle: ({ titleTag }: Product) => {
    return titleTag
  },

  brand: ({ brand }: Product): string => {
    return brand
  },

  brandId: ({ brandId }: Product): string => {
    return brandId.toString(10)
  },

  categoryId: ({ categoryId }: Product): string => {
    return categoryId
  },
  category: ({ categoryTree, categoryId }: Product): string => {
    const cat = categoryTree.find(
      (category: CategoryTree) => category.id === parseInt(categoryId, 10)
    )

    return cat ? cat.name : ''
  },
  categories: ({ categoryTree }: Product): string => {
    if (!categoryTree.length) return ''

    return categoryTree.map((category: CategoryTree) => category.name).join(',')
  },
  parentCategory: ({ categoryTree }: Product): string => {
    if (!categoryTree.length || categoryTree.length < 2) return ''

    return categoryTree[categoryTree.length - 2].name
  },
  parentCategoryId: ({ categoryTree }: Product): string => {
    if (!categoryTree.length || categoryTree.length < 2) return ''

    return categoryTree[categoryTree.length - 2].id.toString()
  },

  description: ({ description }: Product): string => {
    return description
  },

  link: ({ linkText }: Product): string => {
    return `https://${host}/${linkText}/p`
  },
  mainImage: ({ items }: Product): string => {
    if (
      !items ||
      !items.length ||
      !items[0] ||
      !items[0].images ||
      !items[0].images.length
    )
      return ''

    return items[0].images[0].imageUrl
  },

  allImages: ({ items }): string[] => {
    const result: any[] = []

    _.transform(
      items,
      (result, sku) => {
        const images: any[] = sku.images.map(image =>
          _.pick(image, ['imageId', 'imageUrl'])
        )

        result.push(...images)
      },
      result
    )

    return _.uniqBy(result, 'imageId').map(image => image.imageUrl)
  },

  currency: () => {
    return 'RON'
  },

  priceWithoutVAT: ({ items }: Product): number => {
    if (!items.length || !items[0].sellers.length) return -1

    const listPrice = items[0].sellers[0].commertialOffer?.ListPrice
    const tax = items[0].sellers[0].commertialOffer?.Tax

    return listPrice - tax
  },

  discountedPriceWithoutVAT: ({ items }: Product): number => {
    if (!items.length || !items[0].sellers.length) return -1

    const price = items[0].sellers[0].commertialOffer?.Price
    const tax = items[0]?.sellers[0]?.commertialOffer?.Tax

    return price - tax
  },
  discountedPriceWithVAT: ({ items }: Product): number => {
    if (!items.length || !items[0].sellers.length) return -1

    return items[0].sellers[0].commertialOffer?.Price
  },
  priceWithVAT: ({ items }: Product): number => {
    if (!items.length || !items[0].sellers.length) return -1
    const listPrice = items[0].sellers[0].commertialOffer?.ListPrice

    return listPrice
  },

  availability: ({ items }: Product): number => {
    if (!items.length || !items[0].sellers.length) return -1

    const availableQuantity =
      items[0].sellers[0].commertialOffer?.AvailableQuantity

    return availableQuantity
  },
  firstSKU: ({ items }: Product): string => {
    if (!items.length) return ''

    return items[0].itemId
  },
  releaseDate: (p: Product): string => {
    // TBD
    console.log(p)
    return new Date().toISOString().split('T')[0]
  },
})

export const defaultSKUFunction = {
  skuPrice: (sku: SKU): number => {
    if (!sku || !sku.sellers || !sku.sellers.length) return -1

    return sku.sellers[0].commertialOffer?.ListPrice
  },
  skuSalePrice: (sku: SKU): number => {
    if (!sku || !sku.sellers || !sku.sellers.length) return -1

    return sku.sellers[0].commertialOffer?.Price
  },
  skuStock: (sku: SKU): number => {
    if (!sku || !sku.sellers || !sku.sellers.length) return -1

    return sku.sellers[0].commertialOffer.AvailableQuantity
  },
}
