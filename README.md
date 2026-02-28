# Role-Based Food Ordering Application

## Project Overview
The Role-Based Food Ordering Application is a full-stack platform that enables users to browse restaurants, place food orders, manage payments, and track orders based on predefined access roles. The platform also natively supports country-level restrictions, ensuring controlled feature accessibility across different user types and regions.

### Key Roles
- **Admin**: Full system control (Users, Roles, Restaurants, all Orders, Payment Configs, Country Restrictions).
- **Manager**: Operational management under an assigned scope (View restaurants, Manage & Cancel assigned orders).
- **Member**: End customer (Browse restaurants, Create orders, Checkout, Manage personal payments, Cancel own orders).

## Tech Stack
- **Backend Engine**: NestJS
- **API Architecture**: GraphQL & Apollo Server
- **Database**: PostgreSQL with Prisma ORM
- **Frontend Framework**: Next.js with Apollo Client
- **Styling**: Tailwind CSS
- **Authentication**: JWT & Passport with Role-Based Access Control (RBAC)

## Current Progress
We have just completed the **Planning and Requirements Phase**. All foundational documentation has been prepared to guide development:

1. **Product Requirements Document (PRD)** (`docs/PRD.md`): Defined the core objectives, role permissions, functional requirements, and core flows.
2. **Database Architecture** (`docs/ARCHITECTURE.md`): Structured the relational 3NF database schema mapping out Users, Roles, Countries, Restaurants, Menu Items, Orders, and Payment Methods.
3. **Tech Stack & Design specs** (`docs/TECH_STACK.md`, `docs/Design.md`): Solidified our frontend and backend tech choices along with design specifications.
4. **Atomic Task Breakdown** (`todo.md`): Successfully generated the exact sequence of 83 implementation tasks to bring the platform to life, prioritizing the backend first (NestJS/Prisma), followed by the frontend (Next.js/Apollo).

## Next Steps
Development will begin shortly, executing the steps outlined sequentially in `todo.md`:
1. Initialize the NestJS backend repository and configure TypeScript.
2. Set up the environment configs and install the PostgreSQL driver.
3. Implement Prisma ORM and declare the initial database models (User, Restaurant, Order, PaymentMethod).
4. Run the first set of database migrations.
