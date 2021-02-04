/* eslint-disable @typescript-eslint/camelcase */

const mapProductToOrderLineFactory = (status?: string) => (
  item: any
): RevealOrderLine => {
  return {
    ...item,
    product_eid: `sku-${item.product_eid}`,
    parent_product_eid: `product-${item.parent_product_eid}`,
    status: status || 'Unknown',
    qty: 1 * item.qty,
    product_price: 1 * item.product_price,
    total: 1 * item.total,
    // tax: 1 * product.tax,
    // discount: 1 * product.discount,
    // bc_product_price: 1 * product.bc_product_price,
    bc_total: 1 * item.bc_total,
    // bc_tax: 1 * product.bc_tax,
    // bc_discount: 1 * product.bc_discount,
    // bc_unit_aq_price: 1 * product.bc_unit_aq_price,
  }
}

const mapOrderToReveal = (item: any): RevealOrder => {
  const products = JSON.parse(item.products)
  const status = item.status || 'Unknown'
  const mapProductToOrderLine = mapProductToOrderLineFactory(status)
  return {
    ...item,
    status,
    grand_total: 1 * item.grand_total,
    bc_grand_total: 1 * item.bc_grand_total,
    shipping: 1 * item.shipping,
    bc_shipping: 1 * item.bc_shipping,
    order_discount: -1 * item.order_discount,
    bc_order_discount: -1 * item.bc_order_discount,
    products: products.map(mapProductToOrderLine),
    // custom_attributes: JSON.parse(item.custom_attributes),
  }
}

export default mapOrderToReveal
