# Campus Lost & Found Portal

A centralized platform for reporting, discovering and safely reclaiming lost items on a campus, featuring both a Student & User Portal and a comprehensive Admin Management Dashboard.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Stack](https://img.shields.io/badge/stack-MERN-green)
![Docker](https://img.shields.io/badge/docker-ready-blue)

---

## Table of Contents

1. [Overview](#overview)
2. [Objectives](#objectives)
3. [User Roles](#user-roles)
4. [Core Modules](#core-modules)
5. [Key Features](#key-features)
   - [Student & User Portal](#1-student--user-portal)
   - [Admin Management Portal](#2-admin-management-portal)
6. [Default Credentials](#default-credentials)
7. [Functional Requirements](#functional-requirements)
8. [Tech Stack](#tech-stack)
9. [System Architecture](#system-architecture)
10. [Frontend Architecture & Routes](#frontend-architecture--routes)
11. [Data Model](#data-model)
12. [Status Workflows](#status-workflows)
13. [API Overview](#api-overview)
14. [Project Structure](#project-structure)
15. [Getting Started](#getting-started)
16. [Environment Variables](#environment-variables)
17. [Recent Updates & Completed Modules](#recent-updates--completed-modules)
18. [Running with Docker](#running-with-docker)
19. [CI/CD](#cicd)
20. [Security & Privacy](#security--privacy)
21. [Testing](#testing)
22. [Completion Criteria](#completion-criteria)
23. [Roadmap](#roadmap)
24. [Contributing](#contributing)
25. [License](#license)

---

## Overview

Lost belongings on campus are commonly reported through informal groups, notice boards or word of mouth. These channels make it hard to search old reports, verify ownership and track whether an item has actually been returned.

The **Campus Lost & Found Portal** solves this by providing one searchable place where students and staff can report lost and found items, discover likely matches, and reclaim belongings through a controlled **claim and verification workflow** that reduces incorrect handovers.

## Objectives

- Provide one searchable place for students and staff to report lost and found items.
- Improve matching between lost and found reports using category, location, date and descriptive keywords.
- Introduce a controlled claim and verification workflow to reduce incorrect handovers.
- Give administrators visibility into reports, claims and platform activity.

## User Roles

| Role | Responsibilities |
| --- | --- |
| **Visitor** | Browse public, approved found-item listings and search by category or keyword. |
| **Registered user** | Create lost/found reports, manage own reports, submit claims and view claim status. |
| **Administrator** | Review reports, moderate content, verify claims, manage categories and close cases. |

## Core Modules

### Authentication & Profiles
Registration, login, logout, profile details, password reset and role-based access control.

### Lost-Item Reporting
Item name, category, description, approximate loss date, location, optional image and contact preference.

### Found-Item Reporting
Found date, location, category, description, image upload and safe storage/collection notes.

### Search & Matching
Keyword search with filters for category, date range, location and report type. The system surfaces potentially matching records based on category, location, date proximity and keyword overlap.

### Claim Management
Claim submission, private ownership evidence, reviewer decision, status history and handover confirmation.

### Admin Moderation
Approve, reject, hide or archive reports; manage categories; investigate duplicate or suspicious entries.

### Notifications
In-app notifications for claim updates, possible matches and admin decisions.

### Dashboard & Reports
Counts of open reports, matched cases, pending claims and successfully returned items.

---

## Key Features

### 1. Student & User Portal
- 🏠 **Landing Page**: Modern hero section, search bar, visual process breakdown ("How It Works"), category grid, and direct support contact form.
- 🔍 **Search & Filters**: Search listings by keyword, category, status, and campus location.
- 📢 **Report Lost Items**: Submit lost reports with item descriptions, dates, category tags, and location details.
- 📦 **Report Found Items**: Submit found belongings to assist fellow campus members.
- 📝 **My Claims**: Submit and track verification claims against found items.
- 🔔 **Notifications**: Instant updates on reports, matches, and claim status changes.
- 👤 **Student Profile & Registration**: Student ID, department information, and secure local authentication.

### 2. Admin Management Portal
- 📊 **Executive Dashboard (`/admin/dashboard`)**:
  - Live metric summary cards (Total Reports, Claims, Approvals, Pending Actions, Returns).
  - Monthly recovery & reports analytical charts (powered by Recharts).
  - Quick widgets for Recent Claims, Recent Reports, and System Activity.
- 📑 **Manage Reports (`/admin/reports`)**:
  - Real-time tabular view of all campus reports.
  - One-click Approve, Reject (with reason dialog), or Moderate reports.
- 🛡️ **Manage Claims & Verification (`/admin/claims`, `/admin/claims/:id`)**:
  - Review student ownership proof, documents, and claim details.
  - Approve or reject claims with custom administrator remarks.
  - Digital handover logging to officially close recovered cases.
- 👥 **User Management (`/admin/users`)**:
  - Full roster of registered campus students and staff.
  - Approve registration requests, manage permissions, or suspend accounts.
- 🏷️ **Categories Management (`/admin/categories`)**:
  - Create, edit, and organize lost & found item groupings.
- 🔔 **Admin Notifications (`/admin/notifications`)**:
  - Dedicated notification center with unread counters and "Mark All as Read".
- 📈 **Analytics & Reports (`/admin/analytics`)**:
  - Visual trends filtered by customizable periods (Last 7 Days, Last 30 Days, Last 6 Months, This Year).
- ⚙️ **Admin Profile & Settings (`/admin/profile`, `/admin/settings`)**:
  - Manage admin credentials, emergency contacts, retention policies, and preferences.
- 🔒 **Security & Dual Route Protection**:
  - Standalone admin login portal (`/admin`).
  - Route guards (`AdminProtectedRoute` & `AdminLayout`) prevent unauthorized URL hopping directly to `/admin/dashboard`.

---

## Default Credentials

### Administrator Account
| Field | Value |
|---|---|
| **Admin Portal URL** | [http://localhost:5173/admin](http://localhost:5173/admin) |
| **Admin Email** | `admin@campus.edu` *(or `admin@campusfind.com`)* |
| **Password** | `admin123` |

### Student / User Account
| Field | Value |
|---|---|
| **Student Portal URL** | [http://localhost:5173/login](http://localhost:5173/login) |
| **Register User** | [http://localhost:5173/register](http://localhost:5173/register) |
| **Self-Registration** | Register any campus email, ID, and custom password |

---

## Functional Requirements

- Users can create, edit and withdraw their own reports while the report is still **open**.
- Image uploads are validated for file type and size.
- Private ownership evidence is **never** exposed publicly.
- Search results show only **approved, active** reports.
- A user can submit a claim against a found-item record and provide non-public proof of ownership.
- Administrators can approve or reject a claim and must record a reason.
- Only an authorized administrator can mark a report as **returned**, **resolved** or **archived**.
- The system maintains timestamps and status history for important report and claim actions.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19 (Vite), React Router v7, Bootstrap 5, Recharts, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT auth, bcrypt password hashing, role-based access control |
| File storage | Cloud image storage service or local disk for development |
| DevOps | Docker, Docker Compose, GitHub Actions |
| Hosting | Any cloud platform (Render, Railway, AWS, Azure, etc.) |

## System Architecture

```
┌──────────────┐     HTTPS / JSON      ┌──────────────────┐      ┌───────────┐
│  React (Vite) │ ───────────────────► │ Express.js API   │ ───► │  MongoDB  │
│  SPA          │ ◄─────────────────── │ (JWT + RBAC)     │      └───────────┘
└──────────────┘                       │                  │      ┌───────────┐
                                       │  Multer / upload │ ───► │ Image     │
                                       │  middleware      │      │ storage   │
                                       └──────────────────┘      └───────────┘
```

Authorization is enforced **on the server** through middleware; hiding buttons in the UI is never treated as a security measure.

## Frontend Architecture & Routes

```
/                           -> Public Landing Page (Home)
/login                      -> Student & User Login
/register                   -> Student Account Registration
/dashboard                  -> Student User Dashboard
/report-lost                -> Report a Lost Item
/report-found               -> Report a Found Item
/search                     -> Search & Filter Items
/claims                     -> User Claims Tracker
/notifications              -> User Notifications
/profile                    -> User Profile

/admin                      -> Admin Login Portal
/admin/dashboard            -> Admin Executive Dashboard [Protected]
/admin/reports              -> Manage & Moderate Reports [Protected]
/admin/claims               -> Manage Claims Queue [Protected]
/admin/claims/:id           -> Claim Verification & Handover [Protected]
/admin/users                -> Manage Students & Registrations [Protected]
/admin/categories           -> Item Categories Management [Protected]
/admin/notifications        -> System Alerts & Activity Feed [Protected]
/admin/analytics            -> Visual Reports & Trends [Protected]
/admin/profile              -> Administrator Profile [Protected]
/admin/settings             -> Portal Configuration [Protected]
```

## Data Model

| Entity | Purpose |
| --- | --- |
| `User` | Account, profile, role (`user` / `admin`), contact preferences. |
| `ItemReport` | A lost or found report (`type: lost \| found`) with category, location, date, description and status. |
| `ItemCategory` | Admin-managed categories (e.g. Electronics, ID Cards, Keys, Bags). |
| `ItemImage` | Validated image metadata linked to a report. |
| `Claim` | A user's claim against a found-item report, with status and reviewer decision. |
| `ClaimEvidence` | Private proof of ownership, accessible only to the claimant and admins. |
| `Notification` | In-app notifications for claims, matches and admin decisions. |
| `StatusHistory` | Timestamped audit trail of report and claim status changes. |

### Entity Relationships

```
User 1 ──── * ItemReport * ──── 1 ItemCategory
ItemReport 1 ──── * ItemImage
ItemReport 1 ──── * Claim 1 ──── * ClaimEvidence
User 1 ──── * Claim
User 1 ──── * Notification
ItemReport / Claim 1 ──── * StatusHistory
```

## Status Workflows

### Report lifecycle

```
pending ──► approved (open) ──► matched ──► returned ──► archived
   │            │
   ├─► rejected └─► withdrawn / hidden
```

### Claim lifecycle

```
submitted ──► under_review ──► approved ──► handed_over
                   │
                   └─► rejected (reason required)
```

Every transition writes a `StatusHistory` record containing the actor, previous status, new status, reason (where applicable) and timestamp.

## API Overview

> Base URL: `/api/v1` or `/api`. Final routes may vary slightly during implementation.

### Auth
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and receive a token | Public |
| GET | `/api/auth/me` | Get current authenticated user profile | Protected |

### Reports
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/api/reports` | Search approved, active reports (filters: `type`, `category`, `q`, `from`, `to`, `location`) | Public |
| GET | `/api/reports/:id` | View a single report | Public |
| GET | `/api/reports/user/mine` | List reports belonging to current user | Protected |
| POST | `/api/reports` | Create a lost/found report | Protected |
| PATCH | `/api/reports/:id` | Edit own open report | Owner / Admin |
| PATCH | `/api/reports/:id/withdraw` | Withdraw own open report | Owner / Admin |
| POST | `/api/reports/:id/images` | Upload validated image attachment | Owner / Admin |

### Admin
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/api/admin/reports` | All reports (any status) | Admin |
| PATCH | `/api/admin/reports/:id/status` | Approve / reject / hide / archive / mark returned | Admin |
| GET | `/api/admin/claims` | Review claim queue | Admin |
| PATCH | `/api/admin/claims/:id/decision` | Approve or reject a claim (reason required) | Admin |
| POST | `/api/admin/claims/:id/handover` | Confirm handover and close case | Admin |
| CRUD | `/api/admin/categories` | Manage categories | Admin |
| GET | `/api/admin/dashboard` | Summary counts and activity | Admin |

## Project Structure

```
campus-lost-and-found/
├── frontend/                   # React (Vite) frontend application
│   ├── public/                 # Static assets, hero images, and favicon
│   ├── src/
│   │   ├── assets/             # SVGs and graphics
│   │   ├── components/         # Reusable components & Admin widgets
│   │   │   ├── admin/          # Charts, Tables, Nav, Sidebar, Badges
│   │   │   ├── Footer.jsx      # Global footer
│   │   │   ├── Navbar.jsx      # Public navbar
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/            # Admin & Auth global state contexts
│   │   ├── data/               # Mock datasets and initial state
│   │   ├── pages/
│   │   │   ├── admin/          # Dashboard, Claims, Reports, Users, Login
│   │   │   ├── user/           # Dashboard, ReportLost, Claims, Profile
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Login.jsx       # Student login
│   │   │   └── Register.jsx    # Student registration
│   │   ├── services/           # Axios API services (api.js, adminService.js)
│   │   ├── styles/             # Modular CSS stylesheets
│   │   ├── App.jsx             # Routes and routing guards
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global typography & base styling
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── backend/                    # Node.js + Express backend API
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # Route logic (auth, reports, admin, images)
│   ├── middleware/             # Auth, role check, ownership, upload validation
│   ├── models/                 # Mongoose models (User, ItemReport)
│   ├── routes/                 # Express routers (auth, reports, admin)
│   ├── tests/                  # Automated integration tests (testWorkflow.js)
│   ├── uploads/                # Local dev storage for uploaded images
│   ├── utils/                  # JWT token helpers
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── docker-compose.yml
├── .gitignore
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm 9+ (or pnpm / yarn)
- MongoDB 6+ (local instance or MongoDB Atlas)
- Docker & Docker Compose (optional, recommended)

### 1. Clone the repository

```bash
git clone https://github.com/amar9653/campus-lost-found.git
cd campus-lost-found
```

### 2. Configure environment variables

Create a `.env` file inside the `backend` folder based on `backend/.env.example`:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your values (see [Environment Variables](#environment-variables)).

### 3. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Run automated backend tests

```bash
cd backend
npm test
```

### 5. Start the development servers

```bash
# Terminal 1 - Backend API
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: <http://localhost:5173>
- API Base: <http://localhost:5000/api>
- Health Check: <http://localhost:5000/api/health>

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and replace the following configuration values:

| Variable | Description | What to Replace / Example |
| --- | --- | --- |
| `PORT` | Server listening port | `5000` (or your preferred port) |
| `NODE_ENV` | Application environment | `development` (set to `production` in live environments) |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/campus_lost_found` or MongoDB Atlas URI |
| `JWT_SECRET` | Secret key used for signing & verifying JWTs | Strong random secret string |
| `JWT_EXPIRES_IN` | JWT token lifetime | `7d` (e.g., `1d`, `7d`, `24h`) |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

> **Never commit real secrets.** Keep `.env` git-ignored; only share `.env.example`.

## Recent Updates & Completed Modules

### 1. MongoDB Database Models (`backend/models/`)
- **`User` Model (`User.js`)**:
  - Fields: `name`, `email` (unique, lowercase), `password` (hashed with bcrypt), `role` (`user` / `admin`), `phone`, timestamps.
  - Automatic `pre('save')` password hashing hook and `matchPassword` instance method.
- **`ItemReport` Model (`ItemReport.js`)**:
  - Fields: `type` (`lost` / `found`), `itemName`, `category`, `description`, `location`, `eventDate`, `contact`, `status` (`pending`, `approved`, `matched`, `returned`, `withdrawn`, etc.), `isActive`, `images`, and `user` reference (`ObjectId` -> `User`).
  - Text search indexes on `itemName` & `description`, and compound indexes on `type`, `status`, and `isActive`.

### 2. JWT Authentication & Role Middleware (`backend/middleware/` & `backend/utils/`)
- **Token Generation & Verification (`backend/utils/jwt.js`)**: Signs and verifies JWT tokens with custom expiration.
- **Auth Middleware (`backend/middleware/authMiddleware.js`)**:
  - `protect`: Extracts `Bearer <token>` from the `Authorization` header, decodes user payload, and attaches `req.user`. Returns `401 Unauthorized` for missing/invalid tokens.
  - `authorize`: Guards routes based on role permissions (`admin` / `user`).
- **Auth Routes (`backend/routes/authRoutes.js`)**:
  - `POST /api/auth/register`: Creates new user accounts with hashed passwords and returns a JWT token.
  - `POST /api/auth/login`: Authenticates user credentials and issues a JWT token.
  - `GET /api/auth/me`: Fetches authenticated user profile (`protect` required).

### 3. Ownership Verification (`backend/middleware/ownershipMiddleware.js`)
- **`verifyReportOwnership` Middleware**:
  - Validates MongoDB `ObjectId` format.
  - Verifies that the report exists.
  - Verifies that `req.user._id` matches `report.user` (or the user possesses `admin` privileges). Returns `403 Forbidden` if unauthorized.
  - Attaches the verified report object to `req.report`.

### 4. Report Operations & File Uploads
- `POST /api/reports`: Protected; automatically links reports to the authenticated user.
- `GET /api/reports/user/mine`: Protected; retrieves reports created by the current user.
- `PATCH /api/reports/:id`: Protected + ownership verified; allows only owners or admins to modify report details.
- `PATCH /api/reports/:id/withdraw`: Protected + ownership verified; deactivates and withdraws the report.
- `POST /api/reports/:id/images`: Protected + ownership verified + magic-byte image signature validation.

### 5. Automated Workflow Tests (`backend/tests/testWorkflow.js`)
A comprehensive test suite verifying the end-to-end integration:
- User registration and login token issuance.
- Token-protected route authorization (`401` rejection on missing token).
- Report creation linked to user.
- Report modification and withdrawal ownership checks (`403` rejection when non-owners attempt updates/withdrawals).
- Successful owner modifications and withdrawals (`200 OK`).
- Verification that withdrawn reports are excluded from active search listings.

Run tests using:
```bash
cd backend
npm test
```

## Running with Docker

Build and start the full stack:

```bash
docker compose up --build
```

Stop and remove containers:

```bash
docker compose down
```

Remove containers and persisted volumes:

```bash
docker compose down -v
```

## CI/CD

GitHub Actions runs on every push and pull request:

1. Install dependencies for frontend and backend
2. Lint the codebase
3. Run automated tests
4. Build the React app
5. Build Docker images

## Security & Privacy

- **Server-side RBAC:** all protected and admin routes are guarded by authentication and role middleware.
- **Password hashing:** passwords are hashed with bcrypt (never stored in plain text).
- **Private evidence:** `ClaimEvidence` and contact details are accessible only to the claimant and authorized admins, and are never returned by public endpoints.
- **Upload validation:** MIME type and extension allow-list (e.g. JPEG, PNG, WebP), size limits and sanitized filenames.
- **Input validation:** all request bodies are validated with clear error messages.
- **Hardening:** CORS restrictions and rate limiting on sensitive routes.
- **Audit logging:** admin decisions and important status changes are logged with actor, action and timestamp.
- **Public visibility:** only reports with status `approved` and active are returned in search and listings.

## Testing

```bash
# Backend unit & integration tests
cd backend
npm test

# Frontend linting & build check
cd ../frontend
npm run lint
npm run build
```

## Completion Criteria

- [x] A user can publish a lost or found report and later manage it.
- [x] Admin executive dashboard for reviewing reports and claims.
- [x] Secure JWT authentication, ownership verification, and role-based access.
- [x] Automated workflow test suite passing for report lifecycle.
- [ ] Automated image matching using similarity recognition.

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature`
2. Commit using clear messages (e.g. Conventional Commits): `git commit -m "feat: add claim evidence upload"`
3. Push your branch and open a pull request
4. Ensure CI passes and request a review

## License

This project is released under the [MIT License](LICENSE).

---

*Built as part of the WEINTERN minor project.*
