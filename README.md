# ToDo List Application

A full-stack ToDo List application built using the MERN stack with secure authentication using HTTP-only cookies, task management features, and a clean responsive frontend.

---

## 🚀 Features

### Authentication

* User Sign Up
* User Sign In
* Secure JWT Authentication
* HTTP-only Cookie-based Authentication
* Auto Login on Refresh using `/auth/me`
* User Logout

### Task Management

* Create New Task
* View All User Tasks
* Edit Existing Tasks
* Delete Tasks
* Tasks Sorted by Latest Updated
* Real-time UI Refresh after CRUD operations
* Loading States for Better UX
* Notification Messages for Success/Error

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* CSS
* Fetch API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* cookie-parser
* CORS

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 📁 Project Structure

```bash
todo-app/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   │
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication Flow

1. User signs up using email and password
2. User signs in
3. Backend generates JWT token
4. Token is stored in HTTP-only cookies
5. Browser automatically sends cookie with every request
6. Backend verifies user using middleware
7. Protected routes like tasks are accessed securely

---

## 📌 API Endpoints

### Auth Routes

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| POST   | `/auth/signup`   | Register new user          |
| POST   | `/auth/sign-in`  | Login user                 |
| POST   | `/auth/sign-out` | Logout user                |
| GET    | `/auth/me`       | Get current logged-in user |

---

### Task Routes

| Method | Endpoint     | Description        |
| ------ | ------------ | ------------------ |
| GET    | `/tasks`     | Get all user tasks |
| POST   | `/tasks`     | Create new task    |
| PUT    | `/tasks/:id` | Update task        |
| DELETE | `/tasks/:id` | Delete task        |

---

## ⚙️ Environment Variables

### Backend `.env`

```env
PORT=5007
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

---

### Frontend `.env`

```env
VITE_API_URL=your_backend_render_url
```

Example:

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## ▶️ Run Locally

### 1. Clone Repository

```bash
git clone your-repository-url
cd todo-app
```

---

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

### Backend (Render)

Deploy backend on Render with:

* Root Directory → `backend`
* Build Command → `npm install`
* Start Command → `node server.js`

---

### Frontend (Vercel)

Deploy frontend on Vercel with:

* Root Directory → `frontend`
* Framework → `Vite`

---


## 👨‍💻 Author

Developed by **Kishore Kumar**

A full-stack MERN project focused on secure authentication, clean architecture, and production-ready deployment.

---

## ⭐ If You Like This Project

Give it a star on GitHub.
