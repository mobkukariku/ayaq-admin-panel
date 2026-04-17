# Application User API

**Base URL:** `VITE_BACKEND_API`

---

## Endpoints

### 1. Get All Users

- **Method:** `GET`
- **URL:** `/api/ApplicationUser/GetAllUsers`
- **Query parameters:** —

**Response `200 OK`:**
```json
[
  {
    "userId": "string",
    "firstName": "string",
    "lastName": "string",
    "userName": "string",
    "email": "string",
    "profilePictureUrl": "string",
    "roles": ["string"]
  }
]
```

---

### 2. Get User Details By User Name

- **Method:** `GET`
- **URL:** `/api/ApplicationUser/GetUserDetailsByUserName/{userName}`
- **Path parameters:** `userName` (string)

**Response `200 OK`:**
```json
{
  "userId": "string",
  "firstName": "string",
  "lastName": "string",
  "userName": "string",
  "email": "string",
  "profilePictureUrl": "string",
  "roles": ["string"]
}
```

---

### 3. Get User Details By Email

- **Method:** `GET`
- **URL:** `/api/ApplicationUser/GetUserDetailsByEmail/{email}`
- **Path parameters:** `email` (string)

**Response `200 OK`:**
```json
{
  "userId": "string",
  "firstName": "string",
  "lastName": "string",
  "userName": "string",
  "email": "string",
  "profilePictureUrl": "string",
  "roles": ["string"]
}
```

---

### 4. Get User Details By User ID

- **Method:** `GET`
- **URL:** `/api/ApplicationUser/GetUserDetailsByUserId/{userId}`
- **Path parameters:** `userId` (string)

**Response `200 OK`:**
```json
{
  "userId": "string",
  "firstName": "string",
  "lastName": "string",
  "userName": "string",
  "email": "string",
  "profilePictureUrl": "string",
  "roles": ["string"]
}
```

---

### 5. Update Profile Information

- **Method:** `PUT`
- **URL:** `/api/ApplicationUser/UpdateProfileInformation/{userId}`
- **Path parameters:** `userId` (string)

**Request body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "profilePictureUrl": "string"
}
```

**Response `200 OK`:** Success (no response body)