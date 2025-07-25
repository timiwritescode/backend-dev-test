# API Documentation

## Overview

This is the API documentation for the Backend Development Test project. The API is built with NestJS and TypeScript, providing endpoints for user management, company management, image handling, and administrative functions.

**Base URL:** `/api/v1`

**Authentication:** Firebase Authentication with JWT tokens

## Authentication

The API uses Firebase Authentication. Most endpoints require authentication via Bearer token in the Authorization header.

### Authentication Header
```
Authorization: Bearer <firebase_jwt_token>
```

### Roles
- `user`: Regular user with access to their own data
- `admin`: Administrative user with access to all data

---

## Auth Endpoints

### POST /api/v1/auth/sign-up
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePass123!",
  "role": "user"
}
```

**Validation Rules:**
- `email`: Must be a valid email format
- `username`: Only letters, numbers, and underscores allowed
- `password`: Minimum 8 characters with uppercase, lowercase, number, and special character
- `role`: Optional, enum values: "user" or "admin"

**Response Example:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "firebase_user_id",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

### POST /api/v1/auth/sign-in
Sign in an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "User signed in successfully",
  "data": {
    "idToken": "firebase_jwt_token"
  }
}
```

---

## User Endpoints

### GET /api/v1/user
Get current user details.

**Authentication:** Required (User role)

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "john_doe",
    "role": "user"
  }
}
```

---

## Companies Endpoints

### GET /api/v1/companies
Get all companies belonging to the authenticated user with pagination.

**Authentication:** Required (User role)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Number of items per page (default: 10)

**Example Request:**
```
GET /api/v1/companies?page=1&pageSize=10
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "uuid",
        "companyName": "Tech Corp",
        "numberOfUsers": 50,
        "numberOfProducts": 5,
        "percentage": 10,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "user": {
           "email": "user_email",
           "userId": "user_d"
        }
      }
    ]
  }
}
```

### POST /api/v1/companies
Create a new company.

**Authentication:** Required (User role)

**Request Body:**
```json
{
  "companyName": "New Tech Corp",
  "numberOfUsers": 25,
  "numberOfProducts": 3
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Company created successfully",
  "data": {
    "companyId": "uuid",
    "companyName": "New Tech Corp",
    "numberOfUsers": 25,
    "numberOfProducts": 3,
    "percentage": 10,
    "user": {
      "email": "user_email",
      "userId": "user_d"
    }
  }
}
```

### GET /api/v1/companies/:companyId
Get details of a specific company by ID.

**Authentication:** Required (User role)

**Path Parameters:**
- `companyId`: UUID of the company

**Example Request:**
```
GET /api/v1/companies/123e4567-e89b-12d3-a456-426614174000
```

**Response Example:**
```json
{
  "success": true,
  "description": "Get company by ID successful",
  "data": {
    "companyId": "123e4567-e89b-12d3-a456-426614174000",
    "companyName": "Tech Corp",
    "numberOfUsers": 50,
    "numberOfProducts": 5,
    "percentage": 10,
    "createdAt": 17983734737438,
    "updatedAt": 179855578548534
    "user": {
      "email": "user_email",
      "userId": "user_d"
    }
  }
}
```

### PATCH /api/v1/companies/:companyId
Update a specific company.

**Authentication:** Required (User role)

**Path Parameters:**
- `companyId`: UUID of the company

**Request Body:**
```json
{
  "companyName": "Updated Tech Corp",
  "numberOfUsers": 75,
  "numberOfProducts": 8
}
```

**Note:** All fields are optional in the update request.

**Response Example:**
```json
{
  "success": true,
  "description": "Company updated successfully",
  "data": {
    "companyId": "123e4567-e89b-12d3-a456-426614174000",
    "companyName": "Updated Tech Corp",
    "numberOfUsers": 75,
    "numberOfProducts": 8,
    "createdAt": 17983734737438,
    "updatedAt": 179855578548534
    "user": {
      "email": "user_email",
      "userId": "user_d"
    },

  }
}
```

### DELETE /api/v1/companies/:companyId
Delete a specific company.

**Authentication:** Required (User role)

**Path Parameters:**
- `companyId`: UUID of the company

**Example Request:**
```
DELETE /api/v1/companies/123e4567-e89b-12d3-a456-426614174000
```

**Response:** HTTP 204 No Content

---

## Images Endpoints

### GET /api/v1/images
Get all images received by the authenticated user with pagination.

**Authentication:** Required (User role)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Number of items per page (default: 10)

**Example Request:**
```
GET /api/v1/images?page=1&pageSize=10
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "uuid",
        "filename": "image.jpg",
        "url": "https://s3.amazonaws.com/bucket/image.jpg",
        "caption": "Sample image",
        "senderId": "admin_uuid",
        "recipientId": "user_uuid",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### GET /api/v1/images/:imageId
Get details of a specific image by ID.

**Authentication:** Required (User role)

**Path Parameters:**
- `imageId`: UUID of the image

**Example Request:**
```
GET /api/v1/images/123e4567-e89b-12d3-a456-426614174000
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "filename": "image.jpg",
    "url": "https://s3.amazonaws.com/bucket/image.jpg",
    "caption": "Sample image",
    "senderId": "admin_uuid",
    "recipientId": "user_uuid",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Admin Endpoints

### GET /api/v1/admin/users
Get all users with pagination (Admin only).

**Authentication:** Required (Admin role)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Number of items per page (default: 10)

**Example Request:**
```
GET /api/v1/admin/users?page=1&pageSize=10
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "username": "john_doe",
        "role": "user",
        
      }
    ]
  }
}
```

### GET /api/v1/admin/users/:userId
Get details of a specific user by ID (Admin only).

**Authentication:** Required (Admin role)

**Path Parameters:**
- `userId`: UUID of the user

**Example Request:**
```
GET /api/v1/admin/users/123e4567-e89b-12d3-a456-426614174000
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "username": "john_doe",
    "role": "user",
  }
}
```

### GET /api/v1/admin/users/:userId/companies
Get all companies belonging to a specific user (Admin only).

**Authentication:** Required (Admin role)

**Path Parameters:**
- `userId`: UUID of the user

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Number of items per page (default: 10)

**Example Request:**
```
GET /api/v1/admin/users/123e4567-e89b-12d3-a456-426614174000/companies?page=1&pageSize=10
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "uuid",
        "companyName": "Tech Corp",
        "numberOfUsers": 50,
        "numberOfProducts": 5,
        "ownerId": "123e4567-e89b-12d3-a456-426614174000",
        "createdAt": 17983734737438,
        "updatedAt": 179855578548534
      }
    ]
  }
}
```

### GET /api/v1/admin/users/:userId/companies/:companyId
Get details of a specific company belonging to a specific user (Admin only).

**Authentication:** Required (Admin role)

**Path Parameters:**
- `userId`: UUID of the user
- `companyId`: UUID of the company

**Example Request:**
```
GET /api/v1/admin/users/123e4567-e89b-12d3-a456-426614174000/companies/456e4567-e89b-12d3-a456-426614174000
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "id": "456e4567-e89b-12d3-a456-426614174000",
    "companyName": "Tech Corp",
    "numberOfUsers": 50,
    "numberOfProducts": 5,
    "ownerId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### POST /api/v1/admin/image/send
Send an image to a specific user (Admin only).

**Authentication:** Required (Admin role)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `image`: Image file (required)
- `recipientId`: UUID of the recipient user (required)
- `caption`: Optional caption for the image


**Response Example:**
```json
{
  "success": true,
  "message": "Image sent successfully",
  "data": {
    "id": "uuid",
    "filename": "image.jpg",
    "url": "https://s3.amazonaws.com/bucket/image.jpg",
    "caption": "Sample image for user",
    "senderId": "admin_uuid",
    "recipientId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Error Responses

The API returns standardized error responses for various scenarios:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email field cannot be empty; Password length must be at least 8 and must contain uppercase, lowercase, number and special case characters",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing authentication token",
  "statusCode": 401
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden - Insufficient permissions",
  "statusCode": 403
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "statusCode": 404
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```
