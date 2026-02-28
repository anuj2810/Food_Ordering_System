1. System Overview

This architecture defines a scalable, production-ready full-stack web platform using a TypeScript-first ecosystem with unified GraphQL communication, containerized deployment, and modern authorization models.

The system follows:

Frontend → BFF/API Layer → Database

GraphQL-Driven Communication

Stateless Authentication

Fine-Grained Authorization (RBAC + ReBAC)

Cloud-Native Deployment

2. High-Level Architecture
Client Browser
      │
      ▼
Next.js 14 (Frontend)
Apollo Client
      │
      ▼
GraphQL API Gateway
(NestJS Backend)
      │
Prisma ORM
      │
PostgreSQL

Deployment:

Frontend → Vercel
Backend → Railway
Database → Railway PostgreSQL
Containers → Docker
3. Monorepo Project Structure
project-root/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── graphql/
│   ├── lib/
│   ├── hooks/
│   ├── styles/
│   └── apollo/
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── permissions/
│   │   ├── relationships/
│   │   ├── graphql/
│   │   └── prisma/
│   │
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
├── docker/
│   ├── frontend.Dockerfile
│   └── backend.Dockerfile
│
└── docker-compose.yml
4. Frontend Architecture
Technology

Next.js 14 (App Router)

TypeScript

Tailwind CSS

Apollo Client

4.1 Application Layers
✅ Presentation Layer
components/
layouts/
ui/

Reusable UI using Tailwind utility system.

✅ Routing Layer (Next.js App Router)
app/
 ├── layout.tsx
 ├── page.tsx
 ├── dashboard/
 └── admin/

Supports:

Server Components

Streaming rendering

Route segmentation

✅ Data Layer — Apollo Client

Central GraphQL communication.

apollo/
 ├── client.ts
 └── provider.tsx

Responsibilities:

Query caching

Mutation handling

Authentication headers

Error interception

✅ Auth State Handling

JWT stored securely.

Flow:

Login → JWT Issued → Stored → Attached to GraphQL headers

Apollo automatically attaches:

Authorization: Bearer <JWT>
4.2 Frontend Responsibility

UI rendering

GraphQL queries/mutations

Session handling

Permission-aware UI rendering

Optimistic updates

5. Backend Architecture (NestJS)
Core Design Pattern

Modular + Domain Driven Architecture.

5.1 Backend Module Structure
src/
 ├── app.module.ts
 ├── auth/
 ├── users/
 ├── roles/
 ├── permissions/
 ├── relationships/
 ├── graphql/
 └── prisma/

Each module contains:

resolver.ts
service.ts
module.ts
dto/
entities/
5.2 GraphQL Layer

NestJS GraphQL acts as unified API.

Responsibilities:

Query Resolution

Mutation Execution

Authorization Guards

Schema generation

Example flow:

GraphQL Resolver
      ↓
Service Layer
      ↓
Prisma ORM
      ↓
PostgreSQL
6. Database Architecture (PostgreSQL + Prisma)
6.1 Prisma Responsibilities

Type-safe DB access

Schema migrations

Relationship modeling

Query optimization

6.2 Core Data Models
Users
User
- id
- email
- password
- roleId
Roles (RBAC)
Role
- id
- name
Permissions
Permission
- id
- action
- resource
Relationships (ReBAC)
Relationship
- subjectUserId
- objectId
- relationType

Example:

User A → OWNER → Project X
User B → VIEWER → Project X
7. Authentication System
JWT Authentication Flow
Login Request
     ↓
Credential Validation
     ↓
JWT Issued
     ↓
Client Stores Token
     ↓
GraphQL Requests Authorized

JWT Contains:

userId
role
permissions
8. Authorization Architecture
8.1 RBAC (Role-Based Access Control)

Access determined by role.

Example:

Role	Access
Admin	Full
Editor	Modify
Viewer	Read

Implemented using NestJS Guards.

8.2 ReBAC (Relationship-Based Access Control)

Access based on ownership or relationships.

Example checks:

Can user edit document?
→ Is user OWNER of document?

Stored in relationship tables.

Used for:

Shared resources

Teams

Collaboration systems

9. GraphQL Security Layer

Authorization sequence:

JWT Guard
   ↓
RBAC Guard
   ↓
ReBAC Guard
   ↓
Resolver Execution

Ensures:

Authentication

Role permission validation

Resource relationship validation

10. Docker Architecture
Backend Container
Node Runtime
NestJS App
Prisma Client
Frontend Container
Next.js Production Build
Apollo Client
docker-compose

Services:

frontend
backend
postgres

Provides:

Local development parity

Environment isolation

Reproducible builds

11. Deployment Strategy
Frontend Deployment — Vercel

Automatic builds

Edge rendering

Environment variables

Global CDN delivery

Flow:

Git Push → Vercel Build → Deploy
Backend Deployment — Railway

Railway hosts:

NestJS container

PostgreSQL database

Flow:

Docker Image → Railway → Auto Deploy
Environment Configuration
DATABASE_URL
JWT_SECRET
GRAPHQL_ENDPOINT

Managed separately per environment.

12. Production Request Lifecycle
User Action
   ↓
Next.js UI
   ↓
Apollo GraphQL Request
   ↓
NestJS Resolver
   ↓
JWT Validation
   ↓
RBAC + ReBAC Check
   ↓
Prisma Query
   ↓
PostgreSQL
   ↓
Response Returned
13. Scalability Characteristics

✅ Stateless backend
✅ Horizontal scaling ready
✅ Typed end-to-end system
✅ Central API contract (GraphQL)
✅ Container portable deployment

14. Security Model

JWT authentication

Resolver-level authorization

Role validation

Relationship ownership checks

Database isolation via Prisma

15. Production Readiness Features

✅ Type safety across stack
✅ Modular backend domains
✅ Optimized GraphQL caching
✅ Containerized environments
✅ Cloud deployment separation
✅ Fine-grained access control

✅ Final Result

A modern enterprise-grade architecture featuring:

Next.js 14 reactive frontend

NestJS GraphQL backend

Prisma + PostgreSQL persistence

JWT + RBAC + ReBAC authorization

Dockerized infrastructure

Vercel + Railway cloud deployment