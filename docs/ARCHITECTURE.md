# xTraMarlin - System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     xTraMarlin Platform                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   Web Browser    │ ◄─────► │   Web Browser    │
│   (Organizer)    │         │  (Competitor)    │
└────────┬─────────┘         └─────────┬────────┘
         │                             │
         │    HTTP/HTTPS + WebSocket   │
         │                             │
         └──────────┬──────────────────┘
                    │
         ┌──────────▼───────────┐
         │  Frontend (React)    │
         │  Port: 3000          │
         │  - Responsive UI     │
         │  - React Router      │
         │  - Real-time updates │
         └──────────┬───────────┘
                    │
                    │ REST API + WS
                    │
         ┌──────────▼───────────┐
         │  Backend (Node.js)   │
         │  Port: 3001          │
         │  - Express Server    │
         │  - WebSocket Server  │
         │  - JWT Auth          │
         │  - File Upload       │
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │  SQLite Database     │
         │  - Users             │
         │  - Competitions      │
         │  - Photos            │
         │  - Leaderboard       │
         └──────────────────────┘
```

## Component Architecture

### Frontend Architecture

```
frontend/
├── src/
│   ├── main.jsx                    # Entry point
│   ├── App.jsx                     # Main app component
│   │
│   ├── pages/                      # Page components
│   │   ├── HomePage.jsx            # Landing page
│   │   ├── LoginPage.jsx           # Login
│   │   ├── RegisterPage.jsx        # Registration
│   │   ├── CompetitionsPage.jsx   # Competitions list
│   │   ├── CompetitionDetailPage.jsx # Competition details
│   │   ├── LiveLeaderboardPage.jsx # Live rankings
│   │   └── DashboardPage.jsx       # User dashboard
│   │
│   ├── components/                 # Reusable components
│   │   └── Navigation.jsx          # Navigation bar
│   │
│   ├── contexts/                   # React contexts
│   │   └── AuthContext.js          # Authentication state
│   │
│   ├── utils/                      # Utilities
│   │   └── api.js                  # API client
│   │
│   └── styles/                     # CSS styles
│       ├── index.css               # Global styles
│       ├── HomePage.css
│       ├── Navigation.css
│       └── ...
│
└── vite.config.js                  # Vite configuration
```

### Backend Architecture

```
backend/
├── src/
│   ├── server.js                   # Main server file
│   │   ├── Express setup
│   │   ├── WebSocket server
│   │   ├── Routes mounting
│   │   └── Error handling
│   │
│   ├── routes/                     # API endpoints
│   │   ├── auth.js                 # /api/auth/*
│   │   ├── competitions.js         # /api/competitions/*
│   │   ├── photos.js               # /api/photos/*
│   │   └── statistics.js           # /api/statistics/*
│   │
│   ├── middleware/                 # Middleware functions
│   │   └── auth.js                 # JWT authentication
│   │
│   └── config/                     # Configuration
│       └── database.js             # SQLite setup
│
└── uploads/                        # Uploaded photos storage
```

## Data Flow

### User Registration Flow

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│ Frontend │ ───► │ Backend  │ ───► │ Database │
│          │      │          │      │          │
│ Register │      │ Hash pwd │      │ Insert   │
│ Form     │      │ Generate │      │ User     │
│          │ ◄─── │ JWT      │ ◄─── │          │
└──────────┘      └──────────┘      └──────────┘
     │
     ▼
Store token
in localStorage
```

### Photo Upload & Judging Flow

```
1. Competitor uploads photo:
┌──────────┐      ┌──────────┐      ┌──────────┐
│Competitor│ ───► │ Backend  │ ───► │ Database │
│Upload    │      │Save photo│      │ Insert   │
│Photo     │      │Multer    │      │ Record   │
└──────────┘      └────┬─────┘      └──────────┘
                       │
                       ▼
                  WebSocket
                  Broadcast
                       │
                       ▼
              ┌────────────────┐
              │  All Connected │
              │    Clients     │
              └────────────────┘

2. Organizer judges photo:
┌──────────┐      ┌──────────┐      ┌──────────┐
│Organizer │ ───► │ Backend  │ ───► │ Database │
│Judge     │      │Update    │      │ Update   │
│Photo     │      │Status    │      │ Photo    │
└──────────┘      └────┬─────┘      └──────────┘
                       │
                       ▼
                  WebSocket
                  Broadcast
                       │
                       ▼
              ┌────────────────┐
              │  Leaderboard   │
              │  Auto-refresh  │
              └────────────────┘
```

## Database Schema

```sql
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ username        │
│ email           │
│ password_hash   │
│ role            │
│ full_name       │
│ created_at      │
└─────────┬───────┘
          │
          │ 1:N
          │
┌─────────▼───────┐         ┌─────────────────┐
│  competitions   │         │  participants   │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄───────┤│ id (PK)         │
│ name            │    1:N  │ competition_id  │
│ description     │         │ user_id         │
│ start_date      │         │ status          │
│ end_date        │         └────────┬────────┘
│ status          │                  │
│ organizer_id    │                  │ 1:N
└─────────────────┘                  │
                              ┌──────▼────────┐
                              │    photos     │
                              ├───────────────┤
                              │ id (PK)       │
                              │ competition_id│
                              │ participant_id│
                              │ file_path     │
                              │ fish_species  │
                              │ length_cm     │
                              │ weight_kg     │
                              │ judging_status│
                              │ points        │
                              │ upload_time   │
                              └───────────────┘
```

## User Roles & Permissions

```
┌────────────────────────────────────────────────┐
│                  User Roles                     │
└────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Competitor  │  │  Organizer   │  │  Spectator   │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ - Register   │  │ - Create     │  │ - View       │
│   for events │  │   competitions│  │   competitions│
│ - Upload     │  │ - Judge      │  │ - View       │
│   photos     │  │   photos     │  │   leaderboard│
│ - View own   │  │ - Assign     │  │ - View       │
│   results    │  │   points     │  │   statistics │
│ - View       │  │ - View       │  │              │
│   leaderboard│  │   statistics │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Real-time Updates

```
┌────────────────────────────────────────────────┐
│          WebSocket Communication               │
└────────────────────────────────────────────────┘

Server                          Clients
  │                               │
  │◄─────── Connect ──────────────┤
  │                               │
  ├──── new_competition ─────────►│
  ├──── new_participant ─────────►│
  ├──── new_photo ───────────────►│
  ├──── photo_judged ────────────►│
  │                               │
  │                           Auto-refresh
  │                           Leaderboard
```

## Security Measures

```
┌────────────────────────────────────────────────┐
│              Security Features                  │
└────────────────────────────────────────────────┘

1. Authentication
   └─► JWT tokens (7-day expiry)
   └─► Bcrypt password hashing (10 rounds)

2. Authorization
   └─► Role-based access control (RBAC)
   └─► Middleware checks on protected routes

3. File Upload Security
   └─► File type validation (JPEG, PNG only)
   └─► File size limit (10MB max)
   └─► Unique file naming (UUID)

4. API Security
   └─► CORS configuration
   └─► Input validation
   └─► Error handling
```

## Deployment Architecture

```
┌────────────────────────────────────────────────┐
│            Docker Deployment                    │
└────────────────────────────────────────────────┘

┌─────────────────────┐
│  docker-compose     │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────┐  ┌─────────┐
│Frontend │  │Backend  │
│Container│  │Container│
│         │  │         │
│Nginx    │  │Node.js  │
│Port:3000│  │Port:3001│
└─────────┘  └────┬────┘
                  │
                  ▼
             ┌─────────┐
             │SQLite DB│
             │(Volume) │
             └─────────┘
```

## Performance Considerations

1. **Frontend**
   - Code splitting with React lazy loading
   - Optimized images
   - CSS minification
   - Vite build optimization

2. **Backend**
   - Connection pooling for database
   - Efficient SQL queries with indexes
   - WebSocket for real-time updates (no polling)
   - File upload streaming with Multer

3. **Database**
   - Indexed columns (user_id, competition_id)
   - Optimized queries
   - Prepared statements

## Future Enhancements

- [ ] PostgreSQL migration for production
- [ ] Redis caching layer
- [ ] CDN for static assets
- [ ] Image optimization/thumbnails
- [ ] Advanced fish recognition AI
- [ ] Mobile native apps
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
