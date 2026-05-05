# 🎨 PawFlow / Veto-Care — Frontend Integration Guide

Welcome to the frontend side of PawFlow! This guide contains absolutely everything you need to connect your UI to the Flask backend. 

The backend is built as a REST API that sits on top of Supabase. **You do NOT need the `supabase-js` library** for standard database operations; the Flask API handles the secure communication with the database.

---

## 🔗 1. Base API Information

**Local Development Base URL:** `http://localhost:5000`
*(Once deployed, replace this with the Vercel production URL).*

**Headers:**
For every request **except** `/signup` and `/login`, you MUST include the JWT token in the `Authorization` header:
```http
Authorization: Bearer <your_access_token_here>
```

---

## 🔐 2. Authentication Flow

Authentication is stateless via JWT tokens.

### A. Sign Up
*Creates a new user profile.*
- **Endpoint:** `POST /signup`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "full_name": "Ahmed Ali",
    "phone": "0512345678"
  }
  ```
- **Success (201):** `{ "message": "Account created...", "user_id": "uuid" }`
- **Note:** Depending on Supabase settings, the user might need to confirm their email before logging in. (If email confirmations are off, they can log in immediately).

### B. Login (Get Token)
*Authenticates the user and returns the crucial `access_token`.*
- **Endpoint:** `POST /login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Success (200):**
  ```json
  {
    "message": "Login successful",
    "access_token": "eyJhbGciOiJIUzI1...",
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
  ```
> ⚠️ **FRONTEND TASK:** Save the `access_token` in memory (e.g., Zustand, Redux, Context) or a secure HTTP-only cookie. **Do not use LocalStorage** as per project constraints.

### C. Logout
*Invalidates the current session.*
- **Endpoint:** `POST /logout`
- **Headers:** `Authorization: Bearer <token>`
- **Success (200):** `{ "message": "Logged out successfully" }`

---

## 👩‍⚕️ 3. Fetching Data

### Get Current User Profile
- **Endpoint:** `GET /profile`
- **Headers:** `Authorization: Bearer <token>`
- **Success (200):**
  ```json
  {
    "id": "uuid",
    "full_name": "Ahmed Ali",
    "phone": "0512345678",
    "created_at": "2026-05-04T12:00:00+00:00"
  }
  ```

### Get Veterinarians (Table B)
*Populate your "Select a Vet" dropdown with this.*
- **Endpoint:** `GET /vets`
- **Headers:** `Authorization: Bearer <token>`
- **Success (200):**
  ```json
  [
    {
      "id": "vet-uuid-1",
      "name": "Dr. Amira Hassan",
      "specialty": "General Practice",
      "avatar_url": null
    },
    ...
  ]
  ```

---

## 📅 4. Appointments Lifecycle

### A. List User's Appointments
*Fetches ONLY the logged-in user's appointments (Row Level Security ensures this).*
- **Endpoint:** `GET /appointments`
- **Headers:** `Authorization: Bearer <token>`
- **Success (200):**
  ```json
  [
    {
      "id": "appt-uuid-1",
      "pet_name": "Buddy",
      "pet_type": "Dog",
      "appointment_date": "2026-06-15",
      "appointment_time": "10:00:00",
      "status": "pending",
      "file_path": null,
      "veterinarians": {
        "name": "Dr. Amira Hassan",
        "specialty": "General Practice"
      }
    }
  ]
  ```

### B. Create an Appointment
*Books a time slot. Fails with `409` if the vet is already booked at that exact time.*
- **Endpoint:** `POST /appointments`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "vet_id": "vet-uuid",
    "pet_name": "Buddy",
    "pet_type": "Dog",
    "appointment_date": "2026-06-15",
    "appointment_time": "10:00",
    "reason": "Annual check-up"
  }
  ```
- **Success (201):** Returns the created record, including the new appointment `id`.

### C. Update Status (Cancel/Confirm)
*Usually, users can only "cancel" their own appointments. Admins/Vets would confirm them.*
- **Endpoint:** `PATCH /appointments/<appointment_id>`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:** `{ "status": "cancelled" }`
- **Allowed Statuses:** `pending`, `confirmed`, `cancelled`

---

## 📁 5. Uploading the "Carnet de Santé"

The upload process happens **AFTER** the appointment is created (because we need the `appointment_id` to namespace the file securely).

### Upload the File
- **Endpoint:** `POST /appointments/<appointment_id>/upload`
- **Headers:** `Authorization: Bearer <token>` *(No Content-Type needed, Axios/Fetch will set `multipart/form-data` automatically)*
- **Body (`FormData`):**
  ```javascript
  const formData = new FormData();
  formData.append("file", fileInput.files[0]); // The selected PDF/JPG
  ```
- **Success (200):**
  ```json
  {
    "message": "File uploaded successfully",
    "file_path": "owner-uuid/appt-uuid/carnet.pdf",
    "appointment": [{ "...updated appointment data..." }]
  }
  ```

### How to display/download the file in the Frontend
The backend returns a `file_path` (e.g. `owner-uuid/appt-uuid/carnet.pdf`). Because the storage bucket is private, you cannot just put this in an `<img src="...">`. 

To fetch the secure file directly from Supabase via REST:
```javascript
const supabaseUrl = "YOUR_SUPABASE_URL_FROM_ENV";
const filePath = appointment.file_path;
const token = "THE_ACCESS_TOKEN_FROM_LOGIN";

const fileUrl = `${supabaseUrl}/storage/v1/object/authenticated/pet_records/${filePath}`;

// Example using fetch to download it securely
const response = await fetch(fileUrl, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
const blob = await response.blob();
const objectUrl = URL.createObjectURL(blob);

// Now you can use objectUrl in <img src={objectUrl}> or <a href={objectUrl}>
```

---

## 🛑 6. Error Handling

The API uses standard HTTP status codes. Every error response looks like this:
```json
{
  "error": "Human readable error message here"
}
```

**Common Status Codes to handle:**
- `400 Bad Request`: Missing fields, bad file type.
- `401 Unauthorized`: Missing, expired, or invalid token. (Action: Log the user out and redirect to Login).
- `404 Not Found`: Trying to upload to an appointment that doesn't exist or doesn't belong to the user.
- `409 Conflict`: Double-booking detected (the time slot is already taken). Show the `error` string to the user.

---

## 🎯 Frontend Task Checklist

1. [ ] Implement a state management solution for the `access_token` (No LocalStorage).
2. [ ] Add an Axios interceptor (or custom fetch wrapper) to automatically attach `Authorization: Bearer ${token}` to all requests except login/signup.
3. [ ] Handle `401` errors globally to auto-logout the user if their session expires.
4. [ ] Build the Appointment Creation form.
5. [ ] Immediately after a successful 201 appointment creation, if the user selected a file, trigger the `POST /upload` endpoint using the new appointment's ID.
6. [ ] Implement the secure file fetching logic using `URL.createObjectURL(blob)` for viewing the Carnet de Santé.
