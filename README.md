# 🍔 FoodOrder — Role-Based Food Ordering Platform

A production-ready, full-stack food ordering system built with **NestJS**, **GraphQL**, **PostgreSQL**, **Next.js**, and **Docker**. Features role-based access control, JWT authentication, and a premium dark-mode UI.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Features](#-features)
- [User Roles](#-user-roles)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Docker Deployment](#-docker-deployment)
- [Documentation](#-documentation)
- [Screenshots](#-screenshots)

---

## 🎯 Overview

FoodOrder is a complete food ordering ecosystem that connects customers with restaurants. It provides:

- **Customers** can browse restaurants, build orders, manage payments, and track order status
- **Managers** can oversee assigned restaurants and manage regional orders
- **Admins** have full platform control — users, restaurants, menus, orders, and payments

The platform enforces **country-level restrictions** and **role-based permissions** on every operation.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | NestJS | Server framework with modular architecture |
| **API** | GraphQL + Apollo Server | Type-safe API with zero over-fetching |
| **Database** | PostgreSQL + Prisma ORM | Relational database with type-safe queries |
| **Auth** | JWT + Passport | Token-based authentication with RBAC |
| **Frontend** | Next.js 16 (App Router) | React framework with SSR/SSG |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with dark mode |
| **State** | Apollo Client v4 | GraphQL client with React integration |
| **Deploy** | Docker + Docker Compose | Containerized deployment |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│         Next.js 16 + Apollo Client v4               │
│    ┌──────────┬──────────┬──────────────────┐       │
│    │  Auth    │  Cart    │     Pages        │       │
│    │ Context  │ Context  │  (9 routes)      │       │
│    └────┬─────┴────┬─────┴────────┬─────────┘       │
│         └──────────┴──────────────┘                  │
│                    │ GraphQL                         │
├────────────────────┼────────────────────────────────┤
│                    │                                 │
│              BACKEND API                             │
│         NestJS + Apollo Server                       │
│    ┌──────────┬──────────┬──────────────────┐       │
│    │  Auth    │  Orders  │  Restaurants     │       │
│    │ Module   │  Module  │  Module          │       │
│    ├──────────┼──────────┼──────────────────┤       │
│    │  Users   │ Payments │  Guards          │       │
│    │ Module   │  Module  │  (JWT/Role)      │       │
│    └────┬─────┴────┬─────┴────────┬─────────┘       │
│         └──────────┴──────────────┘                  │
│                    │ Prisma ORM                      │
├────────────────────┼────────────────────────────────┤
│                    │                                 │
│            PostgreSQL Database                       │
│    Users · Roles · Countries · Restaurants           │
│    MenuItems · Orders · OrderItems · PaymentMethods  │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Customer Features
- 🔐 Register / Login with JWT authentication
- 🍕 Browse restaurants and view menus with prices
- 🛒 Add items to cart with quantity controls
- 📦 Place orders with automatic price calculation
- 📊 View order history with status tracking (CREATED → PAID → COMPLETED)
- ❌ Cancel orders (only if status is CREATED)
- 💳 Add, view, and delete payment methods

### Admin Features
- 👥 View and manage all users
- 🏪 Create restaurants and add menu items
- 📋 View all orders across the platform
- ✅ Update order status (PAID, COMPLETED)

### Platform Features
- 🔒 Role-Based Access Control (RBAC) with JWT guards
- 🌍 Country-level validation for operations
- 🚀 GraphQL API with type-safe queries and mutations
- 🎨 Premium dark-mode UI with glassmorphism effects
- 📱 Responsive design (mobile + desktop)
- 🐳 Docker-ready with one-command deployment

---

## 👤 User Roles

| Role | ID | Permissions |
|------|-----|------------|
| **Member** | 1 | Browse restaurants, place orders, manage own payments, cancel own orders |
| **Manager** | 2 | View restaurants, manage & cancel assigned orders |
| **Admin** | 3 | Full system control — users, restaurants, menus, all orders, payments |

---

## 📂 Project Structure

```
Food Ordering System/
├── backend/                    # NestJS Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (8 models)
│   │   └── seed.ts             # Seed roles & countries
│   ├── src/
│   │   ├── auth/               # JWT auth, guards, decorators
│   │   │   ├── guards/         # JwtAuthGuard, RolesGuard, CountryValidation
│   │   │   ├── strategies/     # JWT strategy
│   │   │   └── decorators/     # @CurrentUser, @Roles
│   │   ├── users/              # User CRUD + GraphQL resolvers
│   │   ├── restaurants/        # Restaurant + MenuItem management
│   │   ├── orders/             # Order creation, status, cancellation
│   │   ├── payment-methods/    # Payment method CRUD
│   │   ├── prisma/             # Prisma service layer
│   │   ├── utils/              # Password hashing utility
│   │   └── main.ts             # App bootstrap + CORS
│   ├── Dockerfile              # Multi-stage Docker build
│   ├── .env                    # DATABASE_URL, JWT_SECRET
│   └── package.json
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing page (6 sections)
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Registration page
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx          # Welcome dashboard
│   │   │   │   ├── restaurants/      # Browse & order
│   │   │   │   ├── orders/           # Order history
│   │   │   │   │   └── checkout/     # Cart & checkout
│   │   │   │   ├── payments/         # Payment methods
│   │   │   │   └── admin/            # Admin panel
│   │   │   ├── globals.css     # Design system (Tailwind v4)
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── providers.tsx   # Apollo + Auth + Cart providers
│   │   ├── components/
│   │   │   └── navigation/     # Navbar component
│   │   ├── context/
│   │   │   ├── AuthContext.tsx  # Authentication state
│   │   │   └── CartContext.tsx  # Shopping cart state
│   │   └── lib/
│   │       ├── apollo-client.tsx    # Apollo Client config
│   │       └── graphql-queries.ts   # All GraphQL operations
│   ├── Dockerfile              # Multi-stage Docker build
│   ├── .env.local              # NEXT_PUBLIC_GRAPHQL_URL
│   └── package.json
│
├── docs/                       # Project Documentation
│   ├── PRD.md                  # Product Requirements
│   ├── ARCHITECTURE.md         # Database Architecture
│   ├── TECH_STACK.md           # Technology Decisions
│   ├── DESIGN.md               # UI/UX Design Specs
│   ├── BACKEND_SETUP.md        # Backend Setup Guide
│   ├── MANUAL_TESTING_GUIDE.md # Manual Testing Guide
│   └── COMPLETE_TESTING_GUIDE.md # Full Testing Guide
│
├── docker-compose.yml          # Full-stack deployment
├── full-test.ps1               # Automated E2E test suite
├── todo.md                     # 83-step implementation plan
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **PostgreSQL** 14+ 
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/food-ordering-system.git
cd food-ordering-system
```

### 2. Setup Backend
```bash
cd backend
npm install

# Configure environment
# Edit .env with your database credentials:
# DATABASE_URL="postgresql://user:password@localhost:5432/food_ordering"
# JWT_SECRET="your-secret-key"

# Run database migrations
npx prisma migrate dev

# Seed initial data (roles & countries)
npx ts-node prisma/seed.ts

# Start the backend
npm run start:dev
```
Backend runs on: **http://localhost:3000/graphql**

### 3. Setup Frontend
```bash
cd frontend
npm install

# Configure environment
# Edit .env.local:
# NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/graphql

# Start the frontend
npm run dev
```
Frontend runs on: **http://localhost:3001**

---

## 📡 API Reference

### Authentication
| Operation | Type | Description |
|-----------|------|-------------|
| `register` | Mutation | Create new user account |
| `login` | Mutation | Authenticate and receive JWT |

### Restaurants & Menus
| Operation | Type | Role | Description |
|-----------|------|------|-------------|
| `restaurants` | Query | Any Auth | List all restaurants with menus |
| `createRestaurant` | Mutation | Admin | Create a new restaurant |
| `addMenuItem` | Mutation | Admin | Add item to restaurant menu |

### Orders
| Operation | Type | Role | Description |
|-----------|------|------|-------------|
| `createOrder` | Mutation | Member | Place a new order |
| `myOrders` | Query | Member | View own orders |
| `allOrders` | Query | Admin | View all orders |
| `updateOrderStatus` | Mutation | Admin | Change order status |
| `cancelOrder` | Mutation | Member | Cancel own CREATED order |

### Payment Methods
| Operation | Type | Role | Description |
|-----------|------|------|-------------|
| `addPaymentMethod` | Mutation | Member | Add payment method |
| `myPaymentMethods` | Query | Member | View own payment methods |
| `deletePaymentMethod` | Mutation | Member | Remove payment method |

### Users
| Operation | Type | Role | Description |
|-----------|------|------|-------------|
| `users` | Query | Admin | List all users |

---

## 🧪 Testing

### Automated End-to-End Tests
Run all 37 tests with one command:
```powershell
powershell -ExecutionPolicy Bypass -File full-test.ps1
```

| Section | Tests |
|---------|-------|
| API Health | 1 |
| Registration + duplicate check | 3 |
| Login + error handling | 4 |
| Authorization + role guards | 3 |
| Menu item creation | 3 |
| Restaurant browsing | 2 |
| Order flow (create, update, cancel) | 6 |
| Payment methods CRUD | 4 |
| Admin user management | 2 |
| Frontend page health (9 pages) | 9 |
| **Total** | **37** |

### Manual Testing
See `docs/COMPLETE_TESTING_GUIDE.md` for a 40-item step-by-step testing checklist.

---

## 🐳 Docker Deployment

Deploy the entire stack with one command:

```bash
docker-compose up -d --build
```

| Service | Port | Container |
|---------|------|-----------|
| PostgreSQL | 5432 | foodorder-db |
| Backend API | 3000 | foodorder-backend |
| Frontend | 3001 | foodorder-frontend |

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`docs/PRD.md`](docs/PRD.md) | Product Requirements Document |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Database schema & relationships |
| [`docs/TECH_STACK.md`](docs/TECH_STACK.md) | Technology decisions & rationale |
| [`docs/DESIGN.md`](docs/DESIGN.md) | UI/UX design specifications |
| [`docs/BACKEND_SETUP.md`](docs/BACKEND_SETUP.md) | Backend setup instructions |
| [`docs/COMPLETE_TESTING_GUIDE.md`](docs/COMPLETE_TESTING_GUIDE.md) | Full testing guide with 40 items |
| [`todo.md`](todo.md) | 83-step implementation plan |

---

## 📸 Screenshots

### Landing Page
Professional SaaS-style marketing page with hero section, feature cards, how-it-works steps, and conversion CTAs.

### Login & Register
Premium dark glassmorphism design with form validation and error handling.

### Dashboard
Role-aware navigation with restaurant browsing, cart management, order tracking, and payment methods.

### Admin Panel
Tabbed interface for managing users, restaurants, menu items, and all orders with status controls.

---

## 🗄 Database Schema

```
User ──────── Role (Member / Manager / Admin)
  │
  ├── Order ────── OrderItem ────── MenuItem ────── Restaurant
  │                                                      │
  └── PaymentMethod                                  Country
```

**8 Models**: User, Role, Country, Restaurant, MenuItem, Order, OrderItem, PaymentMethod

---

## 📝 License

This project is [UNLICENSED](LICENSE) — private use only.

---

<p align="center">
  Built with ❤️ using NestJS, GraphQL, Next.js & PostgreSQL
</p>
