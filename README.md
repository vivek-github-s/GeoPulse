# 📍 GeoPulse - Real-Time Tracking App

GeoPulse is a full-stack real-time location tracking application built with Django, Django Channels, Redis, PostgreSQL, and React. It supports live updates of moving entities (like vehicles, users, or assets) on an interactive map UI using WebSockets.

---

## 🚀 Features
- Real-time location updates using WebSockets
- RESTful APIs for posting and fetching location data
- Live map visualization in React with Mapbox
- Dockerized development environment
- Scalable setup with Redis and PostgreSQL

---

## 🧱 Tech Stack

**Backend:**
- Django + Django REST Framework
- Django Channels
- Redis (WebSocket layer)
- PostgreSQL (optionally with PostGIS)

**Frontend:**
- React
- Mapbox GL JS (or Leaflet/Google Maps as fallback)

**DevOps:**
- Docker + Docker Compose

---

## 🗂️ Project Structure

```
project/
├── backend/
│   ├── tracking/             # Django tracking app
│   ├── backend/              # Django project config
│   ├── routing.py            # Channels routing
│   ├── manage.py
│   ├── requirements.txt
├── frontend/                # React + Mapbox frontend
│   ├── src/
│   └── package.json
├── docker-compose.yml
├── Dockerfile
├── .env.example
```

---

## ⚙️ Setup Instructions

### 🔧 1. Clone the Repository
```bash
git clone https://github.com/your-username/geopulse.git
cd geopulse
```

### 🐳 2. Run with Docker
```bash
docker-compose up --build
```
This will start:
- Django backend at `http://localhost:8000`
- React frontend at `http://localhost:3000`
- Redis server
- PostgreSQL database

---

## 🔌 API Endpoints (Sample)

**POST /api/locations/**
```json
{
  "entity": 1,
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

**WebSocket**: `ws://localhost:8000/ws/locations/`

Receives real-time updates of location changes.

---

## 🗺️ Frontend (React + Mapbox)

- Displays all entities on an interactive map
- Automatically updates marker positions using WebSocket messages

To run frontend standalone:
```bash
cd frontend
npm install
npm start
```

---

## 📦 Environment Variables
Create `.env` and `.env.example` like:
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:pass@db:5432/tracking
CHANNEL_LAYERS_BACKEND=redis://redis:6379
```

---

## 📈 Future Improvements
- Authentication and user roles
- Entity grouping and filtering
- Location playback (historical path view)
- Geofencing and alerts
- Admin dashboard for analytics

---

## 📄 License
MIT License

---

## 👨‍💻 Author
**Vivek Singh** 

---

> GeoPulse – Real-time, Geo-smart, Scalable ✨
