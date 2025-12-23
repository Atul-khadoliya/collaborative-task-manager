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

## ⚙️ Setup Instructions (Run Locally)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/collaborative-task-manager.git
cd collaborative-task-manager

###2️⃣ Backend Setup
cd backend
npm install


Create a .env file inside the backend directory:

DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>?sslmode=require
JWT_SECRET=your-jwt-secret


Generate Prisma client and run migrations:

npx prisma generate
npx prisma migrate dev


Start the backend server:

npm run dev


Backend will run on:
👉 http://localhost:5000
