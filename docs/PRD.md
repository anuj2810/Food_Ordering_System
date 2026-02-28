1. Product Overview

The Role-Based Food Ordering Application enables users to browse restaurants, place food orders, manage payments, and track orders based on predefined access roles.

The system supports role-based authorization and country-level restrictions, ensuring controlled feature accessibility across different user types and regions.

2. Objectives

Provide seamless online food ordering.

Implement secure role-based access control.

Enable country-based user restriction.

Ensure scalable backend using GraphQL architecture.

Deliver responsive modern UI experience.

3. User Roles
1. Admin

Full system control.

Permissions

Manage users and roles

Manage restaurants

View all orders

Cancel any order

Manage payment configurations

Configure country restrictions

2. Manager

Operational management role.

Permissions

View restaurants

Manage orders under assigned scope

Cancel orders

View payment status

Manage member payment methods

3. Member

End customer.

Permissions

View restaurants

Create orders

Checkout payment

Cancel own orders

Manage personal payment methods

4. Supported Countries (Restriction Layer)

Users are allowed access only if registered under:

🇮🇳 India

🇺🇸 America

Rules

Country assigned during registration.

Backend validates country before authentication.

Restricted users cannot access ordering features.

5. Core Features
5.1 View Restaurants

Users can:

Browse restaurant list

View menu items

Filter restaurants

Access

Admin ✅

Manager ✅

Member ✅

5.2 Create Orders

Members select food items and create orders.

Flow

Select restaurant

Add items to cart

Confirm order

Access

Member ✅

Manager (optional) ✅

Admin ❌

5.3 Checkout Payment

Users complete payment using saved methods.

Capabilities

Payment method selection

Payment confirmation

Order status update

5.4 Cancel Orders

Cancellation depends on role:

Role	Permission
Admin	Any order
Manager	Managed orders
Member	Own orders only
5.5 Manage Payment Methods

Users can:

Add payment method

Update payment method

Delete payment method

Set default payment option

6. Functional Requirements
Authentication

JWT-based authentication

Role-based authorization (RBAC)

Country validation middleware

Order Management

Order lifecycle:

Created

Paid

Cancelled

Completed

Payment Management

Secure payment storage

Tokenized payment handling

7. Non-Functional Requirements
Requirement	Description
Performance	API response < 300ms
Scalability	Modular microservice-ready
Security	JWT + Role Guards
Availability	99.9% uptime
Maintainability	Clean architecture
8. System Architecture
Backend

Technology Stack

NestJS

GraphQL

Prisma ORM

PostgreSQL

Architecture

Modular NestJS structure

GraphQL Resolver Layer

Service Layer

Prisma Data Layer

Frontend

Technology Stack

Next.js

Tailwind CSS

Apollo Client

Architecture

Component-based UI

GraphQL state management

Role-aware routing

9. High-Level Database Models
User

id

name

email

role

country

Restaurant

id

name

location

menuItems

Order

id

userId

restaurantId

status

totalAmount

PaymentMethod

id

userId

type

token

10. API Layer (GraphQL Examples)
Queries

restaurants

orders

paymentMethods

Mutations

createOrder

checkoutPayment

cancelOrder

addPaymentMethod

11. Role-Based Access Control

Implemented using:

NestJS Guards

GraphQL Context

JWT Claims

Example:

@Roles('ADMIN')
@UseGuards(RoleGuard)
12. Success Metrics

Order completion rate

Payment success rate

User retention

Average checkout time

System response latency

13. Future Enhancements

Real-time order tracking

Delivery partner integration

Multi-currency payments

Restaurant ratings & reviews

Push notifications


Country Validation Logic

A user can interact with restaurants only if both belong to the same country.

IF User.country == Restaurant.country
    Allow Access
ELSE
    Deny Access
Enforcement Points

During restaurant listing

Order creation

Checkout payment

GraphQL resolver validation

Backend Example (NestJS Guard Logic)
User.country === Restaurant.country

If mismatch:

ForbiddenException("Country access restricted")