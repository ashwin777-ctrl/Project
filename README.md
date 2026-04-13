# Lost and Found Management System

Full-stack app for reporting lost/found items with geolocation, matching, and messaging.

## Tech Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS + React Leaflet
- **Backend:** Node.js + Express + JWT + Socket.IO
- **Database:** MongoDB + Mongoose

## Project Structure

```
Project/
  client/     # Next.js frontend
  server/     # Express REST API + MongoDB models
```

## Features

- JWT auth (register/login)
- Create/read/update/delete lost/found reports
- Image upload support (multipart form data)
- Map-based location picker (lat/lng)
- Filter + search by keyword/category/location radius
- Interactive map with report markers
- Match suggestions between lost and found items using text + distance
- Basic contact messaging between users
- Dashboard cards, loading/error states, notifications
- Basic admin panel (users + all reports)
- Real-time notifications via Socket.IO for message + match alerts

## Environment Variables

### Server (`server/.env`)

Use `server/.env.example` as template:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lost_found
JWT_SECRET=supersecretjwt
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Client (`client/.env.local`)

Use `client/.env.example` as template:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Run Locally (Step-by-Step)

### 1) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2) Configure env files

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

### 3) Start backend

```bash
cd server
npm run dev
```

### 4) Start frontend

Open a second terminal:

```bash
cd client
npm run dev
```

### 5) Open app

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:5000/api/health`

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/items`
- `GET /api/items/mine` (auth)
- `POST /api/items` (auth, multipart)
- `PUT /api/items/:id` (auth)
- `DELETE /api/items/:id` (auth)
- `GET /api/items/:id/matches` (auth)
- `GET /api/messages` (auth)
- `POST /api/messages` (auth)
- `GET /api/admin/users` (admin)
- `GET /api/admin/items` (admin)

## Notes

- Uploaded images are stored in `server/src/uploads`.
- Set one user role to `admin` manually in MongoDB if needed.
- For production, move uploads to cloud storage and add HTTPS + secure cookies.
