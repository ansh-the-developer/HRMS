```markdown
## ⚓ HRMS App – Setup & Architecture (WIP)

### 1. Monorepo & Base Structure

```
mkdir hrms-app && cd hrms-app
npm init -y

mkdir -p apps/frontend-ui-monorepo packages/ui packages/shared
```

**Root workspace setup:**

```
// package.json (root)
{
  "name": "hrms-app",
  "private": true,
  "workspaces": ["apps/*", "packages/*"]
}
```

Optional Turborepo:

```
npm install turbo --save-dev
```

```
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

```
cd hrms-app
npx turbo run dev --filter=frontend-ui-monorepo
```

---

### 2. Frontend App (Vite + React)

Inside `apps/`:

```
npm create vite@latest frontend-ui-monorepo -- --template react
cd frontend-ui-monorepo
npm install
```

Base dependencies:

```
npm install react-router-dom axios @reduxjs/toolkit react-redux
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
npm install react-hook-form react-query
```

---

### 3. Vite Aliases (Clean Imports)

```
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
- Added `ProtectedRoute.jsx` to guard authenticated routes.
- Created reusable `LogoutButton.jsx` in `components/atomic/molecules`.
- Routing files:
  - `AppRoutes.jsx` – central route manager with root redirect logic.
  - `AuthRoutes.jsx` – all auth-related routes.
  - `HomeRoutes.jsx` – protected `/home` dashboard route.

---

### 6. Current Auth Status

- UI complete for:
  - `LoginPage`, `TwoFactorPage`, `ForgotPasswordPage`,
    `VerifyEmailPage`, `ResetPasswordPage`, `PasswordChangedPage`.
- Auth0 login and logout working end-to-end.
- Protected routing in place via `ProtectedRoute`.
- Ready to continue building Home dashboard UI and core HRMS modules (employee, attendance, leaves, payroll, performance, settings).
```
------------------------
# HRMS App – 20-11-2025 Progress Log

## 1. Sidebar + Dashboard Layout

### New / Updated Components

- `src/components/atomic/organisms/HRMSSidebar.jsx`
  - Sidebar with:
    - Company `Logo` atom
    - Navigation items (Home, Employee, Attendance, Leaves, Performance, Payroll, Settings)
    - Active state styling
  - Supports props:
    - `isCollapsed` – icon-only rail when `true`
    - `onItemClick` – closes mobile drawer on nav click
    - `onToggleCollapse` – toggles collapsed state from inside sidebar
  - Internal UI:
    - Collapse/expand toggle button in the sidebar header
    - When collapsed (md+):
      - Sidebar width shrinks
      - Nav labels hidden, only icons shown
      - Toggle button stacked above logo with rounded soft background

- `src/components/atomic/templates/DashboardLayout.jsx`
  - App shell for all authenticated pages:
    - Desktop: `Flex` layout with collapsible sidebar on the left and main content on the right
    - Mobile: sidebar shown as a `Drawer`
  - Uses:
    - `SIDEBAR_EXPANDED = 260`
    - `SIDEBAR_COLLAPSED = 72`
  - Behavior:
    - Desktop:
      - `<Box as="aside" w={sidebarWidth}>` renders `HRMSSidebar`
      - Content has `ml={0}` (no extra gap)
    - Mobile:
      - Sidebar hidden in main layout
      - Drawer with full sidebar opens from left

- `src/components/atomic/organisms/TopBar.jsx`
  - Sticky header on top of content
  - Shows:
    - Mobile hamburger (`SidebarToggleButton`) to open the sidebar drawer
    - Greeting text with Auth0 user name/email
    - `LogoutButton` on the right
  - Desktop collapse toggle moved into `HRMSSidebar` (TopBar now only handles mobile open)

- `src/components/atomic/atoms/SidebarToggleButton.jsx`
  - Small `IconButton` (hamburger) shown on mobile only
  - Triggers `onOpenSidebarMobile` in `DashboardLayout` via `TopBar`

## 2. Dashboard Content Enhancements

- `BirthdayTrackerCard`
  - Uses `Flex` + `flex="1"` to grow vertically and align with `CalendarCard`
  - Layout: avatar + name + date (below) + role on the right
  - Tweaked so Birthday Tracker and Calendar cards align better in height

- `CalendarCard`
  - Calendar header icon styled:
    - Background: `#7152F31A`
    - Fully rounded
    - Icon color: `#7152F3` (brighter than background)

- `InfoRow` + vertical status bar
  - `InfoRow` updated with a small vertical bar on the left:
    - `status="upcoming"` → purple bar (`#7152F3`)
    - `status="past"` → gray bar
  - Used in `HolidaysCard` and `CompanyEventsCard` to visually denote upcoming vs past entries

- `HRMSButton`
  - Gradient button atom:
    - `bgGradient="linear(to-r, #307DC7, #C1B9B8)"`
    - Rounded (`borderRadius="full"`)
  - Optional `withPlusIcon` prop:
    - Renders a small white circular `+` icon on the left (FiPlus)
  - Used for “Add New Holiday” and “Add an Event” buttons

## 3. Sidebar Behavior Summary

- **Mobile (`base`):**
  - Sidebar hidden in main layout
  - `TopBar` shows hamburger (`SidebarToggleButton`)
  - Clicking opens `Drawer` with `HRMSSidebar`
  - `onItemClick` closes drawer on navigation

- **Desktop (`md+`):**
  - Sidebar always visible on the left
  - Can be toggled between:
    - Expanded (full width, logo + labels)
    - Collapsed (narrow, icons only)
  - Collapse/expand button lives inside `HRMSSidebar` header (above/beside the logo)

---

## Updated Folder Structure (Relevant Parts)

```
hrms-app/
├── apps/
│   └── frontend-ui-monorepo/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── atomic/
│       │   │   │   ├── atoms/
│       │   │   │   │   ├── Logo.jsx
│       │   │   │   │   ├── HRMSButton.jsx
│       │   │   │   │   ├── StatusDot.jsx
│       │   │   │   │   └── SidebarToggleButton.jsx
│       │   │   │   ├── molecules/
│       │   │   │   │   ├── LogoutButton.jsx
│       │   │   │   │   ├── HRMSCard.jsx
│       │   │   │   │   ├── InfoRow.jsx
│       │   │   │   │   ├── LegendItem.jsx
│       │   │   │   │   └── BirthdayListItem.jsx
│       │   │   │   ├── organisms/
│       │   │   │   │   ├── HRMSSidebar.jsx
│       │   │   │   │   ├── TopBar.jsx
│       │   │   │   │   ├── NoticeBoardCard.jsx
│       │   │   │   │   ├── HolidaysCard.jsx
│       │   │   │   │   ├── CompanyEventsCard.jsx
│       │   │   │   │   ├── BirthdayTrackerCard.jsx
│       │   │   │   │   └── CalendarCard.jsx
│       │   │   │   └── templates/
│       │   │   │       └── DashboardLayout.jsx
│       │   │   └── ui/
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   ├── home/
│       │   │   │   └── HomePage.jsx
│       │   │   ├── employee/
│       │   │   ├── attendance/
│       │   │   ├── leaves/
│       │   │   ├── payroll/
│       │   │   ├── performance/
│       │   │   └── settings/
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── AuthRoutes.jsx
│       │   │   └── HomeRoutes.jsx
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
├── packages/
│   ├── ui/
│   └── shared/
├── package.json
├── turbo.json
└── README.md
```


------------------------------
16-12-2025 
------------------------------



hrms-app/
├── apps/
│   └── frontend-ui-monorepo/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── atomic/
│       │   │   │   ├── atoms/
│       │   │   │   │   ├── Logo.jsx
│       │   │   │   │   ├── HRMSButton.jsx
│       │   │   │   │   ├── StatusDot.jsx
│       │   │   │   │   └── SidebarToggleButton.jsx
│       │   │   │   ├── molecules/
│       │   │   │   │   ├── LogoutButton.jsx
│       │   │   │   │   ├── HRMSCard.jsx
│       │   │   │   │   ├── InfoRow.jsx
│       │   │   │   │   ├── LegendItem.jsx
│       │   │   │   │   ├── BirthdayListItem.jsx
│       │   │   │   │   └── DepartmentListItem.jsx   # NEW: reusable row with view/edit/delete
│       │   │   │   ├── organisms/
│       │   │   │   │   ├── HRMSSidebar.jsx
│       │   │   │   │   ├── TopBar.jsx
│       │   │   │   │   ├── NoticeBoardCard.jsx
│       │   │   │   │   ├── HolidaysCard.jsx
│       │   │   │   │   ├── CompanyEventsCard.jsx
│       │   │   │   │   ├── BirthdayTrackerCard.jsx
│       │   │   │   │   ├── CalendarCard.jsx
│       │   │   │   │   └── EmployeeTable.jsx        # UPDATED: now accepts filterType/filterValue
│       │   │   │   └── templates/
│       │   │   │       └── DashboardLayout.jsx
│       │   │   └── ui/
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   ├── home/
│       │   │   │   └── HomePage.jsx
│       │   │   ├── employee/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── EmployeeListPage.jsx        # UPDATED: reads filter from location.state and passes to table
│       │   │   │   │   └── EmployeeDepartmentsPage.jsx # NEW: Departments & Teams management
│       │   │   ├── attendance/
│       │   │   ├── leaves/
│       │   │   ├── payroll/
│       │   │   ├── performance/
│       │   │   └── settings/
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── AuthRoutes.jsx
│       │   │   └── HomeRoutes.jsx
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
├── packages/
│   ├── ui/
│   └── shared/
├── package.json
├── turbo.json
└── README.md

You are helping build the Employee module of an HRMS (React + Chakra UI, atomic design).

**Done today**

- Added `EmployeeDepartmentsPage.jsx` with:
  - Local state for departments and teams.
  - Add (append), Edit (inline rename), and Delete (with confirm) using `map`/`filter` on arrays.
- Enhanced `DepartmentListItem.jsx` to accept `onView`, `onEdit`, `onDelete` and show eye/edit/trash icons.
- Wired navigation + filtering:
  - Eye on a department navigates to `/employees` with `{ filterType: "department", filterValue: "<name>" }`.
  - `EmployeeListPage.jsx` reads this via location state and passes `filterType`/`filterValue` to `EmployeeTable`.
  - `EmployeeTable.jsx` filters `mockEmployees` by department before rendering rows.

**Next steps**

- Create similar pages under `features/employee/pages`:
  - `EmployeeBranchesPage.jsx` (Branches + Sites).
  - `EmployeeDesignationsPage.jsx` (Job titles).
  - `EmployeeStatusesPage.jsx` (Employment statuses).
  - `EmployeeExportPage.jsx` (export button).
- Reuse `DepartmentListItem` and the same add/edit/delete pattern.
- On eye click from those pages, navigate to `/employees` with appropriate `filterType` 
(`"branch"`, `"site"`, `"designation"`, `"status"`) 
and extend `EmployeeTable` to filter on the corresponding employee fields.


-------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------





------------------------------
15-01-2026 
------------------------------

## 📁 HRMS App – Updated Folder Structure

```txt
hrms-app/
├── apps/
│   └── frontend-ui-monorepo/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │
│       │   ├── components/
│       │   │   └── atomic/
│       │   │       ├── atoms/
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx          # NEW: standardized input atom
│       │   │       │   ├── StatusDot.jsx
│       │   │       │   └── SidebarToggleButton.jsx
│       │   │       │
│       │   │       ├── molecules/
│       │   │       │   ├── LogoutButton.jsx
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── BirthdayListItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   └── EmployeeConfigItem.jsx
│       │   │       │
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx
│       │   │       │   ├── TopBar.jsx
│       │   │       │   ├── EmployeeConfigCard.jsx
│       │   │       │   ├── EmployeeTable.jsx
│       │   │       │   ├── NoticeBoardCard.jsx
│       │   │       │   ├── HolidaysCard.jsx
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx
│       │   │       │   └── CalendarCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   ├── home/
│       │   │   │   └── HomePage.jsx
│       │   │   │
│       │   │   └── employee/
│       │   │       └── pages/
│       │   │           ├── EmployeeListPage.jsx
│       │   │           ├── EmployeeDepartmentsPage.jsx
│       │   │           ├── EmployeeBranchesPage.jsx
│       │   │           ├── EmployeeDesignationsPage.jsx
│       │   │           ├── EmployeeStatusesPage.jsx
│       │   │           ├── EmployeeTypesPage.jsx
│       │   │           └── EmployeeExportPage.jsx
│       │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── AuthRoutes.jsx
│       │   │   └── HomeRoutes.jsx
│       │
│       │   ├── App.jsx
│       │   └── main.jsx
│       │
│       ├── package.json
│       └── vite.config.js
│
├── packages/
│   ├── ui/
│   └── shared/
│       └── employeeFilters.js
│
├── package.json
├── turbo.json
└── README.md
```

---

## 🧾 Today’s Work — Prompt Summary (README / PR Friendly)

> **Today’s focus was on strengthening the Employee module UI architecture and enforcing design consistency.**
>
> We introduced a reusable design-system input atom (`HRMSInput`) to eliminate repeated Chakra `Input` styling across pages. All newly created Employee pages (Departments, Branches, Designations, Statuses, Types, Export) were updated to consume this atom, ensuring consistent input height, border radius, and visual behavior throughout the HRMS.
>
> Button alignment issues on the Branches/Locations page were resolved by standardizing flex alignment to match the Departments page layout. Navigation between Employee configuration pages was completed using route-driven config cards, keeping routing declarative and scalable.
>
> This work significantly reduced page-level CSS overrides, improved maintainability, and moved the frontend architecture closer to a proper atomic design system.

---

## 🚀 Recommended Next Steps

### **Immediate (UI-focused)**

1. Finalize **EmployeeExportPage UI** (checkboxes + export actions)
2. Add **empty / no-data states** to Employee tables
3. Extract a reusable **AddInputBlock** molecule (Input + Add button)

### **Design System**

4. Add:

   * `HRMSSelect`
   * `HRMSCheckbox`
5. Move common defaults into **Chakra theme**

### **Architecture (Later)**

6. Introduce global API layer (React Query / RTK Query)
7. Replace mock data with backend-ready services
8. Add permission-based UI (RBAC)


------------------------------------------------------------------------------------------------------------
17-01-2026
-------------------------------------------------------------------------------------------------------------
apps/frontend-ui-monorepo/
└── src/
    ├── components/
    │   └── atomic/
    │       ├── atoms/
    │       │   ├── HRMSButton.jsx
    │       │   ├── HRMSInput.jsx
    │       │   ├── Logo.jsx
    │       │   ├── SectionTitle.jsx
    │       │   ├── SidebarToggleButton.jsx
    │       │   ├── StatusDot.jsx
    │       │   └── index.js
    │       │
    │       ├── molecules/
    │       │   ├── HRMSCard.jsx
    │       │   ├── HRMSTable.jsx
    │       │   ├── EmployeeConfigItem.jsx
    │       │   ├── DepartmentListItem.jsx
    │       │   ├── EmployeeTableRow.jsx
    │       │   └── index.js
    │       │
    │       ├── organisms/
    │       │   ├── EmployeeTable.jsx
    │       │   ├── EmployeeConfigCard.jsx
    │       │   ├── HRMSSidebar.jsx
    │       │   ├── TopBar.jsx
    │       │   └── index.js
    │       │
    │       └── templates/
    │           ├── DashboardLayout.jsx
    │           └── index.js
    │
    ├── features/
    │   ├── employee/
    │   │   └── pages/
    │   │       ├── EmployeeListPage.jsx
    │   │       ├── EmployeeDepartmentsPage.jsx
    │   │       ├── EmployeeBranchesPage.jsx
    │   │       ├── EmployeeDesignationsPage.jsx
    │   │       ├── EmployeeStatusesPage.jsx
    │   │       ├── EmployeeTypesPage.jsx
    │   │       └── EmployeeExportPage.jsx
    │   │
    │   └── attendance/
    │       ├── pages/
    │       │   ├── AttendanceDashboardPage.jsx
    │       │   ├── WorkingDaysPage.jsx
    │       │   ├── WorkingHoursPage.jsx
    │       │   ├── WorkingRulesPage.jsx
    │       │   ├── EditWorkingRulePage.jsx
    │       │   ├── EditAttendancePage.jsx
    │       │   └── AttendanceExportPage.jsx
    │       │
    │       ├── components/
    │       │   ├── molecules/
    │       │   │   ├── AttendanceSearchInput.jsx
    │       │   │   ├── AttendanceStatusBadge.jsx
    │       │   │   ├── EmployeeAvatarName.jsx
    │       │   │   ├── WeekdaySelector.jsx
    │       │   │   ├── WorkingDayItem.jsx
    │       │   │   ├── WorkingHourItem.jsx
    │       │   │   ├── RuleListItem.jsx
    │       │   │   └── RuleField.jsx
    │       │   │
    │       │   └── organisms/
    │       │       ├── AttendanceTable.jsx
    │       │       ├── AttendanceTableRow.jsx
    │       │       ├── AttendanceConfigCard.jsx
    │       │       ├── WorkingDaysForm.jsx
    │       │       ├── WorkingDaysList.jsx
    │       │       ├── WorkingHoursCard.jsx
    │       │       ├── WorkingRulesList.jsx
    │       │       ├── RuleEditCard.jsx
    │       │       └── ExportAttendanceCard.jsx
    │       │
    │       └── constants/
    │           └── attendanceMockData.js
    │
    ├── routes/
    │   ├── AppRoutes.jsx
    │   ├── HomeRoutes.jsx
    │   └── AuthRoutes.jsx
    │
    ├── App.jsx
    └── main.jsx


/////////////////////////////////////////////////////////

26-01-2026

# 🚀 HRMS - Jan 26, 2026 (Attendance COMPLETE)

## ✅ TODAY DONE (6h)
- **Attendance Module 100%**: WorkingDays/Hours/Rules + Edit pages
- **2-col pattern**: Create form | List (View/Edit/Delete)
- **Navigation**: Dashboard → List → Edit detail → Filter back
- **UI**: Inline edit, date filter table, time inputs, rule badges

## 📁 UPDATED STRUCTURE

```txt
# 📁 HRMS Complete Folder Structure (Jan 26, 2026)

hrms-app/
├── apps/
│   └── frontend-ui-monorepo/
│       ├── src/
│       │   ├── components/
│       │   │   └── atomic/
│       │   │       ├── atoms/
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx ⭐NEW
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   └── EmployeeTableRow.jsx
│       │   │       │
│       │   │       ├── organisms/
│       │   │       │   ├── EmployeeTable.jsx (filter)
│       │   │       │   ├── EmployeeConfigCard.jsx
│       │   │       │   ├── HRMSSidebar.jsx
│       │   │       │   ├── TopBar.jsx
│       │   │       │   └── AttendanceConfigCard.jsx ⭐NEW
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/
│       │   │   ├── employee/
│       │   │   │   └── pages/ (✅ 7 COMPLETE)
│       │   │   │       ├── EmployeeListPage.jsx
│       │   │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │   │       ├── EmployeeBranchesPage.jsx
│       │   │   │       ├── EmployeeDesignationsPage.jsx
│       │   │   │       ├── EmployeeStatusesPage.jsx
│       │   │   │       ├── EmployeeTypesPage.jsx
│       │   │   │       └── EmployeeExportPage.jsx
│       │   │   │
│       │   │   └── attendance/ ⭐ **TODAY 100% ✅**
│       │   │       ├── pages/
│       │   │       │   ├── AttendanceDashboardPage.jsx
│       │   │       │   ├── WorkingDaysPage.jsx ⭐NEW
│       │   │       │   ├── WorkingHoursPage.jsx ⭐NEW
│       │   │       │   ├── WorkingRulesPage.jsx ⭐NEW
│       │   │       │   ├── EditWorkingRulePage.jsx ⭐NEW
│       │   │       │   ├── EditAttendancePage.jsx ⭐NEW (date table)
│       │   │       │   ├── EditWorkingDaysPage.jsx (TBD)
│       │   │       │   ├── AttendanceExportPage.jsx (TBD)
│       │   │       │   └── EditAttendancePage.jsx ⭐NEW
│       │   │       │
│       │   │       └── constants/
│       │   │           └── attendanceMockData.js ⭐NEXT
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── HomeRoutes.jsx ⭐ALL ROUTES ✅
│       │   │   └── AuthRoutes.jsx
│       │   │
│       │   ├── App.jsx
│       │   └── main.jsx
│       │
│       ├── package.json
│       └── vite.config.js
│
├── packages/
│   ├── ui/
│   └── shared/
├── package.json
├── turbo.json
└── README.md
```
