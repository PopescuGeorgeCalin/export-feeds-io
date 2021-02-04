import { defaultFunctions } from '../../common/mappings/fieldMappings'
import {
  limitSize,
  identity,
  compose,
  replaceNewLine,
} from '../../common/mappings/formatUtils'

export const mappingFunctions = (host: string): Mapping[] => {
  const mappings = defaultFunctions(host)

  return [
    {
      name: 'product_eid',
      type: 'string',
      mapping: mappings.productId,
      formatting: limitSize(255),
    },
    {
      name: 'parent_product_eid	',
      type: 'string',
      mapping: () => '',
      formatting: limitSize(255),
    },
    {
      name: 'sku',
      type: 'string',
      mapping: mappings.firstSKU,
      formatting: limitSize(255),
    },
    {
      name: 'title',
      type: 'string',
      mapping: mappings.productName,
      formatting: limitSize(255),
    },
    {
      name: 'url',
      type: 'string',
      mapping: mappings.link,
      formatting: limitSize(1024),
    },
    {
      name: 'img',
      type: 'string',
      mapping: mappings.mainImage,
      formatting: limitSize(1024),
    },
    {
      name: 'description',
      type: 'string',

      mapping: mappings.description,
      formatting: compose([limitSize(1024), replaceNewLine(' ')]),
    },
    {
      name: 'date_added',
      type: 'string',

      mapping: mappings.releaseDate,
      formatting: limitSize(10),
    },
    {
      name: 'in_stock',
      type: 'number',
      mapping: (product: Product) => {
        return mappings.availability(product) > 0 ? 1 : 0
      },
      formatting: identity,
    },
    {
      name: 'bc_price',
      type: 'string',
      mapping: (product: Product) => {
        const discountedPrice = mappings.discountedPriceWithVAT(product)
        const price = mappings.priceWithVAT(product)

        if (discountedPrice && discountedPrice < price)
          return `${discountedPrice}`

        return price.toString(10)
      },
      formatting: identity,
    },
    {
      name: 'bc_regular_price',
      type: 'number',
      mapping: mappings.priceWithVAT,
      formatting: identity,
    },
    {
      name: 'bc_aq_price',
      type: 'string',
      mapping: () => '',
      formatting: identity,
    },
    {
      name: 'alt_prices',
      type: 'string',

      mapping: mappings.brand,
      formatting: identity,
    },

    {
      name: 'alt_regular_prices',
      type: 'string',

      mapping: () => {
        return ''
      },
      formatting: identity,
    },

    {
      name: 'categories',
      type: 'string',

      mapping: mappings.categories,
      formatting: identity,
    },
    {
      name: 'brand',
      type: 'string',

      mapping: mappings.brand,
      formatting: limitSize(255),
    },
    {
      name: 'custom_attributes',
      type: 'string',

      mapping: () => {
        return ''
      },
      formatting: identity,
    },
    {
      name: 'variant_options',
      type: 'string',

      mapping: () => {
        return ''
      },
      formatting: identity,
    },
  ]
}
