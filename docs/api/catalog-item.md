# Catalog Item API

**Base URL:** `VITE_BACKEND_API`

---

## Endpoints

### 1. Get Catalog Items

- **Method:** `GET`
- **URL:** `/api/CatalogItem/GetCatalogItems`
- **Parameters:** —

**Response `200 OK`:**
```json
[
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "price": 0,
    "pictureUrl": "string",
    "stockQuantity": 0,
    "catalogItemTypeName": "string",
    "catalogItemBrandName": "string",
    "catalogTypeId": 0,
    "catalogBrandId": 0,
    "reviews": [
      {
        "id": 0,
        "userId": "string",
        "rating": 0,
        "reviewText": "string",
        "createdTime": "2026-04-17T11:37:52.166Z",
        "catalogItemId": 0
      }
    ]
  }
]
```

---

### 2. Get Catalog Item By ID

- **Method:** `GET`
- **URL:** `/api/CatalogItem/GetCatalogItemById/{id}`
- **Path parameters:** `id` (integer)

**Response `200 OK`:**
```json
{
  "id": 0,
  "name": "string",
  "description": "string",
  "price": 0,
  "pictureUrl": "string",
  "stockQuantity": 0,
  "catalogItemTypeName": "string",
  "catalogItemBrandName": "string",
  "catalogTypeId": 0,
  "catalogBrandId": 0,
  "reviews": [
    {
      "id": 0,
      "userId": "string",
      "rating": 0,
      "reviewText": "string",
      "createdTime": "2026-04-17T11:37:52.144Z",
      "catalogItemId": 0
    }
  ]
}
```

---

### 3. Get Catalog Items By Type Name

- **Method:** `GET`
- **URL:** `/api/CatalogItem/GetCatalogItemsByTypeName/{typeName}`
- **Path parameters:** `typeName` (string)

**Response `200 OK`:** массив объектов (см. структуру в п.1)

---

### 4. Get Catalog Items By Brand Name

- **Method:** `GET`
- **URL:** `/api/CatalogItem/GetCatalogItemsByBrandName/{brandName}`
- **Path parameters:** `brandName` (string)

**Response `200 OK`:** массив объектов (см. структуру в п.1)

---

### 5. Create Catalog Item

- **Method:** `POST`
- **URL:** `/api/CatalogItem/CreateCatalogItem`
- **Parameters:** —

**Request body:**
```json
{
  "name": "string",
  "description": "string",
  "price": 0,
  "pictureUrl": "string",
  "stockQuantity": 0,
  "catalogTypeId": 0,
  "catalogBrandId": 0
}
```

**Response `200 OK`:** объект CatalogItem (см. структуру в п.2)

---

### 6. Update Catalog Item Details

- **Method:** `PUT`
- **URL:** `/api/CatalogItem/UpdateCatalogItemDetails/{id}`
- **Path parameters:** `id` (integer)

**Request body:**
```json
{
  "name": "string",
  "description": "string",
  "price": 0
}
```

**Response `200 OK`:** Success (no response body)

---

### 7. Update Catalog Item Stock Quantity

- **Method:** `PUT`
- **URL:** `/api/CatalogItem/UpdateCatalogItemStockQuantity/{id}`
- **Path parameters:** `id` (integer)

**Request body:**
```json
{
  "stockQuantity": 0
}
```

**Response `200 OK`:** Success (no response body)

---

### 8. Update Catalog Item Picture URL

- **Method:** `PUT`
- **URL:** `/api/CatalogItem/UpdateCatalogItemPictureUrl/{id}`
- **Path parameters:** `id` (integer)

**Request body:**
```json
{
  "pictureUrl": "string"
}
```

**Response `200 OK`:** Success (no response body)

---

### 9. Update Catalog Type

- **Method:** `PUT`
- **URL:** `/api/CatalogItem/UpdateCatalogType/{id}`
- **Path parameters:** `id` (integer)

**Request body:**
```json
{
  "catalogTypeId": 0
}
```

**Response `200 OK`:** Success (no response body)

---

### 10. Update Catalog Brand

- **Method:** `PUT`
- **URL:** `/api/CatalogItem/UpdateCatalogBrand/{id}`
- **Path parameters:** `id` (integer)

**Request body:**
```json
{
  "catalogBrandId": 0
}
```

**Response `200 OK`:** Success (no response body)

---

### 11. Delete Catalog Item

- **Method:** `DELETE`
- **URL:** `/api/CatalogItem/DeleteCatalogItem/{id}`
- **Path parameters:** `id` (integer)

**Response `200 OK`:** Success (no response body)