# Backend Architecture Handoff

## Overview
This document serves as the architectural blueprint for the backend implementation of the Mohammad Rehan Platform. The frontend is fully completed, production-ready, and awaits API integration.

**Target AI Agent:** Claude Code (or similar capable backend development agent).

## Core Backend Stack
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Auth.js (NextAuth) integrated with NestJS via secure HTTP-Only Session Cookies.
- **API Style:** REST API with versioned routing (e.g., `/api/v1/`).

---

## 1. Authentication Strategy

**Strict Requirement:** Do NOT use local Storage JWT Bearer tokens. 
- You must configure secure, HTTP-only, SameSite session cookies.
- Use `Auth.js` (NextAuth.js) on the Next.js frontend to handle the session lifecycle.
- The NestJS backend must validate incoming session cookies/tokens passed securely from the Next.js API routes or middleware.
- **Roles:** The system requires two roles: `ADMIN` and `MEMBER`. 

---

## 2. Prisma Schema Proposal

You will need to initialize Prisma and migrate the following schema into PostgreSQL.

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  MEMBER
}

enum GoalStatus {
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  passwordHash  String?   // If not using OAuth exclusively
  role          Role      @default(MEMBER)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  goals         Goal[]
  messages      Message[]
}

model Goal {
  id            String     @id @default(uuid())
  title         String
  description   String?
  status        GoalStatus @default(IN_PROGRESS)
  progress      Int        @default(0) // 0 to 100
  month         Int        // 1-12
  year          Int
  userId        String
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model BlogPost {
  id            String    @id @default(uuid())
  title         String
  slug          String    @unique
  content       String    @db.Text
  category      String
  readTime      String
  published     Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Message {
  id            String    @id @default(uuid())
  name          String
  email         String
  content       String    @db.Text
  isRead        Boolean   @default(false)
  userId        String?   // Optional: if message is from a registered user
  user          User?     @relation(fields: [userId], references: [id], onDelete: SetNull)
  createdAt     DateTime  @default(now())
}
```

---

## 3. Required REST API Endpoints (v1)

The frontend currently uses mock data. You need to implement the following NestJS controllers and hook them up to the Prisma services.

### Auth & Users (`/api/v1/users`)
- `GET /me` - Returns current authenticated user (reads session cookie).
- `GET /` - (Admin Only) Returns list of recent users for the Admin Dashboard Table.
- `GET /analytics` - (Admin Only) Returns aggregated user registration data grouped by date for Recharts.

### Goals (`/api/v1/goals`)
- `GET /` - (Member) Returns the user's goals for the current month.
- `POST /` - (Admin/Member) Creates a new goal.
- `PATCH /:id` - Updates goal progress/status.

### Blog (`/api/v1/posts`)
- `GET /` - (Public) Returns published posts for the frontend `/blog` page.
- `POST /` - (Admin Only) Creates a new draft/published post.
- `PATCH /:id` - (Admin Only) Updates post content.

### Messages & Contact (`/api/v1/messages`)
- `POST /` - (Public) Receives form submissions from the `/contact` page.
- `GET /` - (Admin Only) Retrieves messages for the admin inbox.

---

## 4. Claude Code Implementation Steps

1. **Initialize Backend:** Run `npx @nestjs/cli new backend` alongside the existing `frontend` folder.
2. **Setup Prisma:** Initialize Prisma in the NestJS folder, copy the schema above, and run migrations against a local Postgres instance.
3. **Configure Auth Guard:** Implement a global/route-specific NestJS Guard that reads the NextAuth session cookie from the request headers.
4. **Build Services:** Scaffold the resources (`nest g resource users`, `nest g resource goals`, etc.) and inject the `PrismaService`.
5. **Connect Frontend:** Remove the static mock data in `frontend/src/app/member/page.tsx`, `frontend/src/app/admin/page.tsx`, and `frontend/src/app/blog/page.tsx`. Replace them with native `fetch` or `SWR`/`React Query` hooks calling your new `http://localhost:4000/api/v1/...` endpoints.

*End of Handoff Document.*
