/* eslint-disable @typescript-eslint/camelcase */

const mapCustomerToReveal = (item: any): RevealCustomer => ({
  ...item,
  yob: 1 * item.yob,
  accepts_marketing: 1 * item.accepts_marketing,
  custom_attributes: JSON.parse(item.custom_attributes),
})

export default mapCustomerToReveal
