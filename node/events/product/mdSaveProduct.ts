import { MasterData } from '@vtex/api'

export const saveProduct = async (masterdata: MasterData, product: any) => {
  // add the product to master data
  const fields = {
    ...product,
    skus: product.items.map((item: any) => item.itemId),
  }

  return masterdata.createOrUpdatePartialDocument({
    dataEntity: 'product',
    fields,
    id: `product-${product.productId}`,
    schema: 'product',
  })
}
