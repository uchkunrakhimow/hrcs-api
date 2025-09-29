<h1 align="center">HRCS API</h1>

<p align="center">
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Runtime-Bun-000?logo=bun&logoColor=fff" alt="Bun" /></a>
  <a href="https://elysiajs.com"><img src="https://img.shields.io/badge/Framework-Elysia-0ea5e9" alt="Elysia" /></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/ORM-Prisma-2d3748?logo=prisma" alt="Prisma" /></a>
  <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/DB-PostgreSQL-316192?logo=postgresql&logoColor=fff" alt="PostgreSQL" /></a>
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License: MIT" />
</p>

## Overview

Backend REST API for managing users, organizations, assignments, tests, and results for HR candidate screening.

## Features

- **Auth**: JWT auth, register/login, profile
- **Users**: CRUD, role‑based access
- **Organizations**: Multi‑tenant isolation
- **Assignments & Candidates**: Create, assign, manage lifecycle
- **Questions & Tests**: Multilingual question bank and delivery
- **Results**: PDF export and aggregation
- **Health**: Readiness/liveness checks

## Tech Stack

- **Runtime**: Bun
- **Framework**: Elysia.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT
- **Logging**: Pino

## Quick Start

### Prerequisites

- Bun 1.2.22+
- PostgreSQL 14+

### Setup

```bash
bun install
cp .env.example .env

# Prisma
bunx prisma generate
bunx prisma db push


# Start dev server
bun run dev
```

Default base URL: `http://localhost:3000`, API prefix: `/api/v1`.

## Environment Variables

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

## API Outline

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

## Scripts

- `bun run dev` – Start dev server with watch
- `bun run build` – Generate Prisma client and build binary
- `bun run seed` – Truncate and seed demo data

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

Build and run:

```bash
docker build -t hrcs-api .
docker run -p 3000:3000 \
  -e DATABASE_URL=... \
  -e JWT_SECRET=... \
  hrcs-api
```

## Development Notes

- Use `bunx prisma migrate dev --name <name>` for schema changes
- Use `bunx prisma studio` to inspect the DB
- Logging is structured (Pino); configure level via env

## License

MIT. See `LICENSE`.
