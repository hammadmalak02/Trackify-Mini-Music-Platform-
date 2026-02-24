# 🎵 Trackify — Music Platform

A full-stack music streaming platform where Artists can upload tracks and, while Listeners can browse and play music and also user can create albums.


## 🛠️ Tech Stack

### Backend
- **Node.js** — Runtime environment
- **Express.js** — Web framework
- **MongoDB** — Database
- **Mongoose** — MongoDB ODM
- **JWT (jsonwebtoken)** — Authentication
- **bcryptjs** — Password hashing
- **Multer** — File upload handling
- **ImageKit** — Cloud storage for audio files
- **Cookie-parser** — Cookie handling
- **CORS** — Cross-origin resource sharing

### Frontend
- **React** — UI library
- **Vite** — Build tool
- **CSS-in-JS** — Custom styling with CSS variables

---

## ✨ Features

### Authentication
- Register as **Artist** or **Listener**
- Login / Logout with JWT stored in cookies
- Role-based access control

### For Artists 🎤
- Upload audio tracks (MP3, WAV, FLAC) to ImageKit cloud
- Create albums and add tracks to them

### For Listeners 🎧
- Browse all uploaded tracks
- Browse all albums
- View individual album with full tracklist
- Play tracks directly in browser

---

## 📁 Project Structure

```
Trackify/
│
├── backend/
│   └── src/
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── music.controller.js
│       ├── db/
│       │   └── db.js
│       ├── middlewares/
│       │   └── auth.middleware.js
│       ├── models/
│       │   ├── user.model.js
│       │   ├── music.model.js
│       │   └── album.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── music.routes.js
│       ├── services/
│       │   └── storage.service.js
│       ├── app.js
│       └── server.js
│
└── frontend/
    └── src/
        ├── App.jsx
        └── main.jsx
```

---

## 🚀 Installation & Setup

### 1. Clone the repo
```bash
git clone https://github.com/hammadmalak02/Trackify-Mini-Music-Platform-
cd Trackify


### 2. Backend Setup
bash
cd backend
npm install


Create a `.env` file:
env
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key


Start the backend:
bash
node server.js


Backend runs on: `http://localhost:3000`

### 3. Frontend Setup
bash
cd frontend
npm install
npm run dev


Frontend runs on: `http://localhost:5174`

---

## 🔗 API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| POST | `/logout` | Logout user | Public |

### Music Routes — `/api/music`
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/upload` | Upload a track | Artist only |
| POST | `/album` | Create an album | Artist only |
| GET | `/` | Get all tracks | Any logged in user |
| GET | `/albums` | Get all albums | Any logged in user |
| GET | `/albums/:albumId` | Get album by ID | Any logged in user |

---

## 👤 Author

**Your Name**
- GitHub: [Hammad-Ur-Rehman](https://github.com/hammadmalak02)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
