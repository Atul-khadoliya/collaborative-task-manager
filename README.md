# 🧩 Collaborative Task Manager

A full-stack collaborative task management system with real-time updates using **REST APIs + Socket.io**.  
Users can create tasks, assign them to others, update status/priority, and receive live notifications without refreshing the page.

---

## 🛠️ Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Socket.io (real-time events)

### Frontend
- React + TypeScript
- React Query
- Tailwind CSS
- Socket.io Client

---

# ⚙️ Backend Setup (Local)

## Requirements
- Node.js (v18+)
- npm
- PostgreSQL (local or cloud)
- Git

---

## 1️⃣ Install Dependencies
```bash
cd backend
npm install
2️⃣ Environment Variables
Create a .env file inside backend/:
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>?sslmode=require
JWT_SECRET=your-secret-key
PORT=5000


3️⃣ Prisma Setup
Generate Prisma client:
npx prisma generate

Run migrations:
npx prisma migrate dev


4️⃣ Start Backend Server
npm run dev

Backend runs on:
http://localhost:5000


5️⃣ Health Check
GET /health

Response:
{ "status": "ok" }


🎨 Frontend Setup (Local)
1️⃣ Install Dependencies
cd frontend
npm install


2️⃣ Environment Variables
Create .env inside frontend/:
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000


3️⃣ Start Frontend
npm run dev

Frontend runs on:
http://localhost:5173


🔐 Authentication Flow


Users authenticate via REST API using JWT.


JWT is stored on the client.


JWT is sent:


In API requests (Authorization header)


During Socket.io connection (handshake)




This ensures both API calls and socket events are user-aware.

📡 API Contract (Backend)
Auth
MethodEndpointDescriptionPOST/api/v1/auth/registerRegister userPOST/api/v1/auth/loginLogin user

Tasks
MethodEndpointDescriptionPOST/api/v1/tasksCreate taskGET/api/v1/tasksGet tasks for userPATCH/api/v1/tasks/:idUpdate taskDELETE/api/v1/tasks/:idDelete task

Notifications
MethodEndpointDescriptionGET/api/v1/notificationsFetch notificationsPATCH/api/v1/notifications/:id/readMark as read

🧠 Architecture & Design Decisions
Why PostgreSQL + Prisma


Strong relational integrity (users ↔ tasks ↔ notifications)


Prisma gives:


Type safety


Easy migrations


Clean data access layer





Service Layer Pattern


Controllers handle HTTP concerns


Services handle business logic


Repositories handle DB access


This separation keeps the codebase scalable and testable.

JWT Handling


JWT issued on login


Verified via middleware for all protected routes


Same JWT is reused during socket handshake



🔔 Real-Time System (Socket.io) — Detailed Explanation
Why Socket.io?


REST APIs are request-response


Notifications and task updates require instant delivery


Socket.io enables server-initiated events



🔄 How REST APIs & Socket.io Work Together
Example: Task Assignment


Client (REST API)


POST /api/v1/tasks



Backend (Service Layer)




Task is created in DB


Notification is stored in DB


Socket event is emitted to assignee


emitToUser(userId, "task:assigned", {
  taskId,
  title
});



Client (Socket Listener)


socket.on("task:assigned", (payload) => {
  addNotification(payload);
});

➡️ Result: User receives notification instantly without refresh

📢 Socket Events Used
EventEmitted Whentask:assignedTask assigned to a usertask:updatedTask status/priority updated

🔐 Secure Socket Connections


Socket connects only after login


JWT is sent during connection


Server maps userId → socketId


Events are emitted using emitToUser(userId)


socket.on("connection", (socket) => {
  const userId = socket.user.id;
  userSockets.set(userId, socket.id);
});


✅ Why Notifications Are Also Stored in DB


Socket events are ephemeral


DB ensures:


Missed notifications are retrievable


Unread count survives refresh




Frontend fetches notifications on load


Socket only handles live updates



⚖️ Trade-offs & Assumptions


Socket.io used instead of WebSockets directly for:


Auto reconnection


Rooms & event abstraction




Notifications are simple text-based


No role-based permissions (can be added later)


Demo users used in UI for easier testing



🚀 Future Improvements


Read receipts per notification


Task comments (real-time)


Pagination for notifications


Role-based access (Admin/Member)



👨‍💻 Author
Built as a full-stack system focusing on clean architecture, real-time systems, and production-ready patterns.

---


