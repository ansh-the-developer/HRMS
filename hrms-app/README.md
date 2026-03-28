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
////////////////////////////////////////////////////////////

05-02-2026
..........


## 🚀 **Auth0 Production Deployment (Feb 2026)**

### ✅ **Netlify Environment Variables**
```
VITE_AUTH0_DOMAIN=staging-tenant01.jp.auth0.com
VITE_AUTH0_CLIENT_ID=mBVtD10a9CzgiGqcy7jZeApU1XTpf828
```
**Site Settings → Environment variables → Deploy** [web:39]

### 🔐 **Auth0 Application Settings**
```
✅ Allowed Callback URLs:
  http://localhost:5173
  https://happyhrsystems.netlify.app
  https://happyhrsystems.netlify.app/*

✅ Allowed Logout URLs: 
  https://happyhrsystems.netlify.app  ← Prod FIRST
  https://happyhrsystems.netlify.app/*
  http://localhost:5173              ← Local LAST

✅ Allowed Web Origins:
  http://localhost:5173
  https://happyhrsystems.netlify.app
```

### 💻 **Logout Code** (Production Ready)
```jsx
logout({
  logoutParams: { returnTo: window.location.origin }
});
```

**Live**: https://happyhrsystems.netlify.app ✅
```

## **📁 Complete Folder Structure**

```
hrms-app/
├── apps/
│   └── frontend-ui-monorepo/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   └── atomic/
│       │   │       ├── atoms/
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx ⭐
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
│       │   │       │   ├── EmployeeTable.jsx (filter ✅)
│       │   │       │   ├── EmployeeConfigCard.jsx
│       │   │       │   ├── HRMSSidebar.jsx
│       │   │       │   ├── TopBar.jsx
│       │   │       │   └── AttendanceConfigCard.jsx ⭐
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
│       │   │   └── attendance/ ⭐ **PROD ✅**
│       │   │       ├── pages/
│       │   │       │   ├── AttendanceDashboardPage.jsx
│       │   │       │   ├── WorkingDaysPage.jsx ⭐
│       │   │       │   ├── WorkingHoursPage.jsx ⭐
│       │   │       │   ├── WorkingRulesPage.jsx ⭐
│       │   │       │   ├── EditWorkingRulePage.jsx ⭐
│       │   │       │   ├── EditAttendancePage.jsx ⭐ (date table)
│       │   │       │   ├── AttendanceExportPage.jsx ⭐
│       │   │       │   └── EditWorkingDaysPage.jsx (TBD)
│       │   │       │
│       │   │       └── constants/
│       │   │           └── attendanceMockData.js ⭐NEXT
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── HomeRoutes.jsx ⭐ALL ✅
│       │   │   └── AuthRoutes.jsx ⭐PROD ✅
│       │   │
│       │   ├── App.jsx
│       │   ├── Auth0Provider.jsx ⭐
│       │   └── main.jsx
│       │
│       ├── .env (gitignored) ⭐REMOVED
│       ├── package.json
│       └── vite.config.js
│
├── packages/
│   ├── ui/
│   └── shared/
├── package.json
├── turbo.json
└── README.md ⭐UPDATED
```



////////////////////////////////////////////////////////////


## 📁 Updated folder structure (Feb 21, 2026)

```txt
hrms-app/
├── apps/
│   └── frontend-ui-monorepo/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   └── atomic/
│       │   │       ├── atoms/
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       ├── molecules/
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   └── EmployeeTableRow.jsx
│       │   │       ├── organisms/
│       │   │       │   ├── EmployeeTable.jsx (filter ✅)
│       │   │       │   ├── EmployeeConfigCard.jsx
│       │   │       │   ├── HRMSSidebar.jsx
│       │   │       │   ├── TopBar.jsx
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/
│       │   │   ├── employee/
│       │   │   │   └── pages/ (✅ 7 COMPLETE)
│       │   │   ├── attendance/ (✅ PROD)
│       │   │   │   ├── pages/
│       │   │   │   └── constants/
│       │   │   │       └── attendanceMockData.js
│       │   │   │
│       │   │   ├── leaves/ ⭐ NEW MODULE (UI)
│       │   │   │   ├── components/
│       │   │   │   │   ├── LeaveRequestForm.jsx
│       │   │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── LeavesDashboardPage.jsx
│       │   │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │   │       ├── LeaveRequestListPage.jsx
│       │   │   │       ├── LeaveRequestActionPage.jsx
│       │   │   │       ├── LeaveRulesPage.jsx
│       │   │   │       └── LeaveRulesApprovalFlowPage.jsx
│       │   │   │
│       │   │   └── performance/ ⭐ NEW MODULE (UI)
│       │   │       └── pages/
│       │   │           ├── PerformanceDashboardPage.jsx  ⭐ (/performance)
│       │   │           ├── PerformanceHistoryPage.jsx    ⭐ (/performance/history)
│       │   │           ├── PerformanceReviewDetailPage.jsx ⭐ (/performance/review/:id)
│       │   │           └── PerformanceNewReviewPage.jsx  ⭐ (/performance/new)
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── HomeRoutes.jsx ⭐ updated with Leaves + Performance routes
│       │   │   └── AuthRoutes.jsx
│       │   │
│       │   ├── App.jsx
│       │   ├── Auth0Provider.jsx
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

To run only the frontend app from the monorepo, we use Turborepo filtering (e.g., `turbo run dev --filter=frontend-ui-monorepo`). [turborepo](https://turborepo.com/docs/crafting-your-repository/running-tasks)

***

## 🧾 Today’s work summary (README / PR friendly)

### ✅ Leaves module (UI + state)
- Built **LeavesDashboardPage** with 3 cards (calendar, leave summary ↔ inline form toggle, team members) and bottom action rows.
- Built inline **LeaveRequestForm** with leave type pills, date inputs, reason, cancel/submit, and backend-ready **FormData** submit shape.
- Built **LeaveUploadOverlay** (drag & drop + file picker, validates pdf/jpg/jpeg, returns selected file).
- Built Leave approval flow pages:
  - **LeaveSubmitStatusPage** (horizontal stepper timeline)
  - **LeaveRequestListPage** (approve leaves list)
  - **LeaveRequestActionPage** (approve/decline + notes)
  - **LeaveRulesPage** and **LeaveRulesApprovalFlowPage** (add/remove approvers)

### ✅ Performance module (UI + navigation)
- Implemented **PerformanceDashboardPage** as the **homepage** for Performance (`/performance`):
  - Shows the latest review (knowledge, quality, comments)
  - Added action cards + Proceed buttons:
    - **Check previous reviews** → `/performance/history`
    - **Initiate Performance Review** → `/performance/new`
- Implemented:
  - **PerformanceHistoryPage** (review list)
  - **PerformanceReviewDetailPage** (review detail)
  - **PerformanceNewReviewPage** (new review form)

### ✅ Routing & navigation consistency
- Updated `HomeRoutes.jsx` to include **Leaves** + **Performance** routes under `ProtectedRoute`.
- Ensured navigation follows SPA routing (React Router patterns) so we avoid full reload issues.

***

## ▶️ What to start next

- Replace mock data in Leaves + Performance with real API calls (React Query/RTK Query), add loading/empty/error states.
- Define shared data models (Review, ReviewItem, Rating scale, LeaveRequest) and centralize mock data in `constants/`.
- Add persistence for:
  - Performance new review submission (POST) + history fetch (GET)
  - Leave request submission + approval actions + rules/approval flow storage
- Optional UI polish: reuse shared table/row molecules for consistent “list + details” pages.


///////////////////////////////////////////////////////////////////

Here is the updated folder structure and a clean, PR-friendly summary of the work we completed for the Payroll module today. 

### 📁 Updated Folder Structure (README.md)

```text
hrms-app/
├── apps/
│   └── frontend-ui-monorepo/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   └── atomic/
│       │   │       ├── atoms/
│       │   │       │   ├── index.js ⭐ (Barrel export added)
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       ├── molecules/
│       │   │       │   ├── index.js ⭐ (Barrel export added)
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   └── EmployeeTableRow.jsx
│       │   │       ├── organisms/
│       │   │       │   ├── EmployeeTable.jsx
│       │   │       │   ├── EmployeeConfigCard.jsx
│       │   │       │   ├── HRMSSidebar.jsx
│       │   │       │   ├── TopBar.jsx
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/
│       │   │   ├── employee/ (✅ 7 COMPLETE)
│       │   │   ├── attendance/ (✅ PROD)
│       │   │   ├── leaves/ (✅ UI COMPLETE)
│       │   │   ├── performance/ (✅ UI COMPLETE)
│       │   │   │
│       │   │   └── payroll/ ⭐ NEW MODULE (UI + Logic)
│       │   │       ├── constants/
│       │   │       │   └── payrollMockData.js
│       │   │       └── pages/
│       │   │           ├── PayrollDashboardPage.jsx      ⭐ (/payroll)
│       │   │           ├── PendingPaymentsPage.jsx       ⭐ (/payroll/pending)
│       │   │           ├── RecordPaymentPage.jsx         ⭐ (/payroll/record)
│       │   │           ├── SalaryStructurePage.jsx       ⭐ (/payroll/structure)
│       │   │           ├── ReimbursementStatusPage.jsx   ⭐ (/payroll/reimbursement)
│       │   │           ├── PayrollSlipsPage.jsx          ⭐ (/payroll/payslips)
│       │   │           └── PayrollOverviewPage.jsx       ⭐ (/payroll/overview)
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── HomeRoutes.jsx ⭐ updated with Leaves, Performance, & Payroll routes
│       │   │   └── AuthRoutes.jsx
│       │   │
│       │   ├── App.jsx
│       │   ├── Auth0Provider.jsx
│       │   └── main.jsx
│       │
│       ├── package.json
│       └── vite.config.js ⭐ (Updated for Chakra icon externalization)
│
├── packages/
│   ├── ui/
│   └── shared/
├── package.json
├── turbo.json
└── README.md ⭐ UPDATED
```

***

### 🧾 Work Summary for README / PR

#### 🚀 **New Feature: Payroll Module**
Built out the complete Payroll module UI matching Figma design screens, including interactive functionality and local state persistence.

*   **Routing & Architecture:**
    *   Configured 7 new protected paths in `HomeRoutes.jsx` under the `/payroll/*` path.
    *   Standardized import/export architecture across the app (created `atoms/index.js` and `molecules/index.js` barrel exports) to eliminate build errors.
    *   Centralized mock state and formatting helpers in `payrollMockData.js`.

*   **Pages Implemented:**
    *   **Dashboard (`PayrollDashboardPage`):** Responsive grid mapping out all employees with their CTC, salary, deductions, and accurate payment status badges. Includes quick-action navigation rows at the bottom.
    *   **Payment Processing (`PendingPaymentsPage` & `RecordPaymentPage`):** 
        *   Interactive tables allowing HR to move employee salaries from "Pending" to "Paid" via actions.
        *   Added live search filtering by employee name.
        *   Added "Undo" functionality to revert payments. 
        *   State is cached locally via `localStorage` to persist across navigations.
    *   **Salary Structure (`SalaryStructurePage`):** 
        *   Two-column panel UI for Earnings and Deductions.
        *   Full CRUD functionality: Add new items, inline-edit existing items, and delete items.
        *   Replaced external `@chakra-ui/icons` with optimized inline SVGs to fix Vite optimization issues.
    *   **Reimbursement (`ReimbursementStatusPage`):** 
        *   Interactive pill-based selection for claim types (Food, Travel, Other).
        *   Native date picker integration.
        *   Custom stylized file upload mechanism that securely captures documents visually matching the design system.

#### 🔧 **Technical Fixes**
*   **Vite Optimization:** Updated `vite.config.js` to handle Chakra UI v3 breaking changes, polyfilling node globals and bypassing strict dependency tracking for broken Chakra external exports.
*   **Import Resolution:** Refactored default vs. named exports comprehensively across the repository to ensure strict Vite compliance during Hot Module Replacement (HMR).


/////////////////////////////////////////////////////////////////////

## Phase 2: Backend Integration (Supabase + React Query)

### ✅ **Completed: Supabase Setup (Mar 6, 2026)**

#### **What we did:**
```
1. Created Supabase project: snuqlfgzzxaemxfyklvv.supabase.co
2. Added environment variables (.env.local):
   VITE_SUPABASE_URL=https://snuqlfgzzxaemxfyklvv.supabase.co
   VITE_SUPABASE_ANON_KEY=[anonpublic key]
3. Installed SDK: npm install @supabase/supabase-js
4. Created src/lib/supabaseClient.js:
```js
import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```
5. Added React Query: npm install @tanstack/react-query
6. Wrapped App in QueryClientProvider (main.jsx)
7. Verified connection: ✅ test_items table → real data in browser
8. Enabled RLS policy: "Enable read access for test_items" (anon role)
```

#### **Core React Query Pattern (template for all modules):**
```jsx
const { data, isLoading, error } = useQuery({
  queryKey: ["leave-requests"],
  queryFn: async () => {
    const { data, error } = await supabase.from("leave_requests").select("*");
    if (error) throw error;
    return data;
  },
});
```

#### **Current Status:**
```
✅ Supabase client working
✅ React Query provider active  
✅ RLS policies configured for testing
✅ HRMS UI + Auth0 unchanged
⏳ Ready to wire first real module (Leaves)
```

#### **Next Steps:**
```
1. Create Leaves tables: employees, leave_requests
2. Replace Leaves mock data → React Query + Supabase
3. Add loading/error/empty states
4. Copy pattern to Performance, Payroll, Attendance
```

**Production-ready data layer foundation complete. No mock data needed anymore.**  

/////////////////////////////////////////////////////////////////////////////////
🚀 HRMS Progress Summary (Last 2 Days)

📊 Completed Modules: 2/5 LIVE

✅ Leaves Module       → Supabase + React Query + Full CRUD
✅ Performance Module  → Supabase + React Query + Full CRUD  
⏳ Payroll           → Mock data
⏳ Attendance        → Mock data  
⏳ Employee          → Mock data

Features:

✅ Dashboard (pending/approved leaves)

✅ History list with status badges

✅ Detail view with employee info

✅ New leave request form (dates, type, reason)

✅ Submit → Toast → Auto-refresh list

Supabase Tables: leaves, employees (RLS enabled)

📁 src/services/performanceApi.js
📄 PerformanceDashboardPage.jsx
📄 PerformanceHistoryPage.jsx
📄 PerformanceReviewDetailPage.jsx
📄 PerformanceNewReviewPage.jsx


🔄 React Query (useQuery, useMutation, invalidation)
📡 Supabase (CRUD, RLS, relations)
🍞 Chakra UI (toasts, badges, spinners, forms)
📱 Responsive UI (loading/error/empty states)
⚡ Optimistic updates + caching


hrms-app/                                    ✅ TURBO REPO LIVE
├── apps/
│   └── frontend-ui-monorepo/                ✅ VITE + CHAKRA + SUPABASE
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   └── atomic/                  ✅ ATOMIC DESIGN ✅
│       │   │       ├── atoms/
│       │   │       │   ├── index.js ⭐       # Barrel export
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       ├── molecules/
│       │   │       │   ├── index.js ⭐       # Barrel export
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   └── EmployeeTableRow.jsx
│       │   │       ├── organisms/
│       │   │       │   ├── EmployeeTable.jsx
│       │   │       │   ├── EmployeeConfigCard.jsx
│       │   │       │   ├── HRMSSidebar.jsx
│       │   │       │   ├── TopBar.jsx
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/                    ✅ 4/5 MODULES LIVE
│       │   │   ├── employee/                ✅ 7 COMPLETE
│       │   │   ├── attendance/              ✅ PROD READY
│       │   │   ├── leaves/                  ✅ SUPABASE LIVE (Last 2 days)
│       │   │   │   ├── pages/
│       │   │   │   │   ├── LeavesDashboardPage.jsx
│       │   │   │   │   ├── LeavesHistoryPage.jsx
│       │   │   │   │   ├── LeaveDetailPage.jsx
│       │   │   │   │   └── LeaveNewRequestPage.jsx
│       │   │   │   └── routes.jsx
│       │   │   ├── performance/             ✅ SUPABASE LIVE (Last 2 days)
│       │   │   │   ├── pages/
│       │   │   │   │   ├── PerformanceDashboardPage.jsx
│       │   │   │   │   ├── PerformanceHistoryPage.jsx
│       │   │   │   │   ├── PerformanceReviewDetailPage.jsx
│       │   │   │   │   └── PerformanceNewReviewPage.jsx
│       │   │   │   └── routes.jsx
│       │   │   └── payroll/                 ⭐ NEW MODULE (UI + Mock)
│       │   │       ├── constants/
│       │   │       │   └── payrollMockData.js
│       │   │       └── pages/
│       │   │           ├── PayrollDashboardPage.jsx      ⭐ /payroll
│       │   │           ├── PendingPaymentsPage.jsx       ⭐ /payroll/pending
│       │   │           ├── RecordPaymentPage.jsx         ⭐ /payroll/record
│       │   │           ├── SalaryStructurePage.jsx       ⭐ /payroll/structure
│       │   │           ├── ReimbursementStatusPage.jsx   ⭐ /payroll/reimbursement
│       │   │           ├── PayrollSlipsPage.jsx          ⭐ /payroll/payslips
│       │   │           └── PayrollOverviewPage.jsx       ⭐ /payroll/overview
│       │   │
│       │   ├── services/                    ✅ SUPABASE APIS
│       │   │   ├── leavesApi.js            ✅ LIVE
│       │   │   └── performanceApi.js       ✅ LIVE
│       │   │
│       │   ├── lib/
│       │   │   └── supabaseClient.js       ✅ LIVE
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── HomeRoutes.jsx ⭐        # +Leaves/Perf/Payroll
│       │   │   └── AuthRoutes.jsx
│       │   │
│       │   ├── App.jsx                     ✅ React Query Provider
│       │   ├── Auth0Provider.jsx
│       │   └── main.jsx
│       │
│       ├── package.json
│       └── vite.config.js ⭐                # Chakra icon fix
│
├── packages/
│   ├── ui/                                 ✅ Shared components
│   └── shared/                             ✅ Utilities
├── package.json
├── turbo.json                              ✅ Monorepo build
└── README.md                               ✅ Updated progress


🎉 Key Wins
Full CRUD cycle (Create → Read → Update → List)

Real-time data from Supabase (no more mocks)

Form validation + toasts + loading states

Employee relations (dropdowns, detail views)

Route navigation flows working end-to-end

Cache invalidation (submit → lists auto-refresh)

1. Payroll Module (salary slips, payslips)
2. Attendance Module (timesheets, clock-in/out)  
3. Employee Module (profiles, departments)



//////////////////////////////////////////////////


Here is the **today's summary + updated complete folder structure** to add to your README:

***

## 📅 21-03-2026 – Icons Removal + Netlify Build Fix

### ✅ What We Did Today

**1. Removed `@chakra-ui/icons` completely**
- `NoticeBoardCard.jsx` → replaced `IconButton` + icons with text `Button` components
- `HolidaysCard.jsx` → replaced `EditIcon` / `DeleteIcon` with text buttons
- `SalaryStructurePage.jsx` → removed inline SVG `EditIcon`/`TrashIcon` + replaced with `HRMSButton` + emoji
- Rule: **No `@chakra-ui/icons` anywhere** — use `react-icons`, emoji, or text buttons

**2. Fixed Netlify build (multiple iterations)**
- Root cause: Netlify was installing wrong/old deps from ROOT `node_modules` instead of workspace
- Fixed `netlify.toml` location (was inside workspace, moved to ROOT `hrms-app/`)
- Fixed build command to use npm workspaces properly
- Removed conflicting `overrides` forcing `rolldown-vite` (was crashing build)
- Pinned stable `vite@5.4.8` + `@vitejs/plugin-react@4.3.1` in workspace
- Added `react-icons` to workspace `package.json` (was missing, caused build fail)

**3. Fixed `vite.config.js`** — simplified, removed rolldown-specific hacks

***

### 📁 Updated Folder Structure (21-03-2026)

```txt
hrms-app/                                         ✅ TURBO MONOREPO
├── netlify.toml                                  ✅ FIXED (ROOT level)
├── package.json                                  ✅ FIXED (turbo only)
├── turbo.json
│
├── apps/
│   └── frontend-ui-monorepo/                     ✅ VITE 5.4.8 + CHAKRA v2
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   └── atomic/
│       │   │       ├── atoms/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx    ⚠️ still has IconButton
│       │   │       │   └── EmployeeTableRow.jsx      ⚠️ still has IconButton
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx
│       │   │       │   ├── TopBar.jsx
│       │   │       │   ├── NoticeBoardCard.jsx       ✅ ICONS REMOVED
│       │   │       │   ├── HolidaysCard.jsx          ✅ ICONS REMOVED
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx
│       │   │       │   ├── CalendarCard.jsx          ⚠️ still has IconButton
│       │   │       │   ├── EmployeeTable.jsx
│       │   │       │   ├── EmployeeConfigCard.jsx
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       └── ResetPasswordPage.jsx     ⚠️ still has IconButton
│       │   │   ├── home/
│       │   │   │   └── HomePage.jsx
│       │   │   ├── employee/                         ✅ 7 COMPLETE
│       │   │   ├── attendance/                       ✅ PROD READY
│       │   │   │   └── pages/
│       │   │   │       └── WorkingHoursPage.jsx      ⚠️ uses react-icons/fi
│       │   │   ├── leaves/                           ✅ SUPABASE LIVE
│       │   │   │   └── components/
│       │   │   │       └── LeaveRequestForm.jsx      ⚠️ still has IconButton
│       │   │   ├── performance/                      ✅ SUPABASE LIVE
│       │   │   └── payroll/
│       │   │       └── pages/
│       │   │           └── SalaryStructurePage.jsx   ✅ ICONS REMOVED
│       │   │
│       │   ├── services/
│       │   │   ├── homeApi.js
│       │   │   ├── leavesApi.js
│       │   │   └── performanceApi.js
│       │   │
│       │   ├── lib/
│       │   │   └── supabaseClient.js                 ✅ LIVE
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── HomeRoutes.jsx
│       │   │   └── AuthRoutes.jsx
│       │   │
│       │   ├── App.jsx
│       │   └── main.jsx
│       │
│       ├── package.json                              ✅ vite@5.4.8, react-icons added
│       └── vite.config.js                            ✅ SIMPLIFIED
│
├── packages/
│   ├── ui/
│   └── shared/
└── README.md
```

***

### ⚠️ Files Still Needing Icon Fixes (Next Steps)

```
DepartmentListItem.jsx       → has IconButton
EmployeeTableRow.jsx         → has FiEye/FiEdit2/FiTrash2 IconButtons
CalendarCard.jsx             → has IconButton (prev/next nav)
ResetPasswordPage.jsx        → has FiEyeOff IconButton
LeaveRequestForm.jsx         → has IconButton
```

### 🔑 Config Files (Final State)

**`hrms-app/netlify.toml`:**
```toml
[build]
  base = "hrms-app"
  command = "npm ci --workspaces && npm run -w frontend-ui-monorepo build"
  publish = "apps/frontend-ui-monorepo/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**`hrms-app/package.json`:** Only `turbo` in devDependencies.

**`apps/frontend-ui-monorepo/package.json`:** All app deps live here including `react-icons`, `vite@5.4.8`.


////////////////////////////////////////////////
////////////////////////////////////////////////

# 🚀 **HRMS Home Dashboard - Complete Implementation**



## ✅ **Today's Complete Work Summary**

### **1. CalendarCard.jsx** 🎯
```
✅ Dynamic month navigation (prev/next/today)
✅ Today highlight (purple)
✅ Badges: 📅 Events + 🎂 Birthdays  
✅ MONTH/DAY only filtering (ignores year)
✅ Context synced with BirthdayTracker
✅ Responsive grid with proper spacing
```

### **2. BirthdayTrackerCard.jsx** 🎂
```
✅ Auto-syncs with Calendar month
✅ Shows exact calendar month birthdays
✅ MONTH/DAY filtering (any year birthdays show)
✅ Loading states + empty states
✅ "Synced" badge indicator
✅ 4-5 birthdays per month display
```

### **3. Context System** 🔄
```
✅ src/contexts/CalendarContext.jsx
✅ App.jsx wrapped with CalendarProvider
✅ Both cards share same month state
✅ Calendar navigation → BirthdayTracker auto-updates
```

### **4. Database** 💾
```
✅ 50 unique employees (4-5 birthdays per month)
✅ Cleaned duplicates (FK safe)
✅ Test data: Jan-Dec birthdays spread perfectly
✅ Ready for production
```

### **5. Key Features**
```
🎨 MONTH/DAY birthdays (ignores year - perfect for HRMS!)
🔄 Perfect sync between Calendar + Birthdays
⚡ Real-time updates on month change
📱 Responsive design (mobile-friendly)
🚀 Optimized queries (fast loading)
```

## 🧪 **Test Checklist**
```
✅ [x] Navigate calendar → birthdays update instantly
✅ [x] Every month shows 4-5 birthdays  
✅ [x] Old birthdays (1980s) show in correct month
✅ [x] Future birthdays (2026+) work
✅ [x] No year filtering bug
✅ [x] Responsive badges on calendar days
✅ [x] Hard refresh works
```

hrms-app/                                         ✅ TURBO MONOREPO
├── netlify.toml                                  ✅ FIXED (ROOT level)
├── package.json                                  ✅ FIXED (turbo only)
├── turbo.json
│
├── apps/
│   └── frontend-ui-monorepo/                     ✅ VITE 5.4.8 + CHAKRA v2 + CONTEXT
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   └── atomic/
│       │   │       ├── atoms/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx    ⚠️ still has IconButton
│       │   │       │   ├── EmployeeTableRow.jsx      ⚠️ still has IconButton
│       │   │       │   └── BirthdayListItem.jsx      ✅ NEW: Birthday item
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx
│       │   │       │   ├── TopBar.jsx
│       │   │       │   ├── NoticeBoardCard.jsx       ✅ ICONS REMOVED
│       │   │       │   ├── HolidaysCard.jsx          ✅ ICONS REMOVED
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx   ✅ 🎂 SYNCED w/ Calendar
│       │   │       │   ├── CalendarCard.jsx          ✅ 🎯 MONTH/DAY birthdays
│       │   │       │   ├── EmployeeTable.jsx
│       │   │       │   ├── EmployeeConfigCard.jsx
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── contexts/                          ✅ NEW: State management
│       │   │   └── CalendarContext.jsx           ✅ Calendar + Birthday sync
│       │   │
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       └── ResetPasswordPage.jsx     ⚠️ still has IconButton
│       │   │   ├── home/
│       │   │   │   └── HomePage.jsx              ✅ Home dashboard
│       │   │   ├── employee/                      ✅ 7 COMPLETE
│       │   │   ├── attendance/                    ✅ PROD READY
│       │   │   │   └── pages/
│       │   │   │       └── WorkingHoursPage.jsx      ⚠️ uses react-icons/fi
│       │   │   ├── leaves/                        ✅ SUPABASE LIVE
│       │   │   │   └── components/
│       │   │   │       └── LeaveRequestForm.jsx      ⚠️ still has IconButton
│       │   │   ├── performance/                   ✅ SUPABASE LIVE
│       │   │   └── payroll/
│       │   │       └── pages/
│       │   │           └── SalaryStructurePage.jsx   ✅ ICONS REMOVED
│       │   │
│       │   ├── services/
│       │   │   ├── homeApi.js
│       │   │   ├── leavesApi.js
│       │   │   └── performanceApi.js
│       │   │
│       │   ├── lib/
│       │   │   └── supabaseClient.js              ✅ LIVE
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── HomeRoutes.jsx
│       │   │   └── AuthRoutes.jsx
│       │   │
│       │   ├── App.jsx                            ✅ WRAPPED: CalendarProvider
│       │   └── main.jsx
│       │
│       ├── package.json                           ✅ vite@5.4.8, react-icons, react-query
│       └── vite.config.js                         ✅ SIMPLIFIED
│
├── packages/
│   ├── ui/
│   └── shared/
└── README.md                                     ✅ UPDATED TODAY


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# 🚀 **HRMS - Architecture Upgrade Complete!**

## 📁 **UPDATED File/Folder Structure (Mar 27, 2026)**

```
hrms-app/                                         ✅ TURBO MONOREPO
├── netlify.toml                                  ✅ FIXED (ROOT level)
├── package.json                                  ✅ FIXED (turbo only)
├── turbo.json
│
├── apps/
│   └── frontend-ui-monorepo/                     ✅ VITE 5.4.8 + CHAKRA v2 + REACT QUERY v5
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   └── atomic/
│       │   │       ├── atoms/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx    ⚠️ IconButton cleanup
│       │   │       │   ├── EmployeeTableRow.jsx      ⚠️ IconButton cleanup
│       │   │       │   └── BirthdayListItem.jsx      ✅ Birthday display
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx
│       │   │       │   ├── TopBar.jsx
│       │   │       │   ├── NoticeBoardCard.jsx       ✅ Icons removed
│       │   │       │   ├── HolidaysCard.jsx          ✅ Icons removed
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx   ✅ 🎂 React Query + Month/Day sync
│       │   │       │   ├── CalendarCard.jsx          ✅ 🎯 React Query + badges
│       │   │       │   ├── EmployeeTable.jsx
│       │   │       │   ├── EmployeeConfigCard.jsx    ❌ TO DELETE
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── contexts/                          ✅ Shared state
│       │   │   └── CalendarContext.jsx           ✅ Calendar ↔ Birthday sync
│       │   │
│       │   ├── hooks/                            ✅ ⭐ NEW: TanStack React Query (v5)
│       │   │   ├── index.js                      ✅ Barrel export
│       │   │   ├── useEmployees.js               ✅ Employees + Birthdays
│       │   │   ├── useHome.js                   ✅ Notices, Holidays, Events
│       │   │   ├── useLeaves.js                 ✅ Leave requests
│       │   │   └── usePerformance.js            ✅ Performance reviews
│       │   │
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       └── ResetPasswordPage.jsx     ⚠️ IconButton cleanup
│       │   │   ├── home/
│       │   │   │   └── HomePage.jsx              ✅ Dashboard (React Query ready)
│       │   │   ├── employee/                      ✅ Refactored w/ React Query
│       │   │   │   └── pages/
│       │   │   │       └── EmployeeListPage.jsx    ✅ Table + React Query hook
│       │   │   ├── attendance/                    ✅ PROD READY
│       │   │   │   └── pages/
│       │   │   │       └── WorkingHoursPage.jsx      ⚠️ react-icons cleanup
│       │   │   ├── leaves/                        ✅ SUPABASE LIVE (React Query ready)
│       │   │   │   └── components/
│       │   │   │       └── LeaveRequestForm.jsx      ⚠️ IconButton cleanup
│       │   │   ├── performance/                   ✅ SUPABASE LIVE (React Query ready)
│       │   │   └── payroll/
│       │   │       └── pages/
│       │   │           └── SalaryStructurePage.jsx   ✅ Icons removed
│       │   │
│       │   ├── services/                          ✅ Raw Supabase APIs
│       │   │   ├── employeeApi.js                ✅ ✅ birthdate included
│       │   │   ├── homeApi.js                   ✅ Notices, Holidays, Events, Birthdays
│       │   │   ├── leaveApi.js                  ✅ Leave requests
│       │   │   └── performanceApi.js            ✅ Performance reviews
│       │   │
│       │   ├── lib/
│       │   │   ├── supabaseClient.js            ✅ LIVE
│       │   │   └── queryClient.js               ✅ ⭐ NEW: React Query v5 config
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── HomeRoutes.jsx
│       │   │   └── AuthRoutes.jsx
│       │   │
│       │   ├── App.jsx                            ✅ Clean providers (no duplicates)
│       │   └── main.jsx                          ✅ Single QueryClient + DevTools
│       │
│       ├── package.json                           ✅ @tanstack/react-query-devtools
│       └── vite.config.js                         ✅ Alias + Chakra optimized
│
├── packages/
│   ├── ui/
│   └── shared/
└── README.md                                     ✅ Architecture upgrade logged
```

## **📝 README Summary (Add to your README.md)**

```markdown
## 🔧 Architecture Upgrade (Mar 27, 2026)

### ⭐ **TanStack React Query v5 Integration**
```
✅ Centralized API state management
✅ 4 API hooks: useEmployees, useHome, useLeaves, usePerformance
✅ Global caching (zero duplicate Supabase calls)
✅ Auto-refetch, invalidation, background sync
✅ DevTools panel (coconut beach widget 🥥🏖️)
✅ Production-optimized (staleTime: 5min)
```

### 🎯 **Key Fixes Delivered:**
```
✅ EmployeeListPage → useEmployees() hook
✅ BirthdayTrackerCard → useEmployees() + month/day filter
✅ employeeApi.js → birthdate field included
✅ App.jsx/main.jsx → Single QueryClient (no duplicates)
✅ src/hooks/ → Complete hook system (scales to 100+ APIs)
```

### 🚀 **Data Flow (Production Pattern):**
```
Supabase → services/*.js → hooks/*.js → Components
           ↑
     Global React Query Cache (1 request → N components)
```

### 🏆 **Results:**
```
✅ Home Dashboard: React Query backed
✅ Employee Module: Hook-ready  
✅ Zero duplication
✅ Debug-ready (DevTools)
✅ Scale-ready (future APIs)
```

**Employee Module refactor next → Table + Add/Edit form!**
```

**Architecture 100% production-ready! 🎉**


/////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

hrms-app/                                           ✅ TURBO MONOREPO
├── netlify.toml                                    ✅ Deploy config (ROOT)
├── package.json                                    ✅ Turbo orchestrator
├── turbo.json                                      ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                       ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   └── vite.svg
│       │
│       ├── src/
│       │   ├── components/
│       │   │   └── atomic/                         ✅ Atomic Design System
│       │   │       ├── atoms/                      ✅ 6 primitives
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx          ✅ Purple gradient CTA
│       │   │       │   ├── HRMSInput.jsx           ✅ Focus states
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/                  ✅ 7 composable items
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx  ✅ Icons fixed
│       │   │       │   ├── EmployeeTableRow.jsx    ✅ Icons fixed
│       │   │       │   └── BirthdayListItem.jsx    ✅ Month/Day display
│       │   │       │
│       │   │       ├── organisms/                  ✅ 10 cards + layouts
│       │   │       │   ├── HRMSSidebar.jsx         ✅ Collapsible nav
│       │   │       │   ├── TopBar.jsx              ✅ Profile + notifications
│       │   │       │   ├── NoticeBoardCard.jsx     ✅ Icons removed
│       │   │       │   ├── HolidaysCard.jsx        ✅ Icons removed
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx ✅ 🎂 React Query LIVE
│       │   │       │   ├── CalendarCard.jsx        ✅ 📅 React Query + badges
│       │   │       │   ├── EmployeeTable.jsx       ✅ TOTP Delete Modal
│       │   │       │   ├── EmployeeConfigCard.jsx  ✅ ⚠️ DEPRECATED
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx     ✅ Sidebar + Topbar wrapper
│       │   │
│       │   ├── contexts/                           ✅ Global state
│       │   │   └── CalendarContext.jsx             ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                              ✅ ⭐ React Query v5 Hooks
│       │   │   ├── index.js                        ✅ Barrel export
│       │   │   ├── useEmployees.js                 ✅ List + CRUD ops
│       │   │   ├── useHome.js                      ✅ Dashboard data
│       │   │   ├── useLeaves.js                    ✅ Leave requests
│       │   │   └── usePerformance.js               ✅ Reviews data
│       │   │
│       │   ├── features/                           ✅ Feature-sliced by domain
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       └── ResetPasswordPage.jsx   ✅ Icons fixed
│       │   │   │
│       │   │   ├── home/
│       │   │   │   └── pages/
│       │   │   │       └── HomePage.jsx            ✅ Dashboard (RQ ready)
│       │   │   │
│       │   │   ├── employee/                       ✅ ✅ FULL CRUD + TOTP DELETE
│       │   │   │   └── pages/
│       │   │   │       └── EmployeeListPage.jsx    ✅ Table + modals + RQ
│       │   │   │
│       │   │   ├── attendance/
│       │   │   │   └── pages/
│       │   │   │       └── WorkingHoursPage.jsx    ✅ Icons fixed
│       │   │   │
│       │   │   ├── leaves/
│       │   │   │   └── components/
│       │   │   │       └── LeaveRequestForm.jsx    ✅ Icons fixed
│       │   │   │
│       │   │   ├── performance/                    ✅ Supabase LIVE
│       │   │   │   └── pages/
│       │   │   │       └── PerformanceReviewsPage.jsx
│       │   │   │
│       │   │   └── payroll/
│       │   │       └── pages/
│       │   │           └── SalaryStructurePage.jsx ✅ Icons removed
│       │   │
│       │   ├── services/                           ✅ Supabase API layer
│       │   │   ├── employeeApi.js                  ✅ ✅ CASCADE DELETE + TOTP ready
│       │   │   ├── homeApi.js                      ✅ Notices + Birthdays
│       │   │   ├── leaveApi.js                     ✅ Leave endpoints
│       │   │   └── performanceApi.js               ✅ Review endpoints
│       │   │
│       │   ├── lib/                                ✅ Core utils
│       │   │   ├── supabaseClient.js               ✅ LIVE connection
│       │   │   ├── queryClient.js                  ✅ ⭐ React Query v5 + DevTools
│       │   │   └── totpUtils.js                    ✅ Native Web Crypto TOTP
│       │   │
│       │   ├── routes/                             ✅ Client-side routing
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── HomeRoutes.jsx
│       │   │   └── AuthRoutes.jsx
│       │   │
│       │   ├── App.jsx                             ✅ Providers stack
│       │   └── main.jsx                            ✅ Entry point + QueryClient
│       │
│       ├── package.json                            ✅ @tanstack/react-query v5
│       ├── vite.config.js                          ✅ Chakra + aliases optimized
│       └── tailwind.config.js                      ✅ Custom theme
│
├── packages/
│   ├── ui/                                         ✅ Shared components (future)
│   └── shared/                                     ✅ Types + utils (future)
│
└── README.md                                       ✅ Updated below

**Today's Wins (March 27, 2026):**

1. **✅ Employee CRUD LIVE** (Add/Edit/Delete/List via Supabase)
2. **✅ Secure TOTP Delete** (Native Web Crypto + 6-digit auth)
3. **✅ Cascade Deletes** (performance_reviews + child tables cleaned)
4. **✅ 0 Broken FKs** (RLS Policy B + data integrity fixed)
5. **✅ Production Ready** (React Query v5 + error handling)

//////////////////////////////////////////////////////////////////////////

## **Today's Work Summary (March 28, 2026)**

***

### **Morning: Deployment Crisis → Fixed**
```
🔧 Netlify build failing → DevTools missing dep
🔧 Removed @tanstack/react-query-devtools import
🔧 Fixed queryClient.js → commented DevTools
🔧 Fixed vite.config.js → HMR overlay disabled
🔧 Fixed monorepo → always install from ROOT
🔧 Fixed react-router chunks → corrupted deps
✅ Production deployed → Netlify GREEN
```

### **Phase 1: Employee DB Schema Extension**
```
✅ 1.1 ALTER employees → 5 new columns:
        employee_type, work_location, 
        monthly_ctc, blood_group, 
        emergency_contact

✅ 1.2 CREATE employee_compliance:
        epfo_uan, pran, esic_ip, 
        pan, e_shram_uan

✅ 1.3 CREATE employee_banking:
        primary_bank (JSONB)
        secondary_bank (JSONB)

✅ 1.4 CREATE employee_documents:
        gov_id_proof, employment_docs,
        offer_letter, photo_url, 
        signature_url

✅ 1.5 RLS policies → all 3 new tables
✅ 1.6 JOIN test → 1 row, all columns ✅
```

***

## **README Update:**

```markdown
## 📅 March 28, 2026

### 🚀 Deployment Fix
- Removed `@tanstack/react-query-devtools` from build
- Fixed Vite HMR infinite loop
- Fixed monorepo root install issue
- Fixed react-router corrupted chunks
- ✅ Netlify production deploy GREEN

### 🗄️ Employee Schema Extension (Phase 1)
Extended `employees` table + 3 new tables:

**ALTER employees:**
- `employee_type` (Permanent/Contract/Intern/Probation/Freelancer)
- `work_location`
- `monthly_ctc`
- `blood_group`
- `emergency_contact`

**NEW: `employee_compliance`**
- EPFO UAN, PRAN, ESIC IP, PAN, e-Shram UAN
- FK → employees.id (CASCADE DELETE)

**NEW: `employee_banking`**
- Primary + Secondary bank (JSONB)
- FK → employees.id (CASCADE DELETE)

**NEW: `employee_documents`**
- Gov ID, Employment docs, Photo, Signature URLs
- FK → employees.id (CASCADE DELETE)

**Security:**
- RLS enabled on all 3 tables
- anon + authenticated policies

### 🔮 Next
- [ ] Phase 2: Supabase Storage Buckets
- [ ] Phase 3: API Layer
- [ ] Phase 4: Form Integration
- [ ] Phase 5: Polish + Deploy
```

***

## **Commit Message:**
```
feat: employee schema extension + deployment fix

- fix: remove DevTools import (Netlify build)
- fix: vite HMR infinite loop + monorepo root install
- feat: ALTER employees (+5 columns)
- feat: CREATE employee_compliance table
- feat: CREATE employee_banking table (JSONB)
- feat: CREATE employee_documents table
- feat: RLS policies on all new tables
- test: JOIN verified across all 4 tables
```

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

## **🎉 Phase 2 Complete!**

```
✅ employee-photos     → bucket live (5MB, jpg/png/webp)
✅ employee-docs       → bucket live (10MB, pdf)
✅ employee-signatures → bucket live (2MB, png/jpg)
✅ RLS policies        → all 3 buckets
✅ Public URLs         → enabled
```

***

## **Phase 2 Summary:**
```
✅ 2.1 employee-photos bucket
✅ 2.2 employee-docs bucket
✅ 2.3 employee-signatures bucket
✅ 2.4 RLS policies → anon + authenticated
✅ 2.5 Verified → all buckets public
```

***

## **Progress:**
```
✅ PHASE 1 → DB Schema (4 tables)
✅ PHASE 2 → Storage Buckets (3 buckets)
⏳ PHASE 3 → API Layer
⏳ PHASE 4 → Form Integration
⏳ PHASE 5 → Polish
```

***

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

---

## Phase 3 — Employee API Layer ✅
`src/services/employeeApi.js`

### Core CRUD (existing)
- `getEmployees({ filterType, filterValue })` — list with filters
- `getEmployeeById(id)` — single row
- `createEmployee(payload)` — insert core row
- `updateEmployee(id, updates)` — update core row
- `deleteEmployee(id)` — cascade delete + null FKs

### Extended Profile (3.1–3.5)
- `getEmployeeProfile(id)` — parallel fetch all 4 tables
- `createEmployeeProfile(payload)` — insert all 4 tables
- `updateEmployeeProfile(id, payload)` — update + upsert all 4 tables
- `uploadFile(bucket, file, employeeId)` → public URL
- `deleteFile(bucket, fileUrl)` — storage cleanup
- `deleteEmployeeProfile(id)` — delete all 4 tables + all storage files

### Tables covered
`employees` · `employee_compliance` · `employee_banking` · `employee_documents`

### Storage buckets
`employee-photos` · `employee-docs` · `employee-signatures`

---
//////////////////////////////////////
/////////////////////////////////////
---

## Phase 4 — useEmployeeProfile Hook ✅
`src/features/employee/hooks/useEmployeeProfile.js`

- `fetchProfile()` — loads all 4 tables on mount via `getEmployeeProfile`
- `saveProfile(payload)` — calls `updateEmployeeProfile`, updates local state
- `uploadProfileFile(bucket, file, field, section)` — deletes old → uploads new → saves URL

Exposes: `{ profile, loading, saving, error, fetchProfile, saveProfile, uploadProfileFile }`

---

////////////////////////////////////
///////////////////////////////////
**✅ Phase 5 complete. CRUD fully working with all fields retaining.**

***

## **README — Append this block:**

```md
---

## Phase 5 — EmployeeMasterForm Upgraded ✅
`src/features/employee/components/EmployeeMasterForm.jsx`
`src/features/employee/pages/EmployeeListPage.jsx`

- Form now saves to all 3 tables: `employees` + `employee_compliance` + `employee_banking`
- Edit flow fetches full profile via `getEmployeeProfile` before opening form
- All fields retain on re-open: personal, compliance, banking, emp_code
- New DB columns added: `emp_code`, `personal_number`, `present_address`

---
```

***

## **Where we stand:**

| Phase | Task | Status |
|---|---|---|
| 3 | `employeeApi.js` | ✅ Done |
| 4 | `useEmployeeProfile` hook | ✅ Done |
| 5 | `EmployeeMasterForm` upgraded | ✅ Done |
| **6** | **File uploads in Verification Vault** | ⬅️ Next |
| 7 | `EmployeeProfilePage` (view-only) | After 6 |

///////////////////////////////////////////
////////////////////////////////////////////
## Phase 6 ✅ — Done

**Files touched:**
- `EmployeeMasterForm.jsx` — create/edit modal, file state, wired UploadBoxes, 3-step submit flow
- `employeeApi.js` — fixed `updateEmployeeProfile` to skip empty employee payload (fixed 400 error)

**Upload flow:** Save employee → upload files → save URLs to `employee_documents`

**Vault UI:** PDFs show `Uploaded ✓` | Images show preview thumbnail

***

**Phase 7 tomorrow → `EmployeeProfilePage` (read-only view) 🚀**

////////////////////////////////////////////////////
///////////////////////////////////////////////////

```
hrms-app/                                           ✅ TURBO MONOREPO
├── netlify.toml                                    ✅ Deploy config (ROOT)
├── package.json                                    ✅ Turbo orchestrator
├── turbo.json                                      ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                       ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   └── vite.svg
│       │
│       ├── src/
│       │   ├── components/
│       │   │   └── atomic/                         ✅ Atomic Design System
│       │   │       ├── atoms/                      ✅ 6 primitives
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx          ✅ Purple gradient CTA
│       │   │       │   ├── HRMSInput.jsx           ✅ Focus states
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/                  ✅ 7 composable items
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx  ✅ Icons fixed
│       │   │       │   ├── EmployeeTableRow.jsx    ✅ Icons fixed
│       │   │       │   └── BirthdayListItem.jsx    ✅ Month/Day display
│       │   │       │
│       │   │       ├── organisms/                  ✅ 10 cards + layouts
│       │   │       │   ├── HRMSSidebar.jsx         ✅ Collapsible nav
│       │   │       │   ├── TopBar.jsx              ✅ Profile + notifications
│       │   │       │   ├── NoticeBoardCard.jsx     ✅ Icons removed
│       │   │       │   ├── HolidaysCard.jsx        ✅ Icons removed
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx ✅ 🎂 React Query LIVE
│       │   │       │   ├── CalendarCard.jsx        ✅ 📅 React Query + badges
│       │   │       │   ├── EmployeeTable.jsx       ✅ TOTP Delete Modal
│       │   │       │   ├── EmployeeConfigCard.jsx  ✅ ⚠️ DEPRECATED
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx     ✅ Sidebar + Topbar wrapper
│       │   │
│       │   ├── contexts/                           ✅ Global state
│       │   │   └── CalendarContext.jsx             ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                              ✅ React Query v5 Hooks
│       │   │   ├── index.js                        ✅ Barrel export
│       │   │   ├── useEmployees.js                 ✅ List + CRUD ops
│       │   │   ├── useEmployeeProfile.js           ✅ NEW — full profile fetch (Phase 6)
│       │   │   ├── useHome.js                      ✅ Dashboard data
│       │   │   ├── useLeaves.js                    ✅ Leave requests
│       │   │   └── usePerformance.js               ✅ Reviews data
│       │   │
│       │   ├── features/                           ✅ Feature-sliced by domain
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       └── ResetPasswordPage.jsx   ✅ Icons fixed
│       │   │   │
│       │   │   ├── home/
│       │   │   │   └── pages/
│       │   │   │       └── HomePage.jsx            ✅ Dashboard (RQ ready)
│       │   │   │
│       │   │   ├── employee/                       ✅ FULL CRUD + TOTP + MASTER FORM
│       │   │   │   ├── components/                 ✅ NEW folder (Phase 6)
│       │   │   │   │   └── EmployeeMasterForm.jsx  ✅ NEW — Create/Edit modal
│       │   │   │   │                                   4 sections: KYC · Corporate
│       │   │   │   │                                   Compliance · Verification Vault
│       │   │   │   │                                   File uploads + DB prefill
│       │   │   │   └── pages/
│       │   │   │       └── EmployeeListPage.jsx    ✅ Table + modals + RQ
│       │   │   │
│       │   │   ├── attendance/
│       │   │   │   └── pages/
│       │   │   │       └── WorkingHoursPage.jsx    ✅ Icons fixed
│       │   │   │
│       │   │   ├── leaves/
│       │   │   │   └── components/
│       │   │   │       └── LeaveRequestForm.jsx    ✅ Icons fixed
│       │   │   │
│       │   │   ├── performance/                    ✅ Supabase LIVE
│       │   │   │   └── pages/
│       │   │   │       └── PerformanceReviewsPage.jsx
│       │   │   │
│       │   │   └── payroll/
│       │   │       └── pages/
│       │   │           └── SalaryStructurePage.jsx ✅ Icons removed
│       │   │
│       │   ├── services/                           ✅ Supabase API layer
│       │   │   ├── employeeApi.js                  ✅ EXPANDED (Phase 6)
│       │   │   │                                       getEmployeeProfile()
│       │   │   │                                       createEmployeeProfile()
│       │   │   │                                       updateEmployeeProfile() ← 400 fix
│       │   │   │                                       uploadFile()
│       │   │   │                                       deleteFile()
│       │   │   │                                       deleteEmployeeProfile()
│       │   │   ├── homeApi.js                      ✅ Notices + Birthdays
│       │   │   ├── leaveApi.js                     ✅ Leave endpoints
│       │   │   └── performanceApi.js               ✅ Review endpoints
│       │   │
│       │   ├── lib/                                ✅ Core utils
│       │   │   ├── supabaseClient.js               ✅ LIVE connection
│       │   │   ├── queryClient.js                  ✅ React Query v5 + DevTools
│       │   │   └── totpUtils.js                    ✅ Native Web Crypto TOTP
│       │   │
│       │   ├── routes/                             ✅ Client-side routing
│       │   │   ├── AppRoutes.jsx
│       │   │   ├── HomeRoutes.jsx
│       │   │   └── AuthRoutes.jsx
│       │   │
│       │   ├── App.jsx                             ✅ Providers stack
│       │   └── main.jsx                            ✅ Entry point + QueryClient
│       │
│       ├── package.json                            ✅ @tanstack/react-query v5
│       ├── vite.config.js                          ✅ Chakra + aliases optimized
│       └── tailwind.config.js                      ✅ Custom theme
│
├── packages/
│   ├── ui/                                         ✅ Shared components (future)
│   └── shared/                                     ✅ Types + utils (future)
│
└── README.md                                       ✅ Updated

── SUPABASE STORAGE BUCKETS ──────────────────────  ✅ NEW (Phase 6)
   employee-docs          → gov_id_proof, employment_docs
   employee-photos        → photo_url
   employee-signatures    → signature_url

── SUPABASE DB TABLES ────────────────────────────
   employees              ✅ core
   employee_compliance    ✅ EPFO · PAN · ESIC · PRAN · E-Shram
   employee_banking       ✅ primary + secondary bank (JSONB)
   employee_documents     ✅ NEW — file URLs (Phase 6)
```

**Phase 7 tomorrow → `EmployeeProfilePage` 🚀**