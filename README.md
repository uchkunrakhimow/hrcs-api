<h1 align="center">HRCS API</h1>

<p align="center">
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Runtime-Bun-000?logo=bun&logoColor=fff" alt="Bun" /></a>
  <a href="https://elysiajs.com"><img src="https://img.shields.io/badge/Framework-Elysia-0ea5e9" alt="Elysia" /></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/ORM-Prisma-2d3748?logo=prisma" alt="Prisma" /></a>
  <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/DB-PostgreSQL-316192?logo=postgresql&logoColor=fff" alt="PostgreSQL" /></a>
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License: MIT" />
  <img src="https://img.shields.io/badge/Status-Active%20Development-success" alt="Project Status" />
</p>

<p align="center">
  HR candidate screening REST API — users, organizations, assignments, tests, and results.
</p>

---

## Table of Contents

- **Overview**
- **Features**
- **Architecture**
- **Requirements**
- **Getting Started**
  - Install
  - Configure environment
  - Database setup
  - Run locally
- **API Overview**
- **Project Structure**
- **Docker**
- **Development**
- **Contributing**
- **Security**
- **License**

## Overview

Production‑ready API built with Bun, Elysia.js, Prisma, and PostgreSQL. Focused on clean architecture, strict TypeScript, and simple operability.

## Features

- **🔐 Auth**: JWT auth, register/login, current user
- **👥 Users**: CRUD, role‑based access
- **🏢 Organizations**: Multi‑tenant isolation
- **🧩 Assignments & Candidates**: Create, assign, lifecycle management
- **📝 Questions & Tests**: Multilingual question bank and delivery
- **📄 Results**: PDF export and aggregations
- **🩺 Health**: Readiness and liveness checks

## Architecture

- **Runtime**: Bun
- **Framework**: Elysia.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT
- **Logging**: Pino (structured)

## Requirements

- Bun 1.2.22+
- PostgreSQL 14+

## Getting Started

### Install

```bash
bun install
```

### Configure environment

```bash
cp .env.example .env
```

### Database setup

```bash
bunx prisma generate
bunx prisma db push
```

### Run locally

```bash
bun run dev
```

Default base URL: `http://localhost:3000`, API prefix: `/api/v1`.

### Environment variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hrcs"
JWT_SECRET="replace-with-strong-secret"
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"

# Email (optional)
SMTP_HOST="localhost"
SMTP_PORT=1025
SMTP_USER=""
SMTP_PASS=""
SMTP_SECURE=false
```

## API Overview

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET  /api/v1/auth/me`
- `GET  /api/v1/users` | `POST /api/v1/users` | `GET/PUT/DELETE /api/v1/users/:id`
- `GET  /api/v1/organizations` | `POST /api/v1/organizations` | `GET/PUT/DELETE /api/v1/organizations/:id`
- `GET  /api/v1/assignments` | `POST /api/v1/assignments` | `GET/PUT/DELETE /api/v1/assignments/:id`
- `GET  /api/v1/questions` | `PUT /api/v1/questions/:id`
- `GET  /api/v1/health`

Auth header for protected routes:

```
Authorization: Bearer <jwt>
```

## Project Structure

```
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── organization/
│   ├── assignment/
│   ├── assignment-candidate/
│   ├── question/
│   ├── result/
│   └── health/
├── generated/        # Prisma client (generated)
└── index.ts
```

## Docker

```bash
docker build -t hrcs-api .
docker run -p 3000:3000 \
  -e DATABASE_URL=... \
  -e JWT_SECRET=... \
  hrcs-api
```

## Development

- `bun run dev` – start dev server with watch
- `bun run build` – generate Prisma client and build
- `bunx prisma migrate dev --name <name>` – schema changes
- `bunx prisma studio` – inspect the DB

## Contributing

Contributions are welcome! Please:

- **Fork** the repo and create a feature branch
- **Commit** with clear messages
- **Open a PR** with a concise description and context

If adding/altering APIs, include examples or tests where practical.

## Security

If you discover a security vulnerability, please email the maintainer privately. Avoid opening public issues for vulnerabilities.

## License

MIT. See `LICENSE`.
