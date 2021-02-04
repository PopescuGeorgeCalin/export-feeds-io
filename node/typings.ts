declare global {
  type Maybe<T> = T | null | undefined

  interface ProductFieldMapping<T> {
    name: string
    mapping: (p: Product) => T
    formatting: (t: T) => T
  }

  interface StringFieldMapping extends ProductFieldMapping<string> {
    type: 'string'
  }

  interface NumberFieldMapping extends ProductFieldMapping<number> {
    type: 'number'
  }

  type Mapping = StringFieldMapping | NumberFieldMapping

  interface SearchResponse {
    data: {
      productSearch: {
        recordsFiltered: number
        products: Product[]
      }
    }
  }

  interface Feed {
    id: string
    filename: string
    fileformat?: string
    collectionId?: Maybe<string>
    size: number
    feedType: string
    date: string
    download: string
    updateHour: Maybe<number>
    updateDay: Maybe<number>
  }

  interface SelectedFacetInput {
    key: string
    value: string
  }

  interface CategoryTree {
    id: number
    name: string
    hasChildren: boolean
    href: string
    slug: string
    children: CategoryTree[]
    titleTag: string
    metaTagDescription: string
  }

  interface Product {
    productId: string
    productName: string
    brand: string
    brandId: number
    linkText: string
    productReference: string
    categoryId: string
    metaTagDescription: string
    clusterHighlights: Record<string, string>
    productClusters: Record<string, string>
    searchableClusters: Record<string, string>
    categoryTree: CategoryTree[]
    link: string
    description: string
    items: SKU[]
    itemMetadata: {
      items: ItemMetadataUnit[]
    }
    titleTag: string
    Specifications?: string[]
    allSpecifications?: string[]
    allSpecificationsGroups?: string[]
    skuSpecifications?: SkuSpecification[]
  }

  interface SkuSpecification {
    field: SKUSpecificationField
    values: SKUSpecificationValue[]
  }

  interface SKUSpecificationField {
    name: string
    id: string
  }

  interface SKUSpecificationValue {
    name: string
    id: string
    fieldId: string
  }

  interface Image {
    imageId: string
    imageLabel: string | null
    imageTag: string
    imageUrl: string
    imageText: string
  }

  interface SKU {
    itemId: string
    name: string
    nameComplete: string
    complementName: string
    ean: string
    referenceId: { Key: string; Value: string }[]
    measurementUnit: string
    unitMultiplier: number
    modalType: any | null
    images: Image[]
    Videos: string[]
    variations: string[]
    sellers: Seller[]
    attachments: {
      id: number
      name: string
      required: boolean
      domainValues: string
    }[]
    isKit: boolean
    kitItems?: {
      itemId: string
      amount: number
    }[]
  }

  interface Seller {
    sellerId: string
    sellerName: string
    addToCartLink: string
    sellerDefault: boolean
    commertialOffer: CommertialOffer
  }

  interface CommertialOffer {
    DeliverySlaSamplesPerRegion: Record<
      string,
      { DeliverySlaPerTypes: any[]; Region: any | null }
    >
    Installments: SearchInstallment[]
    DiscountHighLight: any[]
    GiftSkuIds: string[]
    Teasers: any[]
    BuyTogether: any[]
    ItemMetadataAttachment: any[]
    Price: number
    ListPrice: number
    PriceWithoutDiscount: number
    RewardValue: number
    PriceValidUntil: string
    AvailableQuantity: number
    Tax: number
    DeliverySlaSamples: {
      DeliverySlaPerTypes: any[]
      Region: any | null
    }[]
    GetInfoErrorMessage: any | null
    CacheVersionUsedToCallCheckout: string
  }

  interface SearchInstallment {
    Value: number
    InterestRate: number
    TotalValuePlusInterestRate: number
    NumberOfInstallments: number
    PaymentSystemName: string
    PaymentSystemGroupName: string
    Name: string
  }

  interface ItemMetadataUnit {
    id: string
    name: string
    skuName: string
    productId: string
    imageUrl: string
    detailUrl: string
    seller: string
  }

  interface AssemblyOption {
    id: string
    name: string
    composition: Composition | null
    inputValues: InputValues
  }

  interface CompositionItem {
    id: string
    minQuantity: number
    maxQuantity: number
    initialQuantity: number
    priceTable: string
    seller: string
  }

  interface Composition {
    minQuantity: number
    maxQuantity: number
    items: CompositionItem[]
  }

  interface InputValues {
    [key: string]: RawInputValue
  }

  interface RawInputValue {
    maximumNumberOfCharacters: number
    domain: string[]
  }

  interface SearchMetadata {
    titleTag?: string | null
    metaTagDescription?: string | null
    id?: string | null
  }

  interface MdProduct {
    id: string
    categoryid: string
    items: string // SKU[]
    link: string
    description: string
    brand: string
    title: string
  }

  interface ReportTriggerBody {
    Id: string
    Account: string
    LinkToDownload: string
    CompletedDate: string
  }

  interface FeedInfo {
    feedType: string
    collectionId?: Maybe<string>
    fileformat?: string
    id: string
    size?: number
    updateHour: Maybe<number>
    updateDay: Maybe<number>
  }

  interface Category {
    id: number
    name: string
    hasChildren: boolean
    url: string
    children: Category[]
    Title: string
    MetaTagDescription: string
    level: number
    parent: number
  }

  interface RevealCustomer {
    customer_eid: string
    email: string
    date_registered: string
    first_name?: string
    last_name?: string
    country?: string
    region?: string
    city?: string
    gender?: string
    yob?: Int
    accepts_marketing?: Int
    custom_attributes?: Record<string, string | number>
  }

  interface RevealCategory {
    category_eid: string
    parent_category_eid: string | null
    level: number
    name: string
    margin?: number
    url?: string
  }

  interface RevealProduct {
    product_eid: string
    parent_product_eid: Maybe<string>
    sku?: string
    title: string
    url?: string
    img?: Maybe<string>
    description: string
    date_added?: string
    in_stock: number
    bc_price: number
    bc_regular_price: number
    bc_aq_price?: string
    alt_prices?: Record<string, number>
    alt_regular_prices?: Record<string, number>
    categories: string[]
    brand: string
    custom_attributes?: Record<string, string>
    variant_options?: Record<string, string>
  }

  interface RevealOrder {
    order_eid: string
    customer_eid: string
    customer_email: string
    status: string
    placed_at: string
    last_modified_at: string
    currency: string
    grand_total: Float
    bc_grand_total: Float
    shipping: Float
    order_discount: Float
    bc_order_discount: Float
    products: RevealOrderLine[]
    payment_type?: string
    shipping_provider?: string
    custom_attributed?: Record<string, any>
  }

  interface RevealOrderLine {
    product_eid: string
    parent_product_eid?: Maybe<string>
    status: string
    placed_at: string
    last_modifiet_at: string
    qty: Float
    product_price?: Float
    tax?: Float
    discount?: Float
    bc_product_price?: Float
    bc_total: Float
    bc_tax?: Float
    bc_discount?: Float
    bc_unit_aq_price?: Float
  }

  interface RevealCustomerFeed {
    categories: RevealCustomer[]
  }

  interface RevealCategoryFeed {
    categories: RevealCategory[]
  }

  interface RevealProductFeed {
    categories: RevealProduct[]
  }

  interface RevealOrderFeed {
    categories: RevealOrder[]
  }

  type RevealFeed =
    | RevealCustomerFeed
    | RevealCategoryFeed
    | RevealProductFeed
    | RevealOrderFeed
}

export {}
