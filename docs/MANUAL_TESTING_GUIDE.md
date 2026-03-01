# 🧪 Backend API — Manual Testing Guide

> **Step-by-step guide to manually test every GraphQL endpoint using the Apollo Playground.**

---

## 📋 Prerequisites

1. **PostgreSQL** is running and accessible
2. **Database is migrated** — run if not done:
   ```bash
   cd backend
   npx prisma migrate dev
   ```
3. **Database is seeded** (Roles & Countries):
   ```bash
   npx ts-node prisma/seed.ts
   ```
4. **Start the server**:
   ```bash
   npm run start:dev
   ```
5. Open **GraphQL Playground** in your browser:
   ```
   http://localhost:3000/graphql
   ```

---

## 🔐 PHASE 1 — Authentication

### TEST 1: Register Admin User

Paste this into the Playground and click ▶️:

```graphql
mutation {
  register(registerUserInput: {
    firstName: "Admin"
    lastName: "User"
    email: "admin@foodorder.com"
    password: "Admin123!"
    roleId: 3
    countryId: 1
  }) {
    accessToken
    user {
      id
      email
    }
  }
}
```

✅ **Expected**: Returns `accessToken` and user `id` + `email`

> ⚠️ **IMPORTANT**: Copy the `accessToken` value — you will need it for Admin-protected requests.

---

### TEST 2: Register Member User

```graphql
mutation {
  register(registerUserInput: {
    firstName: "John"
    lastName: "Doe"
    email: "member@foodorder.com"
    password: "Member123!"
    roleId: 1
    countryId: 1
  }) {
    accessToken
    user {
      id
      email
    }
  }
}
```

✅ **Expected**: Returns `accessToken` and user details

> ⚠️ **IMPORTANT**: Copy this `accessToken` too — this is the Member token.

---

### TEST 3: Login (Admin)

```graphql
mutation {
  login(loginUserInput: {
    email: "admin@foodorder.com"
    password: "Admin123!"
  }) {
    accessToken
    user {
      id
      email
    }
  }
}
```

✅ **Expected**: Returns a fresh `accessToken` and user details

---

### TEST 4: Login (Member)

```graphql
mutation {
  login(loginUserInput: {
    email: "member@foodorder.com"
    password: "Member123!"
  }) {
    accessToken
    user {
      id
      email
    }
  }
}
```

✅ **Expected**: Same as above but for the Member account

---

### TEST 5: Login with Wrong Password

```graphql
mutation {
  login(loginUserInput: {
    email: "admin@foodorder.com"
    password: "WrongPassword"
  }) {
    accessToken
  }
}
```

❌ **Expected**: Returns an error like `"Invalid credentials"`

---

## 🔑 Setting the Authorization Header

For all the following tests, you need to set the **HTTP Headers** in the Playground.

Click the **"HTTP HEADERS"** tab at the bottom-left of the Playground and paste:

```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

Replace `YOUR_TOKEN_HERE` with the actual token from login/register.

> 💡 **Tip**: Keep two browser tabs open — one with Admin token, one with Member token.

---

## 🏪 PHASE 2 — Restaurant Management (Admin Only)

### TEST 6: Create Restaurant (Admin Token)

Set **Admin token** in headers, then:

```graphql
mutation {
  createRestaurant(createRestaurantInput: {
    name: "Burger Palace"
    description: "The best burgers in town"
    address: "123 Main Street, New York"
    phoneNumber: "555-1234"
    countryId: 1
  }) {
    id
    name
    description
    address
    phoneNumber
    isActive
    countryId
  }
}
```

✅ **Expected**: Returns the created restaurant with an `id`

> 📝 **Note down the restaurant `id`** — you need it for menu items and orders.

---

### TEST 7: Create Restaurant (Member Token — Should FAIL)

Switch to **Member token** in headers:

```graphql
mutation {
  createRestaurant(createRestaurantInput: {
    name: "Unauthorized Restaurant"
    description: "This should fail"
    address: "456 Elm Street"
    phoneNumber: "555-0000"
    countryId: 1
  }) {
    id
    name
  }
}
```

❌ **Expected**: Returns `"Forbidden resource"` error — Members cannot create restaurants.

---

## 🍔 PHASE 3 — Menu Items (Admin Only)

### TEST 8: Add Menu Item 1 (Admin Token)

Use Admin token. Replace `RESTAURANT_ID` with the ID from Test 6:

```graphql
mutation {
  addMenuItem(createMenuItemInput: {
    name: "Classic Cheeseburger"
    description: "Juicy beef patty with melted cheese"
    price: 12.99
    restaurantId: RESTAURANT_ID
  }) {
    id
    name
    description
    price
    isAvailable
    restaurantId
  }
}
```

✅ **Expected**: Returns the menu item with `id` and `price: 12.99`

> 📝 **Note down this menu item `id`** — you need it for orders.

---

### TEST 9: Add Menu Item 2 (Admin Token)

```graphql
mutation {
  addMenuItem(createMenuItemInput: {
    name: "French Fries"
    description: "Crispy golden fries with sea salt"
    price: 4.99
    restaurantId: RESTAURANT_ID
  }) {
    id
    name
    description
    price
    isAvailable
    restaurantId
  }
}
```

✅ **Expected**: Second menu item created

> 📝 **Note this `id` too.**

---

### TEST 10: Add Menu Item 3 (Admin Token)

```graphql
mutation {
  addMenuItem(createMenuItemInput: {
    name: "Chocolate Milkshake"
    description: "Rich and creamy chocolate shake"
    price: 5.49
    restaurantId: RESTAURANT_ID
  }) {
    id
    name
    price
  }
}
```

✅ **Expected**: Third menu item created

---

## 📋 PHASE 4 — Browsing Restaurants & Menus

### TEST 11: Fetch All Restaurants with Menu Items

Use **any authenticated token** (Admin or Member):

```graphql
query {
  restaurants {
    id
    name
    description
    address
    phoneNumber
    isActive
    countryId
    menuItems {
      id
      name
      description
      price
      isAvailable
    }
  }
}
```

✅ **Expected**: Returns all restaurants with their nested menu items

---

### TEST 12: Fetch Restaurants WITHOUT Token (Should FAIL)

Remove the Authorization header completely:

```graphql
query {
  restaurants {
    id
    name
  }
}
```

❌ **Expected**: Returns `"Unauthorized"` error

---

## 🛒 PHASE 5 — Order Flow

### TEST 13: Member Creates an Order (Member Token)

Switch to **Member token**. Replace `RESTAURANT_ID`, `MENU_ITEM_1_ID`, and `MENU_ITEM_2_ID`:

```graphql
mutation {
  createOrder(createOrderInput: {
    restaurantId: RESTAURANT_ID
    items: [
      { menuItemId: MENU_ITEM_1_ID, quantity: 2 },
      { menuItemId: MENU_ITEM_2_ID, quantity: 1 }
    ]
  }) {
    id
    totalAmount
    orderStatus
    userId
    restaurantId
    items {
      id
      menuItemId
      quantity
      unitPrice
      subtotal
    }
  }
}
```

✅ **Expected**:
- Order created with status `CREATED`
- `totalAmount` = (12.99 × 2) + (4.99 × 1) = **$30.97**
- Each item shows its `unitPrice` and `subtotal`

> 📝 **Note the order `id`** for later tests.

---

### TEST 14: Member Views Their Orders (Member Token)

```graphql
query {
  myOrders {
    id
    totalAmount
    orderStatus
    restaurantId
    items {
      menuItemId
      quantity
      unitPrice
      subtotal
    }
  }
}
```

✅ **Expected**: Returns the Member's orders (at least 1)

---

### TEST 15: Admin Views ALL Orders (Admin Token)

Switch to **Admin token**:

```graphql
query {
  allOrders {
    id
    userId
    restaurantId
    totalAmount
    orderStatus
    items {
      menuItemId
      quantity
    }
  }
}
```

✅ **Expected**: Returns ALL orders from ALL users

---

### TEST 16: Admin Updates Order Status to PAID (Admin Token)

Replace `ORDER_ID`:

```graphql
mutation {
  updateOrderStatus(orderId: ORDER_ID, status: "PAID") {
    id
    orderStatus
    totalAmount
  }
}
```

✅ **Expected**: `orderStatus` changes to `PAID`

---

### TEST 17: Admin Updates Order Status to COMPLETED (Admin Token)

```graphql
mutation {
  updateOrderStatus(orderId: ORDER_ID, status: "COMPLETED") {
    id
    orderStatus
  }
}
```

✅ **Expected**: `orderStatus` changes to `COMPLETED`

---

### TEST 18: Member Cancels Their Own Order (Member Token)

First create a **new order** (repeat Test 13), then cancel it.

Switch to **Member token**, replace `NEW_ORDER_ID`:

```graphql
mutation {
  cancelOrder(orderId: NEW_ORDER_ID) {
    id
    orderStatus
  }
}
```

✅ **Expected**: `orderStatus` changes to `CANCELLED`

---

## 💳 PHASE 6 — Payment Methods

### TEST 19: Member Adds a Payment Method (Member Token)

```graphql
mutation {
  addPaymentMethod(createPaymentMethodInput: {
    methodName: "Visa Credit Card"
    provider: "Stripe"
    token: "tok_visa_4242424242424242"
  }) {
    id
    methodName
    provider
    isActive
    userId
  }
}
```

✅ **Expected**: Payment method created and linked to the authenticated user

---

### TEST 20: Member Adds Another Payment Method (Member Token)

```graphql
mutation {
  addPaymentMethod(createPaymentMethodInput: {
    methodName: "PayPal"
    provider: "PayPal"
    token: "paypal_user123@email.com"
  }) {
    id
    methodName
    provider
    isActive
  }
}
```

✅ **Expected**: Second payment method created

---

### TEST 21: Member Views Their Payment Methods (Member Token)

```graphql
query {
  myPaymentMethods {
    id
    methodName
    provider
    token
    isActive
  }
}
```

✅ **Expected**: Returns both payment methods with `isActive: true`

---

### TEST 22: Member Deletes a Payment Method (Member Token)

Replace `PAYMENT_METHOD_ID`:

```graphql
mutation {
  deletePaymentMethod(id: PAYMENT_METHOD_ID)
}
```

✅ **Expected**: Returns `true`

Now re-run **Test 21** — the deleted method should no longer appear (soft-deleted).

---

## 👥 PHASE 7 — Admin User Management

### TEST 23: Admin Fetches All Users (Admin Token)

```graphql
query {
  findAll {
    id
    firstName
    lastName
    email
    isActive
    roleId
    countryId
  }
}
```

✅ **Expected**: Returns all registered users

---

### TEST 24: Member Tries to Fetch All Users (Should FAIL)

Switch to **Member token**:

```graphql
query {
  findAll {
    id
    email
  }
}
```

❌ **Expected**: Returns `"Forbidden resource"` — only Admins can view all users.

---

## 📊 Summary Checklist

| # | Test | Role | Expected |
|---|------|------|----------|
| 1 | Register Admin | — | ✅ Token + User |
| 2 | Register Member | — | ✅ Token + User |
| 3 | Login Admin | — | ✅ Token |
| 4 | Login Member | — | ✅ Token |
| 5 | Login Wrong Password | — | ❌ Error |
| 6 | Create Restaurant | Admin | ✅ Created |
| 7 | Create Restaurant | Member | ❌ Forbidden |
| 8 | Add Menu Item 1 | Admin | ✅ Created |
| 9 | Add Menu Item 2 | Admin | ✅ Created |
| 10 | Add Menu Item 3 | Admin | ✅ Created |
| 11 | Fetch Restaurants + Menus | Any Auth | ✅ List |
| 12 | Fetch Restaurants No Token | None | ❌ Unauthorized |
| 13 | Create Order | Member | ✅ $30.97 |
| 14 | View My Orders | Member | ✅ List |
| 15 | View All Orders | Admin | ✅ List |
| 16 | Update Status → PAID | Admin | ✅ Updated |
| 17 | Update Status → COMPLETED | Admin | ✅ Updated |
| 18 | Cancel Order | Member | ✅ Cancelled |
| 19 | Add Payment Method 1 | Member | ✅ Created |
| 20 | Add Payment Method 2 | Member | ✅ Created |
| 21 | View Payment Methods | Member | ✅ List |
| 22 | Delete Payment Method | Member | ✅ Soft-deleted |
| 23 | View All Users | Admin | ✅ List |
| 24 | View All Users | Member | ❌ Forbidden |
