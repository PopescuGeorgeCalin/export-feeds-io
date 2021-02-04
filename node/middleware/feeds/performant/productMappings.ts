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
      name: 'title',
      type: 'string',
      mapping: mappings.productName,
      formatting: compose([limitSize(255), replaceNewLine(' ')]),
    },
    {
      name: 'description',
      type: 'string',
      mapping: mappings.description,
      formatting: replaceNewLine(' '),
    },
    {
      name: 'caption',
      type: 'string',

      mapping: mappings.description,
      formatting: compose([limitSize(254), replaceNewLine(' ')]),
    },
    {
      name: 'price',
      type: 'string',
      mapping: (product: Product) => {
        const discountedPrice = mappings.discountedPriceWithVAT(product)
        const price = mappings.priceWithVAT(product)

        if (discountedPrice && discountedPrice < price)
          return `${price}/${discountedPrice}`

        return price.toString(10)
      },
      formatting: identity,
    },
    {
      name: 'category',
      type: 'string',
      mapping: mappings.category,
      formatting: compose([limitSize(254), replaceNewLine(' ')]),
    },
    {
      name: 'subcategory',
      type: 'string',

      mapping: mappings.category,
      formatting: compose([limitSize(254), replaceNewLine(' ')]),
    },

    {
      name: 'link',
      type: 'string',

      mapping: mappings.category,
      formatting: compose([limitSize(254), replaceNewLine(' ')]),
    },
    {
      name: 'image',
      type: 'string',

      mapping: mappings.category,
      formatting: compose([limitSize(254), replaceNewLine(' ')]),
    },
    {
      name: 'productId',
      type: 'string',

      mapping: mappings.category,
      formatting: compose([limitSize(254), replaceNewLine(' ')]),
    },
    {
      name: 'legacy',
      type: 'string',

      mapping: () => {
        return ''
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
      name: 'inStock',
      type: 'number',

      mapping: (product: Product) => {
        return mappings.availability(product) > 0 ? 1 : 0
      },
      formatting: identity,
    },
    {
      name: 'otherData',
      type: 'string',

      mapping: () => {
        return ''
      },
      formatting: identity,
    },
  ]
}
