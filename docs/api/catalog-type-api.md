# Catalog Type API

**Base URL:** `VITE_BACKEND_API`

---

## Endpoints

### 1. Get Catalog Types

- **Method:** `GET`
- **URL:** `/api/CatalogType/GetCatalogTypes`
- **Parameters:** —

**Response `200 OK`:**
```json
[
  {
    "id": 0,
    "type": "string"
  }
]
```

---

### 2. Get Catalog Type By ID

- **Method:** `GET`
- **URL:** `/api/CatalogType/GetCatalogTypeById/{id}`
- **Path parameters:** `id` (integer)

**Response `200 OK`:**
```json
{
  "id": 0,
  "type": "string"
}
```

---

### 3. Get Catalog Type By Name

- **Method:** `GET`
- **URL:** `/api/CatalogType/GetCatalogTypeByName/{typeName}`
- **Path parameters:** `typeName` (string)

**Response `200 OK`:**
```json
{
  "id": 0,
  "type": "string"
}
```

---

### 4. Create Catalog Type

- **Method:** `POST`
- **URL:** `/api/CatalogType/CreateCatalogType`
- **Parameters:** —

**Request body:**
```json
{
  "type": "string"
}
```

**Response `200 OK`:**
```json
{
  "id": 0,
  "type": "string"
}
```

---

### 5. Update Catalog Type

- **Method:** `PUT`
- **URL:** `/api/CatalogType/UpdateCatalogType/{id}`
- **Path parameters:** `id` (integer)

**Request body:**
```json
{
  "type": "string"
}
```

**Response `200 OK`:** Success (no response body)

---

### 6. Delete Catalog Type

- **Method:** `DELETE`
- **URL:** `/api/CatalogType/DeleteCatalogType/{id}`
- **Path parameters:** `id` (integer)

**Response `200 OK`:** Success (no response body)