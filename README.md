# Schema Initialization

You have to manually create the schemas with postman using the following steps:

## Step 1:

### Create feeds schema

`PUT https://{accountName}.{environment}.com.br/api/dataentities/feed/schemas/feed`

Using Authentication headers for the account

with this body:

```json
{
  "properties": {
    "filename": {
      "type": "string"
    },
    "fileformat": {
      "type": "string"
    },
    "feedType": {
      "type": "string"
    },
    "collectionId": {
      "type": "string"
    },
    "size": {
      "type": "number"
    },
    "date": {
      "type": "string"
    },
    "download": {
      "type": "string"
    },
    "updateHour": {
      "type": "number"
    },
    "updateDay": {
      "type": "number"
    },
  },
  "required": [],
  "v-indexed": [
    "filename",
    "fileformat",
    "feedType",
    "collectionId",
    "size",
    "date",
    "download",
    "updateHour",
    "updateDay"
  ],
  "v-cache": false,
  "v-security": {
    "allowGetAll": true,
    "publicRead": [
      "filename",
      "fileformat",
      "feedType",
      "collectionId",
      "size",
      "date",
      "download",
      "updateHour",
      "updateDay"
    ],
    "publicWrite": [
      "filename",
      "fileformat",
      "feedType",
      "collectionId",
      "size",
      "date",
      "download",
      "updateHour",
      "updateDay"
    ],
    "publicFilter": [
      "filename",
      "fileformat",
      "feedType",
      "collectionId",
      "size",
      "date",
      "download",
      "updateHour",
      "updateDay"
    ]
  }
}
```

## Step 2:

### Create report_to_feed schema

`PUT https://{accountName}.{environment}.com.br/api/dataentities/report_to_feed/schemas/report_to_feed`

Using Authentication headers for the account

with this body:

```json
{
  "properties": {
    "idFeed": {
      "type": "string"
    }
  },
  "v-indexed": ["idFeed"],
  "v-cache": false,
  "v-security": {
    "allowGetAll": true,
    "publicRead": ["idFeed"],
    "publicWrite": ["idFeed"],
    "publicFilter": ["idFeed"]
  }
}
```

## Step 3:

### Create products schema

`PUT https://{accountName}.{environment}.com.br/api/dataentities/product/schemas/product`

Using Authentication headers for the account

with this body:

```json
{
  "properties": {
    "brand": {
      "type": "string"
    },
    "brandId": {
      "type": "integer"
    },
    "cacheId": {
      "type": "string"
    },
    "categoryId": {
      "type": "string"
    },
    "categoryTree": {
      "type": "array",
      "items": [
        {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "slug": {
              "type": "string"
            },
            "hasChildren": {
              "type": "boolean"
            },
            "id": {
              "type": "integer"
            }
          },
          "required": ["name", "slug", "hasChildren", "id"]
        },
        {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "slug": {
              "type": "string"
            },
            "hasChildren": {
              "type": "boolean"
            },
            "id": {
              "type": "integer"
            }
          },
          "required": ["name", "slug", "hasChildren", "id"]
        },
        {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "slug": {
              "type": "string"
            },
            "hasChildren": {
              "type": "boolean"
            },
            "id": {
              "type": "integer"
            }
          },
          "required": ["name", "slug", "hasChildren", "id"]
        }
      ]
    },
    "productClusters": {
      "type": "array",
      "items": [
        {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": ["id"]
        },
        {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            }
          },
          "required": ["id"]
        }
      ]
    },
    "items": {
      "type": "array",
      "items": [
        {
          "type": "object",
          "properties": {
            "itemId": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "nameComplete": {
              "type": "string"
            },
            "complementName": {
              "type": "string"
            },
            "ean": {
              "type": "string"
            },
            "measurementUnit": {
              "type": "string"
            },
            "unitMultiplier": {
              "type": "integer"
            },
            "estimatedDateArrival": {
              "type": "null"
            },
            "images": {
              "type": "array",
              "items": [
                {
                  "type": "object",
                  "properties": {
                    "imageId": {
                      "type": "string"
                    },
                    "imageUrl": {
                      "type": "string"
                    }
                  },
                  "required": ["imageId", "imageUrl"]
                }
              ]
            },
            "sellers": {
              "type": "array",
              "items": [
                {
                  "type": "object",
                  "properties": {
                    "commertialOffer": {
                      "type": "object",
                      "properties": {
                        "Price": {
                          "type": "number"
                        },
                        "ListPrice": {
                          "type": "number"
                        },
                        "spotPrice": {
                          "type": "number"
                        },
                        "PriceWithoutDiscount": {
                          "type": "number"
                        },
                        "RewardValue": {
                          "type": "integer"
                        },
                        "PriceValidUntil": {
                          "type": ["string", "null"]
                        },
                        "AvailableQuantity": {
                          "type": "integer"
                        },
                        "Tax": {
                          "type": "number"
                        },
                        "taxPercentage": {
                          "type": ["number", "null"]
                        },
                        "CacheVersionUsedToCallCheckout": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "Price",
                        "ListPrice",
                        "spotPrice",
                        "PriceWithoutDiscount",
                        "RewardValue",
                        "PriceValidUntil",
                        "AvailableQuantity",
                        "Tax",
                        "taxPercentage",
                        "CacheVersionUsedToCallCheckout"
                      ]
                    }
                  },
                  "required": ["commertialOffer"]
                }
              ]
            }
          },
          "required": [
            "itemId",
            "name",
            "nameComplete",
            "complementName",
            "ean",
            "measurementUnit",
            "unitMultiplier",
            "estimatedDateArrival",
            "images",
            "sellers"
          ]
        }
      ]
    },
    "description": {
      "type": "string"
    },
    "link": {
      "type": "string"
    },
    "linkText": {
      "type": "string"
    },
    "productId": {
      "type": "string"
    },
    "productName": {
      "type": "string"
    },
    "productReference": {
      "type": "string"
    },
    "titleTag": {
      "type": "string"
    },
    "metaTagDescription": {
      "type": "string"
    },
    "jsonSpecifications": {
      "type": "string"
    },
    "releaseDate": {
      "type": "string"
    },
    "skus": {
      "type": "array",
      "items": [
        {
          "type": "string"
        }
      ]
    }
  },
  "required": [
    "brand",
    "brandId",
    "categoryId",
    "categoryTree",
    "productClusters",
    "description",
    "link",
    "productId",
    "productName",
    "titleTag",
    "releaseDate",
    "skus"
  ],
  "v-indexed": [
    "id",
    "brand",
    "brandId",
    "productId",
    "productName",
    "skus",
    "categoryId",
    "productClusters"
  ],
  "v-security": {
    "allowGetAll": true,
    "publicRead": [
      "id",
      "brand",
      "brandId",
      "productId",
      "productName",
      "skus",
      "categoryId",
      "productClusters"
    ],
    "publicWrite": [
      "id",
      "brand",
      "brandId",
      "productId",
      "productName",
      "skus",
      "categoryId",
      "productClusters"
    ],
    "publicFilter": [
      "id",
      "brand",
      "brandId",
      "productId",
      "productName",
      "skus",
      "categoryId",
      "productClusters"
    ]
  },
  "v-cache": false
}
```
