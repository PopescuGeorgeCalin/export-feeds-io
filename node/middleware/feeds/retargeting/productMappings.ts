import { defaultFunctions } from '../../common/mappings/fieldMappings'
import { identity } from '../../common/mappings/formatUtils'

export const mappingFunctions = (host: string): Mapping[] => {
  const mappings = defaultFunctions(host)

  return [
    {
      name: 'product id',
      type: 'string',
      mapping: mappings.productId,
      formatting: identity,
    },
    {
      name: 'product name',
      type: 'string',
      mapping: mappings.productName,
      formatting: identity,
    },
    {
      name: 'product url',
      type: 'string',
      mapping: mappings.link,
      formatting: identity,
    },
    {
      name: 'image url',
      type: 'string',
      mapping: mappings.mainImage,
      formatting: identity,
    },
    {
      name: 'stock',
      type: 'number',
      mapping: mappings.availability,
      formatting: identity,
    },
    {
      name: 'price',
      type: 'number',
      mapping: mappings.priceWithVAT,
      formatting: identity,
    },
    {
      name: 'sale price',
      type: 'number',
      mapping: (product: Product) => {
        const discountedPrice = mappings.discountedPriceWithVAT(product)
        const price = mappings.priceWithVAT(product)

        if (discountedPrice && discountedPrice < price) return discountedPrice

        return price
      },
      formatting: identity,
    },
    {
      name: 'brand',
      type: 'string',
      mapping: mappings.brand,
      formatting: identity,
    },
    {
      name: 'category',
      type: 'string',
      mapping: mappings.category,
      formatting: identity,
    },
    {
      name: 'extra data',
      type: 'string',
      mapping: (product: Product): string => {
        const data = {
          categories: mappings
            .categories(product)
            .split(',')
            .join(' | '),
          'media gallery': mappings.allImages(product),
          margin: null,
        }

        // const variations = product.items.map(sku => ({
        //   id: sku.itemId,
        //   price: defaultSKUFunction.skuPrice(sku).toString(),
        //   "sale_price": defaultSKUFunction.skuSalePrice(sku).toString(),
        //   stock: defaultSKUFunction.skuStock(sku),
        //   margin: null,
        // }))

        const variations: any[] = []

        return JSON.stringify({ ...data, variations })
      },
      formatting: identity,
    },
  ]
}
