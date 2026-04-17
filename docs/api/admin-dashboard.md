# Admin Dashboard API

**Base URL:** `VITE_BACKEND_API`

---

## Endpoints

### 1. Sales Report

- **Method:** `GET`
- **URL:** `/api/AdminDashboard/SalesReport`
- **Parameters:** —

**Response `200 OK`:**
```json
[
  {
    "month": "string",
    "salesCount": 0
  }
]
```

---

### 2. Get Customer Activity Logs

- **Method:** `GET`
- **URL:** `/api/AdminDashboard/GetCustomerActivityLogs`
- **Parameters:** —

**Response `200 OK`:**
```json
[
  {
    "userId": "string",
    "justOrdered": true,
    "orderDate": "2026-04-17T11:23:47.967Z"
  }
]
```

---

### 3. Get Inventory Summary

- **Method:** `GET`
- **URL:** `/api/AdminDashboard/GetInventorySummary`
- **Parameters:** —

**Response `200 OK`:**
```json
[
  {
    "productName": "string",
    "stockQuantity": 0
  }
]
```