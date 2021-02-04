/* eslint-disable @typescript-eslint/camelcase */

const getSkuImg = ({ images }: SKU): Maybe<string> => {
  return images.length === 0 ? null : images[0].imageUrl
}

const getSkuAvailability = ({ sellers }: SKU): number => {
  return sellers.length === 0
    ? 0
    : +!!sellers[0].commertialOffer?.AvailableQuantity
}

const getSkuPrices = ({ sellers }: SKU) => {
  if (sellers.length === 0) return { bc_price: 0, bc_regular_price: 0 }
  const commertialOffer = sellers[0].commertialOffer
  return {
    bc_price: commertialOffer.Price,
    bc_regular_price: commertialOffer.PriceWithoutDiscount,
  }
}

const parseContentToRevealProducts = (
  fileContent: MdProduct[]
): RevealProduct[] => {
  let flat_products: RevealProduct[] = []

  fileContent.forEach((product: MdProduct) => {
    const items = JSON.parse(product.items) as SKU[]

    flat_products.push({
      product_eid: `product-${product.id}`,
      parent_product_eid: null,
      title: product.title || 'No Title',
      url: product.link,
      description: product.description,
      in_stock: 0,
      bc_price: 0,
      bc_regular_price: 0,
      categories: [product.categoryid],
      brand: product.brand,
    })

    items.forEach((sku: SKU) => {
      const { bc_price, bc_regular_price } = getSkuPrices(sku)
      flat_products.push({
        product_eid: `sku-${sku.itemId}`,
        parent_product_eid: product.id,
        title: sku.nameComplete || sku.name || product.title || 'No Title',
        url: `${product.link}`,
        img: getSkuImg(sku),
        description: product.description,
        in_stock: getSkuAvailability(sku),
        bc_price,
        bc_regular_price,
        categories: [product.categoryid],
        brand: product.brand,
      })
    })
  })

  return flat_products
}

export default parseContentToRevealProducts
