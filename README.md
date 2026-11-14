# Campus Lost & Found Portal

A centralized platform for reporting, discovering and safely reclaiming lost items on a campus.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Stack](https://img.shields.io/badge/stack-MERN-green)
![Docker](https://img.shields.io/badge/docker-ready-blue)

---

## Table of Contents

1. [Overview](#overview)
2. [Objectives](#objectives)
3. [User Roles](#user-roles)
4. [Core Modules](#core-modules)
5. [Functional Requirements](#functional-requirements)
6. [Tech Stack](#tech-stack)
7. [System Architecture](#system-architecture)
8. [Data Model](#data-model)
9. [Status Workflows](#status-workflows)
10. [API Overview](#api-overview)
11. [Project Structure](#project-structure)
12. [Getting Started](#getting-started)
13. [Environment Variables](#environment-variables)
14. [Running with Docker](#running-with-docker)
15. [CI/CD](#cicd)
16. [Security & Privacy](#security--privacy)
17. [Testing](#testing)
18. [Completion Criteria](#completion-criteria)
19. [Roadmap](#roadmap)
20. [Contributing](#contributing)
21. [License](#license)

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
| Frontend | React (Vite) |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT or session-based auth, bcrypt password hashing |
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

> Base URL: `/api/v1`. Final routes may vary slightly during implementation.

### Auth
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Log in and receive a token | Public |
| POST | `/auth/logout` | Log out | User |
| POST | `/auth/forgot-password` | Request password reset | Public |
| POST | `/auth/reset-password` | Reset password with token | Public |
| GET / PATCH | `/users/me` | View / update own profile | User |

### Reports
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/reports` | Search approved, active reports (filters: `type`, `category`, `q`, `from`, `to`, `location`) | Public |
| GET | `/reports/:id` | View a single approved report | Public |
| GET | `/reports/:id/matches` | Potential matches for a report | User |
| POST | `/reports` | Create a lost/found report | User |
| PATCH | `/reports/:id` | Edit own open report | Owner |
| POST | `/reports/:id/withdraw` | Withdraw own open report | Owner |
| GET | `/reports/mine` | List own reports | User |

### Claims
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/reports/:id/claims` | Submit a claim with private evidence | User |
| GET | `/claims/mine` | List own claims and statuses | User |
| GET | `/claims/:id` | View claim (evidence visible to claimant & admin only) | Claimant / Admin |

### Notifications
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/notifications` | List own notifications | User |
| PATCH | `/notifications/:id/read` | Mark as read | User |

### Admin
| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/admin/reports` | All reports (any status) | Admin |
| PATCH | `/admin/reports/:id/status` | Approve / reject / hide / archive / mark returned | Admin |
| GET | `/admin/claims` | Review claim queue | Admin |
| PATCH | `/admin/claims/:id/decision` | Approve or reject a claim (reason required) | Admin |
| POST | `/admin/claims/:id/handover` | Confirm handover and close case | Admin |
| CRUD | `/admin/categories` | Manage categories | Admin |
| GET | `/admin/dashboard` | Summary counts and activity | Admin |
| GET | `/admin/audit-logs` | View audit log | Admin |

## Project Structure

```
campus-lost-and-found/
├── client/                     # React (Vite) frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/           # API client
│   │   ├── context/            # Auth context
│   │   └── main.jsx
│   ├── Dockerfile
│   └── vite.config.js
├── server/                     # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/         # auth, role checks, validation, upload
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/           # matching, notifications, audit logging
│   │   ├── utils/
│   │   └── app.js
│   ├── uploads/                # local dev storage (git-ignored)
│   ├── tests/
│   └── Dockerfile
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+ (or pnpm / yarn)
- MongoDB 6+ (local instance or MongoDB Atlas)
- Docker & Docker Compose (optional, recommended)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/campus-lost-and-found.git
cd campus-lost-and-found
```

### 2. Configure environment variables

```bash
cp .env.example server/.env
cp .env.example client/.env
```

Edit the files with your own values (see [Environment Variables](#environment-variables)).

### 3. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 4. Seed initial data (categories and admin account)

```bash
cd server
npm run seed
```

### 5. Start the development servers

```bash
# Terminal 1 - API
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

- Frontend: <http://localhost:5173>
- API: <http://localhost:5000/api/v1>

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
| --- | --- | --- |
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | API port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/lostfound` |
| `JWT_SECRET` | Secret for signing tokens | `change-me` |
| `JWT_EXPIRES_IN` | Token lifetime | `1d` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |
| `UPLOAD_DIR` | Local upload directory | `uploads` |
| `MAX_IMAGE_SIZE_MB` | Max image size | `5` |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Email settings for password reset | – |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin credentials | – |

### Client (`client/.env`)

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |

> **Never commit real secrets.** `.env` files are git-ignored; only `.env.example` is tracked.

## Running with Docker

Build and start the full stack (client, API and MongoDB):

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

Example `docker-compose.yml` services:

- `mongo`: MongoDB with a named volume
- `server`: Express API (depends on `mongo`)
- `client`: React build served via Nginx

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request:

1. Install dependencies for client and server
2. Lint the codebase
3. Run automated tests
4. Build the React app
5. Build Docker images
6. *(On `main`)* Push images to a registry and deploy to the cloud host

Deployment is repeatable: the same container images that pass CI are what get deployed.

## Security & Privacy

- **Server-side RBAC:** all protected and admin routes are guarded by authentication and role middleware.
- **Password hashing:** passwords are hashed with bcrypt (never stored in plain text).
- **Private evidence:** `ClaimEvidence` and contact details are accessible only to the claimant and authorized admins, and are never returned by public endpoints.
- **Upload validation:** MIME type and extension allow-list (e.g. JPEG, PNG, WebP), size limits and sanitized filenames.
- **Input validation:** all request bodies are validated (e.g. with Zod, Joi or express-validator) with clear error messages.
- **Hardening:** `helmet`, CORS restrictions and rate limiting on auth and claim endpoints.
- **Audit logging:** admin decisions and important status changes are logged with actor, action and timestamp.
- **Public visibility:** only reports with status `approved` and active are returned in search and listings.

## Testing

```bash
# Backend unit & integration tests
cd server
npm test

# Frontend tests
cd client
npm test
```

Recommended test coverage:

- Auth flows and role-based access (including attempts to access admin routes as a normal user)
- Report create / edit / withdraw rules
- Search filtering returns only approved, active reports
- Claim submission and admin decision flow
- Private evidence is never exposed publicly
- Status history is written on every transition

## Completion Criteria

- [ ] A user can publish a lost or found report and later manage it.
- [ ] Another user can search approved found reports and submit a claim.
- [ ] An administrator can review evidence, decide the claim and close the case.
- [ ] Private evidence is not visible in public listings.
- [ ] The application can be built and deployed through a repeatable container/CI workflow.

## Roadmap

- [ ] Authentication, profiles and role-based access
- [ ] Lost and found report CRUD with image upload
- [ ] Search, filters and potential-match suggestions
- [ ] Claim submission with private evidence
- [ ] Admin moderation and claim verification
- [ ] In-app notifications
- [ ] Admin dashboard and audit logs
- [ ] Dockerization and CI/CD pipeline
- [ ] Cloud deployment

**Future ideas:** email notifications, QR-code handover confirmation, image-similarity matching, multi-campus support.

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature`
2. Commit using clear messages (e.g. Conventional Commits): `git commit -m "feat: add claim evidence upload"`
3. Push your branch and open a pull request
4. Ensure CI passes and request a review

## License

This project is released under the [MIT License](LICENSE).

---

*Built as part of the WEINTERN minor project.*
