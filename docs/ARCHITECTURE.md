# ARCHITECTURE.md

# 🏗️ Restaurant Ordering Platform — Database Architecture

---

## 1️⃣ System Overview

This system represents a **Restaurant Ordering Platform** that allows users to browse restaurants, view menu items, place orders, and complete payments using various payment methods.

The architecture follows **relational database design principles**, ensuring scalability, consistency, and maintainability suitable for production-grade environments. The system is normalized up to **Third Normal Form (3NF)** to minimize redundancy and maintain data integrity.

Target compatibility: **PostgreSQL / MySQL**

---

## 2️⃣ Entity Definitions

---

## 👤 User

**Description:**  
Represents customers using the platform to browse restaurants and place orders.

**Primary Key**
- `user_id`

**Attributes**
- `user_id` (PK)
- `first_name`
- `last_name`
- `email` (UNIQUE)
- `phone_number`
- `password_hash`
- `role_id`
- `country_id`
- `is_active`
- `created_at`
- `updated_at`

**Foreign Keys**
- `role_id → role.role_id`
- `country_id → country.country_id`

---

## 🛡️ Role

**Description:**  
Defines access control levels such as Admin, Customer, or Restaurant Owner.

**Primary Key**
- `role_id`

**Attributes**
- `role_id` (PK)
- `role_name` (UNIQUE)
- `description`
- `created_at`
- `updated_at`

---

## 🌍 Country

**Description:**  
Stores country-level geographic information for localization and regulatory purposes.

**Primary Key**
- `country_id`

**Attributes**
- `country_id` (PK)
- `country_name`
- `iso_code` (UNIQUE)
- `currency_code`
- `created_at`
- `updated_at`

---

## 🍽️ Restaurant

**Description:**  
Represents restaurants registered on the platform offering menu items.

**Primary Key**
- `restaurant_id`

**Attributes**
- `restaurant_id` (PK)
- `name`
- `description`
- `address`
- `phone_number`
- `country_id`
- `is_active`
- `created_at`
- `updated_at`

**Foreign Keys**
- `country_id → country.country_id`

---

## 📋 MenuItem

**Description:**  
Represents food or beverage items offered by a restaurant.

**Primary Key**
- `menu_item_id`

**Attributes**
- `menu_item_id` (PK)
- `restaurant_id`
- `name`
- `description`
- `price`
- `is_available`
- `created_at`
- `updated_at`

**Foreign Keys**
- `restaurant_id → restaurant.restaurant_id`

---

## 🧾 Order

**Description:**  
Represents a customer's purchase transaction placed at a restaurant.

**Primary Key**
- `order_id`

**Attributes**
- `order_id` (PK)
- `user_id`
- `restaurant_id`
- `order_status`
- `total_amount`
- `order_time`
- `created_at`
- `updated_at`

**Foreign Keys**
- `user_id → user.user_id`
- `restaurant_id → restaurant.restaurant_id`

---

## 🧺 OrderItem

**Description:**  
Stores individual menu items included within an order.

**Primary Key**
- `order_item_id`

**Attributes**
- `order_item_id` (PK)
- `order_id`
- `menu_item_id`
- `quantity`
- `unit_price`
- `subtotal`
- `created_at`
- `updated_at`

**Foreign Keys**
- `order_id → order.order_id`
- `menu_item_id → menu_item.menu_item_id`

---

## 💳 PaymentMethod

**Description:**  
Represents supported payment options used during order checkout.

**Primary Key**
- `payment_method_id`

**Attributes**
- `payment_method_id` (PK)
- `method_name`
- `provider`
- `is_active`
- `created_at`
- `updated_at`

---

## 3️⃣ Database Relationships

---

### ✅ User → Country

- **Type:** One-to-Many  
- **Foreign Key:** `user.country_id`
- **Referential Action:** `ON DELETE RESTRICT`
- **Explanation:**  
  Multiple users can belong to one country. Country deletion is restricted if users exist to preserve user localization data.

---

### ✅ Restaurant → Country

- **Type:** One-to-Many  
- **Foreign Key:** `restaurant.country_id`
- **Referential Action:** `ON DELETE RESTRICT`
- **Explanation:**  
  Restaurants operate within a specific country for taxation and regional availability.

---

### ✅ Order → User

- **Type:** One-to-Many  
- **Foreign Key:** `order.user_id`
- **Referential Action:** `ON DELETE CASCADE`
- **Explanation:**  
  A user may place multiple orders. Deleting a user removes dependent historical orders if business policy allows account removal.

---

### ✅ Order → Restaurant

- **Type:** One-to-Many  
- **Foreign Key:** `order.restaurant_id`
- **Referential Action:** `ON DELETE RESTRICT`
- **Explanation:**  
  Orders must always reference an existing restaurant to maintain transaction history integrity.

---

### ✅ OrderItem → MenuItem

- **Type:** Many-to-One  
- **Foreign Key:** `order_item.menu_item_id`
- **Referential Action:** `ON DELETE RESTRICT`
- **Explanation:**  
  Each order item references a menu item. Historical order data must remain valid even if menu availability changes.

---

## 4️⃣ Relational Diagram (Text-Based ERD)

            Country
             ↑   ↑
             |   |
          User  Restaurant
             ↑        ↑
             |        |
             +---- Order ----+
                      |
                  OrderItem
                      ↑
                   MenuItem

---

## 5️⃣ Data Integrity & Constraints

---

### ✅ Indexing Strategy

**Primary Indexes**
- All primary keys automatically indexed.

**Recommended Secondary Indexes**
- `user(email)`
- `restaurant(country_id)`
- `menu_item(restaurant_id)`
- `order(user_id)`
- `order(restaurant_id)`
- `order_item(order_id)`
- `order_item(menu_item_id)`

---

### ✅ Unique Constraints

- `user.email`
- `role.role_name`
- `country.iso_code`
- Composite: `(restaurant_id, name)` in `menu_item`

---

### ✅ Cascade Rules

| Relationship | Delete Rule |
|-------------|------------|
| User → Order | CASCADE |
| Order → OrderItem | CASCADE |
| Country → User | RESTRICT |
| Country → Restaurant | RESTRICT |
| MenuItem → OrderItem | RESTRICT |

---

### ✅ Normalization Level

Database design follows **Third Normal Form (3NF)**:

- No repeating groups
- No partial dependencies
- No transitive dependencies
- Logical separation of entities
- Reduced redundancy
- Improved scalability

---

### ✅ Timestamp Strategy

All transactional entities include:

- `created_at`
- `updated_at`

Supports:
- auditing
- analytics
- debugging
- soft future extensions

---

## ✅ Architecture Summary

This relational architecture ensures:

- Strong referential integrity
- Scalable restaurant onboarding
- Efficient order processing
- Historical transaction preservation
- Production-ready extensibility

The schema is optimized for **high-read and transactional workloads** typical of modern food ordering platforms.
