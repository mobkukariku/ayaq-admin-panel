# Catalog Brand API

**Base URL:** `VITE_BACKEND_API`

---

## Endpoints

### 1. Get Catalog Brands

- **Method:** `GET`
- **URL:** `/api/CatalogBrand/GetCatalogBrands`
- **Parameters:** —

**Response `200 OK`:**
```json
[
  {
    "id": 0,
    "brand": "string"
  }
]
```

---

### 2. Get Catalog Brand By ID

- **Method:** `GET`
- **URL:** `/api/CatalogBrand/GetCatalogBrandById/{id}`
- **Path parameters:** `id` (integer)

**Response `200 OK`:**
```json
{
  "id": 0,
  "brand": "string"
}
```

---

### 3. Get Catalog Brand By Name

- **Method:** `GET`
- **URL:** `/api/CatalogBrand/GetCatalogBrandByName/{brandName}`
- **Path parameters:** `brandName` (string)

**Response `200 OK`:**
```json
{
  "id": 0,
  "brand": "string"
}
```

---

### 4. Create Catalog Brand

- **Method:** `POST`
- **URL:** `/api/CatalogBrand/CreateCatalogBrand`
- **Parameters:** —

**Request body:**
```json
{
  "brand": "string"
}
```

**Response `200 OK`:**
```json
{
  "id": 0,
  "brand": "string"
}
```

---

### 5. Update Catalog Brand

- **Method:** `PUT`
- **URL:** `/api/CatalogBrand/UpdateCatalogBrand/{id}`
- **Path parameters:** `id` (integer)

**Request body:**
```json
{
  "brand": "string"
}
```

**Response `200 OK`:** Success (no response body)

---

### 6. Delete Catalog Brand

- **Method:** `DELETE`
- **URL:** `/api/CatalogBrand/DeleteCatalogBrand/{id}`
- **Path parameters:** `id` (integer)

**Response `200 OK`:** Success (no response body)