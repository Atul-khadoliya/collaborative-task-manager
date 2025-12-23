# Collaborative Task Manager

A full-stack collaborative task management system built to demonstrate real-world backend architecture, real-time collaboration, and scalable frontend state management.

This project focuses on **correct system design**, **event-driven updates**, and **clean separation of concerns**, rather than just basic CRUD functionality.

---

## 🚀 Live Application

# Collaborative Task Manager

A full-stack collaborative task management application with real-time updates, built using a clean layered backend architecture and a modern React frontend.

---

## 🚀 Features

- User authentication with JWT
- Create, update, assign, and track tasks
- Personal task views:
  - Tasks assigned to you
  - Tasks created by you
  - Overdue tasks
- Filtering & sorting by status, priority, and due date
- Real-time notifications using Socket.io
- Optimistic UI updates with React Query

---

## 🧱 Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Socket.io

### Frontend
- React + TypeScript
- React Router
- React Query
- Tailwind CSS
- Socket.io Client

---

## 📦 Project Structure

backend/
├─ src/
│ ├─ modules/
│ │ ├─ auth/
│ │ ├─ tasks/
│ │ ├─ notifications/
│ ├─ lib/
│ ├─ server.ts
│
├─ prisma/
│ └─ schema.prisma
│
└─ package.json

frontend/
├─ src/
│ ├─ features/
│ │ ├─ tasks/
│ │ ├─ auth/
│ │ ├─ notifications/
│ ├─ context/
│ ├─ lib/
│ └─ App.tsx
│
└─ package.json

yaml
Copy code

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/collaborative-task-manager.git
cd collaborative-task-manager
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
Create a .env file:

env
Copy code
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>?sslmode=require
JWT_SECRET=your-secret-key
Run Prisma & start server:

bash
Copy code
npx prisma generate
npx prisma migrate dev
npm run dev
Backend runs on:
👉 http://localhost:5000

3️⃣ Frontend Setup
bash
Copy code
cd ../frontend
npm install
npm run dev
Frontend runs on:
👉 http://localhost:5173

🔌 API Contract (Key Endpoints)
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT

Tasks
Method	Endpoint	Description
GET	/api/tasks	Fetch tasks relevant to current user
POST	/api/tasks	Create a new task
PATCH	/api/tasks/:id	Update task (status, priority, assignment)
DELETE	/api/tasks/:id	Delete task

Notifications
Method	Endpoint	Description
GET	/api/notifications	Fetch unread notifications
PATCH	/api/notifications/:id/read	Mark notification as read

🧠 Architecture Overview & Design Decisions
Backend Architecture
Layered design:

Controller → Service → Repository

Business logic lives in services, not controllers

Prisma handles all DB interactions

DTOs + schema validation ensure safe inputs

Database Choice
PostgreSQL

Strong relational guarantees

Suitable for task-user relationships

Works well with Prisma migrations

Authentication
Stateless JWT-based authentication

Token parsed via middleware

User context injected into request lifecycle

🔔 Real-time Functionality (Socket.io)
Socket.io is initialized on the backend server

Each user joins a room based on userId

Events emitted on:

Task assignment

Task updates

Frontend listens and:

Updates notification state instantly

Invalidates React Query cache for live task refresh

This avoids polling and ensures low-latency updates.

⚖️ Trade-offs & Assumptions
Task update notifications are currently delivered via sockets only (not persisted yet) to avoid premature schema complexity

Notification persistence is designed but intentionally deferred

Authorization assumes task creator or assignee can update a task

Designed for clarity & correctness over premature optimization

✅ Why This Project Matters
This project demonstrates:

Clean backend architecture

Real-time systems thinking

Correct use of ORM + transactions

Frontend state management at scale

Practical trade-offs made intentionally

📌 Future Improvements
Persist all notification types

Role-based access control

Task comments & activity logs

Pagination & infinite scroll

E2E testing

