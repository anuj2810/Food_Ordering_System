# 🏗️ Backend Setup Guide (NestJS + Prisma + GraphQL)

This guide provides a complete, step-by-step process for initializing and configuring a scalable, production-ready NestJS backend.

## 1️⃣ Project Initialization

First, we need to install the NestJS CLI globally and bootstrap the core application structure using `npm`.

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create a new NestJS project named 'backend'
nest new backend --package-manager npm
```

## 2️⃣ Install Core Dependencies

Navigate into the `backend` directory and install the required dependencies for GraphQL, Prisma, and Authentication.

```bash
cd backend

# Install GraphQL & Apollo Server dependencies
npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql

# Install Prisma ORM
npm install prisma --save-dev
npm install @prisma/client

# Install Authentication dependencies
npm install @nestjs/passport passport passport-jwt bcrypt
npm install @types/passport-jwt @types/bcrypt --save-dev
```

## 3️⃣ Prisma Setup

Initialize Prisma to set up the default schema file and environment variables configuration.

```bash
npx prisma init
```

This command creates a `prisma/schema.prisma` file and a `.env` file in the root of your `backend` directory.

Next, open the `.env` file and configure your PostgreSQL connection string:

```env
# backend/.env
DATABASE_URL="postgresql://user:pass@localhost:5432/food"
```

## 4️⃣ Prisma Schema Design

Open `prisma/schema.prisma` and replace its contents with the production-ready schema below. This schema includes all the required relationships, enums, timestamps, and foreign keys mapped according to 3NF standards.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// -----------------------------------------------------------------------------
// Core Enums
// -----------------------------------------------------------------------------

enum OrderStatus {
  CREATED
  PAID
  COMPLETED
  CANCELLED
}

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

model Country {
  id           Int          @id @default(autoincrement())
  countryName  String
  isoCode      String       @unique
  currencyCode String
  
  users        User[]
  restaurants  Restaurant[]
  
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Role {
  id          Int      @id @default(autoincrement())
  roleName    String   @unique
  description String?
  
  users       User[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model User {
  id             Int             @id @default(autoincrement())
  firstName      String
  lastName       String
  email          String          @unique
  phoneNumber    String?
  passwordHash   String
  isActive       Boolean         @default(true)
  
  roleId         Int
  role           Role            @relation(fields: [roleId], references: [id])
  countryId      Int
  country        Country         @relation(fields: [countryId], references: [id])
  
  orders         Order[]
  paymentMethods PaymentMethod[]

  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

model Restaurant {
  id          Int        @id @default(autoincrement())
  name        String
  description String?
  address     String
  phoneNumber String?
  isActive    Boolean    @default(true)
  
  countryId   Int
  country     Country    @relation(fields: [countryId], references: [id])
  
  menuItems   MenuItem[]
  orders      Order[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model MenuItem {
  id           Int         @id @default(autoincrement())
  name         String
  description  String?
  price        Float
  isAvailable  Boolean     @default(true)
  
  restaurantId Int
  restaurant   Restaurant  @relation(fields: [restaurantId], references: [id])
  
  orderItems   OrderItem[]

  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  
  // Ensures menu item names are unique per restaurant
  @@unique([restaurantId, name])
}

model Order {
  id           Int         @id @default(autoincrement())
  orderStatus  OrderStatus @default(CREATED)
  totalAmount  Float
  
  userId       Int
  user         User        @relation(fields: [userId], references: [id])
  restaurantId Int
  restaurant   Restaurant  @relation(fields: [restaurantId], references: [id])
  
  items        OrderItem[]

  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

model OrderItem {
  id         Int      @id @default(autoincrement())
  quantity   Int
  unitPrice  Float
  subtotal   Float

  orderId    Int
  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuItemId Int
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id], onDelete: Restrict)

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model PaymentMethod {
  id         Int      @id @default(autoincrement())
  methodName String
  provider   String
  token      String?
  isActive   Boolean  @default(true)

  userId     Int
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## 5️⃣ Database Migration

Once you have defined the models in `schema.prisma` and configured your `.env` database URL, you need to create and apply the initial migration to your PostgreSQL database.

```bash
npx prisma migrate dev --name init
```

### What this command does:
1. **Reads your Prisma schema file** and generates a SQL migration file inside the `prisma/migrations` folder.
2. **Executes the SQL against your PostgreSQL database**, dynamically provisioning the necessary tables, columns, relations, and enums natively.
3. **Generates the Prisma Client** locally, modifying `@prisma/client` so you can interact with the new relational schema securely in your application code.

### When to run it:
Only run this command in **development environments**. Every time you add a new model or alter a column constraint in `schema.prisma`, you should run `npx prisma migrate dev --name <migration_description>` to synchronize the database with your code representation.

---

### 🚀 Next Steps
After completing these steps, the backend structure layout, connection string, database schemas, and Object-Relational Mapping (ORM) client will be fully configured and ready for application logic implementation.
