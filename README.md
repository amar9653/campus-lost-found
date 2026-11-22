# Campus Lost & Found Portal - Frontend

A modern, responsive, and feature-rich React web application for reporting, tracking, recovering lost belongings, and managing campus operations through a dedicated Admin Dashboard.

![React](https://img.shields.io/badge/React-19.3.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8.3.6-purple?logo=vite)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.9-purple?logo=bootstrap)
![Recharts](https://img.shields.io/badge/Recharts-3.11.0-teal)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## 📌 Table of Contents

1. [Overview](#-overview)
2. [Key Features](#-key-features)
   - [Student & User Portal](#1-student--user-portal)
   - [Admin Management Portal](#2-admin-management-portal)
3. [Default Credentials](#-default-credentials)
4. [Tech Stack](#-tech-stack)
5. [Project Architecture & Routes](#-project-architecture--routes)
6. [Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation & Running](#installation--running)
7. [Scripts](#-scripts)
8. [Folder Structure](#-folder-structure)
9. [Future Roadmap](#-future-roadmap)
10. [License](#-license)

---

## 📖 Overview

Belongings lost around campus (keys, bags, student IDs, laptops, bottles) are traditionally managed via informal WhatsApp groups or physical noticeboards, creating friction, lack of proof, and lost track of items.

The **Campus Lost & Found Portal** provides an all-in-one centralized digital platform with two cohesive portals:
- **Student / User Portal**: Clean, intuitive interface for students & staff to browse found items, post reports, and submit claims with proof of ownership.
- **Admin Management Portal**: Secure, multi-view control center for college administrators to moderate listings, approve/reject claims, verify handovers, manage users/categories, and review recovery analytics.

---

## ✨ Key Features

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
  - Monthly recovery & reports analytical line charts (powered by Recharts).
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

## 🔑 Default Credentials

### 🛡️ Administrator Account
| Field | Value |
|---|---|
| **Admin Portal URL** | [http://localhost:5174/admin](http://localhost:5174/admin) |
| **Admin Email** | `admin@campus.edu` *(or `admin@campusfind.com`)* |
| **Password** | `admin123` |

### 🎓 Student / User Account
| Field | Value |
|---|---|
| **Student Portal URL** | [http://localhost:5174/login](http://localhost:5174/login) |
| **Register User** | [http://localhost:5174/register](http://localhost:5174/register) |
| **Self-Registration** | Register any campus email, ID, and custom password |

---

## 💻 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **UI & Styling**: [Bootstrap 5](https://getbootstrap.com/), Vanilla Modular CSS
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualizations**: [Recharts](https://recharts.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## 🗺️ Project Architecture & Routes

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

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or v20.x+
- **npm** (v9+) or **pnpm** / **yarn**

### Installation & Running

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/campus-lost-found-frontend.git
   cd campus-lost-found-frontend
   ```

2. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```

5. **Open in your browser**:
   - Student Portal: **`http://localhost:5173/`** (or `http://localhost:5174/`)
   - Admin Login: **`http://localhost:5173/admin`** (or `http://localhost:5174/admin`)

---

## 🛠️ Scripts

Inside the `frontend/` directory, you can run:

| Command | Action |
|---|---|
| `npm run dev` | Starts the Vite dev server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles and bundles production-ready assets into `/dist` |
| `npm run preview` | Runs a local web server serving the production build |
| `npm run lint` | Runs ESLint to check for code quality and style errors |

---

## 📂 Folder Structure

```
frontend/
├── public/                     # Static assets & favicon
├── src/
│   ├── assets/                 # SVGs and graphics (campus-building.png)
│   ├── components/
│   │   ├── admin/              # Admin components (Charts, Tables, Nav, Sidebar, Badges)
│   │   ├── Footer.jsx          # Global website footer
│   │   ├── Navbar.jsx          # Public navbar
│   │   └── ProtectedRoute.jsx  # Route authorization wrapper
│   ├── context/
│   │   └── AdminContext.jsx    # Global state management for admin data & toasts
│   ├── data/                   # Realistic mock datasets (Reports, Claims, Users, Stats)
│   ├── pages/
│   │   ├── admin/              # Admin pages (Dashboard, Claims, Reports, Users, Login)
│   │   ├── user/               # Student pages (Dashboard, ReportLost, Claims, Profile)
│   │   ├── Home.jsx            # Main landing page
│   │   ├── Login.jsx           # Student login page
│   │   └── Register.jsx        # Student registration page
│   ├── services/
│   │   ├── adminService.js     # Admin API service layer (ready for REST integration)
│   │   └── api.js              # Student/public API client
│   ├── styles/                 # Modular CSS stylesheets
│   │   ├── admin.css           # Admin theme & variables
│   │   ├── adminDashboard.css  # Admin cards & metrics
│   │   ├── adminTables.css     # Clean data tables
│   │   ├── adminResponsive.css # Mobile/tablet layout rules
│   │   ├── Auth.css            # Authentication form styles
│   │   ├── Dashboard.css       # Student dashboard styles
│   │   └── Home.css            # Landing page styles
│   ├── App.jsx                 # Central router & route guard definitions
│   ├── main.jsx                # Application entrypoint
│   └── index.css               # Global base styles
├── package.json
└── vite.config.js
```

---

## 🔮 Future Roadmap

- [ ] Connect with Express/MongoDB REST backend endpoints.
- [ ] Automated image matching using similarity recognition.
- [ ] QR code generation for streamlined physical claim handovers.
- [ ] Email and SMS alerts for matched items.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
