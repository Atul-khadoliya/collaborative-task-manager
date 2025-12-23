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

## ⚙️ Setup Instructions (Run Locally

## ⚙️ Backend Setup (Local)

### Requirements
- Node.js (v18+)
- npm
- PostgreSQL (local or cloud)
- Git

---

### 1️⃣ Clone & Install
```bash
cd backend
npm install

###2️⃣ Environment Variables


Create a .env file inside backend/:

DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>?sslmode=require
JWT_SECRET=your-secret-key
PORT=5000
