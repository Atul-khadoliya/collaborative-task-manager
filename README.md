# 🧩 Collaborative Task Manager

A full-stack collaborative task management system with real-time updates using REST APIs + Socket.io.
Users can create tasks, assign them to others, update status/priority, and receive live notifications without refreshing the page.

=====================================================================

🛠️ TECH STACK

Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Socket.io (real-time events)

Frontend
- React + TypeScript
- React Query
- Tailwind CSS
- Socket.io Client

=====================================================================

⚙️ BACKEND SETUP (LOCAL)

Requirements
- Node.js (v18+)
- npm
- PostgreSQL (local or cloud)
- Git

---------------------------------------------------------------------

1️⃣ Install Dependencies

cd backend
npm install

---------------------------------------------------------------------

2️⃣ Environment Variables

Create a .env file inside backend/

DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>?sslmode=require
JWT_SECRET=your-secret-key
PORT=5000

---------------------------------------------------------------------

3️⃣ Prisma Setup

Generate Prisma client

npx prisma generate

Run migrations

npx prisma migrate dev

---------------------------------------------------------------------

4️⃣ Start Backend Server

npm run dev

Backend runs on:
http://localhost:5000

---------------------------------------------------------------------

5️⃣ Health Check

GET /health

Response:
{ "status": "ok" }

=====================================================================

🎨 FRONTEND SETUP (LOCAL)

---------------------------------------------------------------------

1️⃣ Install Dependencies

cd frontend
npm install

---------------------------------------------------------------------

2️⃣ Environment Variables

Create a .env file inside frontend/

VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

---------------------------------------------------------------------

3️⃣ Start Frontend

npm run dev

Frontend runs on:
http://localhost:5173

=====================================================================

🔐 AUTHENTICATION FLOW

- Users authenticate via REST APIs using JWT
- JWT is stored on the client
- JWT is sent:
  - In API requests (Authorization header)
  - During Socket.io connection (handshake)

This ensures both REST APIs and socket events are user-aware.

=====================================================================

📡 API CONTRACT (BACKEND)

AUTH

POST   /api/v1/auth/register   → Register user

POST   /api/v1/auth/login      → Login user


TASKS

POST     /api/v1/tasks         → Create task

GET      /api/v1/tasks         → Get tasks for user

PATCH    /api/v1/tasks/:id     → Update task

DELETE   /api/v1/tasks/:id     → Delete task

NOTIFICATIONS

GET     /api/v1/notifications          → Fetch notifications

PATCH   /api/v1/notifications/:id/read → Mark as read

=====================================================================

🧠 ARCHITECTURE & DESIGN DECISIONS

Why PostgreSQL + Prisma
- Strong relational integrity (users ↔ tasks ↔ notifications)
- Prisma provides:
  - Type safety
  - Easy migrations
  - Clean data access layer

Service Layer Pattern
- Controllers handle HTTP concerns
- Services handle business logic
- Repositories handle database access

This separation keeps the codebase scalable and testable.

JWT Handling
- JWT issued on login
- Verified via middleware for protected routes
- Same JWT reused during socket handshake

=====================================================================

🔔 REAL-TIME SYSTEM (SOCKET.IO)

Why Socket.io?
- REST APIs are request-response
- Notifications and task updates require instant delivery
- Socket.io enables server-initiated events

---------------------------------------------------------------------

How REST APIs & Socket.io Work Together

Example: Task Assignment

Client (REST API)

POST /api/v1/tasks

Backend

- Task is created in DB
- 
- Notification is stored in DB
- 
- Socket event is emitted to assignee

emitToUser(userId, "task:assigned", {

  taskId,
  
  title
  
});

Client (Socket Listener)

socket.on("task:assigned", (payload) => {

  addNotification(payload);
  
});

Result:
User receives notification instantly without page refresh.

---------------------------------------------------------------------

Socket Events Used

task:assigned  → Task assigned to a user

task:updated   → Task status or priority updated

---------------------------------------------------------------------

Secure Socket Connections

- Socket connects only after login
- JWT is sent during connection
- Server maps userId → socketId

socket.on("connection", (socket) => {

  const userId = socket.user.id;
  
  userSockets.set(userId, socket.id);
  
});

=====================================================================

✅ WHY NOTIFICATIONS ARE STORED IN DB

- Socket events are ephemeral
- Database ensures:
  - Missed notifications are retrievable
  - Unread count survives refresh

Frontend fetches notifications on load.
Socket only handles live updates.

=====================================================================

⚖️ TRADE-OFFS & ASSUMPTIONS

- Socket.io used instead of raw WebSockets for:
  - Auto-reconnection
  - Event abstraction
- Notifications are text-based
- No role-based permissions (can be added later)
- Demo users used for easier testing

=====================================================================

🚀 FUTURE IMPROVEMENTS

- Read receipts per notification
- Real-time task comments
- Pagination for notifications
- Role-based access (Admin / Member)

=====================================================================

👨‍💻 AUTHOR

Built as a production-style full-stack system focusing on clean architecture,
real-time systems, and scalable backend design.
