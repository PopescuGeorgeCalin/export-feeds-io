import { defaultFunctions } from '../../common/mappings/fieldMappings'
import {
  limitSize,
  compose,
  removeHtmlTags,
  identity,
  limitDecimals,
} from '../../common/mappings/formatUtils'

export const mappingFunctions = (host: string): Mapping[] => {
  const mappings = defaultFunctions(host)

  return [
    {
      name: 'categoryId',
      type: 'string',
      mapping: mappings.categoryId,
      formatting: limitSize(20),
    },
    {
      name: 'categories',
      type: 'string',
      mapping: mappings.category,
      formatting: limitSize(100),
    },
    {
      name: 'parentCategory',
      type: 'string',
      mapping: mappings.parentCategory,
      formatting: limitSize(100),
    },
    {
      name: 'manufacturer',
      type: 'string',
      mapping: mappings.brand,
      formatting: limitSize(100),
    },
    {
      name: 'manufacturerpn',
      type: 'string',
      mapping: mappings.brandId,
      formatting: limitSize(25),
    },
    {
      name: 'model',
      type: 'string',
      mapping: (product: Product) => {
        return `${mappings.brand(product)} ${mappings.productName(product)}`
      },
      formatting: limitSize(255),
    },
    {
      name: 'productId',
      type: 'string',
      mapping: mappings.productId,
      formatting: limitSize(100),
    },
    {
      name: 'productName',
      type: 'string',
      mapping: mappings.productName,
      formatting: limitSize(255),
    },
    {
      name: 'description',
      type: 'string',
      mapping: mappings.description,
      formatting: compose([removeHtmlTags(), limitSize(255)]),
    },
    {
      name: 'link',
      type: 'string',
      mapping: mappings.link,
      formatting: identity,
    },
    {
      name: 'image',
      type: 'string',
      mapping: mappings.mainImage,
      formatting: identity,
    },
    {
      name: 'priceWithoutVAT',
      type: 'number',
      mapping: mappings.priceWithoutVAT,
      formatting: limitDecimals(5),
    },
    {
      name: 'priceWithVAT',
      type: 'number',
      mapping: mappings.priceWithVAT,
      formatting: limitDecimals(5),
    },
    {
      name: 'discountedPriceWithoutVAT',
      type: 'number',
      mapping: mappings.discountedPriceWithoutVAT,
      formatting: limitDecimals(5),
    },
    {
      name: 'currency',
      type: 'string',
      mapping: mappings.currency,
      formatting: identity,
    },
    {
      name: 'availability',
      type: 'string',
      mapping: (product: Product) => {
        const available = mappings.availability(product)

        return available > 0 ? 'in stock' : 'out of stock'
      },
      formatting: identity,
    },
    {
      name: 'freeDelivery',
      type: 'number',
      mapping: (_: Product) => 0,
      formatting: identity,
    },
    {
      name: 'giftIncluded',
      type: 'number',
      mapping: (_: Product) => 0,
      formatting: identity,
    },
    {
      name: 'status',
      type: 'number',
      mapping: (_: Product) => 1,
      formatting: identity,
    },
    {
      name: 'parentCategoryId',
      type: 'string',
      mapping: mappings.parentCategoryId,
      formatting: limitSize(20),
    },
  ]
}
