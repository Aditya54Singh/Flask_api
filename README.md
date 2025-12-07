
# 🧭 Flask Routes & API Documentation

This document explains the **Flask route files** used in the backend of this project, focusing on:

- `auth_routes.py` → Authentication (Register & Login)
- `user_routes.py` → Protected user operations (Read / Update / Delete)
- `routes/__init__.py` → Blueprint registration

---

## 📁 Routes Overview

The project uses **Flask Blueprints** to keep routes modular and organized.

```bash
backend/
└── app/
    ├── models.py
    ├── extensions.py
    └── routes/
        ├── __init__.py
        ├── auth_routes.py
        └── user_routes.py
```

| File              | Responsibility                            |
|-------------------|-------------------------------------------|
| `auth_routes.py`  | Handles user registration and login       |
| `user_routes.py`  | Handles protected user-related operations |
| `__init__.py`     | Registers blueprints with the Flask app   |

---

## 🔐 Authentication Routes (`auth_routes.py`)

**Blueprint name:** `auth_bp`  
**URL prefix:** `/auth`

This file contains the routes for:

- **User registration**
- **User login**
- **JWT token generation**

### 1️⃣ Register — `POST /auth/register`

Create a new user account.

**Request body (JSON):**

```json
{
  "username": "john_doe",
  "password": "secret123"
}
```

**Validation:**

- Both `username` and `password` are required
- Username must be unique

**Possible responses:**

- `201 Created` → User registered successfully
- `400 Bad Request` → Missing fields or username already exists

---

### 2️⃣ Login — `POST /auth/login`

Authenticate a user and return a **JWT access token**.

**Request body (JSON):**

```json
{
  "username": "john_doe",
  "password": "secret123"
}
```

**Behavior:**

- Looks up the user by username
- Verifies the password using bcrypt
- If valid → generates a JWT token using `create_access_token(identity=user.id)`

**Successful response example:**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJh..."
}
```

**Error response:**

- `401 Unauthorized` → Invalid username or password

---

## 👤 User Routes (`user_routes.py`)

**Blueprint name:** `user_bp`  
**URL prefix:** `/users`

All routes in this file are **JWT protected**, using `@jwt_required()`.

To access them, clients must send an `Authorization` header:

```http
Authorization: Bearer <access_token>
```

---

### 1️⃣ Get All Users — `GET /users/`

Returns a list of all registered users.

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response example:**

```json
[
  { "id": 1, "username": "john_doe" },
  { "id": 2, "username": "alice" }
]
```

---

### 2️⃣ Update Current User — `PUT /users/me`

Update the username of the currently logged-in user.

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Request body:**

```json
{
  "username": "new_username"
}
```

**Responses:**

- `200 OK` → Username updated
- `400 Bad Request` → Missing username
- `404 Not Found` → User not found (should not usually happen if token is valid)

---

### 3️⃣ Delete Current User — `DELETE /users/me`

Delete the account of the currently logged-in user.

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Responses:**

- `200 OK` → User deleted
- `404 Not Found` → User not found

---

## 🔗 Blueprint Registration (`routes/__init__.py`)

This file contains the function that registers all blueprints with the main Flask app.

```python
from flask import Blueprint
from .auth_routes import auth_bp
from .user_routes import user_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(user_bp, url_prefix="/users")
```

- `/auth/...` → all authentication endpoints
- `/users/...` → all user-related endpoints

This keeps the `app/__init__.py` clean and focused only on:

- App creation
- Config loading
- Extension initialization
- Blueprint registration

---

## 🧪 Testing the Routes (Example with curl)

### Register

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "test123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "test123"}'
```

Copy the `access_token` from the response.

### Get Users

```bash
curl http://localhost:5000/users/ \
  -H "Authorization: Bearer <access_token>"
```

---

## ⚙️ Tech Stack Summary

- **Framework:** Flask
- **Database:** SQLAlchemy (MySQL/SQLite)
- **Auth:** Flask-JWT-Extended
- **Password Hashing:** Flask-Bcrypt
- **Architecture Pattern:** Modular Blueprints

---

## 🚀 Future Improvements

- Role-based access control (admin vs normal user)
- Refresh tokens & logout functionality
- Password reset via email
- Rate limiting for login endpoint
- Centralized error handling and logging

---

## ✍️ Notes

This README is specifically for explaining the **routes layer** of the backend.  
You can include it as `ROUTES_README.md` or merge it into the main `README.md` of your project.
