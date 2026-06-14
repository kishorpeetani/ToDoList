# ToDo List Application

A full-stack ToDo List application built using the MERN stack with secure authentication using HTTP-only cookies, task management features, password recovery via OTP, email integration, and a clean responsive frontend.

---

## 🌐 Live Demo

**Application:** https://todolist.kishorkumar.app

---

## 🚀 Features

### Authentication

* User Sign Up
* User Sign In
* Secure JWT Authentication
* HTTP-only Cookie-based Authentication
* Auto Login on Refresh using `/auth/me`
* Protected Routes
* User Logout
* OTP-based Password Reset
* Secure Password Recovery Flow

### Task Management

* Create New Task
* View All User Tasks
* Edit Existing Tasks
* Delete Tasks
* Tasks Sorted by Latest Updated
* Real-time UI Refresh after CRUD Operations
* Loading States for Better UX
* Notification Messages for Success/Error

### Email Integration

* Transactional Email Integration using Resend
* OTP Delivery for Password Reset
* Verified Custom Domain Configuration
* Production-ready Email Delivery

### Security

* Password Hashing using bcryptjs
* JWT Authorization Middleware
* HTTP-only Cookies
* Protected API Endpoints
* Environment Variable Configuration
* CORS Configuration

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
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

### Services

* Resend Email API

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
* Custom Domain: Name.com

---

## 📁 Project Structure

```bash
todo-app/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
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
│   │   ├── services/
│   │   └── server.js
│   │
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication Flow

1. User signs up using email and password.
2. Password is hashed before storing in MongoDB.
3. User signs in using registered credentials.
4. Backend generates a JWT token.
5. JWT is stored in an HTTP-only cookie.
6. Browser automatically sends the cookie with authenticated requests.
7. Authentication middleware validates the token.
8. Protected routes are accessible only to authenticated users.

### Password Recovery Flow

1. User requests password reset.
2. Backend generates a One-Time Password (OTP).
3. OTP is sent to the user's registered email via Resend.
4. User verifies the OTP.
5. User sets a new password.
6. Password is securely hashed and updated.

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

### Password Reset Routes

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| POST   | `/auth/forgot-password` | Send OTP to registered email |
| POST   | `/auth/verify-otp`      | Verify OTP                   |
| POST   | `/auth/reset-password`  | Reset password               |

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
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
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
* Start Command → `npm start`

### Frontend (Vercel)

Deploy frontend on Vercel with:

* Root Directory → `frontend`
* Framework Preset → `Vite`

### Domain Configuration

* Domain Registered via Name.com
* Custom Domain Connected to Vercel
* Email Domain Verified for Resend

---

## 👨‍💻 Author

Developed by **Peetani Kishor Kumar**

A full-stack MERN project focused on secure authentication, task management, OTP-based password recovery, email integration using Resend, and production-ready cloud deployment.

---

## ⭐ If You Like This Project

Give it a star on GitHub.
