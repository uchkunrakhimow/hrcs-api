<div align="center">

# 🎯 HRCS API

**HR candidate screening REST API built with Bun and Elysia.js**

_Complete platform for managing users, organizations, assignments, tests, and results_

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.2.22+-black.svg)](https://bun.sh/)
[![Elysia.js](https://img.shields.io/badge/Elysia.js-Latest-blue.svg)](https://elysiajs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-orange.svg)](https://postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://typescriptlang.org/)

</div>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Requirements](#-requirements)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [📡 API Overview](#-api-overview)
- [📁 Project Structure](#-project-structure)
- [🐳 Docker](#-docker)
- [🔧 Development](#-development)
- [🤝 Contributing](#-contributing)
- [🔒 Security](#-security)
- [📄 License](#-license)

## ✨ Features

- **🔐 Authentication**: JWT-based auth with register/login endpoints
- **👥 User Management**: CRUD operations with role-based access control
- **🏢 Organizations**: Multi-tenant isolation and management
- **🧩 Assignments & Candidates**: Create, assign, and manage candidate lifecycle
- **📝 Questions & Tests**: Multilingual question bank with test delivery
- **📄 Results**: PDF export and result aggregations
- **🩺 Health Checks**: Readiness and liveness monitoring endpoints

## 🛠️ Tech Stack

- **Runtime**: Bun
- **Framework**: Elysia.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Logging**: Pino (structured logging)

## 📋 Requirements

- Bun 1.2.22+
- PostgreSQL 14+

## 🚀 Getting Started

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

3. **Set up database:**

   ```bash
   bunx prisma generate
   bunx prisma db push
   ```

4. **Start development server:**
   ```bash
   bun run dev
   ```

Server will start on `http://localhost:3000` with API prefix `/api/v1`.

## ⚙️ Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hrcs"

# Authentication
JWT_SECRET="replace-with-strong-secret"

# Server
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"

# Email (optional)
SMTP_HOST="localhost"
SMTP_PORT=1025
SMTP_USER=""
SMTP_PASS=""
SMTP_SECURE=false
```

## 📡 API Overview

**Authentication:**

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

**Users:**

- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `GET/PUT/DELETE /api/v1/users/:id` - User operations

**Organizations:**

- `GET /api/v1/organizations` - List organizations
- `POST /api/v1/organizations` - Create organization
- `GET/PUT/DELETE /api/v1/organizations/:id` - Organization operations

**Assignments:**

- `GET /api/v1/assignments` - List assignments
- `POST /api/v1/assignments` - Create assignment
- `GET/PUT/DELETE /api/v1/assignments/:id` - Assignment operations

**Questions & Health:**

- `GET /api/v1/questions` - List questions
- `PUT /api/v1/questions/:id` - Update question
- `GET /api/v1/health` - Health check

**Authentication header for protected routes:**

```
Authorization: Bearer <jwt_token>
```

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/                    # Authentication & JWT
│   ├── user/                    # User management
│   ├── organization/            # Organization management
│   ├── assignment/              # Assignment operations
│   ├── assignment-candidate/    # Candidate assignments
│   ├── question/               # Question bank
│   ├── result/                 # Test results & PDF export
│   ├── health/                 # Health checks
│   └── helpers/                # Utilities (email, jwt, logger)
├── generated/                  # Prisma client (auto-generated)
└── index.ts                   # Application entry point
```

## 🐳 Docker

```bash
# Build image
docker build -t hrcs-api .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  hrcs-api
```

## 🔧 Development

- `bun run dev` – Start development server with hot reload
- `bun run build` – Generate Prisma client and build project
- `bunx prisma migrate dev --name <migration_name>` – Create and apply database migration
- `bunx prisma studio` – Open Prisma Studio to inspect database

## 🔒 Security

If you discover a security vulnerability, please email the maintainer privately rather than opening a public issue. We take security seriously and will respond promptly to legitimate reports.

## 📄 License

[MIT](LICENSE) - see the LICENSE file for details.
