# Task Manager Pro

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production_Ready-success" />
  <img src="https://img.shields.io/badge/React-18.2-blue" />
  <img src="https://img.shields.io/badge/TypeScript-5.2-blue" />
  <img src="https://img.shields.io/badge/Node.js-18-green" />
  <img src="https://img.shields.io/badge/PostgreSQL-14-blue" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## Overview

**Task Manager Pro** is an enterprise-grade task management application designed for modern teams that demand performance, clarity, and visual excellence. It features an ultra-HD, professional corporate interface with glass‑morphism effects, advanced filtering, and real-time task tracking.

---

## Key Features

###  Ultra HD Professional UI

* Glass‑morphism design with blur effects
* 4K‑optimized typography and icons
* Smooth micro‑animations and transitions
* Professional corporate color palette
* Fully responsive across devices

### 📊 Advanced Task Management

* **Four Status Levels:** Pending, In Progress, Completed, Blocked
* **Real‑time Updates:** Instant task status changes
* **Due Date Tracking:** Visual deadline indicators
* **Advanced Filtering:** Filter by status, due date, and more
* **Task Statistics Dashboard:** At‑a‑glance performance metrics

---

## Technical Excellence

* End‑to‑end TypeScript for full type safety
* Clean, modern architecture with clear separation of concerns
* Optimized performance with code splitting and lazy loading
* Comprehensive error handling and graceful degradation
* Real‑time validation with immediate user feedback

---

## Tech Stack

### Backend

* Node.js (TypeScript)
* Express.js
* PostgreSQL
* Prisma ORM
* Zod (schema validation)
* Helmet (security headers)
* CORS

### Frontend

* React 18 (TypeScript)
* Vite
* Tailwind CSS
* Hero UI Components
* React Query
* React Hook Form
* React Hot Toast
* Headless UI
* Heroicons

### Development Tools

* ESLint
* Prettier
* TypeScript
* Prisma Studio

---

## Project Structure

```
task-manager-pro/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   └── vite.config.ts
└── README.md
```

---

## Quick Start

### Prerequisites

* Node.js 18+
* PostgreSQL 14+
* Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager-pro.git
cd task-manager-pro
```

#### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

---

## Development URLs

* **Backend API:** [http://localhost:5000](http://localhost:5000)
* **Frontend App:** [http://localhost:5173](http://localhost:5173)
* **API Docs:** [http://localhost:5000/api](http://localhost:5000/api)
* **Health Check:** [http://localhost:5000/health](http://localhost:5000/health)
* **Prisma Studio:** [http://localhost:5555](http://localhost:5555)

---

## Database Schema

### Tasks Table

```sql
CREATE TABLE tasks (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('PENDING','IN_PROGRESS','COMPLETED','BLOCKED') DEFAULT 'PENDING',
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP
);
```

---

## API Endpoints

| Method | Endpoint   | Description    |
| ------ | ---------- | -------------- |
| GET    | /tasks     | Get all tasks  |
| GET    | /tasks/:id | Get task by ID |
| POST   | /tasks     | Create task    |
| PUT    | /tasks/:id | Update task    |
| DELETE | /tasks/:id | Delete task    |

---

## Security

* CORS whitelisting
* Rate limiting
* Helmet security headers
* Zod input validation
* Prisma SQL injection protection
* XSS protection via React

---

## Deployment

### Backend (Heroku)

```bash
heroku create task-manager-pro-api
git push heroku main
heroku run npx prisma migrate deploy
```

### Frontend (Vercel)

```bash
vercel
```

### Docker

Dockerfile provided for backend production builds.

---

## Testing

```bash
npm test
npm run test:e2e
```

* Unit Tests: 90%+ coverage
* Integration Tests
* End‑to‑End Testing

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

---

## License

MIT License

---

## Contact

**Project Maintainer:** Dennis Kimani
**Email:** [denniskimani918@gmail.com](mailto:denniskimani918@gmail.com)
**GitHub:** @DGikuma

---

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

**Task Manager Pro** — Professional task management for modern teams. Streamline your workflow with a powerful, elegant, and production‑ready platform.
