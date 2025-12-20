# Collaborative Task Manager

A full-stack collaborative task management system built to demonstrate real-world backend architecture, real-time collaboration, and scalable frontend state management.

This project focuses on **correct system design**, **event-driven updates**, and **clean separation of concerns**, rather than just basic CRUD functionality.

---

## 🚀 Live Application

**Application URL:**  
👉 <PASTE YOUR APPLICATION LINK HERE>

---

## 🎯 Project Goals

The project was designed with the following objectives:

- Build a **production-style backend architecture**
- Implement **real-time collaboration** using WebSockets
- Treat notifications as **persistent domain entities**
- Ensure UI consistency across multiple users
- Demonstrate scalable frontend data handling using React Query

---

## 🧠 High-Level Architecture

### Backend Architecture
HTTP / Socket Requests ↓ Controllers ↓ Services (Business Logic) ↓ Repositories (Data Access) ↓ PostgreSQL (via Prisma)
Copy code

### Frontend Architecture
UI Components ↓ React Query (Server State) ↓ API Layer ↓ Socket Events (Signals) ↓ Global Context (Notifications)
Copy code

This separation ensures:
- Business logic is isolated and testable
- Data access is centralized
- Real-time updates do not corrupt UI state
- The system remains scalable and maintainable

---

## 🔐 Authentication & Authorization

- Secure user registration and login using JWT
- Password hashing with bcrypt
- Auth-protected routes across the application
- Stateless backend authentication suitable for scaling

---

## 🗂 Task Management

Each task includes:
- Title and description
- Due date
- Priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
- Status (`TODO`, `IN_PROGRESS`, `REVIEW`, `COMPLETED`)
- Task creator and assignee

### Task Lifecycle

1. A user creates a task
2. The task may be assigned to another user
3. Status and priority can be updated
4. All changes propagate in real time to other users

The distinction between **creator** and **assignee** enables realistic collaboration workflows.

---

## ⚡ Real-Time Collaboration

Real-time behavior is implemented using **Socket.io** with an event-driven approach.

### Design Principle

> WebSockets signal that data has changed — REST APIs remain the source of truth.

### Socket Events

- `task:assigned`
- `task:updated`

### Update Flow

1. User updates a task via REST API
2. Backend updates the database
3. Backend emits a socket event
4. Other clients receive the event
5. Frontend invalidates cached queries
6. Fresh data is fetched automatically

This guarantees consistency without manual state synchronization.

---

## 🔔 Notification System

Notifications are implemented as **persistent entities**, not UI-only messages.

### Notification Triggers

- Task assignment
- Task status updates by another user

### Features

- Stored in database
- Delivered instantly via WebSockets
- Unread/read state tracking
- Unread notification count in the UI
- Marked as read when viewed

This mirrors how real collaboration tools handle notifications.

---

## 📊 Dashboard & Task Views

The dashboard provides:
- Unified task list
- Sorting by due date
- Filtering by status and priority

Each task is rendered using a reusable **TaskCard** component.

---

## 🧩 TaskCard Component

The `TaskCard` component is intentionally **stateless and mutation-focused**.

### Responsibilities

- Display task details
- Allow inline updates for:
  - Status
  - Priority
- Trigger backend mutations

### Non-Responsibilities

- Does not manage global state
- Does not handle socket logic
- Does not manually update task lists

All updates rely on the existing real-time infrastructure.

---

## 🧠 Frontend State Management

### React Query

- Manages all server-side data
- Handles caching and refetching
- Automatically updates UI after socket-triggered invalidation

### Context API

- Used only for cross-cutting concerns
- Authentication and notifications are isolated in separate contexts

This avoids mixing UI state with server state.

---

## 🔁 End-to-End Data Flow Example

**Scenario: Task Reassignment**

1. User A reassigns a task
2. Backend updates the task
3. Backend emits `task:assigned`
4. Assignee receives a real-time notification
5. Other users' dashboards refresh automatically
6. Notification persists across reloads

---

## 📦 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Query
- Socket.io Client

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.io
- JWT Authentication

---

## 🛠 Local Development

### Prerequisites
- Node.js
- Docker
- PostgreSQL

### Backend
```bash
cd backend
npm install
npm run dev
Frontend
Copy code
Bash
cd frontend
npm install
npm run dev
