# EKO RESTAURANT — PROJECT STATUS

## 1. Project Overview
- **Restaurant Name:** Eko Restaurant
- **Type:** Luxury Fine-Dining Restaurant
- **Location:** Kigali, KK 554
- **Phone / WhatsApp:** 0701537890
- **Email:** mugishamp7@gmail.com
- **Opening Hours:** Every day, 10:00–23:00
- **Currency:** RWF (Rwandan Franc)
- **Palette:** Black + Gold + White
- **Typography:** Serif for headings (Cormorant Garamond, Playfair Display), Sans-serif for body (Montserrat)
- **Slogan:** *"A Symphony of Flavors, Where Kigali Meets Culinary Artistry"*

---

## 2. Current Development Stage
- **Current Active Stage:** STAGE 5 — Public React Website
- **Stage Status:** **PASSED & VERIFIED** (Ready to proceed to Stage 6 Menu System)

---

## 3. Development Stages Tracker

| Stage | Name | Status | Verification Summary |
|-------|------|--------|----------------------|
| **STAGE 1** | **Project initialization** | **COMPLETED & VERIFIED** | Express + Vite full-stack server running on port 3000, unified REST API routing, luxury design tokens, health check endpoints, environment configs. |
| **STAGE 2** | **Database** | **COMPLETED & VERIFIED** | Complete relational MySQL DDL schema (12 tables), database connection pooling & fallback storage manager, migrations & seeder for categories, exact RWF menu items, admin, settings, gallery, and live CRUD test verification. |
| **STAGE 3** | **Backend foundation** | **COMPLETED & VERIFIED** | REST API v1 routing, service layer abstractions (`MenuService`, `SettingsService`), session & cookie parsing middleware, Zod request body/query schema validation, standardized success/error response protocol (`sendSuccess`, `sendError`), and live server-side cart pricing engine. |
| **STAGE 4** | **Authentication** | **COMPLETED & VERIFIED** | Customer & Admin session auth, bcrypt password hashing, JWT token generation & verification, role-based route guards (`requireAuth`, `requireAdmin`), admin login audit logging in `activity_logs`, and interactive auth dashboard. |
| **STAGE 5** | **Public React website** | **COMPLETED & VERIFIED** | Complete responsive customer experience: Grand Hero with Kigali backdrop, 35-item culinary catalog with search and filters, Maître d' table reservations, Ambiance Gallery, Kigali Story, Concierge contact, and cart drawer with RWF delivery checkout. |
| STAGE 6 | Menu system | PENDING | Food/Drinks categorization, original menu preservation, search & filters. |
| STAGE 7 | Cart and checkout | PENDING | Order basket, delivery/pickup options, server-side price validation. |
| STAGE 8 | Orders and delivery | PENDING | Kigali delivery fee calculator abstraction, order tracking. |
| STAGE 9 | Reservations | PENDING | Table booking, double-booking prevention, guest counts. |
| STAGE 10 | Payment integration | PENDING | MTN MoMo, Airtel Money, Visa/Mastercard, Cash on delivery/pickup. |
| STAGE 11 | Customer dashboard | PENDING | Real-time order & payment statuses, reservation history. |
| STAGE 12 | Admin dashboard | PENDING | Single administrator portal, stats overview, menu/order management. |
| STAGE 13 | Gallery & restaurant management | PENDING | Cloud storage for images, dynamic restaurant metadata, audit logs. |
| STAGE 14 | Security & validation | PENDING | Input sanitization, SQL injection prevention, rate limiting. |
| STAGE 15 | Testing & bug fixing | PENDING | Automated & manual regression testing. |
| STAGE 16 | Production preparation | PENDING | Production bundling, deployment instructions, environment validation. |

---

## 4. Stage 4 Authentication Architecture

### Service & Middleware Layer
- `AuthService` (`/server/services/authService.ts`):
  - `registerCustomer(dto)`: Validates email uniqueness, hashes password with `bcryptjs` (salt rounds = 10), creates customer user record, and issues JWT + session.
  - `loginCustomer(dto)`: Verifies email, compares password hash, returns safe customer profile + JWT token.
  - `loginAdmin(dto, ip)`: Authenticates against `admins` table, logs action to `activity_logs`, and issues admin JWT token.
  - `getUserProfile(userId)` / `getAdminProfile(adminId)`: Retrieves safe sanitized profile objects.
  - `updateCustomerProfile(userId, dto)`: Updates name/phone securely.
  - `changePassword(role, id, currentPass, newPass)`: Secure password update verifying current hash.
- `Auth Middleware` (`/server/middleware/auth.ts`):
  - `requireAuth`: Reads `Authorization: Bearer <token>`, cookie `eko_token`, or active session; verifies JWT; populates `req.user`.
  - `requireAdmin`: Enforces `req.user.role === 'admin'`; rejects unauthorized or customer tokens with `ForbiddenError` (403).

### REST Endpoints (`/api/v1/auth/*`)
- `POST /api/v1/auth/register` — Validated customer registration with Zod.
- `POST /api/v1/auth/login` — Customer login endpoint.
- `POST /api/v1/auth/admin/login` — Administrator login endpoint.
- `GET /api/v1/auth/me` — Profile lookup protected with `requireAuth`.
- `PUT /api/v1/auth/profile` — Update customer profile.
- `PUT /api/v1/auth/change-password` — Change account password.
- `POST /api/v1/auth/logout` — Clears cookies and session.
- `GET /api/v1/auth/admin/verify` — Route guard test endpoint protected with `requireAdmin`.
