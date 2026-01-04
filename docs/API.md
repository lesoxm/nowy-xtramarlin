# API Documentation - xTraMarlin

## Base URL
```
http://localhost:3001/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "jan_kowalski",
  "email": "jan@example.com",
  "password": "secure_password",
  "role": "competitor",
  "full_name": "Jan Kowalski"
}
```

**Roles:**
- `competitor` - Zawodnik
- `organizer` - Organizator
- `spectator` - Kibic

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "username": "jan_kowalski",
    "email": "jan@example.com",
    "role": "competitor",
    "full_name": "Jan Kowalski"
  },
  "token": "jwt-token"
}
```

### Login
**POST** `/auth/login`

Login with existing credentials.

**Request Body:**
```json
{
  "username": "jan_kowalski",
  "password": "secure_password"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "username": "jan_kowalski",
    "email": "jan@example.com",
    "role": "competitor",
    "full_name": "Jan Kowalski"
  },
  "token": "jwt-token"
}
```

---

## Competition Endpoints

### Get All Competitions
**GET** `/competitions`

Get list of all competitions with optional status filter.

**Query Parameters:**
- `status` (optional): `active`, `upcoming`, `completed`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Zawody Letnie 2024",
    "description": "Zawody wędkarskie nad jeziorem",
    "start_date": "2024-07-01T08:00:00Z",
    "end_date": "2024-07-01T16:00:00Z",
    "status": "active",
    "organizer_id": "uuid",
    "organizer_name": "Jan Organizator",
    "created_at": "2024-06-15T10:00:00Z"
  }
]
```

### Get Competition Details
**GET** `/competitions/:id`

Get detailed information about a specific competition.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Zawody Letnie 2024",
  "description": "Zawody wędkarskie nad jeziorem",
  "start_date": "2024-07-01T08:00:00Z",
  "end_date": "2024-07-01T16:00:00Z",
  "status": "active",
  "organizer_id": "uuid",
  "organizer_name": "Jan Organizator",
  "created_at": "2024-06-15T10:00:00Z"
}
```

### Create Competition
**POST** `/competitions` 🔒 *Organizers only*

Create a new competition.

**Request Body:**
```json
{
  "name": "Zawody Jesienne 2024",
  "description": "Zawody nad rzeką",
  "start_date": "2024-09-15T08:00:00Z",
  "end_date": "2024-09-15T16:00:00Z"
}
```

**Response:** `201 Created`
```json
{
  "message": "Competition created successfully",
  "competition": {
    "id": "uuid",
    "name": "Zawody Jesienne 2024",
    "description": "Zawody nad rzeką",
    "start_date": "2024-09-15T08:00:00Z",
    "end_date": "2024-09-15T16:00:00Z",
    "status": "upcoming",
    "organizer_id": "uuid"
  }
}
```

### Register for Competition
**POST** `/competitions/:id/register` 🔒 *Competitors only*

Register as a participant in a competition.

**Response:** `200 OK`
```json
{
  "message": "Successfully registered for competition",
  "participant_id": "uuid"
}
```

### Get Leaderboard
**GET** `/competitions/:id/leaderboard`

Get current leaderboard for a competition.

**Response:** `200 OK`
```json
[
  {
    "user_id": "uuid",
    "username": "jan_kowalski",
    "full_name": "Jan Kowalski",
    "total_fish": 5,
    "total_points": 450,
    "last_catch": "2024-07-01T14:30:00Z"
  }
]
```

---

## Photo Endpoints

### Upload Photo
**POST** `/photos/upload` 🔒 *Competitors only*

Upload a photo of caught fish.

**Request Body:** `multipart/form-data`
- `photo` (file): Image file (JPEG, JPG, PNG, max 10MB)
- `competition_id` (string): Competition UUID
- `fish_species` (string, optional): Species name
- `length_cm` (number, optional): Fish length in cm
- `weight_kg` (number, optional): Fish weight in kg

**Response:** `201 Created`
```json
{
  "message": "Photo uploaded successfully",
  "photo": {
    "id": "uuid",
    "file_path": "/uploads/filename.jpg",
    "fish_species": "Karp",
    "length_cm": 45.5,
    "weight_kg": 2.3,
    "judging_status": "pending"
  }
}
```

### Get Competition Photos
**GET** `/photos/competition/:competition_id`

Get photos from a specific competition.

**Query Parameters:**
- `status` (optional): `pending`, `approved`, `rejected`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "competition_id": "uuid",
    "participant_id": "uuid",
    "file_path": "/uploads/filename.jpg",
    "fish_species": "Karp",
    "length_cm": 45.5,
    "weight_kg": 2.3,
    "upload_time": "2024-07-01T12:00:00Z",
    "judging_status": "approved",
    "points": 100,
    "username": "jan_kowalski",
    "full_name": "Jan Kowalski"
  }
]
```

### Get My Photos
**GET** `/photos/my-photos` 🔒 *Competitors only*

Get all photos uploaded by the authenticated user.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "competition_id": "uuid",
    "competition_name": "Zawody Letnie 2024",
    "file_path": "/uploads/filename.jpg",
    "fish_species": "Karp",
    "length_cm": 45.5,
    "weight_kg": 2.3,
    "upload_time": "2024-07-01T12:00:00Z",
    "judging_status": "approved",
    "points": 100
  }
]
```

### Judge Photo
**PUT** `/photos/:id/judge` 🔒 *Organizers only*

Judge a submitted photo.

**Request Body:**
```json
{
  "judging_status": "approved",
  "points": 100,
  "judge_notes": "Piękny okaz, zasługuje na 100 punktów"
}
```

**Response:** `200 OK`
```json
{
  "message": "Photo judged successfully"
}
```

---

## Statistics Endpoints

### Get Platform Statistics
**GET** `/statistics/platform`

Get overall platform statistics.

**Response:** `200 OK`
```json
{
  "total_competitors": 150,
  "total_competitions": 25,
  "active_competitions": 3,
  "total_approved_catches": 1200
}
```

### Get Competition Statistics
**GET** `/statistics/competition/:id`

Get detailed statistics for a specific competition.

**Response:** `200 OK`
```json
{
  "basic": {
    "total_participants": 45,
    "total_photos": 220,
    "pending_photos": 15,
    "approved_photos": 200,
    "rejected_photos": 5
  },
  "fish_statistics": [
    {
      "fish_species": "Karp",
      "count": 85,
      "avg_length": 42.5,
      "max_length": 68.0,
      "avg_weight": 2.8,
      "max_weight": 5.2
    }
  ],
  "top_scorers": [
    {
      "username": "jan_kowalski",
      "full_name": "Jan Kowalski",
      "fish_count": 8,
      "total_points": 750
    }
  ]
}
```

### Get User Statistics
**GET** `/statistics/user/:userId`

Get statistics for a specific user.

**Response:** `200 OK`
```json
{
  "competitions_entered": 12,
  "total_catches": 95,
  "approved_catches": 90,
  "total_points": 8500,
  "best_catch_points": 150
}
```

### Get Competition Timeline
**GET** `/statistics/competition/:id/timeline`

Get activity timeline for a competition.

**Response:** `200 OK`
```json
[
  {
    "event_type": "photo_upload",
    "event_time": "2024-07-01T14:30:00Z",
    "username": "jan_kowalski",
    "fish_species": "Karp",
    "judging_status": "approved"
  }
]
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "error": "Missing required fields"
}
```

**401 Unauthorized**
```json
{
  "error": "Access token required"
}
```

**403 Forbidden**
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Server error"
}
```

---

## WebSocket Events

Connect to: `ws://localhost:3001`

### Events Broadcasted:

**New Competition**
```json
{
  "type": "new_competition",
  "data": {
    "id": "uuid",
    "name": "Competition name"
  }
}
```

**New Participant**
```json
{
  "type": "new_participant",
  "data": {
    "competition_id": "uuid"
  }
}
```

**New Photo**
```json
{
  "type": "new_photo",
  "data": {
    "competition_id": "uuid",
    "username": "jan_kowalski"
  }
}
```

**Photo Judged**
```json
{
  "type": "photo_judged",
  "data": {
    "photo_id": "uuid",
    "competition_id": "uuid",
    "status": "approved"
  }
}
```
