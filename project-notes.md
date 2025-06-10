# 🧠 CodeCraft: Learn JavaScript & React with Interactive Game

## 🏗 Tech Stack

| Layer     | Tech                         |
|-----------|------------------------------|
| Frontend  | React + TailwindCSS          |
| Auth      | Firebase Authentication      |
| Backend   | Node.js + Express.js         |
| Database  | MongoDB Atlas                |
| Search    | Fuse.js                      |
| Analytics | Recharts                     |

---

## ✅ Project Milestones (Progress Tracker)

- [ ] Firebase Auth Setup (Email + Google)
- [ ] React App Setup with Routing + Auth Pages
- [ ] Concept JSON + Fuse.js Search
- [ ] Firebase to store searched queries
- [ ] Backend API setup (Node + MongoDB)
- [ ] API to log user searches
- [ ] Admin dashboard with analytics (Recharts)
- [ ] Hosting Frontend (Vercel) + Backend (Render)

---

## 🔐 Firebase Auth Fields

- Email/Password Login
- Google Auth
- Store basic profile (name, email, UID)

---

## 🗃 DB Collections (MongoDB)

- `users`: [uid, email, createdAt]
- `conceptSearches`: [uid, conceptName, timestamp]
- `concepts`: [title, definition, codeExample, examAnswer]

---

## 🔍 Fuse.js Search Flow

1. JSON file with all concepts
2. User types → Fuse searches → best match shown
3. On click, show: Concept + Real-life example + Exam Answer

---

## 📊 Analytics

- Most searched concepts
- Daily/Weekly searches
- Top 5 active users

---

## 🌐 API Endpoints (Planned)

| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| POST   | `/log-search`       | Log a user search            |
| GET    | `/get-analytics`    | Return chart data            |
| POST   | `/add-concept`      | Add new concept (admin)      |

---

> Created with ❤️ by [your GitHub username]  
> Guide: ChatGPT (project journey tracker)
