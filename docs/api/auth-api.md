# Authentication API (Auth)

**Base URL:** `VITE_BACKEND_API`

---

## Endpoints

### 1. User Login

- **Method:** `POST`
- **URL:** `/api/Auth/Login`
- **Parameters:** —

**Request body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response `200 OK`:**
```json
{
  "authToken": "string"
}
```

---

### 2. Add User To Roles

- **Method:** `POST`
- **URL:** `/api/Auth/AddUserToRoles`
- **Parameters:** —

**Request body:**
```json
{
  "email": "string",
  "roles": ["string"]
}
```

**Response `200 OK`:**
```json
{
  "authToken": "string"
}
```

---

### 3. Request Password Reset

- **Method:** `POST`
- **URL:** `/api/Auth/RequestPasswordReset`
- **Parameters:** —

**Request body:**
```json
{
  "email": "string",
  "linkToResetPassword": "string"
}
```

**Response `200 OK`:** Success (no response body)

---

### 4. Reset Password

- **Method:** `POST`
- **URL:** `/api/Auth/ResetPassword`
- **Parameters:** —

**Request body:**
```json
{
  "email": "string",
  "code": 0,
  "newPassword": "string"
}
```

**Response `200 OK`:** Success (no response body)

---

### 5. Change Email

- **Method:** `POST`
- **URL:** `/api/Auth/ChangeEmail`
- **Parameters:** —

**Request body:**
```json
{
  "oldEmail": "string",
  "newEmail": "string"
}
```

**Response `200 OK`:**
```json
{
  "authToken": "string"
}
```

---

### 6. Change Password

- **Method:** `POST`
- **URL:** `/api/Auth/ChangePassword`
- **Parameters:** —

**Request body:**
```json
{
  "email": "string",
  "oldPassword": "string",
  "newPassword": "string"
}
```

**Response `200 OK`:** Success (no response body)

---

### 7. Get Current User ID

- **Method:** `GET`
- **URL:** `/api/Auth/GetCurrentUserId`
- **Parameters:** —

**Response `200 OK`:**
```json
{
  "userId": "string"
}
```

---

### 8. Get Current User Name

- **Method:** `GET`
- **URL:** `/api/Auth/GetCurrentUserName`
- **Parameters:** —

**Response `200 OK`:**
```json
{
  "userName": "string"
}
```

---

### 9. Get Payload

- **Method:** `GET`
- **URL:** `/api/Auth/GetPayload/{token}`
- **Path parameters:** `token` (string)

**Response `200 OK`:**
```json
{
  "nameId": "string",
  "name": "string",
  "roles": ["string"],
  "notBefore": 0,
  "expires": 0,
  "issuedAt": 0
}
```