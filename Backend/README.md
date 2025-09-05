# User API - Uber Clone Backend

This document describes the User registration, login, profile, and logout workflow.

## Endpoints

### 1. Register User

- **POST** `/users/register`
- **Body:**
  ```json
  {
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**  
  - `201 Created` with `{ token, user }` on success

### 2. Login User

- **POST** `/users/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**  
  - `200 OK` with welcome message and sets HTTP-only cookie `token`

### 3. Get User Profile

- **GET** `/users/profile`
- **Headers:**  
  - Requires valid `token` cookie (set on login)
- **Response:**  
  - `200 OK` with user profile JSON

### 4. Logout User

- **GET** `/users/logout`
- **Headers:**  
  - Requires valid `token` cookie
- **Response:**  
  - `200 OK` with logout message, clears cookie and blacklists token

## Security

- Passwords are hashed with a unique salt before storage.
- JWT tokens are stored in HTTP-only cookies.
- Blacklisted tokens are checked on every authenticated request.

---
# Captain API - Uber Clone Backend

This document describes the Captain registration, login, profile, and logout workflow.

## Endpoints

### 1. Register Captain

- **POST** `/captains/register`
- **Body:**
  ```json
  {
    "fullname": { "firstname": "Anita", "lastname": "Sharma" },
    "email": "anita.captain@example.com",
    "password": "mysecurepass",
    "vehicle": {
      "color": "Blue",
      "capacity": 2,
      "vehicleType": "motorcycle",
      "numberPlate": "MH12XY9876"
    }
  }
  ```
- **Response:**  
  - `201 Created` with `{ token, captain }` on success

### 2. Login Captain

- **POST** `/captains/login`
- **Body:**
  ```json
  {
    "email": "anita.captain@example.com",
    "password": "mysecurepass"
  }
  ```
- **Response:**  
  - `200 OK` with welcome message and sets HTTP-only cookie `token`

### 3. Get Captain Profile

- **GET** `/captains/profile`
- **Headers:**  
  - Requires valid `token` cookie (set on login)
- **Response:**  
  - `200 OK` with captain profile JSON

### 4. Logout Captain

- **GET** `/captains/logout`
- **Headers:**  
  - Requires valid `token` cookie
- **Response:**  
  - `200 OK` with logout message, clears cookie and blacklists token

## Security

- Passwords are hashed with a unique salt before storage.
- JWT tokens are stored in HTTP-only cookies.
- Blacklisted tokens are checked on every authenticated request.