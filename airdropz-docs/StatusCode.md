# Airdropz Project - HTTP Status Codes Guide

This document explains the HTTP status codes used in the Airdropz backend, along with examples relevant to the API endpoints.

---

## ✅ Success Codes (2xx)

- **200 OK**  
  - Standard response for successful GET or PUT requests.  
  - _Example:_  
    `GET /api/airdrops/:id` — Returns the airdrop data.

- **201 Created**  
  - Used when a new resource is successfully created.  
  - _Example:_  
    `POST /api/airdrops` — Airdrop successfully created.

- **204 No Content**  
  - Success with no response body.  
  - _Example:_  
    `DELETE /api/airdrops/:id` — Airdrop deleted successfully.

---

## ⚠️ Client Errors (4xx)

- **400 Bad Request**  
  - The request is malformed or missing required fields.  
  - _Example:_  
    `POST /api/users/register` with no email or invalid data.

- **401 Unauthorized**  
  - Authentication is required or token is missing/invalid.  
  - _Example:_  
    Accessing `/api/airdrops/create` without a valid token.

- **403 Forbidden**  
  - User is authenticated but not allowed to perform the action.  
  - _Example:_  
    A normal user tries to access admin-only route `/api/admin/tasks`.

- **404 Not Found**  
  - Resource not found.  
  - _Example:_  
    `GET /api/airdrops/unknown-id`

- **409 Conflict**  
  - Duplicate or conflicting request.  
  - _Example:_  
    `POST /api/users/register` with an already used email.

---

## ❌ Server Errors (5xx)

- **500 Internal Server Error**  
  - Something went wrong on the server. Usually a code or DB bug.  
  - _Example:_  
    Airdrop creation fails due to an unhandled DB exception.

- **503 Service Unavailable**  
  - Server is down or in maintenance.  
  - _Example:_  
    Scheduled downtime or DB connection issue.

---

## Notes for Devs

- Always return **JSON responses** with a `message` field:
  
  ```json
  {
    "status": 400,
    "message": "Email is required"
  }
