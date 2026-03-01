# 🧪 Complete Testing Guide — Food Ordering System

> This guide covers **every testable component** in the project with both **automated** and **manual** methods.

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Quick Automated Test (1 Command)](#-quick-automated-test)
3. [Backend API Tests (Manual)](#-backend-api-tests)
4. [Frontend UI Tests (Manual)](#-frontend-ui-tests)
5. [Docker Tests](#-docker-tests)
6. [Database Tests](#-database-tests)

---

## 🔧 Prerequisites

Before running any tests, make sure these services are running:

### Step 1: Start PostgreSQL
Make sure your PostgreSQL database is running and accessible.

### Step 2: Start Backend
```bash
cd backend
npm run start:dev
```
Wait for: `Nest application successfully started`
Backend runs on: **http://localhost:3000/graphql**

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```
Wait for: `✓ Ready`
Frontend runs on: **http://localhost:3001**

### Step 4: Seed Database (first time only)
```bash
cd backend
npx ts-node prisma/seed.ts
```
This creates the Roles (Member/Manager/Admin) and Countries.

---

## ⚡ Quick Automated Test

Run all tests with **one command** from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File full-test.ps1
```

This runs **35+ tests** automatically covering:

| Section | What It Tests | # Tests |
|---------|--------------|---------|
| API Health | GraphQL endpoint accessible | 1 |
| Registration | Register admin, member, duplicate check | 3 |
| Login | Correct login, wrong password, wrong email | 4 |
| Authorization | Unauthenticated access, role guards | 3 |
| Menu Items | Admin creates 3 menu items | 3 |
| Browsing | Fetch restaurants with menus | 2 |
| Order Flow | Create, view, update status, cancel | 6 |
| Payments | Add, view, delete payment methods | 4 |
| Admin | Fetch all users, member denied | 2 |
| Frontend Pages | All 9 pages return HTTP 200 | 9 |

At the end you'll see:
```
========================================================
  TEST RESULTS
========================================================
  Total:  37
  Passed: 37
  Failed: 0
========================================================

  ALL TESTS PASSED! ✅
```

---

## 🔌 Backend API Tests

### Test 1: Backend is Running
Open browser → go to: `http://localhost:3000/graphql`

✅ **Expected**: You see the Apollo GraphQL Playground / Sandbox

---

### Test 2: Register a New User
In the Playground, paste:
```graphql
mutation {
  register(registerUserInput: {
    firstName: "John"
    lastName: "Doe"
    email: "john@test.com"
    password: "Test123!"
    roleId: 1
    countryId: 1
  }) {
    accessToken
    user { id email }
  }
}
```
✅ **Expected**: Returns `accessToken` and `user` object
📝 **Save the accessToken** — you need it for authenticated requests

---

### Test 3: Login
```graphql
mutation {
  login(loginUserInput: {
    email: "john@test.com"
    password: "Test123!"
  }) {
    accessToken
    user { id email }
  }
}
```
✅ **Expected**: Returns fresh JWT token

---

### Test 4: Login with Wrong Password
```graphql
mutation {
  login(loginUserInput: {
    email: "john@test.com"
    password: "WrongPass"
  }) {
    accessToken
  }
}
```
❌ **Expected**: Error message returned

---

### Test 5: Set Auth Header
Click **HTTP Headers** at bottom of Playground, add:
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

---

### Test 6: Create Restaurant (Admin Only)
First register an admin user (roleId: 3), login, set the admin token. Then:
```graphql
mutation {
  createRestaurant(createRestaurantInput: {
    name: "Pizza Palace"
    description: "Best pizza in town"
    address: "456 Oak Ave"
    phoneNumber: "555-7890"
    countryId: 1
  }) {
    id name isActive
  }
}
```
✅ **Expected**: Restaurant created with auto ID

---

### Test 7: Member Cannot Create Restaurant
Switch to member token, try the same mutation:

❌ **Expected**: `"Forbidden resource"` error

---

### Test 8: Add Menu Items
With admin token, add items (replace `RESTAURANT_ID`):
```graphql
mutation {
  addMenuItem(createMenuItemInput: {
    name: "Pepperoni Pizza"
    description: "Classic pepperoni"
    price: 14.99
    restaurantId: RESTAURANT_ID
  }) {
    id name price
  }
}
```
✅ **Expected**: Menu item created

---

### Test 9: Browse Restaurants with Menu
With any auth token:
```graphql
query {
  restaurants {
    id name
    menuItems { id name price isAvailable }
  }
}
```
✅ **Expected**: Restaurants with nested menu items

---

### Test 10: Place an Order
With member token:
```graphql
mutation {
  createOrder(createOrderInput: {
    restaurantId: RESTAURANT_ID
    items: [
      { menuItemId: ITEM_1_ID, quantity: 2 },
      { menuItemId: ITEM_2_ID, quantity: 1 }
    ]
  }) {
    id totalAmount orderStatus
    items { menuItemId quantity unitPrice subtotal }
  }
}
```
✅ **Expected**: Order created with `CREATED` status, correct `totalAmount`

---

### Test 11: View My Orders
```graphql
query {
  myOrders { id totalAmount orderStatus }
}
```

---

### Test 12: Admin Updates Order Status
With admin token:
```graphql
mutation {
  updateOrderStatus(orderId: ORDER_ID, status: "PAID") {
    id orderStatus
  }
}
```
✅ **Expected**: Status changes to `PAID`

---

### Test 13: Cancel Order
With member token (only `CREATED` orders can be cancelled):
```graphql
mutation {
  cancelOrder(orderId: ORDER_ID) {
    id orderStatus
  }
}
```
✅ **Expected**: Status changes to `CANCELLED`

---

### Test 14: Add Payment Method
```graphql
mutation {
  addPaymentMethod(createPaymentMethodInput: {
    methodName: "Visa Card"
    provider: "Stripe"
    token: "tok_visa_4242"
  }) {
    id methodName provider isActive
  }
}
```

---

### Test 15: View Payment Methods
```graphql
query {
  myPaymentMethods { id methodName provider isActive }
}
```

---

### Test 16: Delete Payment Method
```graphql
mutation {
  deletePaymentMethod(id: PAYMENT_ID)
}
```
✅ **Expected**: Returns `true`

---

### Test 17: Admin Views All Users
With admin token:
```graphql
query {
  findAll { id firstName lastName email roleId isActive }
}
```
✅ **Expected**: Returns all users

---

### Test 18: Unauthenticated Access
Remove the Authorization header completely, try any query:
```graphql
query { restaurants { id } }
```
❌ **Expected**: `"Unauthorized"` error

---

## 🌐 Frontend UI Tests

### Test F1: Landing Page
1. Open: `http://localhost:3001`
2. ✅ See "FoodOrder" branding, Sign In & Create Account buttons
3. Click **Sign In** → should go to `/login`

### Test F2: Registration Flow
1. Open: `http://localhost:3001/register`
2. Fill in all fields (First Name, Last Name, Email, Password, Role, Country)
3. Click **Create Account**
4. ✅ Should redirect to `/dashboard` with welcome message

### Test F3: Login Flow
1. Click **Sign Out** in navbar
2. Redirected to `/login`
3. Enter email/password from registration
4. Click **Sign In**
5. ✅ Should redirect to `/dashboard`

### Test F4: Navigation Bar
1. After login, verify navbar shows:
   - FoodOrder logo
   - Dashboard, Restaurants, Orders, Payments tabs
   - Admin tab (only if logged in as Admin, roleId: 3)
   - Role badge (Member/Admin)
   - Email and Sign Out button

### Test F5: Browse Restaurants
1. Click **Restaurants** in navbar
2. ✅ See list of restaurants
3. Click a restaurant → menu expands
4. Click **+ Add** on menu items → items added to cart
5. ✅ Cart badge appears in top-right with count and total

### Test F6: Checkout Flow
1. With items in cart, click the cart button
2. ✅ See checkout page with item list, quantities, total
3. Use **+/−** buttons to adjust quantities
4. Click **✕** to remove items
5. Click **Place Order**
6. ✅ See success confirmation with order ID

### Test F7: Order History
1. Click **Orders** in navbar
2. ✅ See your orders with status badges (CREATED, PAID, etc.)
3. For `CREATED` orders, click **Cancel Order**
4. ✅ Status changes to `CANCELLED`

### Test F8: Payment Methods
1. Click **Payments** in navbar
2. Click **+ Add Method**
3. Fill in Name, Provider, Token
4. Click **Save Payment Method**
5. ✅ New card appears in list
6. Click **Remove** to delete
7. ✅ Card disappears from list

### Test F9: Admin Dashboard (Admin Only)
1. Login with Admin account (roleId: 3)
2. Click **Admin** in navbar
3. ✅ See tabbed interface: Orders / Users / Restaurants
4. **Orders tab**: See all orders, use dropdown to update status
5. **Users tab**: See table of all registered users
6. **Restaurants tab**: Create new restaurant, add menu items

### Test F10: Route Protection
1. Logout → visit `http://localhost:3001/dashboard`
2. ✅ Redirected to `/login`
3. Login as Member → visit `http://localhost:3001/dashboard/admin`
4. ✅ Redirected to `/dashboard` (non-admin blocked)

---

## 🐳 Docker Tests

### Test D1: Build All Containers
```bash
docker-compose build
```
✅ **Expected**: All 3 images built successfully

### Test D2: Start All Services
```bash
docker-compose up -d
```
✅ **Expected**: 3 containers running (db, backend, frontend)

### Test D3: Check Container Health
```bash
docker-compose ps
```
✅ **Expected**: All containers show `Up` and `healthy`

### Test D4: Access Services
- Backend: `http://localhost:3000/graphql`
- Frontend: `http://localhost:3001`
- Database: `localhost:5432` (user: postgres, pass: postgres123)

### Test D5: Stop Services
```bash
docker-compose down
```
✅ **Expected**: All containers stopped

---

## 🗄️ Database Tests

### Test DB1: Check Prisma Migrations
```bash
cd backend
npx prisma migrate status
```
✅ **Expected**: All migrations applied

### Test DB2: View Data with Prisma Studio
```bash
cd backend
npx prisma studio
```
✅ Opens browser at `http://localhost:5555` showing all tables:
- User, Role, Country, Restaurant, MenuItem, Order, OrderItem, PaymentMethod

### Test DB3: Verify Seeded Data
In Prisma Studio, check:
- **Role** table: 3 rows (MEMBER, MANAGER, ADMIN)
- **Country** table: 4 rows (US, Canada, UK, India)

---

## 📊 Complete Test Checklist

| # | Test | Method | Status |
|---|------|--------|--------|
| 1 | Backend API accessible | Auto/Manual | ⬜ |
| 2 | Register Admin user | Auto/Manual | ⬜ |
| 3 | Register Member user | Auto/Manual | ⬜ |
| 4 | Duplicate email rejected | Auto | ⬜ |
| 5 | Login with correct credentials | Auto/Manual | ⬜ |
| 6 | Login with wrong password rejected | Auto/Manual | ⬜ |
| 7 | Login with fake email rejected | Auto | ⬜ |
| 8 | Unauthenticated request denied | Auto/Manual | ⬜ |
| 9 | Admin creates restaurant | Auto/Manual | ⬜ |
| 10 | Member cannot create restaurant | Auto/Manual | ⬜ |
| 11 | Admin adds menu items | Auto/Manual | ⬜ |
| 12 | Fetch restaurants with menus | Auto/Manual | ⬜ |
| 13 | Member creates order | Auto/Manual | ⬜ |
| 14 | Price calculation correct | Auto | ⬜ |
| 15 | Member views orders | Auto/Manual | ⬜ |
| 16 | Admin views all orders | Auto/Manual | ⬜ |
| 17 | Admin updates order status | Auto/Manual | ⬜ |
| 18 | Member cancels order | Auto/Manual | ⬜ |
| 19 | Add payment method | Auto/Manual | ⬜ |
| 20 | View payment methods | Auto/Manual | ⬜ |
| 21 | Delete payment method | Auto/Manual | ⬜ |
| 22 | Admin fetches all users | Auto/Manual | ⬜ |
| 23 | Member cannot fetch users | Auto | ⬜ |
| 24 | Landing page loads | Auto/Manual | ⬜ |
| 25 | Login page loads | Auto/Manual | ⬜ |
| 26 | Register page loads | Auto/Manual | ⬜ |
| 27 | Dashboard page loads | Auto/Manual | ⬜ |
| 28 | Restaurants page loads | Auto/Manual | ⬜ |
| 29 | Orders page loads | Auto/Manual | ⬜ |
| 30 | Checkout page loads | Auto/Manual | ⬜ |
| 31 | Payments page loads | Auto/Manual | ⬜ |
| 32 | Admin page loads | Auto/Manual | ⬜ |
| 33 | Login → dashboard redirect | Manual | ⬜ |
| 34 | Cart add/remove/quantity | Manual | ⬜ |
| 35 | Place order from UI | Manual | ⬜ |
| 36 | Route protection works | Manual | ⬜ |
| 37 | Docker build succeeds | Manual | ⬜ |
| 38 | Docker containers healthy | Manual | ⬜ |
| 39 | Database migrations applied | Manual | ⬜ |
| 40 | Seed data present | Manual | ⬜ |
