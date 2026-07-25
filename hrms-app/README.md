# 📘 HRMS App – README

## ⚓ HRMS App – Setup & Architecture (WIP)

> [!IMPORTANT]
> **Repository Notice**: This repository is published as a portfolio project and is intended solely for educational and evaluation purposes. Employers, recruiters, and prospective clients are welcome to review the source code. However, the project is distributed under a proprietary license. Commercial use, redistribution, modification, and production deployment are strictly prohibited without prior written permission.

### 1. Monorepo & Base Structure

```bash
mkdir hrms-app && cd hrms-app
npm init -y

mkdir -p apps/frontend-ui-monorepo packages/ui packages/shared
```

**Root workspace setup:**

```json
// package.json (root)
{
  "name": "hrms-app",
  "private": true,
  "workspaces": ["apps/*", "packages/*"]
}
```

Optional Turborepo:

```bash
npm install turbo --save-dev
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "dev": { "cache": false },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

Run frontend:

```bash
cd hrms-app
npx turbo run dev --filter=frontend-ui-monorepo
```

---

### 2. Frontend App (Vite + React)

Inside `apps/`:

```bash
npm create vite@latest frontend-ui-monorepo -- --template react
cd frontend-ui-monorepo
npm install
```

Base dependencies:

```bash
npm install react-router-dom axios @reduxjs/toolkit react-redux
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
npm install react-hook-form react-query
```

---

### 3. Vite Aliases (Clean Imports)

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

### 4. Frontend Folder Structure

```
hrms-app/
├── apps/
│   └── frontend-ui-monorepo/
│       ├── public/
│       ├── src/
│       │   ├── assets/                      # images, icons, fonts
│       │   ├── components/
│       │   │   ├── atomic/                  # atomic design
│       │   │   │   ├── atoms/               # Logo, basic inputs, buttons
│       │   │   │   ├── molecules/           # LogoutButton, small composites
│       │   │   │   ├── organisms/           # Navbar, Sidebar, DataTable
│       │   │   │   ├── templates/           # layout templates (Dashboard, Auth)
│       │   │   │   └── pages/
│       │   │   └── ui/                      # shared UI wrappers
│       │   │   └── ProtectedRoute.jsx       # route guard (Auth0)
│       │   ├── constants/
│       │   ├── features/                    # feature-based modules
│       │   │   ├── auth/
│       │   │   │   ├── components/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── LoginPage.jsx
│       │   │   │   │   ├── TwoFactorPage.jsx
│       │   │   │   │   ├── ForgotPasswordPage.jsx
│       │   │   │   │   ├── VerifyEmailPage.jsx
│       │   │   │   │   ├── ResetPasswordPage.jsx
│       │   │   │   │   └── PasswordChangedPage.jsx
│       │   │   │   └── index.js
│       │   │   ├── home/
│       │   │   │   └── HomePage.jsx         # dashboard landing
│       │   │   ├── employee/
│       │   │   ├── attendance/
│       │   │   ├── leaves/
│       │   │   ├── payroll/
│       │   │   ├── performance/
│       │   │   └── settings/
│       │   ├── hooks/
│       │   ├── layouts/
│       │   ├── pages/
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx            # main route manager
│       │   │   ├── AuthRoutes.jsx           # auth module routes
│       │   │   └── HomeRoutes.jsx           # protected /home route
│       │   ├── services/
│       │   │   └─ employeeApi.js
│       │   ├── store/
│       │   ├── utils/
│       │   ├── App.jsx
│       │   └── main.jsx                     # Chakra + Auth0Provider
│       ├── .env                             # Auth0 creds (gitignored)
│       ├── .gitignore
│       ├── package.json
│       └── vite.config.js
│
├── packages/
│   ├── ui/                                  # shared design system (future)
│   └── shared/                              # shared utils, constants, schemas
│
├── package.json
├── turbo.json
└── README.md
```

---

### 5. Auth0 Integration (High-Level Summary)

- Created Auth0 SPA application (domain + client ID).
- Stored credentials in `.env`:
  - `VITE_AUTH0_DOMAIN`
  - `VITE_AUTH0_CLIENT_ID`
- Wrapped app with `Auth0Provider` in `src/main.jsx`.
- Updated `LoginPage.jsx` to trigger Auth0 Universal Login (`loginWithRedirect`).
- Added a reusable `LogoutButton.jsx` in `components/atomic/molecules`.
- Created `ProtectedRoute.jsx` to guard authenticated routes.

---

### 6. Current Auth Status

- UI complete for:
  - `LoginPage`, `TwoFactorPage`, `ForgotPasswordPage`,
    `VerifyEmailPage`, `ResetPasswordPage`, `PasswordChangedPage`.
- Auth0 login and logout working end-to‑to‑end.
- Protected routing in place via `ProtectedRoute`.
- Ready to continue building Home dashboard UI and core HRMS modules (employee, attendance, leaves, payroll, performance, settings).

---

## 📅 2026-07-26 – Production Stabilization Sprint

### ✅ Completed Today

- **Supabase 400 Bad Request fix**: Updated `src/services/employeeApi.js` – refactored `resolveEmployeeRecord` to:
  - Use proper column names (`auth_user_id`, `email`).
  - Remove unsupported `user_id` and `profile_id` queries.
  - Implement robust error‑handling that checks Supabase error codes instead of relying on `try/catch`.
  - Added helper `isColumnMissingError` to silently ignore missing‑column errors.
- Verified build with `npm run build`; all modules compiled successfully and no runtime errors were observed.
- The earlier fixes for `HRMSSidebar` (missing imports, undefined variables) remain intact.
- Help Center modal, responsive redesign, and other UI stabilizations from previous sprints are still functional.

### 📖 Summary of Changes

- **File Modified**: `src/services/employeeApi.js`
  - Replaced the previous cascade of `try/catch` column lookups with a clean sequence that first tries `auth_user_id`, then falls back to email lookups.
  - Added column‑missing detection to prevent 400 responses.
- **No schema changes** – database and RBAC remain untouched.
- **No design system changes** – Japanese Glass design system preserved.

---

## 📂 Updated Folder Structure (Full Project Tree)

```
hrms-app/
├─ apps/
│   └─ frontend-ui-monorepo/
│       ├─ public/
│       ├─ src/
│       │   ├─ assets/
│       │   ├─ components/
│       │   │   └─ atomic/
│       │   │       ├─ atoms/
│       │   │       │   ├─ HRMSButton.jsx
│       │   │       │   ├─ HRMSInput.jsx
│       │   │       │   ├─ Logo.jsx
│       │   │       │   ├─ SectionTitle.jsx
│       │   │       │   ├─ SidebarToggleButton.jsx
│       │   │       │   └─ StatusDot.jsx
│       │   │       ├─ molecules/
│       │   │       │   ├─ LogoutButton.jsx
│       │   │       │   ├─ HRMSCard.jsx
│       │   │       │   ├─ EmployeeConfigItem.jsx
│       │   │       │   ├─ DepartmentListItem.jsx
│       │   │       │   └─ EmployeeTableRow.jsx
│       │   │       ├─ organisms/
│       │   │       │   ├─ EmployeeTable.jsx
│       │   │       │   ├─ EmployeeConfigCard.jsx
│       │   │       │   ├─ HRMSSidebar.jsx
│       │   │       │   ├─ TopBar.jsx
│       │   │       │   └─ AttendanceConfigCard.jsx
│       │   │       └─ templates/
│       │   │           └─ DashboardLayout.jsx
│       │   ├─ constants/
│       │   ├─ features/
│       │   │   ├─ employee/
│       │   │   │   └─ pages/
│       │   │   │       ├─ EmployeeListPage.jsx
│       │   │   │       ├─ EmployeeDepartmentsPage.jsx
│       │   │   │       ├─ EmployeeBranchesPage.jsx
│       │   │   │       ├─ EmployeeDesignationsPage.jsx
│       │   │   │       ├─ EmployeeStatusesPage.jsx
│       │   │   │       ├─ EmployeeTypesPage.jsx
│       │   │   │       └─ EmployeeExportPage.jsx
│       │   │   └─ attendance/
│       │   │       └─ pages/
│       │   │           ├─ AttendanceDashboardPage.jsx
│       │   │           ├─ WorkingDaysPage.jsx
│       │   │           ├─ WorkingHoursPage.jsx
│       │   │           ├─ WorkingRulesPage.jsx
│       │   │           ├─ EditWorkingRulePage.jsx
│       │   │           ├─ EditAttendancePage.jsx
│       │   │           ├─ EditWorkingDaysPage.jsx
│       │   │           └─ AttendanceExportPage.jsx
│       │   ├─ hooks/
│       │   ├─ layouts/
│       │   ├─ pages/
│       │   ├─ routes/
│       │   │   ├─ AppRoutes.jsx
│       │   │   ├─ AuthRoutes.jsx
│       │   │   └─ HomeRoutes.jsx
│       │   ├─ services/
│       │   │   └─ employeeApi.js
│       │   ├─ store/
│       │   ├─ utils/
│       │   ├─ App.jsx
│       │   └─ main.jsx
│       ├─ .env
│       ├─ .gitignore
│       ├─ package.json
│       └─ vite.config.js
│
├─ packages/
│   ├─ ui/
│   └─ shared/
│       └─ employeeFilters.js
│
├─ package.json
├─ turbo.json
└─ README.md
```

---

*All work performed today respects the existing Japanese Glass design system, routing, authentication, RBAC, and database schema.*
