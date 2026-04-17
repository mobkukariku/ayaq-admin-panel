# Order API

**Base URL:** `VITE_BACKEND_API`

---

## Структура объекта Order

```json
{
  "id": 0,
  "userId": "string",
  "orderDate": "2026-04-17T11:39:04.397Z",
  "isConfirmed": true,
  "shippingMethod": {
    "name": "string",
    "cost": 0,
    "deliveryTime": "string"
  },
  "shippingDetails": {
    "addressToShip": "string",
    "phoneNumber": "string"
  },
  "items": [
    {
      "id": 0,
      "catalogItemId": 0,
      "unitPrice": 0,
      "quantity": 0,
      "productName": "string",
      "orderId": 0,
      "totalPrice": 0
    }
  ],
  "totalPrice": 0
}
```

---

## Endpoints

### 1. Get Orders

- **Method:** `GET`
- **URL:** `/api/Order/GetOrders`
- **Parameters:** —

**Response `200 OK`:** массив объектов Order (см. структуру выше)

---

### 2. Get Order By ID

- **Method:** `GET`
- **URL:** `/api/Order/GetOrderById/{orderId}`
- **Path parameters:** `orderId` (integer)

**Response `200 OK`:** объект Order (см. структуру выше)

---

### 3. Get Order By User ID

- **Method:** `GET`
- **URL:** `/api/Order/GetOrderByUserId/{userId}`
- **Path parameters:** `userId` (string)

**Response `200 OK`:** объект Order (см. структуру выше)

---

### 4. Create Order

- **Method:** `POST`
- **URL:** `/api/Order/CreateOrder/{userId}`
- **Path parameters:** `userId` (string)

**Request body:**
```json
{
  "deliveryName": "string",
  "deliveryCost": 0,
  "deliveryTime": 0,
  "addressToShip": "string",
  "phoneNumber": "string"
}
```

**Response `200 OK`:** объект Order (см. структуру выше)

---

### 5. Confirm Order

- **Method:** `POST`
- **URL:** `/api/Order/ConfirmOrder/{orderId}`
- **Path parameters:** `orderId` (integer)

**Response `200 OK`:** Success (no response body)