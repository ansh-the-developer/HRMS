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


///////////////////////////////////
//////////////////////////////////

## 📅 Today's Work Summary (Mar 31, 2026)

### Auth0 → Supabase Migration — Complete

| # | What | File |
|---|---|---|
| 1 | Supabase Auth context with session state | `AuthContext.jsx` |
| 2 | Split hook to fix Vite Fast Refresh | `useAuthContext.js` |
| 3 | Full `useAuth` hook with all auth methods | `useAuth.js` |
| 4 | Login with email/password + MFA check | `LoginPage.jsx` |
| 5 | Forgot password → reset email flow | `ForgotPasswordPage.jsx` |
| 6 | Reset password + strength bar + token guard | `ResetPasswordPage.jsx` |
| 7 | Logout with `scope: local` | `LogoutButton.jsx` |
| 8 | User display name fallback chain | `TopBar.jsx` |
| 9 | Avatar + email + logout dropdown | `UserProfileMenu.jsx` |
| 10 | Spinner guard + session-aware redirect | `ProtectedRoute.jsx` |
| 11 | Removed double Router + PublicOnlyRoute | `AppRoutes.jsx` |
| 12 | Mapped all 6 auth pages to correct files | `AuthRoutes.jsx` |
| 13 | Wrapped in `<Routes>` + removed per-route guards | `HomeRoutes.jsx` |
| 14 | Removed `@auth0/auth0-react` package | `package.json` |
| 15 | Cleaned Netlify env vars (removed Auth0 + TOTP) | Netlify dashboard |

***

## 📁 Updated Complete Folder Structure

```
hrms-app/                                             ✅ TURBO MONOREPO
├── netlify.toml                                      ✅ Deploy config (ROOT)
├── package.json                                      ✅ Turbo orchestrator
├── turbo.json                                        ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                         ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   └── vite.svg
│       │
│       ├── src/
│       │   │
│       │   ├── lib/                                  ✅ Core utils
│       │   │   ├── supabaseClient.js                 ✅ Supabase LIVE connection
│       │   │   ├── queryClient.js                    ✅ React Query v5 + DevTools
│       │   │   └── totpUtils.js                      ✅ Native Web Crypto TOTP
│       │   │
│       │   ├── contexts/                             ✅ Global state
│       │   │   ├── AuthContext.jsx                   ✅ UPDATED — Supabase session
│       │   │   │                                         getSession() + onAuthStateChange()
│       │   │   │                                         isLoading starts true (undefined session)
│       │   │   │                                         isAuthenticated derived from !!session
│       │   │   ├── useAuthContext.js                 ✅ NEW — split from AuthContext
│       │   │   │                                         fixes Vite Fast Refresh warning
│       │   │   └── CalendarContext.jsx               ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                                ✅ React Query v5 Hooks
│       │   │   ├── index.js                          ✅ Barrel export
│       │   │   ├── useAuth.js                        ✅ UPDATED — full Supabase auth hook
│       │   │   │                                         signIn / signOut (scope:local)
│       │   │   │                                         forgotPassword / resetPassword (alias)
│       │   │   │                                         updatePassword
│       │   │   │                                         enrollMFA / challengeMFA / verifyMFA
│       │   │   ├── useEmployees.js                   ✅ List + CRUD ops
│       │   │   ├── useEmployeeProfile.js             ✅ Full profile fetch
│       │   │   ├── useHome.js                        ✅ Dashboard data
│       │   │   ├── useLeaves.js                      ✅ Leave requests
│       │   │   └── usePerformance.js                 ✅ Reviews data
│       │   │
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx                ✅ UPDATED — Supabase session guard
│       │   │   │                                         isLoading → Spinner (no flash)
│       │   │   │                                         isAuthenticated → children or /login
│       │   │   │                                         named + default export
│       │   │   │
│       │   │   └── atomic/                           ✅ Atomic Design System
│       │   │       ├── atoms/                        ✅ 6 primitives
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx            ✅ Gradient CTA
│       │   │       │   ├── HRMSInput.jsx             ✅ Focus states
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── LogoutButton.jsx          ✅ UPDATED — signOut() + navigate
│       │   │       │   │                                 scope:local (no 403 warning)
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx    ✅ Icons fixed
│       │   │       │   ├── EmployeeTableRow.jsx      ✅ Icons fixed
│       │   │       │   └── BirthdayListItem.jsx      ✅ Month/Day display
│       │   │       │
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx           ✅ Collapsible nav
│       │   │       │   ├── TopBar.jsx                ✅ UPDATED — useAuth user
│       │   │       │   │                                 full_name → name → email fallback
│       │   │       │   ├── UserProfileMenu.jsx       ✅ UPDATED — Supabase user shape
│       │   │       │   │                                 avatarUrl from user_metadata
│       │   │       │   │                                 signOut + navigate on logout
│       │   │       │   │                                 red Logout MenuItem
│       │   │       │   ├── NoticeBoardCard.jsx
│       │   │       │   ├── HolidaysCard.jsx
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx   ✅ React Query LIVE
│       │   │       │   ├── CalendarCard.jsx          ✅ React Query + badges
│       │   │       │   ├── EmployeeTable.jsx         ✅ TOTP Delete Modal
│       │   │       │   ├── EmployeeConfigCard.jsx    ⚠️ DEPRECATED
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx       ✅ Sidebar + Topbar wrapper
│       │   │
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── LoginPage.jsx             ✅ UPDATED — email/password form
│       │   │   │       │                                 signIn() from useAuth
│       │   │   │       │                                 MFA check → /verify-mfa
│       │   │   │       │                                 error Alert + show/hide password
│       │   │   │       ├── ForgotPasswordPage.jsx    ✅ UPDATED — forgotPassword()
│       │   │   │       │                                 two-state UI (form → success)
│       │   │   │       │                                 Try Again + Back to Login
│       │   │   │       ├── ResetPasswordPage.jsx     ✅ UPDATED — updatePassword()
│       │   │   │       │                                 token guard (type=recovery check)
│       │   │   │       │                                 password strength bar (4 levels)
│       │   │   │       │                                 live match feedback
│       │   │   │       ├── TwoFactorPage.jsx         ⏳ PENDING — TOTP Phase 1
│       │   │   │       ├── VerifyEmailPage.jsx       ✅ Exists
│       │   │   │       └── PasswordChangedPage.jsx   ✅ Exists
│       │   │   │
│       │   │   ├── home/
│       │   │   │   └── pages/
│       │   │   │       └── HomePage.jsx              ✅ Dashboard (RQ ready)
│       │   │   │
│       │   │   ├── employee/                         ✅ FULL CRUD + TOTP + MASTER FORM
│       │   │   │   ├── components/
│       │   │   │   │   └── EmployeeMasterForm.jsx    ✅ Create/Edit modal
│       │   │   │   └── pages/
│       │   │   │       ├── EmployeeListPage.jsx      ✅ Table + modals + RQ
│       │   │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │   │       ├── EmployeeBranchesPage.jsx
│       │   │   │       ├── EmployeeDesignationsPage.jsx
│       │   │   │       ├── EmployeeStatusesPage.jsx
│       │   │   │       ├── EmployeeTypesPage.jsx
│       │   │   │       └── EmployeeExportPage.jsx
│       │   │   │
│       │   │   ├── attendance/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── AttendanceDashboardPage.jsx
│       │   │   │   │   ├── WorkingDaysPage.jsx
│       │   │   │   │   ├── WorkingHoursPage.jsx      ✅ Icons fixed
│       │   │   │   │   ├── WorkingRulesPage.jsx
│       │   │   │   │   ├── EditWorkingRulePage.jsx
│       │   │   │   │   ├── EditAttendancePage.jsx
│       │   │   │   │   ├── EditWorkingDaysPage.jsx
│       │   │   │   │   └── AttendanceExportPage.jsx
│       │   │   │   └── constants/
│       │   │   │       └── attendanceMockData.js
│       │   │   │
│       │   │   ├── leaves/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LeaveRequestForm.jsx      ✅ Icons fixed
│       │   │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── LeavesDashboardPage.jsx
│       │   │   │       ├── LeaveRequiredFormPage.jsx
│       │   │   │       ├── LeaveRequestUploadPage.jsx
│       │   │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │   │       ├── LeaveRequestListPage.jsx
│       │   │   │       ├── LeaveRequestActionPage.jsx
│       │   │   │       ├── LeaveRulesPage.jsx
│       │   │   │       └── LeaveRulesApprovalFlowPage.jsx
│       │   │   │
│       │   │   ├── performance/                      ✅ Supabase LIVE
│       │   │   │   └── pages/
│       │   │   │       ├── PerformanceDashboardPage.jsx
│       │   │   │       ├── PerformanceHistoryPage.jsx
│       │   │   │       ├── PerformanceReviewDetailPage.jsx
│       │   │   │       └── PerformanceNewReviewPage.jsx
│       │   │   │
│       │   │   ├── payroll/
│       │   │   │   ├── constants/
│       │   │   │   │   └── payrollMockData.js
│       │   │   │   └── pages/
│       │   │   │       ├── PayrollDashboardPage.jsx
│       │   │   │       ├── PendingPaymentsPage.jsx
│       │   │   │       ├── RecordPaymentPage.jsx
│       │   │   │       ├── SalaryStructurePage.jsx   ✅ Icons removed
│       │   │   │       ├── ReimbursementStatusPage.jsx
│       │   │   │       ├── PayrollSlipsPage.jsx
│       │   │   │       └── PayrollOverviewPage.jsx
│       │   │   │
│       │   │   └── settings/
│       │   │       └── pages/
│       │   │           ├── SettingsDashboardPage.jsx
│       │   │           ├── UserManagementPage.jsx
│       │   │           ├── CompanyDetailsPage.jsx
│       │   │           └── PermissionsManagerPage.jsx
│       │   │
│       │   ├── services/                             ✅ Supabase API layer
│       │   │   ├── employeeApi.js                    ✅ Full CRUD + file ops
│       │   │   ├── homeApi.js                        ✅ Notices + Birthdays
│       │   │   ├── leaveApi.js                       ✅ Leave endpoints
│       │   │   └── performanceApi.js                 ✅ Review endpoints
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx                     ✅ UPDATED — no BrowserRouter
│       │   │   │                                         PublicOnlyRoute with spinner
│       │   │   │                                         path="*" catch-all for HomeRoutes
│       │   │   │                                         reset-password never guarded
│       │   │   ├── AuthRoutes.jsx                    ✅ UPDATED — all 6 pages mapped
│       │   │   │                                         login / verify-mfa / verify-email
│       │   │   │                                         forgot / reset / password-changed
│       │   │   └── HomeRoutes.jsx                    ✅ UPDATED — wrapped in <Routes>
│       │   │                                             removed per-route ProtectedRoute
│       │   │                                             absolute paths, * fallback
│       │   │
│       │   ├── App.jsx                               ✅ Providers stack
│       │   └── main.jsx                              ✅ BrowserRouter lives here (ONLY)
│       │
│       ├── .env.local                                ✅ CLEANED — 2 vars only
│       │                                                 VITE_SUPABASE_URL
│       │                                                 VITE_SUPABASE_ANON_KEY
│       │                                                 (no Auth0, no TOTP secret)
│       ├── package.json                              ✅ @auth0/auth0-react REMOVED
│       ├── vite.config.js                            ✅ Chakra + aliases optimized
│       └── tailwind.config.js
│
├── packages/
│   ├── ui/                                           ✅ Shared components (future)
│   └── shared/                                       ✅ Types + utils (future)
│
└── README.md                                         ✅ Updated
```

***

## ⏳ Pending — Phase 1 TOTP (Next Session)

```
features/auth/pages/
├── TwoFactorPage.jsx     ⏳ update — challengeMFA + verifyMFA
├── MFAEnrollPage.jsx     ⏳ CREATE — QR + secret + confirm (first login only)
└── ChangePasswordPage.jsx ⏳ CREATE — forced on first login

hooks/
├── useAuth.js            ⏳ minor — enrollMFA flow already present
└── useProfile.js         ⏳ CREATE — fetch profiles table row

services/
└── profileApi.js         ⏳ CREATE — get/update profiles table

supabase/
└── profiles table        ⏳ CREATE — id, role, must_change_password
```

**Ready to start Phase 1 whenever you are 🚀**

/////////////////////////////////////////////////////////

What We Built (Last 2 Weeks)
What's in It
Phase 1 — TOTP tasks 1.1–1.5 in a clean table: Supabase dashboard enable, useAuth MFA methods, MFAEnrollPage, TwoFactorPage, route added.

Phase 2 — profiles tasks 2.1–2.4: SQL with full RLS policies, profileApi.js, useProfile.js.

Phase 3 — tasks 3.1–3.5: the full post-login routing decision tree as a diagram, ChangePasswordPage, route additions, plus all the side fixes (AppRoutes no-redirect, AAL2 fix, Fast Refresh split, import path fix).

Full file & folder structure — complete tree with every file annotated, new files marked ✅ NEW (Phase X), updated files marked ✅ UPDATED (Phase X).

Phase 4 roadmap at the bottom with the correct order (4.3 → 4.1 → 4.2). 🚀



hrms-app/                                             ✅ TURBO MONOREPO
├── netlify.toml                                      ✅ Deploy config (ROOT)
├── package.json                                      ✅ Turbo orchestrator
├── turbo.json                                        ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                         ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   └── vite.svg
│       │
│       ├── src/
│       │   │
│       │   ├── lib/                                  ✅ Core utils
│       │   │   ├── supabaseClient.js                 ✅ Supabase client (URL + ANON_KEY)
│       │   │   ├── queryClient.js                    ✅ React Query v5 + DevTools
│       │   │   └── totpUtils.js                      ✅ Native Web Crypto TOTP (RFC 6238)
│       │   │
│       │   ├── contexts/                             ✅ Split for Vite Fast Refresh fix
│       │   │   ├── AuthContext.js                    ✅ createContext({}) only — no component
│       │   │   ├── AuthProvider.jsx                  ✅ Provider component only
│       │   │   │                                         getSession() on mount
│       │   │   │                                         onAuthStateChange() listener
│       │   │   │                                         session / user / isLoading
│       │   │   │                                         isAuthenticated = !!session
│       │   │   └── CalendarContext.jsx               ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                                ✅ React custom hooks
│       │   │   ├── index.js                          ✅ Barrel export
│       │   │   ├── useAuth.js                        ✅ Full Supabase auth hook
│       │   │   │                                         signIn / signOut (scope:local)
│       │   │   │                                         forgotPassword / updatePassword
│       │   │   │                                         enrollMFA / challengeMFA
│       │   │   │                                         verifyMFA / getMFALevel
│       │   │   │                                         getMFAFactors / listMFAFactors
│       │   │   ├── useEmployees.js
│       │   │   ├── useEmployeeProfile.js
│       │   │   ├── useHome.js
│       │   │   ├── useLeaves.js
│       │   │   └── usePerformance.js
│       │   │
│       │   ├── services/                             ✅ Supabase API layer + RQ hooks
│       │   │   ├── employeeApi.js                    ✅ Full CRUD + file ops
│       │   │   ├── homeApi.js                        ✅ Notices + Birthdays
│       │   │   ├── leaveApi.js
│       │   │   ├── performanceApi.js
│       │   │   ├── profileApi.js                     ✅ NEW (Phase 2)
│       │   │   │                                         getProfile(userId)
│       │   │   │                                         updateProfile(userId, data)
│       │   │   └── useProfile.js                     ✅ NEW (Phase 2)
│       │   │                                             profile / isLoading / error
│       │   │                                             updateProfile (mutateAsync)
│       │   │                                             isUpdating / refetch
│       │   │
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx                ✅ isLoading → Spinner
│       │   │   │                                         isAuthenticated → children | /login
│       │   │   │                                         named + default export
│       │   │   │
│       │   │   └── atomic/
│       │   │       ├── atoms/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── LogoutButton.jsx          ✅ signOut() scope:local + navigate
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   ├── EmployeeTableRow.jsx
│       │   │       │   └── BirthdayListItem.jsx
│       │   │       │
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx
│       │   │       │   ├── TopBar.jsx                ✅ full_name → name → email fallback
│       │   │       │   ├── UserProfileMenu.jsx       ✅ avatarUrl from user_metadata
│       │   │       │   │                                 signOut + navigate on logout
│       │   │       │   ├── NoticeBoardCard.jsx
│       │   │       │   ├── HolidaysCard.jsx
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx
│       │   │       │   ├── CalendarCard.jsx
│       │   │       │   ├── EmployeeTable.jsx
│       │   │       │   ├── EmployeeConfigCard.jsx    ⚠️ DEPRECATED
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── LoginPage.jsx             ✅ UPDATED (Phase 3)
│       │   │   │       │                                 signIn() + full post-login router
│       │   │   │       │                                 must_change_password check
│       │   │   │       │                                 getMFALevel + listMFAFactors
│       │   │   │       │                                 → /change-password | /enroll-mfa
│       │   │   │       │                                 → /verify-mfa | /home
│       │   │   │       │
│       │   │   │       ├── ChangePasswordPage.jsx    ✅ NEW (Phase 3)
│       │   │   │       │                                 first-login forced password change
│       │   │   │       │                                 5-rule strength checker
│       │   │   │       │                                 updatePassword()
│       │   │   │       │                                 updateProfile({ must_change_password: false })
│       │   │   │       │                                 → /enroll-mfa
│       │   │   │       │                                 useProfile from @/services/useProfile
│       │   │   │       │
│       │   │   │       ├── MFAEnrollPage.jsx         ✅ NEW (Phase 1)
│       │   │   │       │                                 enrollMFA() → QR code + secret key
│       │   │   │       │                                 6-digit confirm
│       │   │   │       │                                 first login only, shown once
│       │   │   │       │                                 → /home on success
│       │   │   │       │
│       │   │   │       ├── TwoFactorPage.jsx         ✅ NEW (Phase 1)
│       │   │   │       │                                 6-digit TOTP entry (every login)
│       │   │   │       │                                 challengeMFA + verifyMFA
│       │   │   │       │                                 factorId from route state
│       │   │   │       │                                 → /home on success
│       │   │   │       │
│       │   │   │       ├── ForgotPasswordPage.jsx    ✅ forgotPassword()
│       │   │   │       │                                 two-state: form → success message
│       │   │   │       │
│       │   │   │       ├── ResetPasswordPage.jsx     ✅ UPDATED (Phase 3)
│       │   │   │       │                                 updatePassword()
│       │   │   │       │                                 supabase.auth.signOut() after update
│       │   │   │       │                                 AAL2 fix: destroy recovery session
│       │   │   │       │                                 token guard (type=recovery check)
│       │   │   │       │                                 password strength bar (4 levels)
│       │   │   │       │
│       │   │   │       ├── VerifyEmailPage.jsx       ✅ Email confirmation handler
│       │   │   │       └── PasswordChangedPage.jsx   ✅ Post-reset confirmation screen
│       │   │   │
│       │   │   ├── home/
│       │   │   │   └── pages/
│       │   │   │       └── HomePage.jsx
│       │   │   │
│       │   │   ├── employee/
│       │   │   │   ├── components/
│       │   │   │   │   └── EmployeeMasterForm.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── EmployeeListPage.jsx
│       │   │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │   │       ├── EmployeeBranchesPage.jsx
│       │   │   │       ├── EmployeeDesignationsPage.jsx
│       │   │   │       ├── EmployeeStatusesPage.jsx
│       │   │   │       ├── EmployeeTypesPage.jsx
│       │   │   │       └── EmployeeExportPage.jsx
│       │   │   │
│       │   │   ├── attendance/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── AttendanceDashboardPage.jsx
│       │   │   │   │   ├── WorkingDaysPage.jsx
│       │   │   │   │   ├── WorkingHoursPage.jsx
│       │   │   │   │   ├── WorkingRulesPage.jsx
│       │   │   │   │   ├── EditWorkingRulePage.jsx
│       │   │   │   │   ├── EditAttendancePage.jsx
│       │   │   │   │   ├── EditWorkingDaysPage.jsx
│       │   │   │   │   └── AttendanceExportPage.jsx
│       │   │   │   └── constants/
│       │   │   │       └── attendanceMockData.js
│       │   │   │
│       │   │   ├── leaves/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LeaveRequestForm.jsx
│       │   │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── LeavesDashboardPage.jsx
│       │   │   │       ├── LeaveRequiredFormPage.jsx
│       │   │   │       ├── LeaveRequestUploadPage.jsx
│       │   │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │   │       ├── LeaveRequestListPage.jsx
│       │   │   │       ├── LeaveRequestActionPage.jsx
│       │   │   │       ├── LeaveRulesPage.jsx
│       │   │   │       └── LeaveRulesApprovalFlowPage.jsx
│       │   │   │
│       │   │   ├── performance/
│       │   │   │   └── pages/
│       │   │   │       ├── PerformanceDashboardPage.jsx
│       │   │   │       ├── PerformanceHistoryPage.jsx
│       │   │   │       ├── PerformanceReviewDetailPage.jsx
│       │   │   │       └── PerformanceNewReviewPage.jsx
│       │   │   │
│       │   │   ├── payroll/
│       │   │   │   ├── constants/
│       │   │   │   │   └── payrollMockData.js
│       │   │   │   └── pages/
│       │   │   │       ├── PayrollDashboardPage.jsx
│       │   │   │       ├── PendingPaymentsPage.jsx
│       │   │   │       ├── RecordPaymentPage.jsx
│       │   │   │       ├── SalaryStructurePage.jsx
│       │   │   │       ├── ReimbursementStatusPage.jsx
│       │   │   │       ├── PayrollSlipsPage.jsx
│       │   │   │       └── PayrollOverviewPage.jsx
│       │   │   │
│       │   │   └── settings/
│       │   │       └── pages/
│       │   │           ├── SettingsDashboardPage.jsx
│       │   │           ├── UserManagementPage.jsx
│       │   │           ├── CompanyDetailsPage.jsx
│       │   │           └── PermissionsManagerPage.jsx
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx                     ✅ UPDATED (Phase 3)
│       │   │   │                                         /login → bare (no PublicOnlyRoute)
│       │   │   │                                         /change-password → unguarded
│       │   │   │                                         /enroll-mfa → unguarded
│       │   │   │                                         /verify-mfa → unguarded
│       │   │   │                                         /reset-password → unguarded
│       │   │   │                                         path="*" → ProtectedRoute → HomeRoutes
│       │   │   ├── AuthRoutes.jsx
│       │   │   └── HomeRoutes.jsx                    ✅ Absolute paths, * fallback
│       │   │
│       │   ├── assets/
│       │   │   └── loginPagePic.jpg
│       │   │
│       │   ├── App.jsx                               ✅ Provider stack
│       │   └── main.jsx                              ✅ BrowserRouter lives here ONLY
│       │                                                 AuthProvider (from AuthProvider.jsx)
│       │                                                 QueryClientProvider
│       │
│       ├── .env.local                                ✅ 2 vars only
│       │                                                 VITE_SUPABASE_URL
│       │                                                 VITE_SUPABASE_ANON_KEY
│       ├── package.json
│       ├── vite.config.js
│       └── tailwind.config.js
│
├── packages/
│   ├── ui/                                           ⏳ Shared components (future)
│   └── shared/                                       ⏳ Types + utils (future)
│
└── README.md


/////////////////////////////
/////////////////////////////


**Phase 4 — Employee Master Form & Edge Function Auth (Apr 21, 2026)**
1. Fixed `@/hooks/useProfile` missing import error blocking `ChangePasswordPage` from loading.
2. Confirmed `EmployeeMasterForm.jsx` structure was logically sound before fixing.
3. Fixed `useRef` — moved from `React.useRef` inline call to top-level named import.
4. Fixed preview `useEffect` logic — simplified `photoPreview` / `signPreview` to clean single-URL lifecycle with proper `revokeObjectURL` cleanup.
5. Fixed compliance mapped inputs — `onChange={setU(field)}` was partially-applied incorrectly; replaced with explicit `(e) => setUi(...)` inline handler.
6. Extracted `resetAll()` helper — used consistently on modal close and create-mode open.
7. Added `handleClose` wrapper — ensures state is fully wiped whether user discards or saves.
8. Added `onClose()` call after successful save — modal now auto-closes on success.
9. Identified `POST /functions/v1/create-employee-user → 401 Unauthorized` as an Edge Function JWT config issue, not a frontend bug.
10. Root cause: Edge Function has `verify_jwt = true` (default) but the anon/service key may not be passed correctly — to be fixed tomorrow via `verify_jwt = false` in `config.toml` or passing the service role key explicitly.

***
hrms-app/                                             ✅ TURBO MONOREPO
├── netlify.toml                                      ✅ Deploy config (ROOT)
├── package.json                                      ✅ Turbo orchestrator
├── turbo.json                                        ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                         ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   └── vite.svg
│       │
│       ├── src/
│       │   │
│       │   ├── lib/                                  ✅ Core utils
│       │   │   ├── supabaseClient.js                 ✅ Supabase client (URL + ANON_KEY)
│       │   │   ├── queryClient.js                    ✅ React Query v5 + DevTools
│       │   │   └── totpUtils.js                      ✅ Native Web Crypto TOTP (RFC 6238)
│       │   │
│       │   ├── contexts/                             ✅ Split for Vite Fast Refresh fix
│       │   │   ├── AuthContext.js                    ✅ createContext({}) only — no component
│       │   │   ├── AuthProvider.jsx                  ✅ Provider component only
│       │   │   │                                         getSession() on mount
│       │   │   │                                         onAuthStateChange() listener
│       │   │   │                                         session / user / isLoading
│       │   │   │                                         isAuthenticated = !!session
│       │   │   └── CalendarContext.jsx               ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                                ✅ React custom hooks
│       │   │   ├── index.js                          ✅ Barrel export
│       │   │   ├── useAuth.js                        ✅ Full Supabase auth hook
│       │   │   │                                         signIn / signOut (scope:local)
│       │   │   │                                         forgotPassword / updatePassword
│       │   │   │                                         enrollMFA / challengeMFA
│       │   │   │                                         verifyMFA / getMFALevel
│       │   │   │                                         getMFAFactors / listMFAFactors
│       │   │   ├── useEmployees.js                   ✅ List + CRUD ops
│       │   │   ├── useEmployeeProfile.js             ✅ Full profile fetch
│       │   │   ├── useHome.js                        ✅ Dashboard data
│       │   │   ├── useLeaves.js                      ✅ Leave requests
│       │   │   └── usePerformance.js                 ✅ Reviews data
│       │   │
│       │   ├── services/                             ✅ Supabase API layer + RQ hooks
│       │   │   ├── employeeApi.js                    ✅ Full CRUD + file ops
│       │   │   │                                         createEmployeeProfile()
│       │   │   │                                         updateEmployeeProfile()
│       │   │   │                                         uploadFile()
│       │   │   ├── homeApi.js                        ✅ Notices + Birthdays
│       │   │   ├── leaveApi.js                       ✅ Leave endpoints
│       │   │   ├── performanceApi.js                 ✅ Review endpoints
│       │   │   ├── profileApi.js                     ✅ NEW (Phase 2)
│       │   │   │                                         getProfile(userId)
│       │   │   │                                         updateProfile(userId, data)
│       │   │   └── useProfile.js                     ✅ NEW (Phase 2)
│       │   │                                             profile / isLoading / error
│       │   │                                             updateProfile (mutateAsync)
│       │   │                                             isUpdating / refetch
│       │   │
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx                ✅ isLoading → Spinner
│       │   │   │                                         isAuthenticated → children | /login
│       │   │   │                                         named + default export
│       │   │   │
│       │   │   └── atomic/                           ✅ Atomic Design System
│       │   │       ├── atoms/                        ✅ 6 primitives
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx            ✅ Gradient CTA
│       │   │       │   ├── HRMSInput.jsx             ✅ Focus states
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── LogoutButton.jsx          ✅ signOut() scope:local + navigate
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx    ✅ Icons fixed
│       │   │       │   ├── EmployeeTableRow.jsx      ✅ Icons fixed
│       │   │       │   └── BirthdayListItem.jsx      ✅ Month/Day display
│       │   │       │
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx           ✅ Collapsible nav
│       │   │       │   ├── TopBar.jsx                ✅ full_name → name → email fallback
│       │   │       │   ├── UserProfileMenu.jsx       ✅ avatarUrl from user_metadata
│       │   │       │   │                                 signOut + navigate on logout
│       │   │       │   │                                 red Logout MenuItem
│       │   │       │   ├── NoticeBoardCard.jsx
│       │   │       │   ├── HolidaysCard.jsx
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx   ✅ React Query LIVE
│       │   │       │   ├── CalendarCard.jsx          ✅ React Query + badges
│       │   │       │   ├── EmployeeTable.jsx         ✅ TOTP Delete Modal
│       │   │       │   ├── EmployeeConfigCard.jsx    ⚠️ DEPRECATED
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx       ✅ Sidebar + Topbar wrapper
│       │   │
│       │   ├── features/
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── LoginPage.jsx             ✅ UPDATED (Phase 3)
│       │   │   │       │                                 signIn() + full post-login router
│       │   │   │       │                                 must_change_password → /change-password
│       │   │   │       │                                 getMFALevel + listMFAFactors
│       │   │   │       │                                 no factors → /enroll-mfa
│       │   │   │       │                                 AAL1 + factors → /verify-mfa
│       │   │   │       │                                 AAL2 → /home
│       │   │   │       │
│       │   │   │       ├── ChangePasswordPage.jsx    ✅ NEW (Phase 3)
│       │   │   │       │                                 first-login forced password change
│       │   │   │       │                                 5-rule password strength checker
│       │   │   │       │                                 updatePassword()
│       │   │   │       │                                 updateProfile({ must_change_password: false })
│       │   │   │       │                                 uses useProfile from @/services/useProfile
│       │   │   │       │                                 → /enroll-mfa on success
│       │   │   │       │
│       │   │   │       ├── MFAEnrollPage.jsx         ✅ NEW (Phase 1)
│       │   │   │       │                                 enrollMFA() → QR code + secret key
│       │   │   │       │                                 6-digit TOTP confirm to activate
│       │   │   │       │                                 shown once on first login only
│       │   │   │       │                                 → /home on success
│       │   │   │       │
│       │   │   │       ├── TwoFactorPage.jsx         ✅ NEW (Phase 1)
│       │   │   │       │                                 6-digit TOTP entry (every login)
│       │   │   │       │                                 challengeMFA + verifyMFA
│       │   │   │       │                                 factorId passed via route state
│       │   │   │       │                                 → /home on success
│       │   │   │       │
│       │   │   │       ├── ForgotPasswordPage.jsx    ✅ forgotPassword()
│       │   │   │       │                                 two-state UI: form → success message
│       │   │   │       │                                 Try Again + Back to Login links
│       │   │   │       │
│       │   │   │       ├── ResetPasswordPage.jsx     ✅ UPDATED (Phase 3)
│       │   │   │       │                                 updatePassword()
│       │   │   │       │                                 supabase.auth.signOut() after update
│       │   │   │       │                                 AAL2 fix: destroy recovery session
│       │   │   │       │                                 token guard (type=recovery check)
│       │   │   │       │                                 password strength bar (4 levels)
│       │   │   │       │                                 live match feedback
│       │   │   │       │
│       │   │   │       ├── VerifyEmailPage.jsx       ✅ Email confirmation handler
│       │   │   │       └── PasswordChangedPage.jsx   ✅ Post-reset confirmation screen
│       │   │   │
│       │   │   ├── home/
│       │   │   │   └── pages/
│       │   │   │       └── HomePage.jsx              ✅ Dashboard (RQ ready)
│       │   │   │
│       │   │   ├── employee/                         ✅ FULL CRUD + TOTP + MASTER FORM
│       │   │   │   ├── components/
│       │   │   │   │   └── EmployeeMasterForm.jsx    ✅ FIXED (Phase 4)
│       │   │   │   │                                     Create / Edit modal
│       │   │   │   │                                     useRef import fixed (top-level)
│       │   │   │   │                                     photoPreview / signPreview — clean
│       │   │   │   │                                     single-URL useEffect lifecycle
│       │   │   │   │                                     revokeObjectURL on cleanup
│       │   │   │   │                                     compliance mapped inputs onChange fixed
│       │   │   │   │                                     resetAll() helper extracted
│       │   │   │   │                                     handleClose resets + calls onClose
│       │   │   │   │                                     onClose() called after save success
│       │   │   │   │                                     supabase.functions.invoke()
│       │   │   │   │                                     → create-employee-user edge fn
│       │   │   │   │                                     ⚠️ 401 pending fix (Phase 5)
│       │   │   │   │
│       │   │   │   └── pages/
│       │   │   │       ├── EmployeeListPage.jsx      ✅ Table + modals + RQ
│       │   │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │   │       ├── EmployeeBranchesPage.jsx
│       │   │   │       ├── EmployeeDesignationsPage.jsx
│       │   │   │       ├── EmployeeStatusesPage.jsx
│       │   │   │       ├── EmployeeTypesPage.jsx
│       │   │   │       └── EmployeeExportPage.jsx
│       │   │   │
│       │   │   ├── attendance/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── AttendanceDashboardPage.jsx
│       │   │   │   │   ├── WorkingDaysPage.jsx
│       │   │   │   │   ├── WorkingHoursPage.jsx      ✅ Icons fixed
│       │   │   │   │   ├── WorkingRulesPage.jsx
│       │   │   │   │   ├── EditWorkingRulePage.jsx
│       │   │   │   │   ├── EditAttendancePage.jsx
│       │   │   │   │   ├── EditWorkingDaysPage.jsx
│       │   │   │   │   └── AttendanceExportPage.jsx
│       │   │   │   └── constants/
│       │   │   │       └── attendanceMockData.js
│       │   │   │
│       │   │   ├── leaves/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LeaveRequestForm.jsx      ✅ Icons fixed
│       │   │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── LeavesDashboardPage.jsx
│       │   │   │       ├── LeaveRequiredFormPage.jsx
│       │   │   │       ├── LeaveRequestUploadPage.jsx
│       │   │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │   │       ├── LeaveRequestListPage.jsx
│       │   │   │       ├── LeaveRequestActionPage.jsx
│       │   │   │       ├── LeaveRulesPage.jsx
│       │   │   │       └── LeaveRulesApprovalFlowPage.jsx
│       │   │   │
│       │   │   ├── performance/                      ✅ Supabase LIVE
│       │   │   │   └── pages/
│       │   │   │       ├── PerformanceDashboardPage.jsx
│       │   │   │       ├── PerformanceHistoryPage.jsx
│       │   │   │       ├── PerformanceReviewDetailPage.jsx
│       │   │   │       └── PerformanceNewReviewPage.jsx
│       │   │   │
│       │   │   ├── payroll/
│       │   │   │   ├── constants/
│       │   │   │   │   └── payrollMockData.js
│       │   │   │   └── pages/
│       │   │   │       ├── PayrollDashboardPage.jsx
│       │   │   │       ├── PendingPaymentsPage.jsx
│       │   │   │       ├── RecordPaymentPage.jsx
│       │   │   │       ├── SalaryStructurePage.jsx   ✅ Icons removed
│       │   │   │       ├── ReimbursementStatusPage.jsx
│       │   │   │       ├── PayrollSlipsPage.jsx
│       │   │   │       └── PayrollOverviewPage.jsx
│       │   │   │
│       │   │   └── settings/
│       │   │       └── pages/
│       │   │           ├── SettingsDashboardPage.jsx
│       │   │           ├── UserManagementPage.jsx
│       │   │           ├── CompanyDetailsPage.jsx
│       │   │           └── PermissionsManagerPage.jsx
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx                     ✅ UPDATED (Phase 3)
│       │   │   │                                         /login          → bare (no guard)
│       │   │   │                                         /change-password → unguarded
│       │   │   │                                         /enroll-mfa     → unguarded
│       │   │   │                                         /verify-mfa     → unguarded
│       │   │   │                                         /reset-password → unguarded
│       │   │   │                                         /verify-email   → unguarded
│       │   │   │                                         /password-changed → unguarded
│       │   │   │                                         path="*" → ProtectedRoute → HomeRoutes
│       │   │   │
│       │   │   ├── AuthRoutes.jsx                    ✅ All 8 auth pages mapped
│       │   │   │                                         login / change-password / enroll-mfa
│       │   │   │                                         verify-mfa / forgot-password
│       │   │   │                                         reset-password / verify-email
│       │   │   │                                         password-changed
│       │   │   │
│       │   │   └── HomeRoutes.jsx                    ✅ Absolute paths + * fallback
│       │   │                                             wrapped in <Routes>
│       │   │                                             no per-route ProtectedRoute
│       │   │
│       │   ├── assets/
│       │   │   └── loginPagePic.jpg
│       │   │
│       │   ├── App.jsx                               ✅ Provider stack
│       │   │                                             ChakraProvider
│       │   │                                             QueryClientProvider
│       │   │                                             AuthProvider
│       │   │                                             CalendarProvider
│       │   │                                             ReactQueryDevtools
│       │   │
│       │   └── main.jsx                              ✅ BrowserRouter lives here ONLY
│       │
│       ├── supabase/                                 ✅ Edge Functions
│       │   └── functions/
│       │       └── create-employee-user/
│       │           ├── index.ts                      ⚠️ 401 PENDING FIX (Phase 5)
│       │           │                                     creates Supabase Auth user
│       │           │                                     called from EmployeeMasterForm
│       │           │                                     needs verify_jwt = false OR
│       │           │                                     service_role key in Authorization
│       │           └── config.toml                   ⚠️ PENDING — add verify_jwt = false
│       │
│       ├── .env.local                                ✅ 2 vars only
│       │                                                 VITE_SUPABASE_URL
│       │                                                 VITE_SUPABASE_ANON_KEY
│       ├── package.json                              ✅ @auth0/auth0-react REMOVED
│       ├── vite.config.js                            ✅ Chakra + @ alias optimized
│       └── tailwind.config.js
│
├── packages/
│   ├── ui/                                           ⏳ Shared components (future)
│   └── shared/                                       ⏳ Types + utils (future)
│
└── README.md                                         ✅ Updated through Phase 4




//////////////////////////////////////////////////////



## Today — Friday, May 1, 2026 — Phase 5 RBAC Summary

1. Enabled RLS on `employees`, `employee_compliance`, `employee_banking`, `employee_documents`, and `profiles` with role-based policies for HR, manager, and employee. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/86996807/1d11ae29-20ff-462e-bb80-185a4fd29a50/paste.txt)
2. Added 5 helper SQL functions (`current_user_role`, `is_hr`, `is_manager`, `is_employee`, `is_own_employee_id`) to keep policies clean and reusable. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/86996807/1d11ae29-20ff-462e-bb80-185a4fd29a50/paste.txt)
3. Added a database trigger to lock `profiles.role` so only HR can promote or demote users. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/86996807/1d11ae29-20ff-462e-bb80-185a4fd29a50/paste.txt)
4. Created `RoleRoute.jsx` and wired it into `HomeRoutes.jsx` so every route now enforces role-based access at the router level. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/86996807/1d11ae29-20ff-462e-bb80-185a4fd29a50/paste.txt)
5. Updated `HRMSSidebar.jsx`, `EmployeeListPage.jsx`, and `EmployeeTable.jsx` so UI actions like Add, Modify, and Delete are invisible to non-HR roles. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/86996807/1d11ae29-20ff-462e-bb80-185a4fd29a50/paste.txt)

**Next session:** Fix the Edge Function 401 on `create-employee-user` — either set `verify_jwt = false` in `config.toml` or pass the service role key correctly. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/86996807/1d11ae29-20ff-462e-bb80-185a4fd29a50/paste.txt)

***

## Updated Folder Structure

```
hrms-app/                                             ✅ TURBO MONOREPO
├── netlify.toml                                      ✅ Deploy config (ROOT)
├── package.json                                      ✅ Turbo orchestrator
├── turbo.json                                        ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                         ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   └── vite.svg
│       │
│       ├── src/
│       │   │
│       │   ├── lib/                                  ✅ Core utils
│       │   │   ├── supabaseClient.js                 ✅ Supabase client (URL + ANON_KEY)
│       │   │   ├── queryClient.js                    ✅ React Query v5 + DevTools
│       │   │   └── totpUtils.js                      ✅ Native Web Crypto TOTP (RFC 6238)
│       │   │
│       │   ├── contexts/                             ✅ Split for Vite Fast Refresh fix
│       │   │   ├── AuthContext.js                    ✅ createContext({}) only
│       │   │   ├── AuthProvider.jsx                  ✅ session / user / isLoading
│       │   │   │                                         isAuthenticated = !!session
│       │   │   └── CalendarContext.jsx               ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                                ✅ React custom hooks
│       │   │   ├── index.js                          ✅ Barrel export
│       │   │   ├── useAuth.js                        ✅ Full Supabase auth hook
│       │   │   │                                         signIn / signOut (scope:local)
│       │   │   │                                         forgotPassword / updatePassword
│       │   │   │                                         enrollMFA / challengeMFA
│       │   │   │                                         verifyMFA / getMFALevel
│       │   │   │                                         getMFAFactors / listMFAFactors
│       │   │   ├── useEmployees.js                   ✅ List + CRUD ops
│       │   │   ├── useEmployeeProfile.js             ✅ Full profile fetch
│       │   │   ├── useHome.js                        ✅ Dashboard data
│       │   │   ├── useLeaves.js                      ✅ Leave requests
│       │   │   ├── usePerformance.js                 ✅ Reviews data
│       │   │   └── useRole.js                        ✅ NEW (Phase 5)
│       │   │                                             reads profiles.role via Supabase
│       │   │                                             returns role / isHR / isManager
│       │   │                                             isEmployee / isLoading
│       │   │
│       │   ├── services/                             ✅ Supabase API layer + RQ hooks
│       │   │   ├── employeeApi.js                    ✅ Full CRUD + file ops
│       │   │   │                                         createEmployeeProfile()
│       │   │   │                                         updateEmployeeProfile()
│       │   │   │                                         uploadFile()
│       │   │   ├── homeApi.js                        ✅ Notices + Birthdays
│       │   │   ├── leaveApi.js                       ✅ Leave endpoints
│       │   │   ├── performanceApi.js                 ✅ Review endpoints
│       │   │   ├── profileApi.js                     ✅ getProfile / updateProfile
│       │   │   └── useProfile.js                     ✅ profile / isLoading / error
│       │   │                                             updateProfile / isUpdating / refetch
│       │   │
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx                ✅ isLoading → Spinner
│       │   │   │                                         isAuthenticated → children | /login
│       │   │   │                                         named + default export
│       │   │   │
│       │   │   ├── RoleRoute.jsx                     ✅ NEW (Phase 5)
│       │   │   │                                         allow={["hr","manager",...]}
│       │   │   │                                         isLoading → Spinner
│       │   │   │                                         unauthorized → Navigate /home
│       │   │   │
│       │   │   └── atomic/                           ✅ Atomic Design System
│       │   │       ├── atoms/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── LogoutButton.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   ├── EmployeeTableRow.jsx
│       │   │       │   └── BirthdayListItem.jsx
│       │   │       │
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx           ✅ UPDATED (Phase 5)
│       │   │       │   │                                 useRole() filters nav by role
│       │   │       │   │                                 HR → all 7 items
│       │   │       │   │                                 Manager → no Payroll, no Settings
│       │   │       │   │                                 Employee → Home/Attendance/Leaves
│       │   │       │   │                                            Performance/Payroll only
│       │   │       │   ├── TopBar.jsx
│       │   │       │   ├── UserProfileMenu.jsx
│       │   │       │   ├── NoticeBoardCard.jsx
│       │   │       │   ├── HolidaysCard.jsx
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx
│       │   │       │   ├── CalendarCard.jsx
│       │   │       │   ├── EmployeeTable.jsx         ✅ UPDATED (Phase 5)
│       │   │       │   │                                 isReadOnly prop support
│       │   │       │   │                                 Modify/Delete cols hidden for
│       │   │       │   │                                 non-HR roles
│       │   │       │   │                                 DeleteEmployeeModal guarded
│       │   │       │   ├── EmployeeConfigCard.jsx    ⚠️ DEPRECATED
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── LoginPage.jsx
│       │   │   │       ├── ChangePasswordPage.jsx
│       │   │   │       ├── MFAEnrollPage.jsx
│       │   │   │       ├── TwoFactorPage.jsx
│       │   │   │       ├── ForgotPasswordPage.jsx
│       │   │   │       ├── ResetPasswordPage.jsx
│       │   │   │       ├── VerifyEmailPage.jsx
│       │   │   │       └── PasswordChangedPage.jsx
│       │   │   │
│       │   │   ├── home/
│       │   │   │   └── pages/
│       │   │   │       └── HomePage.jsx
│       │   │   │
│       │   │   ├── employee/
│       │   │   │   ├── components/
│       │   │   │   │   ├── EmployeeMasterForm.jsx    ✅ Create/Edit modal (Phase 4)
│       │   │   │   │   │                                 ⚠️ Edge Fn 401 pending (Phase 6)
│       │   │   │   │   ├── EmployeeProfilePage.jsx   ✅ UPDATED (Phase 5)
│       │   │   │   │   │                                 view-only for all roles
│       │   │   │   │   │                                 role-aware (useRole ready)
│       │   │   │   │   └── DeleteEmployeeModal.jsx
│       │   │   │   │
│       │   │   │   └── pages/
│       │   │   │       ├── EmployeeListPage.jsx      ✅ UPDATED (Phase 5)
│       │   │   │       │                                 HR only → Add New Record button
│       │   │   │       │                                 HR only → edit/delete actions
│       │   │   │       │                                 Manager → view-only badge shown
│       │   │   │       │                                 isReadOnly passed to EmployeeTable
│       │   │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │   │       ├── EmployeeBranchesPage.jsx
│       │   │   │       ├── EmployeeDesignationsPage.jsx
│       │   │   │       ├── EmployeeStatusesPage.jsx
│       │   │   │       ├── EmployeeTypesPage.jsx
│       │   │   │       └── EmployeeExportPage.jsx
│       │   │   │
│       │   │   ├── attendance/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── AttendanceDashboardPage.jsx
│       │   │   │   │   ├── WorkingDaysPage.jsx
│       │   │   │   │   ├── WorkingHoursPage.jsx
│       │   │   │   │   ├── WorkingRulesPage.jsx
│       │   │   │   │   ├── EditWorkingRulePage.jsx
│       │   │   │   │   ├── EditAttendancePage.jsx
│       │   │   │   │   ├── EditWorkingDaysPage.jsx
│       │   │   │   │   └── AttendanceExportPage.jsx
│       │   │   │   └── constants/
│       │   │   │       └── attendanceMockData.js
│       │   │   │
│       │   │   ├── leaves/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LeaveRequestForm.jsx
│       │   │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── LeavesDashboardPage.jsx
│       │   │   │       ├── LeaveRequiredFormPage.jsx
│       │   │   │       ├── LeaveRequestUploadPage.jsx
│       │   │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │   │       ├── LeaveRequestListPage.jsx
│       │   │   │       ├── LeaveRequestActionPage.jsx
│       │   │   │       ├── LeaveRulesPage.jsx
│       │   │   │       └── LeaveRulesApprovalFlowPage.jsx
│       │   │   │
│       │   │   ├── performance/
│       │   │   │   └── pages/
│       │   │   │       ├── PerformanceDashboardPage.jsx
│       │   │   │       ├── PerformanceHistoryPage.jsx
│       │   │   │       ├── PerformanceReviewDetailPage.jsx
│       │   │   │       └── PerformanceNewReviewPage.jsx
│       │   │   │
│       │   │   ├── payroll/
│       │   │   │   ├── constants/
│       │   │   │   │   └── payrollMockData.js
│       │   │   │   └── pages/
│       │   │   │       ├── PayrollDashboardPage.jsx
│       │   │   │       ├── PendingPaymentsPage.jsx
│       │   │   │       ├── RecordPaymentPage.jsx
│       │   │   │       ├── SalaryStructurePage.jsx
│       │   │   │       ├── ReimbursementStatusPage.jsx
│       │   │   │       ├── PayrollSlipsPage.jsx
│       │   │   │       └── PayrollOverviewPage.jsx
│       │   │   │
│       │   │   └── settings/
│       │   │       └── pages/
│       │   │           ├── SettingsDashboardPage.jsx
│       │   │           ├── UserManagementPage.jsx
│       │   │           ├── CompanyDetailsPage.jsx
│       │   │           └── PermissionsManagerPage.jsx
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx                     ✅ Auth + protected split
│       │   │   ├── AuthRoutes.jsx                    ✅ All 8 auth pages
│       │   │   └── HomeRoutes.jsx                    ✅ UPDATED (Phase 5)
│       │   │                                             every route wrapped in RoleRoute
│       │   │                                             HR / Manager / Employee access
│       │   │                                             defined per route via allow={[]}
│       │   │                                             Settings → HR only
│       │   │                                             Payroll admin → HR only
│       │   │                                             Employee config → HR + Manager
│       │   │
│       │   ├── assets/
│       │   │   └── loginPagePic.jpg
│       │   │
│       │   ├── App.jsx                               ✅ Provider stack
│       │   └── main.jsx                              ✅ BrowserRouter lives here ONLY
│       │
│       ├── supabase/
│       │   └── functions/
│       │       └── create-employee-user/
│       │           ├── index.ts                      ⚠️ 401 PENDING FIX (Phase 6)
│       │           └── config.toml                   ⚠️ PENDING — verify_jwt = false
│       │
│       ├── .env.local                                ✅ VITE_SUPABASE_URL
│       │                                                VITE_SUPABASE_ANON_KEY
│       ├── package.json
│       ├── vite.config.js
│       └── tailwind.config.js
│
├── packages/
│   ├── ui/                                           ⏳ Shared components (future)
│   └── shared/                                       ⏳ Types + utils (future)
│
└── README.md                                         ✅ Updated through Phase 5
```

***

## Supabase — Phase 5 DB Changes

```
Database (snuqlfgzzxaemxfyklvv.supabase.co)
│
├── public.profiles                     ✅ RLS ON (Phase 5)
│   ├── SELECT  → HR full / own row only
│   ├── INSERT  → HR only
│   ├── UPDATE  → HR full / own row (role field locked by trigger)
│   └── DELETE  → HR only
│
├── public.employees                    ✅ RLS ON (Phase 5)
│   ├── SELECT  → HR / Manager full / Employee own row
│   ├── INSERT  → HR only
│   ├── UPDATE  → HR / Employee own row
│   └── DELETE  → HR only
│
├── public.employee_compliance          ✅ RLS ON (Phase 5)
├── public.employee_banking             ✅ RLS ON (Phase 5)
└── public.employee_documents           ✅ RLS ON (Phase 5)
    └── (same HR/Manager/Employee policy pattern as employees)
│
└── Functions
    ├── current_user_role()             ✅ NEW — reads profiles.role
    ├── is_hr()                         ✅ NEW
    ├── is_manager()                    ✅ NEW
    ├── is_employee()                   ✅ NEW
    ├── is_own_employee_id(uuid)        ✅ NEW
    └── prevent_unauthorized_profile_role_change()  ✅ NEW trigger fn
        └── trg_prevent_unauthorized_profile_role_change  ✅ BEFORE UPDATE on profiles
```





///////////////////////////////////////////////////////////////////

---------14-05-2026--------------

Phase 6 (Steps 1–3) — RBAC foundation completed. Added useRole and RoleRoute, wired route-level access control in HomeRoutes, filtered sidebar navigation by role, restricted employee list actions for non-HR users, and updated EmployeeProfilePage to support HR full view, manager limited view, and employee self-view logic.



hrms-app/                                              ✅ TURBO MONOREPO
├── netlify.toml                                       ✅ Deploy config (ROOT)
├── package.json                                       ✅ Turbo orchestrator
├── turbo.json                                         ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                          ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   └── vite.svg
│       │
│       ├── src/
│       │   │
│       │   ├── lib/                                   ✅ Core utils
│       │   │   ├── supabaseClient.js                  ✅ Supabase client (URL + ANON_KEY)
│       │   │   ├── queryClient.js                     ✅ React Query v5 + DevTools
│       │   │   └── totpUtils.js                       ✅ Native Web Crypto TOTP (RFC 6238)
│       │   │
│       │   ├── contexts/                              ✅ Split for Vite Fast Refresh fix
│       │   │   ├── AuthContext.js                     ✅ createContext({}) only
│       │   │   ├── AuthProvider.jsx                   ✅ session / user / isLoading
│       │   │   │                                          isAuthenticated = !!session
│       │   │   └── CalendarContext.jsx                ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                                 ✅ React custom hooks
│       │   │   ├── index.js                           ✅ Barrel export
│       │   │   ├── useAuth.js                         ✅ Full Supabase auth hook
│       │   │   │                                          signIn / signOut (scope:local)
│       │   │   │                                          forgotPassword / updatePassword
│       │   │   │                                          enrollMFA / challengeMFA
│       │   │   │                                          verifyMFA / getMFALevel
│       │   │   │                                          getMFAFactors / listMFAFactors
│       │   │   ├── useEmployees.js                    ✅ List + CRUD ops
│       │   │   ├── useEmployeeProfile.js              ✅ Full profile fetch
│       │   │   ├── useHome.js                         ✅ Dashboard data
│       │   │   ├── useLeaves.js                       ✅ Leave requests
│       │   │   ├── usePerformance.js                  ✅ Reviews data
│       │   │   └── useRole.js                         ✅ NEW (Phase 6)
│       │   │                                               reads profiles.role via Supabase
│       │   │                                               returns role / isHR / isManager
│       │   │                                               isEmployee / isLoading
│       │   │
│       │   ├── services/                              ✅ Supabase API layer + RQ hooks
│       │   │   ├── employeeApi.js                     ✅ Full CRUD + file ops
│       │   │   │                                          createEmployeeProfile()
│       │   │   │                                          updateEmployeeProfile()
│       │   │   │                                          uploadFile()
│       │   │   ├── homeApi.js                         ✅ Notices + Birthdays
│       │   │   ├── leaveApi.js                        ✅ Leave endpoints
│       │   │   ├── performanceApi.js                  ✅ Review endpoints
│       │   │   ├── profileApi.js                      ✅ getProfile / updateProfile
│       │   │   └── useProfile.js                      ✅ profile / isLoading / error
│       │   │                                               updateProfile / isUpdating / refetch
│       │   │
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx                 ✅ isLoading → Spinner
│       │   │   │                                          isAuthenticated → children | /login
│       │   │   │                                          named + default export
│       │   │   │
│       │   │   ├── RoleRoute.jsx                      ✅ NEW (Phase 6)
│       │   │   │                                          allow={["hr","manager",...]}
│       │   │   │                                          isLoading → Spinner
│       │   │   │                                          unauthorized → Navigate /home
│       │   │   │
│       │   │   └── atomic/                            ✅ Atomic Design System
│       │   │       ├── atoms/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── LogoutButton.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   ├── EmployeeTableRow.jsx
│       │   │       │   └── BirthdayListItem.jsx
│       │   │       │
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx            ✅ UPDATED (Phase 6)
│       │   │       │   │                                  useRole() filters nav by role
│       │   │       │   │                                  HR → all 7 items
│       │   │       │   │                                  Manager → no Payroll, no Settings
│       │   │       │   │                                  Employee → Home / Attendance / Leaves
│       │   │       │   │                                               Performance / Payroll only
│       │   │       │   ├── TopBar.jsx
│       │   │       │   ├── UserProfileMenu.jsx
│       │   │       │   ├── NoticeBoardCard.jsx
│       │   │       │   ├── HolidaysCard.jsx
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx
│       │   │       │   ├── CalendarCard.jsx
│       │   │       │   ├── EmployeeTable.jsx          ✅ UPDATED (Phase 6)
│       │   │       │   │                                  isReadOnly prop support
│       │   │       │   │                                  Modify/Delete cols hidden for
│       │   │       │   │                                  non-HR roles
│       │   │       │   │                                  DeleteEmployeeModal guarded
│       │   │       │   ├── EmployeeConfigCard.jsx     ⚠️ DEPRECATED
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── LoginPage.jsx
│       │   │   │       ├── ChangePasswordPage.jsx
│       │   │   │       ├── MFAEnrollPage.jsx
│       │   │   │       ├── TwoFactorPage.jsx
│       │   │   │       ├── ForgotPasswordPage.jsx
│       │   │   │       ├── ResetPasswordPage.jsx
│       │   │   │       ├── VerifyEmailPage.jsx
│       │   │   │       └── PasswordChangedPage.jsx
│       │   │   │
│       │   │   ├── home/
│       │   │   │   └── pages/
│       │   │   │       └── HomePage.jsx
│       │   │   │
│       │   │   ├── employee/
│       │   │   │   ├── components/
│       │   │   │   │   ├── EmployeeMasterForm.jsx     ✅ Create/Edit modal (Phase 4/5)
│       │   │   │   │   │                                  ⚠️ Edge Fn 401 pending (Phase 6)
│       │   │   │   │   ├── EmployeeProfilePage.jsx    ✅ UPDATED (Phase 6 Step 3)
│       │   │   │   │   │                                  HR → full profile view
│       │   │   │   │   │                                  Manager → limited view-only
│       │   │   │   │   │                                  Employee → self-view logic ready
│       │   │   │   │   │                                  sensitive sections restricted
│       │   │   │   │   └── DeleteEmployeeModal.jsx
│       │   │   │   │
│       │   │   │   └── pages/
│       │   │   │       ├── EmployeeListPage.jsx       ✅ UPDATED (Phase 6 Step 2)
│       │   │   │       │                                  HR only → Add New Record button
│       │   │   │       │                                  HR only → edit/delete actions
│       │   │   │       │                                  Manager → view-only badge shown
│       │   │   │       │                                  isReadOnly passed to EmployeeTable
│       │   │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │   │       ├── EmployeeBranchesPage.jsx
│       │   │   │       ├── EmployeeDesignationsPage.jsx
│       │   │   │       ├── EmployeeStatusesPage.jsx
│       │   │   │       ├── EmployeeTypesPage.jsx
│       │   │   │       └── EmployeeExportPage.jsx
│       │   │   │
│       │   │   ├── attendance/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── AttendanceDashboardPage.jsx
│       │   │   │   │   ├── WorkingDaysPage.jsx
│       │   │   │   │   ├── WorkingHoursPage.jsx
│       │   │   │   │   ├── WorkingRulesPage.jsx
│       │   │   │   │   ├── EditWorkingRulePage.jsx
│       │   │   │   │   ├── EditAttendancePage.jsx
│       │   │   │   │   ├── EditWorkingDaysPage.jsx
│       │   │   │   │   └── AttendanceExportPage.jsx
│       │   │   │   └── constants/
│       │   │   │       └── attendanceMockData.js
│       │   │   │
│       │   │   ├── leaves/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LeaveRequestForm.jsx
│       │   │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── LeavesDashboardPage.jsx
│       │   │   │       ├── LeaveRequiredFormPage.jsx
│       │   │   │       ├── LeaveRequestUploadPage.jsx
│       │   │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │   │       ├── LeaveRequestListPage.jsx
│       │   │   │       ├── LeaveRequestActionPage.jsx
│       │   │   │       ├── LeaveRulesPage.jsx
│       │   │   │       └── LeaveRulesApprovalFlowPage.jsx
│       │   │   │
│       │   │   ├── performance/
│       │   │   │   └── pages/
│       │   │   │       ├── PerformanceDashboardPage.jsx
│       │   │   │       ├── PerformanceHistoryPage.jsx
│       │   │   │       ├── PerformanceReviewDetailPage.jsx
│       │   │   │       └── PerformanceNewReviewPage.jsx
│       │   │   │
│       │   │   ├── payroll/
│       │   │   │   ├── constants/
│       │   │   │   │   └── payrollMockData.js
│       │   │   │   └── pages/
│       │   │   │       ├── PayrollDashboardPage.jsx
│       │   │   │       ├── PendingPaymentsPage.jsx
│       │   │   │       ├── RecordPaymentPage.jsx
│       │   │   │       ├── SalaryStructurePage.jsx
│       │   │   │       ├── ReimbursementStatusPage.jsx
│       │   │   │       ├── PayrollSlipsPage.jsx
│       │   │   │       └── PayrollOverviewPage.jsx
│       │   │   │
│       │   │   └── settings/
│       │   │       └── pages/
│       │   │           ├── SettingsDashboardPage.jsx
│       │   │           ├── UserManagementPage.jsx
│       │   │           ├── CompanyDetailsPage.jsx
│       │   │           └── PermissionsManagerPage.jsx
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx                      ✅ Auth + protected split
│       │   │   ├── AuthRoutes.jsx                     ✅ All 8 auth pages
│       │   │   └── HomeRoutes.jsx                     ✅ UPDATED (Phase 6 Step 1)
│       │   │                                               every route wrapped in RoleRoute
│       │   │                                               HR / Manager / Employee access
│       │   │                                               defined per route via allow={[]}
│       │   │                                               Settings → HR only
│       │   │                                               Payroll admin → HR only
│       │   │                                               Employee config → HR + Manager
│       │   │
│       │   ├── assets/
│       │   │   └── loginPagePic.jpg
│       │   │
│       │   ├── App.jsx                                 ✅ Provider stack
│       │   └── main.jsx                                ✅ BrowserRouter lives here ONLY
│       │
│       ├── supabase/
│       │   └── functions/
│       │       └── create-employee-user/
│       │           ├── index.ts                        ⚠️ 401 PENDING FIX (Phase 6)
│       │           └── config.toml                     ⚠️ PENDING — verify_jwt = false
│       │
│       ├── .env.local                                  ✅ VITE_SUPABASE_URL
│       │                                                  VITE_SUPABASE_ANON_KEY
│       ├── package.json
│       ├── vite.config.js
│       └── tailwind.config.js
│
├── packages/
│   ├── ui/                                            ⏳ Shared components (future)
│   └── shared/                                        ⏳ Types + utils (future)
│
└── README.md                                          ✅ Updated through Phase 6 Step 3



/////////////////////////////////////////////
/////////////////////////////////////////////

------15-05-2026----------------------------
hrms-app/                                                     ✅ TURBO MONOREPO
├── netlify.toml                                              ✅ Deploy config (ROOT)
├── package.json                                              ✅ Turbo orchestrator
├── turbo.json                                                ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                                 ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   └── vite.svg
│       │
│       ├── src/
│       │   │
│       │   ├── lib/                                          ✅ Core utils
│       │   │   ├── supabaseClient.js                         ✅ Supabase client (URL + ANON_KEY)
│       │   │   ├── queryClient.js                            ✅ React Query v5 + DevTools
│       │   │   └── totpUtils.js                              ✅ Native Web Crypto TOTP (RFC 6238)
│       │   │
│       │   ├── contexts/                                     ✅ Split for Vite Fast Refresh fix
│       │   │   ├── AuthContext.js                            ✅ createContext({}) only
│       │   │   ├── AuthProvider.jsx                          ✅ session / user / isLoading
│       │   │   │                                                 isAuthenticated = !!session
│       │   │   └── CalendarContext.jsx                       ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                                        ✅ React custom hooks
│       │   │   ├── index.js                                  ✅ Barrel export
│       │   │   ├── useAuth.js                                ✅ Full Supabase auth hook
│       │   │   │                                                 signIn / signOut (scope:local)
│       │   │   │                                                 forgotPassword / updatePassword
│       │   │   │                                                 enrollMFA / challengeMFA
│       │   │   │                                                 verifyMFA / getMFALevel
│       │   │   │                                                 getMFAFactors / listMFAFactors
│       │   │   ├── useEmployees.js                           ✅ List + CRUD ops
│       │   │   ├── useEmployeeProfile.js                     ✅ Full profile fetch
│       │   │   ├── useHome.js                                ✅ Dashboard data
│       │   │   ├── useLeaves.js                              ✅ Leave requests
│       │   │   ├── usePerformance.js                         ✅ Reviews data
│       │   │   └── useRole.js                                ✅ NEW (Phase 6)
│       │   │                                                     reads profiles.role via Supabase
│       │   │                                                     returns role / isHR / isManager
│       │   │                                                     isEmployee / isLoading
│       │   │
│       │   ├── services/                                     ✅ Supabase API layer + RQ hooks
│       │   │   ├── employeeApi.js                            ✅ Full CRUD + file ops
│       │   │   │                                                 createEmployeeProfile()
│       │   │   │                                                 updateEmployeeProfile()
│       │   │   │                                                 uploadFile()
│       │   │   ├── homeApi.js                                ✅ Notices + Birthdays
│       │   │   ├── leaveApi.js                               ✅ Leave endpoints
│       │   │   ├── performanceApi.js                         ✅ Review endpoints
│       │   │   ├── profileApi.js                             ✅ getProfile / updateProfile
│       │   │   └── useProfile.js                             ✅ profile / isLoading / error
│       │   │                                                     updateProfile / isUpdating / refetch
│       │   │
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx                        ✅ isLoading → Spinner
│       │   │   │                                                 isAuthenticated → children | /login
│       │   │   │                                                 named + default export
│       │   │   │
│       │   │   ├── RoleRoute.jsx                             ✅ NEW (Phase 6)
│       │   │   │                                                 allow={["hr","manager",...]}
│       │   │   │                                                 isLoading → Spinner
│       │   │   │                                                 unauthorized → Navigate /home
│       │   │   │
│       │   │   └── atomic/                                   ✅ Atomic Design System
│       │   │       ├── atoms/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── LogoutButton.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   ├── EmployeeTableRow.jsx
│       │   │       │   └── BirthdayListItem.jsx
│       │   │       │
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx                   ✅ UPDATED (Phase 6)
│       │   │       │   │                                         useRole() filters nav by role
│       │   │       │   │                                         HR → all 7 items
│       │   │       │   │                                         Manager → no Payroll, no Settings
│       │   │       │   │                                         Employee → Home / Attendance / Leaves
│       │   │       │   │                                                     Performance / Payroll only
│       │   │       │   ├── TopBar.jsx
│       │   │       │   ├── UserProfileMenu.jsx
│       │   │       │   ├── NoticeBoardCard.jsx
│       │   │       │   ├── HolidaysCard.jsx
│       │   │       │   ├── CompanyEventsCard.jsx
│       │   │       │   ├── BirthdayTrackerCard.jsx
│       │   │       │   ├── CalendarCard.jsx
│       │   │       │   ├── EmployeeTable.jsx                 ✅ UPDATED (Phase 6)
│       │   │       │   │                                         isReadOnly prop support
│       │   │       │   │                                         Modify/Delete cols hidden for
│       │   │       │   │                                         non-HR roles
│       │   │       │   │                                         DeleteEmployeeModal guarded
│       │   │       │   ├── EmployeeConfigCard.jsx            ⚠️ DEPRECATED
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── LoginPage.jsx
│       │   │   │       ├── ChangePasswordPage.jsx
│       │   │   │       ├── MFAEnrollPage.jsx
│       │   │   │       ├── TwoFactorPage.jsx
│       │   │   │       ├── ForgotPasswordPage.jsx
│       │   │   │       ├── ResetPasswordPage.jsx
│       │   │   │       ├── VerifyEmailPage.jsx
│       │   │   │       └── PasswordChangedPage.jsx
│       │   │   │
│       │   │   ├── home/
│       │   │   │   └── pages/
│       │   │   │       └── HomePage.jsx
│       │   │   │
│       │   │   ├── employee/
│       │   │   │   ├── components/
│       │   │   │   │   ├── EmployeeMasterForm.jsx            ✅ Create/Edit modal (Phase 4/5/6)
│       │   │   │   │   │                                         Edge Function 401 fixed
│       │   │   │   │   ├── EmployeeProfilePage.jsx           ✅ UPDATED (Phase 6 Step 3)
│       │   │   │   │   │                                         HR → full profile view
│       │   │   │   │   │                                         Manager → limited view-only
│       │   │   │   │   │                                         Employee → self-view logic ready
│       │   │   │   │   │                                         sensitive sections restricted
│       │   │   │   │   └── DeleteEmployeeModal.jsx
│       │   │   │   │
│       │   │   │   └── pages/
│       │   │   │       ├── EmployeeListPage.jsx              ✅ UPDATED (Phase 6 Step 2)
│       │   │   │       │                                         HR only → Add New Record button
│       │   │   │       │                                         HR only → edit/delete actions
│       │   │   │       │                                         Manager → view-only badge shown
│       │   │   │       │                                         isReadOnly passed to EmployeeTable
│       │   │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │   │       ├── EmployeeBranchesPage.jsx
│       │   │   │       ├── EmployeeDesignationsPage.jsx
│       │   │   │       ├── EmployeeStatusesPage.jsx
│       │   │   │       ├── EmployeeTypesPage.jsx
│       │   │   │       └── EmployeeExportPage.jsx
│       │   │   │
│       │   │   ├── attendance/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── AttendanceDashboardPage.jsx
│       │   │   │   │   ├── WorkingDaysPage.jsx
│       │   │   │   │   ├── WorkingHoursPage.jsx
│       │   │   │   │   ├── WorkingRulesPage.jsx
│       │   │   │   │   ├── EditWorkingRulePage.jsx
│       │   │   │   │   ├── EditAttendancePage.jsx
│       │   │   │   │   ├── EditWorkingDaysPage.jsx
│       │   │   │   │   └── AttendanceExportPage.jsx
│       │   │   │   └── constants/
│       │   │   │       └── attendanceMockData.js
│       │   │   │
│       │   │   ├── leaves/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LeaveRequestForm.jsx
│       │   │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── LeavesDashboardPage.jsx
│       │   │   │       ├── LeaveRequiredFormPage.jsx
│       │   │   │       ├── LeaveRequestUploadPage.jsx
│       │   │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │   │       ├── LeaveRequestListPage.jsx
│       │   │   │       ├── LeaveRequestActionPage.jsx
│       │   │   │       ├── LeaveRulesPage.jsx
│       │   │   │       └── LeaveRulesApprovalFlowPage.jsx
│       │   │   │
│       │   │   ├── performance/
│       │   │   │   └── pages/
│       │   │   │       ├── PerformanceDashboardPage.jsx
│       │   │   │       ├── PerformanceHistoryPage.jsx
│       │   │   │       ├── PerformanceReviewDetailPage.jsx
│       │   │   │       └── PerformanceNewReviewPage.jsx
│       │   │   │
│       │   │   ├── payroll/
│       │   │   │   ├── constants/
│       │   │   │   │   └── payrollMockData.js
│       │   │   │   └── pages/
│       │   │   │       ├── PayrollDashboardPage.jsx
│       │   │   │       ├── PendingPaymentsPage.jsx
│       │   │   │       ├── RecordPaymentPage.jsx
│       │   │   │       ├── SalaryStructurePage.jsx
│       │   │   │       ├── ReimbursementStatusPage.jsx
│       │   │   │       ├── PayrollSlipsPage.jsx
│       │   │   │       └── PayrollOverviewPage.jsx
│       │   │   │
│       │   │   └── settings/
│       │   │       └── pages/
│       │   │           ├── SettingsDashboardPage.jsx
│       │   │           ├── UserManagementPage.jsx
│       │   │           ├── CompanyDetailsPage.jsx
│       │   │           └── PermissionsManagerPage.jsx
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx                             ✅ Auth + protected split
│       │   │   ├── AuthRoutes.jsx                            ✅ All 8 auth pages
│       │   │   └── HomeRoutes.jsx                            ✅ UPDATED (Phase 6 Step 1)
│       │   │                                                     every route wrapped in RoleRoute
│       │   │                                                     HR / Manager / Employee access
│       │   │                                                     defined per route via allow={[]}
│       │   │                                                     Settings → HR only
│       │   │                                                     Payroll admin → HR only
│       │   │                                                     Employee config → HR + Manager
│       │   │
│       │   ├── assets/
│       │   │   └── loginPagePic.jpg
│       │   │
│       │   ├── App.jsx                                        ✅ Provider stack
│       │   └── main.jsx                                       ✅ BrowserRouter lives here ONLY
│       │
│       ├── supabase/
│       │   └── functions/
│       │       └── create-employee-user/
│       │           ├── index.ts                               ✅ Edge Function fixed
│       │           └── config.toml                            ✅ verify_jwt configured
│       │
│       ├── .env.local                                         ✅ VITE_SUPABASE_URL
│       │                                                         VITE_SUPABASE_ANON_KEY
│       ├── package.json
│       ├── vite.config.js
│       └── tailwind.config.js
│
├── packages/
│   ├── ui/                                                    ⏳ Shared components (future)
│   └── shared/                                                ⏳ Types + utils (future)
│
└── README.md                                                  ✅ Updated HRMS — README Update (May 16, 2026)
Today’s Summary
Completed the remaining Phase 6 work and closed the final open backend blocker for employee creation flow. The pending Supabase Edge Function 401 issue is now fixed, RBAC has been fully verified end-to-end, and Phase 6 can be marked complete.

What was completed today
Fixed the Supabase Edge Function 401 issue for create-employee-user, removing the previous blocker in the employee creation flow.

Completed the final RBAC verification pass for HR, manager, and employee login behavior across routes, sidebar visibility, UI actions, and direct URL access.

Confirmed role behavior works as intended: HR can view/edit all employees, manager can view all but edit none, and employee can view only self.

Confirmed there is no direct URL bypass and Supabase RLS behavior aligns with frontend restrictions.

Phase 6 status
Step 1: Done — route-level role access via RoleRoute and HomeRoutes.

Step 2: Done — employee list and actions restricted by role.

Step 3: Done — employee profile role-specific behavior implemented.

Step 4: Done — sidebar and route mismatch audit completed.

Step 5: Done — final test pass completed across login behavior, routes, sidebar, actions, and Supabase RLS.

Phase 6 Status: COMPLETE


/////////////////////////////////////////////
/////////////////////////////////////////////

Bug 1 & 2 — Notice / Holiday / Event Edit & Delete (Fixed May 21, 2026)

The UPDATE and DELETE RLS policies on notices, holidays, and events tables were scoped to to anon, but Supabase Auth sets role: authenticated in the JWT after login — so all write operations silently matched 0 rows and returned a false success toast. Fixed by dropping the old policies and recreating them as to authenticated. Additionally, updateNotice(), updateHoliday(), and updateEvent() in homeApi.js used .single() which throws a 406 on RETURNING edge cases — replaced with .maybeSingle(). NoticeBoardCard.jsx was also calling Supabase directly inside the component instead of delegating to homeApi.js, which was refactored. All three tables — notices, holidays, and events — now support full HR create, edit, and delete correctly.

hrms-app/                                                     ✅ TURBO MONOREPO
├── netlify.toml                                              ✅ Deploy config (ROOT)
├── package.json                                              ✅ Turbo orchestrator
├── turbo.json                                                ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                                 ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   └── vite.svg
│       │
│       ├── src/
│       │   │
│       │   ├── lib/                                          ✅ Core utils
│       │   │   ├── supabaseClient.js                         ✅ Supabase client (URL + ANON_KEY)
│       │   │   ├── queryClient.js                            ✅ React Query v5 config
│       │   │   └── totpUtils.js                              ✅ Native Web Crypto TOTP (RFC 6238)
│       │   │
│       │   ├── contexts/                                     ✅ Split for Vite Fast Refresh fix
│       │   │   ├── AuthContext.js                            ✅ createContext({}) only
│       │   │   ├── AuthProvider.jsx                          ✅ session / user / isLoading
│       │   │   │                                                 isAuthenticated = !!session
│       │   │   └── CalendarContext.jsx                       ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                                        ✅ React custom hooks
│       │   │   ├── index.js                                  ✅ Barrel export
│       │   │   ├── useAuth.js                                ✅ Full Supabase auth hook
│       │   │   │                                                 signIn / signOut (scope:local)
│       │   │   │                                                 forgotPassword / updatePassword
│       │   │   │                                                 enrollMFA / challengeMFA
│       │   │   │                                                 verifyMFA / getMFALevel
│       │   │   │                                                 getMFAFactors / listMFAFactors
│       │   │   ├── useEmployees.js                           ✅ List + CRUD ops
│       │   │   ├── useEmployeeProfile.js                     ✅ Full profile fetch (4 tables)
│       │   │   ├── useHome.js                                ✅ Dashboard data hook
│       │   │   ├── useLeaves.js                              ✅ Leave requests
│       │   │   ├── usePerformance.js                         ✅ Reviews data
│       │   │   └── useRole.js                                ✅ Reads profiles.role via Supabase
│       │   │                                                     returns: role / isHR / isManager
│       │   │                                                     isEmployee / isLoading
│       │   │
│       │   ├── services/                                     ✅ Supabase API layer
│       │   │   ├── employeeApi.js                            ✅ Full CRUD + file ops
│       │   │   │                                                 getEmployees / getEmployeeById
│       │   │   │                                                 createEmployee / updateEmployee
│       │   │   │                                                 deleteEmployee (cascade)
│       │   │   │                                                 getEmployeeProfile
│       │   │   │                                                 createEmployeeProfile
│       │   │   │                                                 updateEmployeeProfile (400 fix)
│       │   │   │                                                 uploadFile / deleteFile
│       │   │   │                                                 deleteEmployeeProfile
│       │   │   ├── homeApi.js                                ✅ UPDATED — Bug 1 & 2 fixed
│       │   │   │                                                 getNotices / createNotice
│       │   │   │                                                 updateNotice ← .maybeSingle()
│       │   │   │                                                 deleteNotice
│       │   │   │                                                 getHolidays / createHoliday
│       │   │   │                                                 updateHoliday ← .maybeSingle()
│       │   │   │                                                 deleteHoliday
│       │   │   │                                                 getEvents / createEvent
│       │   │   │                                                 updateEvent ← .maybeSingle()
│       │   │   │                                                 deleteEvent
│       │   │   │                                                 getBirthdaysByDate / createBirthday
│       │   │   ├── leaveApi.js                               ✅ Leave endpoints
│       │   │   ├── performanceApi.js                         ✅ Review endpoints
│       │   │   ├── profileApi.js                             ✅ getProfile / updateProfile
│       │   │   └── useProfile.js                             ✅ profile / isLoading / error
│       │   │                                                     updateProfile / isUpdating / refetch
│       │   │
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx                        ✅ isLoading → Spinner
│       │   │   │                                                 isAuthenticated → children | /login
│       │   │   │                                                 named + default export
│       │   │   │
│       │   │   ├── RoleRoute.jsx                             ✅ allow={["hr","manager",...]}
│       │   │   │                                                 isLoading → Spinner
│       │   │   │                                                 unauthorized → Navigate /home
│       │   │   │
│       │   │   └── atomic/                                   ✅ Atomic Design System
│       │   │       ├── atoms/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── LogoutButton.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   ├── EmployeeTableRow.jsx
│       │   │       │   └── BirthdayListItem.jsx
│       │   │       │
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx                   ✅ useRole() filters nav by role
│       │   │       │   │                                         HR → all 7 nav items
│       │   │       │   │                                         Manager → no Payroll, no Settings
│       │   │       │   │                                         Employee → Home / Attendance
│       │   │       │   │                                                     Leaves / Performance
│       │   │       │   │                                                     Payroll (own) only
│       │   │       │   ├── TopBar.jsx
│       │   │       │   ├── UserProfileMenu.jsx
│       │   │       │   ├── NoticeBoardCard.jsx                ✅ UPDATED — Bug 1 fixed
│       │   │       │   │                                         mutations delegate to homeApi.js
│       │   │       │   │                                         no inline supabase calls
│       │   │       │   │                                         ⏳ Bug 3: role-based UI pending
│       │   │       │   ├── HolidaysCard.jsx                  ⏳ Bug 4: role-based UI pending
│       │   │       │   ├── CompanyEventsCard.jsx              ⏳ Bug 5: role-based UI pending
│       │   │       │   ├── BirthdayTrackerCard.jsx            ✅ React Query + month/day sync
│       │   │       │   ├── CalendarCard.jsx                   ⏳ Bug 6: birthday icon fix pending
│       │   │       │   ├── EmployeeTable.jsx                  ✅ isReadOnly prop support
│       │   │       │   │                                         Modify/Delete cols hidden for
│       │   │       │   │                                         non-HR roles
│       │   │       │   │                                         DeleteEmployeeModal guarded
│       │   │       │   ├── EmployeeConfigCard.jsx             ⚠️  DEPRECATED
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── LoginPage.jsx
│       │   │   │       ├── ChangePasswordPage.jsx
│       │   │   │       ├── MFAEnrollPage.jsx
│       │   │   │       ├── TwoFactorPage.jsx
│       │   │   │       ├── ForgotPasswordPage.jsx
│       │   │   │       ├── ResetPasswordPage.jsx
│       │   │   │       ├── VerifyEmailPage.jsx
│       │   │   │       └── PasswordChangedPage.jsx
│       │   │   │
│       │   │   ├── home/
│       │   │   │   └── pages/
│       │   │   │       └── HomePage.jsx
│       │   │   │
│       │   │   ├── employee/
│       │   │   │   ├── components/
│       │   │   │   │   ├── EmployeeMasterForm.jsx             ✅ Create/Edit modal
│       │   │   │   │   │                                         4 sections: KYC / Corporate
│       │   │   │   │   │                                         Compliance / Verification Vault
│       │   │   │   │   │                                         File uploads + DB prefill
│       │   │   │   │   │                                         Edge Function 401 fixed
│       │   │   │   │   ├── EmployeeProfilePage.jsx            ✅ HR → full profile view
│       │   │   │   │   │                                         Manager → limited view-only
│       │   │   │   │   │                                         Employee → self-view ready
│       │   │   │   │   │                                         Sensitive sections restricted
│       │   │   │   │   └── DeleteEmployeeModal.jsx
│       │   │   │   │
│       │   │   │   └── pages/
│       │   │   │       ├── EmployeeListPage.jsx               ✅ HR only → Add New Record
│       │   │   │       │                                         HR only → edit/delete actions
│       │   │   │       │                                         Manager → view-only badge
│       │   │   │       │                                         isReadOnly → EmployeeTable
│       │   │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │   │       ├── EmployeeBranchesPage.jsx
│       │   │   │       ├── EmployeeDesignationsPage.jsx
│       │   │   │       ├── EmployeeStatusesPage.jsx
│       │   │   │       ├── EmployeeTypesPage.jsx
│       │   │   │       └── EmployeeExportPage.jsx
│       │   │   │
│       │   │   ├── attendance/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── AttendanceDashboardPage.jsx
│       │   │   │   │   ├── WorkingDaysPage.jsx
│       │   │   │   │   ├── WorkingHoursPage.jsx
│       │   │   │   │   ├── WorkingRulesPage.jsx
│       │   │   │   │   ├── EditWorkingRulePage.jsx
│       │   │   │   │   ├── EditAttendancePage.jsx
│       │   │   │   │   ├── EditWorkingDaysPage.jsx
│       │   │   │   │   └── AttendanceExportPage.jsx
│       │   │   │   └── constants/
│       │   │   │       └── attendanceMockData.js
│       │   │   │
│       │   │   ├── leaves/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LeaveRequestForm.jsx
│       │   │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── LeavesDashboardPage.jsx
│       │   │   │       ├── LeaveRequiredFormPage.jsx
│       │   │   │       ├── LeaveRequestUploadPage.jsx
│       │   │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │   │       ├── LeaveRequestListPage.jsx
│       │   │   │       ├── LeaveRequestActionPage.jsx
│       │   │   │       ├── LeaveRulesPage.jsx
│       │   │   │       └── LeaveRulesApprovalFlowPage.jsx
│       │   │   │
│       │   │   ├── performance/
│       │   │   │   └── pages/
│       │   │   │       ├── PerformanceDashboardPage.jsx
│       │   │   │       ├── PerformanceHistoryPage.jsx
│       │   │   │       ├── PerformanceReviewDetailPage.jsx
│       │   │   │       └── PerformanceNewReviewPage.jsx
│       │   │   │
│       │   │   ├── payroll/
│       │   │   │   ├── constants/
│       │   │   │   │   └── payrollMockData.js
│       │   │   │   └── pages/
│       │   │   │       ├── PayrollDashboardPage.jsx
│       │   │   │       ├── PendingPaymentsPage.jsx
│       │   │   │       ├── RecordPaymentPage.jsx
│       │   │   │       ├── SalaryStructurePage.jsx
│       │   │   │       ├── ReimbursementStatusPage.jsx
│       │   │   │       ├── PayrollSlipsPage.jsx
│       │   │   │       └── PayrollOverviewPage.jsx
│       │   │   │
│       │   │   └── settings/
│       │   │       └── pages/
│       │   │           ├── SettingsDashboardPage.jsx
│       │   │           ├── UserManagementPage.jsx
│       │   │           ├── CompanyDetailsPage.jsx
│       │   │           └── PermissionsManagerPage.jsx
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx                              ✅ Auth + protected split
│       │   │   ├── AuthRoutes.jsx                             ✅ All 8 auth pages
│       │   │   └── HomeRoutes.jsx                             ✅ Every route in RoleRoute
│       │   │                                                      Settings → HR only
│       │   │                                                      Payroll admin → HR only
│       │   │                                                      Employee config → HR + Manager
│       │   │
│       │   ├── assets/
│       │   │   └── loginPagePic.jpg
│       │   │
│       │   ├── App.jsx                                        ✅ Provider stack (clean)
│       │   └── main.jsx                                       ✅ BrowserRouter lives here ONLY
│       │                                                          Single QueryClient entry point
│       │
│       ├── supabase/
│       │   └── functions/
│       │       └── create-employee-user/
│       │           ├── index.ts                               ✅ Edge Function (401 fixed)
│       │           └── config.toml                            ✅ verify_jwt configured
│       │
│       ├── .env.local                                         ✅ VITE_SUPABASE_URL
│       │                                                          VITE_SUPABASE_ANON_KEY
│       ├── package.json                                       ✅ vite 5.4.8, react-icons,
│       │                                                          @tanstack/react-query v5
│       ├── vite.config.js                                     ✅ Chakra aliases, HMR overlay off
│       └── tailwind.config.js
│
├── packages/
│   ├── ui/                                                    ⏳ Shared components (future)
│   └── shared/                                                ⏳ Types + utils (future)
│
└── README.md



/////////////////////////////////////////
/////////////////////////////////////////

Homepage / dashboard  Bug Fixes Summary
Fixed notice edit/delete by updating the Supabase notice mutation flow so HR can save and remove notices without 406 errors.

Fixed holiday edit/delete by correcting the Home API holiday update and delete handling for successful HR actions.

Restricted notice actions so only HR can see Add, Edit, Delete, and Unpin controls in NoticeBoardCard.jsx.

Restricted holiday actions so only HR can see Add New Holiday, Edit, and Delete controls in HolidaysCard.jsx.

Restricted company event actions so only HR can see Add Event, Edit, and Delete controls in CompanyEventsCard.jsx.

Fixed missing birthday cake icons in CalendarCard.jsx by matching birthdays by month/day for the selected month instead of full date/year.

Reviewed the async login listener warning and found no confirmed app-side auth bug; it appears to be browser-extension noise unless a stack trace points to app code.

All 7 fixes were completed as updates to existing files only; no new file was added for these bugs.


/////////////////////////////////////////
/////////////////////////////////////////

## **Employee Bulk CSV Import and Export Summary (June 28, 2026)**

***

### **Overview**
Implemented full bulk CSV import (with automatic auth creation and idempotent upserts) and detailed CSV export matching the client mockups.

### **New Files & Modified Structure**

```
hrms-app/                                                     ✅ TURBO MONOREPO
├── netlify.toml                                              ✅ Deploy config (ROOT)
├── package.json                                              ✅ Turbo orchestrator
├── turbo.json                                                ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                                 ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   ├── vite.svg
│       │   ├── employee_import_template.csv            ✅ [NEW] CSV template for imports
│       │   └── export csv 1.csv                        ✅ [NEW] CSV test data sample
│       │
│       ├── src/
│       │   │
│       │   ├── lib/                                          ✅ Core utils
│       │   │   ├── supabaseClient.js                         ✅ Supabase client (URL + ANON_KEY)
│       │   │   ├── queryClient.js                            ✅ React Query v5 config
│       │   │   └── totpUtils.js                              ✅ Native Web Crypto TOTP (RFC 6238)
│       │   │
│       │   ├── contexts/                                     ✅ Split for Vite Fast Refresh fix
│       │   │   ├── AuthContext.js                            ✅ createContext({}) only
│       │   │   ├── AuthProvider.jsx                          ✅ session / user / isLoading
│       │   │   │                                                 isAuthenticated = !!session
│       │   │   └── CalendarContext.jsx                       ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                                        ✅ React custom hooks
│       │   │   ├── index.js                                  ✅ Barrel export
│       │   │   ├── useAuth.js                                ✅ Full Supabase auth hook
│       │   │   │                                                 signIn / signOut (scope:local)
│       │   │   │                                                 forgotPassword / updatePassword
│       │   │   │                                                 enrollMFA / challengeMFA
│       │   │   │                                                 verifyMFA / getMFALevel
│       │   │   │                                                 getMFAFactors / listMFAFactors
│       │   │   ├── useEmployees.js                           ✅ List + CRUD ops
│       │   │   ├── useEmployeeProfile.js                     ✅ Full profile fetch (4 tables)
│       │   │   ├── useHome.js                                ✅ Dashboard data hook
│       │   │   ├── useLeaves.js                              ✅ Leave requests
│       │   │   ├── usePerformance.js                         ✅ Reviews data
│       │   │   └── useRole.js                                ✅ Reads profiles.role via Supabase
│       │   │                                                     returns: role / isHR / isManager
│       │   │                                                     isEmployee / isLoading
│       │   │
│       │   ├── services/                                     ✅ Supabase API layer
│       │   │   ├── employeeApi.js                            ✅ Full CRUD + file ops
│       │   │   │                                                 getEmployees / getEmployeeById
│       │   │   │                                                 createEmployee / updateEmployee
│       │   │   │                                                 deleteEmployee (cascade)
│       │   │   │                                                 getEmployeeProfile
│       │   │   │                                                 createEmployeeProfile
│       │   │   │                                                 updateEmployeeProfile (400 fix)
│       │   │   │                                                 uploadFile / deleteFile
│       │   │   │                                                 deleteEmployeeProfile
│       │   │   ├── homeApi.js                                ✅ UPDATED — Bug 1 & 2 fixed
│       │   │   │                                                 getNotices / createNotice
│       │   │   │                                                 updateNotice ← .maybeSingle()
│       │   │   │                                                 deleteNotice
│       │   │   │                                                 getHolidays / createHoliday
│       │   │   │                                                 updateHoliday ← .maybeSingle()
│       │   │   │                                                 deleteHoliday
│       │   │   │                                                 getEvents / createEvent
│       │   │   │                                                 updateEvent ← .maybeSingle()
│       │   │   │                                                 deleteEvent
│       │   │   │                                                 getBirthdaysByDate / createBirthday
│       │   │   ├── leaveApi.js                               ✅ Leave endpoints
│       │   │   ├── performanceApi.js                         ✅ Review endpoints
│       │   │   ├── profileApi.js                             ✅ getProfile / updateProfile
│       │   │   └── useProfile.js                             ✅ profile / isLoading / error
│       │   │                                                     updateProfile / isUpdating / refetch
│       │   │
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx                        ✅ isLoading → Spinner
│       │   │   │                                                 isAuthenticated → children | /login
│       │   │   │                                                 named + default export
│       │   │   │
│       │   │   ├── RoleRoute.jsx                             ✅ allow={["hr","manager",...]}
│       │   │   │                                                 isLoading → Spinner
│       │   │   │                                                 unauthorized → Navigate /home
│       │   │   │
│       │   │   └── atomic/                                   ✅ Atomic Design System
│       │   │       ├── atoms/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── LogoutButton.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   ├── EmployeeTableRow.jsx
│       │   │       │   └── BirthdayListItem.jsx
│       │   │       │
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx                   ✅ useRole() filters nav by role
│       │   │       │   │                                         HR → all 7 nav items
│       │   │       │   │                                         Manager → no Payroll, no Settings
│       │   │       │   │                                         Employee → Home / Attendance
│       │   │       │   │                                                     Leaves / Performance
│       │   │       │   │                                                     Payroll (own) only
│       │   │       │   ├── TopBar.jsx
│       │   │       │   ├── UserProfileMenu.jsx
│       │   │       │   ├── NoticeBoardCard.jsx                ✅ UPDATED — Bug 1 fixed
│       │   │       │   │                                         mutations delegate to homeApi.js
│       │   │       │   │                                         no inline supabase calls
│       │   │       │   │                                         ⏳ Bug 3: role-based UI pending
│       │   │       │   ├── HolidaysCard.jsx                  ⏳ Bug 4: role-based UI pending
│       │   │       │   ├── CompanyEventsCard.jsx              ⏳ Bug 5: role-based UI pending
│       │   │       │   ├── BirthdayTrackerCard.jsx            ✅ React Query + month/day sync
│       │   │       │   ├── CalendarCard.jsx                   ⏳ Bug 6: birthday icon fix pending
│       │   │       │   ├── EmployeeTable.jsx                  ✅ isReadOnly prop support
│       │   │       │   │                                         Modify/Delete cols hidden for
│       │   │       │   │                                         non-HR roles
│       │   │       │   │                                         DeleteEmployeeModal guarded
│       │   │       │   ├── EmployeeConfigCard.jsx             ⚠️  DEPRECATED
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── LoginPage.jsx
│       │   │   │       ├── ChangePasswordPage.jsx
│       │   │   │       ├── MFAEnrollPage.jsx
│       │   │   │       ├── TwoFactorPage.jsx
│       │   │   │       ├── ForgotPasswordPage.jsx
│       │   │   │       ├── ResetPasswordPage.jsx
│       │   │   │       ├── VerifyEmailPage.jsx
│       │   │   │       └── PasswordChangedPage.jsx
│       │   │   │
│       │   │   ├── home/
│       │   │   │   └── pages/
│       │   │   │       └── HomePage.jsx
│       │   │   │
│       │   │   ├── employee/
│       │   │   │   ├── components/
│       │   │   │   │   ├── EmployeeMasterForm.jsx             ✅ Create/Edit modal
│       │   │   │   │   │                                         4 sections: KYC / Corporate
│       │   │   │   │   │                                         Compliance / Verification Vault
│       │   │   │   │   │                                         File uploads + DB prefill
│       │   │   │   │   │                                         Edge Function 401 fixed
│       │   │   │   │   ├── EmployeeProfilePage.jsx            ✅ HR → full profile view
│       │   │   │   │   │                                         Manager → limited view-only
│       │   │   │   │   │                                         Employee → self-view ready
│       │   │   │   │   │                                         Sensitive sections restricted
│       │   │   │   │   ├── EmployeeBulkImportModal.jsx        ✅ [NEW] Bulk CSV Import Modal
│       │   │   │   │   └── DeleteEmployeeModal.jsx
│       │   │   │   │
│       │   │   │   └── pages/
│       │   │   │       ├── EmployeeListPage.jsx               ✅ HR only → Add New Record
│       │   │   │       │                                         HR only → edit/delete actions
│       │   │   │       │                                         Manager → view-only badge
│       │   │   │       │                                         isReadOnly → EmployeeTable
│       │   │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │   │       ├── EmployeeBranchesPage.jsx
│       │   │   │       ├── EmployeeDesignationsPage.jsx
│       │   │   │       ├── EmployeeStatusesPage.jsx
│       │   │   │       ├── EmployeeTypesPage.jsx
│       │   │   │       └── EmployeeExportPage.jsx
│       │   │   │
│       │   │   ├── attendance/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── AttendanceDashboardPage.jsx
│       │   │   │   │   ├── WorkingDaysPage.jsx
│       │   │   │   │   ├── WorkingHoursPage.jsx
│       │   │   │   │   ├── WorkingRulesPage.jsx
│       │   │   │   │   ├── EditWorkingRulePage.jsx
│       │   │   │   │   ├── EditAttendancePage.jsx
│       │   │   │   │   ├── EditWorkingDaysPage.jsx
│       │   │   │   │   └── AttendanceExportPage.jsx
│       │   │   │   └── constants/
│       │   │   │       └── attendanceMockData.js
│       │   │   │
│       │   │   ├── leaves/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LeaveRequestForm.jsx
│       │   │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── LeavesDashboardPage.jsx
│       │   │   │       ├── LeaveRequiredFormPage.jsx
│       │   │   │       ├── LeaveRequestUploadPage.jsx
│       │   │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │   │       ├── LeaveRequestListPage.jsx
│       │   │   │       ├── LeaveRequestActionPage.jsx
│       │   │   │       ├── LeaveRulesPage.jsx
│       │   │   │       └── LeaveRulesApprovalFlowPage.jsx
│       │   │   │
│       │   │   ├── performance/
│       │   │   │   └── pages/
│       │   │   │       ├── PerformanceDashboardPage.jsx
│       │   │   │       ├── PerformanceHistoryPage.jsx
│       │   │   │       ├── PerformanceReviewDetailPage.jsx
│       │   │   │       └── PerformanceNewReviewPage.jsx
│       │   │   │
│       │   │   ├── payroll/
│       │   │   │   ├── constants/
│       │   │   │   │   └── payrollMockData.js
│       │   │   │   └── pages/
│       │   │   │       ├── PayrollDashboardPage.jsx
│       │   │   │       ├── PendingPaymentsPage.jsx
│       │   │   │       ├── RecordPaymentPage.jsx
│       │   │   │       ├── SalaryStructurePage.jsx
│       │   │   │       ├── ReimbursementStatusPage.jsx
│       │   │   │       ├── PayrollSlipsPage.jsx
│       │   │   │       └── PayrollOverviewPage.jsx
│       │   │   │
│       │   │   └── settings/
│       │   │       └── pages/
│       │   │           ├── SettingsDashboardPage.jsx
│       │   │           ├── UserManagementPage.jsx
│       │   │           ├── CompanyDetailsPage.jsx
│       │   │           └── PermissionsManagerPage.jsx
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx                              ✅ Auth + protected split
│       │   │   ├── AuthRoutes.jsx                             ✅ All 8 auth pages
│       │   │   └── HomeRoutes.jsx                             ✅ Every route in RoleRoute
│       │   │                                                      Settings → HR only
│       │   │                                                      Payroll admin → HR only
│       │   │                                                      Employee config → HR + Manager
│       │   │
│       │   ├── assets/
│       │   │   └── loginPagePic.jpg
│       │   │
│       │   ├── App.jsx                                        ✅ Provider stack (clean)
│       │   └── main.jsx                                       ✅ BrowserRouter lives here ONLY
│       │                                                          Single QueryClient entry point
│       │
│       ├── supabase/
│       │   └── functions/
│       │       └── create-employee-user/
│       │           ├── index.ts                               ✅ Edge Function (401 fixed)
│       │           └── config.toml                            ✅ verify_jwt configured
│       │
│       ├── .env.local                                         ✅ VITE_SUPABASE_URL
│       │                                                          VITE_SUPABASE_ANON_KEY
│       ├── package.json                                       ✅ vite 5.4.8, react-icons,
│       │                                                          @tanstack/react-query v5
│       ├── vite.config.js                                     ✅ Chakra aliases, HMR overlay off
│       └── tailwind.config.js
│
├── packages/
│   ├── ui/                                                    ⏳ Shared components (future)
│   └── shared/                                                ⏳ Types + utils (future)
│
└── README.md
```

### **Detailed Summary of Work**
1. **Resilient User Account Handling:** Modified edge function to locate and link existing users on email conflict, upserting their profiles instead of failing with 400 Bad Request.
2. **Bulk Upload Modal:** Designed a Chakra UI modal that accepts drag-and-drop CSV uploads, displays status notifications, parses date inputs in both `DD-MM-YYYY` and `DD/MM/YYYY` formats, and shows comprehensive sync reports (created vs. updated vs. failed).
3. **Idempotency:** Checked existing `emp_code` identifiers first. New employees receive portal logins (using `temp_password` defined in the CSV) and are registered, while existing employees undergo update transformations.
4. **CSV Export:** Fetched data in parallel from `employees`, `employee_compliance`, and `employee_banking` schemas to generate quote-escaped, BOM-aligned CSV files.

***

## **Attendance Board Overhaul & Supabase Employee Logs Integration (July 6, 2026)**

***

### **Overview**
Redesigned the Attendance Board interface to match client mockups, integrated complete real-time database operations via Supabase, added click-to-filter stat toggles, created employee-level detailed monthly logs dashboards, and built a pop-up manual edit log modal with 12h/24h time conversions.

### **New Files & Modified Structure**

```
hrms-app/                                                     ✅ TURBO MONOREPO
├── netlify.toml                                              ✅ Deploy config (ROOT)
├── package.json                                              ✅ Turbo orchestrator
├── turbo.json                                                ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                                 ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   ├── vite.svg
│       │   ├── employee_import_template.csv            ✅ [NEW] CSV template for imports
│       │   └── export csv 1.csv                        ✅ [NEW] CSV test data sample
│       │
│       ├── src/
│       │   │
│       │   ├── lib/                                          ✅ Core utils
│       │   │   ├── supabaseClient.js                         ✅ Supabase client (URL + ANON_KEY)
│       │   │   ├── queryClient.js                            ✅ React Query v5 config
│       │   │   └── totpUtils.js                              ✅ Native Web Crypto TOTP (RFC 6238)
│       │   │
│       │   ├── contexts/                                     ✅ Split for Vite Fast Refresh fix
│       │   │   ├── AuthContext.js                            ✅ createContext({}) only
│       │   │   ├── AuthProvider.jsx                          ✅ session / user / isLoading
│       │   │   │                                                 isAuthenticated = !!session
│       │   │   └── CalendarContext.jsx                       ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                                        ✅ React custom hooks
│       │   │   ├── index.js                                  ✅ Barrel export
│       │   │   ├── useAuth.js                                ✅ Full Supabase auth hook
│       │   │   │                                                 signIn / signOut (scope:local)
│       │   │   │                                                 forgotPassword / updatePassword
│       │   │   │                                                 enrollMFA / challengeMFA
│       │   │   │                                                 verifyMFA / getMFALevel
│       │   │   │                                                 getMFAFactors / listMFAFactors
│       │   │   ├── useEmployees.js                           ✅ List + CRUD ops
│       │   │   ├── useEmployeeProfile.js                     ✅ Full profile fetch (4 tables)
│       │   │   ├── useHome.js                                ✅ Dashboard data hook
│       │   │   ├── useLeaves.js                              ✅ Leave requests
│       │   │   ├── usePerformance.js                         ✅ Reviews data
│       │   │   └── useRole.js                                ✅ Reads profiles.role via Supabase
│       │   │                                                     returns: role / isHR / isManager
│       │   │                                                     isEmployee / isLoading
│       │   │
│       │   ├── services/                                     ✅ Supabase API layer
│       │   │   ├── attendanceApi.js                          ✅ [NEW] Supabase attendance database helper
│       │   │   ├── employeeApi.js                            ✅ Full CRUD + file ops
│       │   │   │                                                 getEmployees / getEmployeeById
│       │   │   │                                                 createEmployee / updateEmployee
│       │   │   │                                                 deleteEmployee (cascade)
│       │   │   │                                                 getEmployeeProfile
│       │   │   │                                                 createEmployeeProfile
│       │   │   │                                                 updateEmployeeProfile (400 fix)
│       │   │   │                                                 uploadFile / deleteFile
│       │   │   │                                                 deleteEmployeeProfile
│       │   │   ├── homeApi.js                                ✅ UPDATED — Bug 1 & 2 fixed
│       │   │   │                                                 getNotices / createNotice
│       │   │   │                                                 updateNotice ← .maybeSingle()
│       │   │   │                                                 deleteNotice
│       │   │   │                                                 getHolidays / createHoliday
│       │   │   │                                                 updateHoliday ← .maybeSingle()
│       │   │   │                                                 deleteHoliday
│       │   │   │                                                 getEvents / createEvent
│       │   │   │                                                 updateEvent ← .maybeSingle()
│       │   │   │                                                 deleteEvent
│       │   │   │                                                 getBirthdaysByDate / createBirthday
│       │   │   ├── leaveApi.js                               ✅ Leave endpoints
│       │   │   ├── performanceApi.js                         ✅ Review endpoints
│       │   │   ├── profileApi.js                             ✅ getProfile / updateProfile
│       │   │   └── useProfile.js                             ✅ profile / isLoading / error
│       │   │                                                     updateProfile / isUpdating / refetch
│       │   │
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx                        ✅ isLoading → Spinner
│       │   │   │                                                 isAuthenticated → children | /login
│       │   │   │                                                 named + default export
│       │   │   │
│       │   │   ├── RoleRoute.jsx                             ✅ allow={["hr","manager",...]}
│       │   │   │                                                 isLoading → Spinner
│       │   │   │                                                 unauthorized → Navigate /home
│       │   │   │
│       │   │   └── atomic/                                   ✅ Atomic Design System
│       │   │       ├── atoms/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSButton.jsx
│       │   │       │   ├── HRMSInput.jsx
│       │   │       │   ├── Logo.jsx
│       │   │       │   ├── SectionTitle.jsx
│       │   │       │   ├── SidebarToggleButton.jsx
│       │   │       │   └── StatusDot.jsx
│       │   │       │
│       │   │       ├── molecules/
│       │   │       │   ├── index.js
│       │   │       │   ├── HRMSCard.jsx
│       │   │       │   ├── InfoRow.jsx
│       │   │       │   ├── LegendItem.jsx
│       │   │       │   ├── LogoutButton.jsx
│       │   │       │   ├── EmployeeConfigItem.jsx
│       │   │       │   ├── DepartmentListItem.jsx
│       │   │       │   ├── EmployeeTableRow.jsx
│       │   │       │   ├── BirthdayListItem.jsx
│       │   │       │   └── AttendanceStatusBadge.jsx         ✅ [NEW] Styled Present/Absent/Leave/Off badges
│       │   │       │
│       │   │       ├── organisms/
│       │   │       │   ├── HRMSSidebar.jsx                   ✅ useRole() filters nav by role
│       │   │       │   │                                         HR → all 7 nav items
│       │   │       │   │                                         Manager → no Payroll, no Settings
│       │   │       │   │                                         Employee → Home / Attendance
│       │   │       │   │                                                     Leaves / Performance
│       │   │       │   │                                                     Payroll (own) only
│       │   │       │   ├── TopBar.jsx
│       │   │       │   ├── UserProfileMenu.jsx
│       │   │       │   ├── NoticeBoardCard.jsx                ✅ UPDATED — Bug 1 fixed
│       │   │       │   │                                         mutations delegate to homeApi.js
│       │   │       │   │                                         no inline supabase calls
│       │   │       │   │                                         ⏳ Bug 3: role-based UI pending
│       │   │       │   ├── HolidaysCard.jsx                  ⏳ Bug 4: role-based UI pending
│       │   │       │   ├── CompanyEventsCard.jsx              ⏳ Bug 5: role-based UI pending
│       │   │       │   ├── BirthdayTrackerCard.jsx            ✅ React Query + month/day sync
│       │   │       │   ├── CalendarCard.jsx                   ⏳ Bug 6: birthday icon fix pending
│       │   │       │   ├── EmployeeTable.jsx                  ✅ isReadOnly prop support
│       │   │       │   │                                         Modify/Delete cols hidden for
│       │   │       │   │                                         non-HR roles
│       │   │       │   │                                         DeleteEmployeeModal guarded
│       │   │       │   ├── EmployeeConfigCard.jsx             ⚠️  DEPRECATED
│       │   │       │   ├── AttendanceTable.jsx                ✅ Updated with sorting & row click listeners
│       │   │       │   ├── AttendanceTableRow.jsx             ✅ Updated to handle row click propagation
│       │   │       │   └── AttendanceConfigCard.jsx
│       │   │       │
│       │   │       └── templates/
│       │   │           └── DashboardLayout.jsx
│       │   │
│       │   ├── features/
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── LoginPage.jsx
│       │   │   │       ├── ChangePasswordPage.jsx
│       │   │   │       ├── MFAEnrollPage.jsx
│       │   │   │       ├── TwoFactorPage.jsx
│       │   │   │       ├── ForgotPasswordPage.jsx
│       │   │   │       ├── ResetPasswordPage.jsx
│       │   │   │       ├── VerifyEmailPage.jsx
│       │   │   │       └── PasswordChangedPage.jsx
│       │   │   │
│       │   │   ├── home/
│       │   │   │   └── pages/
│       │   │   │       └── HomePage.jsx
│       │   │   │
│       │   │   ├── employee/
│       │   │   │   ├── components/
│       │   │   │   │   ├── EmployeeMasterForm.jsx             ✅ Create/Edit modal
│       │   │   │   │   │                                         4 sections: KYC / Corporate
│       │   │   │   │   │                                         Compliance / Verification Vault
│       │   │   │   │   │                                         File uploads + DB prefill
│       │   │   │   │   │                                         Edge Function 401 fixed
│       │   │   │   │   ├── EmployeeProfilePage.jsx            ✅ HR → full profile view
│       │   │   │   │   │                                         Manager → limited view-only
│       │   │   │   │   │                                         Employee → self-view ready
│       │   │   │   │   │                                         Sensitive sections restricted
│       │   │   │   │   ├── EmployeeBulkImportModal.jsx        ✅ [NEW] Bulk CSV Import Modal
│       │   │   │   │   └── DeleteEmployeeModal.jsx
│       │   │   │   │
│       │   │   │   └── pages/
│       │   │   │       ├── EmployeeListPage.jsx               ✅ HR only → Add New Record
│       │   │   │       │                                         HR only → edit/delete actions
│       │   │   │       │                                         Manager → view-only badge
│       │   │   │       │                                         isReadOnly → EmployeeTable
│       │   │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │   │       ├── EmployeeBranchesPage.jsx
│       │   │   │       ├── EmployeeDesignationsPage.jsx
│       │   │   │       ├── EmployeeStatusesPage.jsx
│       │   │   │       ├── EmployeeTypesPage.jsx
│       │   │   │       └── EmployeeExportPage.jsx
│       │   │   │
│       │   │   ├── attendance/
│       │   │   │   ├── pages/
│       │   │   │   │   ├── AttendanceDashboardPage.jsx        ✅ Main dashboard views + Employee log views + Edit modal
│       │   │   │   │   ├── WorkingDaysPage.jsx
│       │   │   │   │   ├── WorkingHoursPage.jsx
│       │   │   │   │   ├── WorkingRulesPage.jsx
│       │   │   │   │   ├── EditWorkingRulePage.jsx
│       │   │   │   │   ├── EditAttendancePage.jsx
│       │   │   │   │   ├── EditWorkingDaysPage.jsx
│       │   │   │   │   └── AttendanceExportPage.jsx
│       │   │   │   └── constants/
│       │   │   │       └── attendanceMockData.js              ✅ Prepopulated test codes
│       │   │   │
│       │   │   ├── leaves/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LeaveRequestForm.jsx
│       │   │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── LeavesDashboardPage.jsx
│       │   │   │       ├── LeaveRequiredFormPage.jsx
│       │   │   │       ├── LeaveRequestUploadPage.jsx
│       │   │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │   │       ├── LeaveRequestListPage.jsx
│       │   │   │       ├── LeaveRequestActionPage.jsx
│       │   │   │       ├── LeaveRulesPage.jsx
│       │   │   │       └── LeaveRulesApprovalFlowPage.jsx
│       │   │   │
│       │   │   ├── performance/
│       │   │   │   └── pages/
│       │   │   │       ├── PerformanceDashboardPage.jsx
│       │   │   │       ├── PerformanceHistoryPage.jsx
│       │   │   │       ├── PerformanceReviewDetailPage.jsx
│       │   │   │       └── PerformanceNewReviewPage.jsx
│       │   │   │
│       │   │   ├── payroll/
│       │   │   │   ├── constants/
│       │   │   │   │   └── payrollMockData.js
│       │   │   │   └── pages/
│       │   │   │       ├── PayrollDashboardPage.jsx
│       │   │   │       ├── PendingPaymentsPage.jsx
│       │   │   │       ├── RecordPaymentPage.jsx
│       │   │   │       ├── SalaryStructurePage.jsx
│       │   │   │       ├── ReimbursementStatusPage.jsx
│       │   │   │       ├── PayrollSlipsPage.jsx
│       │   │   │       └── PayrollOverviewPage.jsx
│       │   │   │
│       │   │   └── settings/
│       │   │       └── pages/
│       │   │           ├── SettingsDashboardPage.jsx
│       │   │           ├── UserManagementPage.jsx
│       │   │           ├── CompanyDetailsPage.jsx
│       │   │           └── PermissionsManagerPage.jsx
│       │   │
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx                              ✅ Auth + protected split
│       │   │   ├── AuthRoutes.jsx                             ✅ All 8 auth pages
│       │   │   └── HomeRoutes.jsx                             ✅ Every route in RoleRoute
│       │   │                                                      Settings → HR only
│       │   │                                                      Payroll admin → HR only
│       │   │                                                      Employee config → HR + Manager
│       │   │
│       │   ├── assets/
│       │   │   └── loginPagePic.jpg
│       │   │
│       │   ├── App.jsx                                        ✅ Provider stack (clean)
│       │   └── main.jsx                                       ✅ BrowserRouter lives here ONLY
│       │                                                          Single QueryClient entry point
│       │
│       ├── supabase/
│       │   └── functions/
│       │       └── create-employee-user/
│       │           ├── index.ts                               ✅ Edge Function (401 fixed)
│       │           └── config.toml                            ✅ verify_jwt configured
│       │
│       ├── .env.local                                         ✅ VITE_SUPABASE_URL
│       │                                                          VITE_SUPABASE_ANON_KEY
│       ├── package.json                                       ✅ vite 5.4.8, react-icons,
│       │                                                          @tanstack/react-query v5
│       ├── vite.config.js                                     ✅ Chakra aliases, HMR overlay off
│       └── tailwind.config.js
│
├── packages/
│   ├── ui/                                                    ⏳ Shared components (future)
│   └── shared/                                                ⏳ Types + utils (future)
│
└── README.md
```

### **Detailed Summary of Work**

1. **Dashboard Redesign & Live Integrations:**
   - Overhauled status metric cards (**Present**, **Absence**, **Leave**, **Day Off**) with sleek gradients, background accents, and inline trendlines.
   - Tied cards as interactive UI toggles; clicking a metric card dynamically filters the database records displayed in the table below.
   - Connected `public.employees` metadata with `public.attendance` records using database queries, defaulting to `Absent` for non-logged dates.

2. **Employee Detailed Logs View:**
   - clicking any employee row opens their detailed logs page.
   - Displays profile summaries, dynamic **Today's Status** dots, and card-based metrics totals over the active month.
   - Added dropdown selectors for viewing ranges (Month & Year selects and FY selects) paired with customized range-filtered CSV exporters.
   - Incorporated a **Nuke Logs** button allowing admins to completely reset and clear records for an employee within a month range.

3. **Daily Punch Records Calendar:**
   - Implemented an automatic descending list of calendar dates (e.g. from current system day/selected day down to the 1st).
   - Each row displays Date, In Time, Out Time, calculated Work Hours, a clickable Status tag, a "Mark Off" button, and a trash reset action to delete punch records.

4. **Interactive Edit Log Modal:**
   - Clicking a status badge in the detailed calendar list opens the edit log modal.
   - Integrated native clock inputs (`HH:MM`) converting display AM/PM formats (e.g., `09:30 AM` $\leftrightarrow$ `09:30`) seamlessly.
   - Saves time entries directly to Supabase and refreshes all relevant dashboard and list states instantly.

---

## **Leaves Module Recreation and Verification (July 7, 2026)**

***

### **Overview**
Recreated the Leaves request approval module inside the HRMS dashboard to match the prototype screenshots, integrated interactive status filters, implemented a reset warning alert modal, added client-side CSV downloads matching your spreadsheet columns, and built pagination capability.

### **Detailed Summary of Work**
1. **Visual Alignment & Card Panels**:
   - Recreated the plain page header for **Leave Requests** and italicized subtitle **Leave Verification & Management**.
   - Created the **Leaves Summary** metric board with three status counters (PENDING in `• 00` dot format, APPROVED, and REJECTED) dynamically recalculating based on the active dataset.
   - Built the **Application Workspace** container housing status filter tabs (**All**, **Pending**, **Approved**, **Rejected**) and an outlined **Export CSV** download button.
   - Customized the sidebar navigation ([HRMSSidebar.jsx](file:///c:/Users/aman/Documents/OFFICE/HRMS/hrms-app/apps/frontend-ui-monorepo/src/components/atomic/organisms/HRMSSidebar.jsx)) for HR and Manager roles to dynamically display **"Leave Request Data"** linking directly to the requests page at `/leaves/requests` for exact alignment with the prototype.
2. **Leaves Requests List & Custom Badges**:
   - Laid out table columns with uppercase wide tracked-headers: `EMPLOYEE`, `TYPE & DURATION`, `REASON`, `SUBMITTED ON`, `EVIDENCE`, `ACTION`.
   - The `TYPE & DURATION` column displays custom badges (peach bg for "SICK LEAVE"), start/end date text spans, and total days count (with correct singular/plural formats).
   - Designed paperclip icons next to the lazy-loaded evidence link tags. Clicking "View Doc" opens the document URL in a new tab if attached; if there is no document, it opens a warning alert modal displaying the message: *"No document uploaded."*
3. **Interactive Reset to Pending Modal**:
   - Rows in APPROVED or REJECTED state render a "Reset to Pending" link below their status badge.
   - Clicking this link displays a confirmation alert dialog modal with a warning exclamation triangle, matching the prototype design text: *"Reset this decision back to Pending? Admin note will be cleared."*
   - Confirming the reset sets the status back to Pending, updates the table row with Approve/Reject buttons, and adjusts the header metrics board in real-time.
4. **Client-Side CSV Exporter**:
   - Generates comma-separated values matching your Excel sheet headers: `Emp ID`, `Name`, `Leave Type`, `Start`, `End`, `Days`, `Status`, `Submitted`, `Admin Note`.
   - Downloads the file formatted as `leave_requests_YYYY-MM-DD.csv` where `YYYY-MM-DD` is the active system date.
5. **Pagination & Mock Fallback**:
   - Added a capsule-shaped **Load Older Requests** button at the center-bottom to paginate through entries.
   - Integrated a mock dataset fallback that pre-populates the list with the three approved Sick Leaves of `BK-006` (Kungthinliu Newmai) from your screenshot if the database contains no records, keeping the dashboard interactive and demonstrative out-of-the-box.
6. **Role Perspective Switcher & Dynamic Sidebar**:
   - Overhauled the sidebar ([HRMSSidebar.jsx](file:///c:/Users/aman/Documents/OFFICE/HRMS/hrms-app/apps/frontend-ui-monorepo/src/components/atomic/organisms/HRMSSidebar.jsx)) and auth hook ([useRole.js](file:///c:/Users/aman/Documents/OFFICE/HRMS/hrms-app/apps/frontend-ui-monorepo/src/hooks/useRole.js)) to toggle view perspective.
   - For Employee View: displays simplified menu list matching Screenshot 1: *Home, Schedule, Leave/Vacation, Salary, Complaint Center, Profile, Sign out*.
   - For Admin View: displays complete menu list matching Screenshot 2: *Home, Employee Mgmt., Schedule Mgmt., Leave Request Data, Salary Mgmt., Complaint Center, Employee ID & Docs, Activity Logs, Sign out, and Language selector*.
   - Rendered a dynamic Switch Perspective button at the bottom of the sidebar allowing HR/Manager users to swap UI contexts seamlessly.
   - Embedded "Sign out" action inside the sidebar list group and implemented the "Language" globe selector dropdown at the bottom of the sidebar.
   - Implemented a mockup complaints center page ([ComplaintCenterPage.jsx](file:///c:/Users/aman/Documents/OFFICE/HRMS/hrms-app/apps/frontend-ui-monorepo/src/features/home/ComplaintCenterPage.jsx)) and a subscription lock page ([ProFeatureGatePage.jsx](file:///c:/Users/aman/Documents/OFFICE/HRMS/hrms-app/apps/frontend-ui-monorepo/src/features/home/ProFeatureGatePage.jsx)) to link with all new menu items.

### **Updated Files & Directory Structure (July 7, 2026)**

```
hrms-app/                                                     ✅ TURBO MONOREPO
├── netlify.toml                                              ✅ Deploy config (ROOT)
├── package.json                                              ✅ Turbo orchestrator
├── turbo.json                                                ✅ Build pipeline
│
├── apps/
│   └── frontend-ui-monorepo/                                 ✅ VITE 5.4.8 + CHAKRA v2 + RQ v5
│       ├── public/
│       │   ├── favicon.ico
│       │   ├── vite.svg
│       │   ├── employee_import_template.csv            ✅ [NEW] CSV template for imports
│       │   └── export csv 1.csv                        ✅ [NEW] CSV test data sample
│       │
│       ├── src/
│       │   │
│       │   ├── lib/                                          ✅ Core utils
│       │   │   ├── supabaseClient.js                         ✅ Supabase client (URL + ANON_KEY)
│       │   │   ├── queryClient.js                            ✅ React Query v5 config
│       │   │   └── totpUtils.js                              ✅ Native Web Crypto TOTP (RFC 6238)
│       │   │
│       │   ├── contexts/                                     ✅ Split for Vite Fast Refresh fix
│       │   │   ├── AuthContext.js                            ✅ createContext({}) only
│       │   │   ├── AuthProvider.jsx                          ✅ session / user / isLoading
│       │   │   │                                                 isAuthenticated = !!session
│       │   │   └── CalendarContext.jsx                       ✅ Birthday ↔ Calendar sync
│       │   │
│       │   ├── hooks/                                        ✅ React custom hooks
│       │   │   ├── index.js                                  ✅ Barrel export
│       │   │   ├── useAuth.js                                ✅ Full Supabase auth hook
│       │   │   │                                                 signIn / signOut (scope:local)
│       │   │   │                                                 forgotPassword / updatePassword
│       │   │   │                                                 enrollMFA / challengeMFA
│       │   │   │                                                 verifyMFA / getMFALevel
│       │   │   │                                                 getMFAFactors / listMFAFactors
│       │   │   ├── useEmployees.js                           ✅ List + CRUD ops
│       │   │   ├── useEmployeeProfile.js                     ✅ Full profile fetch (4 tables)
│       │   │   ├── useHome.js                                ✅ Dashboard data hook
│       │   │   ├── useLeaves.js                              ✅ Leave requests
│       │   │   ├── usePerformance.js                         ✅ Reviews data
│       │   │   └── useRole.js                                ✅ Reads profiles.role via Supabase
│       │   │                                                     returns: role / isHR / isManager
│       │   │                                                     isEmployee / isLoading
│       │   │
│       │   ├── services/                                     ✅ Supabase API layer
│       │   │   ├── attendanceApi.js                          ✅ [NEW] Supabase attendance database helper
│       │   │   ├── employeeApi.js                            ✅ Full CRUD + file ops
│       │   │   │                                                 getEmployees / getEmployeeById
│       │   │   │                                                 createEmployee / updateEmployee
│       │   │   │                                                 deleteEmployee (cascade)
│       │   │   │                                                 getEmployeeProfile
│       │   │   │                                                 createEmployeeProfile
│       │   │   │                                                 updateEmployeeProfile (400 fix)
│       │   │   │                                                 uploadFile / deleteFile
│       │   │   │                                                 deleteEmployeeProfile
│       │   │   ├── homeApi.js                                ✅ UPDATED — Bug 1 & 2 fixed
│       │   │   │                                                 getNotices / createNotice
│       │   │   │                                                 updateNotice ← .maybeSingle()
│       │   │   │                                                 deleteNotice
│       │   │   │                                                 getHolidays / createHoliday
│       │   │   │                                                 updateHoliday ← .maybeSingle()
│       │   │   │                                                 deleteHoliday
│       │   │   │                                                 getEvents / createEvent
│       │   │   │                                                 updateEvent ← .maybeSingle()
│       │   │   │                                                 deleteEvent
│       │   │   │                                                 getBirthdaysByDate / createBirthday
│       │   │   ├── leaveApi.js                               ✅ Leave endpoints
│       │   │   ├── performanceApi.js                         ✅ Review endpoints
│       │   │   ├── profileApi.js                             ✅ getProfile / updateProfile
│       │   │   └── useProfile.js                             ✅ profile / isLoading / error
│       │   │                                                     updateProfile / isUpdating / refetch
│       │   │
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx                        ✅ isLoading → Spinner
│       │   │   │                                                 isAuthenticated → children | /login
│       │   │   │                                                 named + default export
│       │   │   │
│       │   │   ├── RoleRoute.jsx                             ✅ allow={["hr","manager",...]}
│       │   │   │                                                 isLoading → Spinner
│       │   │   │                                                 unauthorized → Navigate /home
│       │   │   │
│       │   └── atomic/                                       ✅ Atomic Design System
│       │       ├── atoms/
│       │       │   ├── index.js
│       │       │   ├── HRMSButton.jsx
│       │       │   ├── HRMSInput.jsx
│       │       │   ├── Logo.jsx
│       │       │   ├── SectionTitle.jsx
│       │       │   ├── SidebarToggleButton.jsx
│       │       │   └── StatusDot.jsx
│       │       │
│       │       ├── molecules/
│       │       │   ├── index.js
│       │       │   ├── HRMSCard.jsx
│       │       │   ├── InfoRow.jsx
│       │       │   ├── LegendItem.jsx
│       │       │   ├── LogoutButton.jsx
│       │       │   ├── EmployeeConfigItem.jsx
│       │       │   ├── DepartmentListItem.jsx
│       │       │   ├── EmployeeTableRow.jsx
│       │       │   ├── BirthdayListItem.jsx
│       │       │   └── AttendanceStatusBadge.jsx         ✅ [NEW] Styled Present/Absent/Leave/Off badges
│       │       │
│       │       ├── organisms/
│       │       │   ├── HRMSSidebar.jsx                   ✅ useRole() filters nav by role
│       │       │   │                                         HR → all 7 nav items
│       │       │   │                                         Manager → no Payroll, no Settings
│       │       │   │                                         Employee → Home / Attendance
│       │       │   │                                                     Leaves / Performance
│       │       │   │                                                     Payroll (own) only
│       │       │   ├── TopBar.jsx
│       │       │   ├── UserProfileMenu.jsx
│       │       │   ├── NoticeBoardCard.jsx                ✅ UPDATED — Bug 1 fixed
│       │       │   │                                         mutations delegate to homeApi.js
│       │       │   │                                         no inline supabase calls
│       │       │   │                                         ⏳ Bug 3: role-based UI pending
│       │       │   ├── HolidaysCard.jsx                  ⏳ Bug 4: role-based UI pending
│       │       │   ├── CompanyEventsCard.jsx              ⏳ Bug 5: role-based UI pending
│       │       │   ├── BirthdayTrackerCard.jsx            ✅ React Query + month/day sync
│       │       │   ├── CalendarCard.jsx                   ⏳ Bug 6: birthday icon fix pending
│       │       │   ├── EmployeeTable.jsx                  ✅ isReadOnly prop support
│       │       │   │                                         Modify/Delete cols hidden for
│       │       │   │                                         non-HR roles
│       │       │   │                                         DeleteEmployeeModal guarded
│       │       │   ├── EmployeeConfigCard.jsx             ⚠️  DEPRECATED
│       │       │   ├── AttendanceTable.jsx                ✅ Updated with sorting & row click listeners
│       │       │   ├── AttendanceTableRow.jsx             ✅ Updated to handle row click propagation
│       │       │   └── AttendanceConfigCard.jsx
│       │       │
│       │       └── templates/
│       │           └── DashboardLayout.jsx
│       │
│       ├── features/
│       │   │
│       │   ├── auth/
│       │   │   └── pages/
│       │   │       ├── LoginPage.jsx
│       │   │       ├── ChangePasswordPage.jsx
│       │   │       ├── MFAEnrollPage.jsx
│       │   │       ├── TwoFactorPage.jsx
│       │   │       ├── ForgotPasswordPage.jsx
│       │   │       ├── ResetPasswordPage.jsx
│       │   │       ├── VerifyEmailPage.jsx
│       │   │       └── PasswordChangedPage.jsx
│       │   │
│       │   ├── home/
│       │   │   ├── pages/
│       │   │   │   └── HomePage.jsx
│       │   │   ├── ComplaintCenterPage.jsx            ✅ [NEW] Employee feedback & HR resolution dashboard
│       │   │   └── ProFeatureGatePage.jsx             ✅ [NEW] Subscription-lock gate for audit logs & docs
│       │   │
│       │   ├── employee/
│       │   │   ├── components/
│       │   │   │   ├── EmployeeMasterForm.jsx             ✅ Create/Edit modal
│       │   │   │   │                                         4 sections: KYC / Corporate
│       │   │   │   │                                         Compliance / Verification Vault
│       │   │   │   │                                         File uploads + DB prefill
│       │   │   │   │                                         Edge Function 401 fixed
│       │   │   │   ├── EmployeeProfilePage.jsx            ✅ HR → full profile view
│       │   │   │   │                                         Manager → limited view-only
│       │   │   │   │                                         Employee → self-view ready
│       │   │   │   │                                         Sensitive sections restricted
│       │   │   │   ├── EmployeeBulkImportModal.jsx        ✅ [NEW] Bulk CSV Import Modal
│       │   │   │   └── DeleteEmployeeModal.jsx
│       │   │   │
│       │   │   └── pages/
│       │   │       ├── EmployeeListPage.jsx               ✅ HR only → Add New Record
│       │   │       │                                         HR only → edit/delete actions
│       │   │       │                                         Manager → view-only badge
│       │   │       │                                         isReadOnly → EmployeeTable
│       │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │       ├── EmployeeBranchesPage.jsx
│       │   │       ├── EmployeeDesignationsPage.jsx
│       │   │       ├── EmployeeStatusesPage.jsx
│       │   │       ├── EmployeeTypesPage.jsx
│       │   │       └── EmployeeExportPage.jsx
│       │   │
│       │   ├── attendance/
│       │   │   ├── pages/
│       │   │   │   ├── AttendanceDashboardPage.jsx        ✅ Main dashboard views + Employee log views + Edit modal
│       │   │   │   ├── WorkingDaysPage.jsx
│       │   │   │   ├── WorkingHoursPage.jsx
│       │   │   │   ├── WorkingRulesPage.jsx
│       │   │   │   ├── EditWorkingRulePage.jsx
│       │   │   │   ├── EditAttendancePage.jsx
│       │   │   │   ├── EditWorkingDaysPage.jsx
│       │   │   │   └── AttendanceExportPage.jsx
│       │   │   └── constants/
│       │   │       └── attendanceMockData.js              ✅ Prepopulated test codes
│       │   │
│       │   ├── leaves/
│       │   │   ├── components/
│       │   │   │   ├── LeaveRequestForm.jsx
│       │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   └── pages/
│       │   │       ├── LeavesDashboardPage.jsx
│       │   │       ├── LeaveRequiredFormPage.jsx
│       │   │       ├── LeaveRequestUploadPage.jsx
│       │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │       ├── LeaveRequestListPage.jsx
│       │   │       ├── LeaveRequestActionPage.jsx
│       │   │       ├── LeaveRulesPage.jsx
│       │   │       └── LeaveRulesApprovalFlowPage.jsx
│       │   │
│       │   ├── performance/
│       │   │   └── pages/
│       │   │       ├── PerformanceDashboardPage.jsx
│       │   │       ├── PerformanceHistoryPage.jsx
│       │   │       ├── PerformanceReviewDetailPage.jsx
│       │   │       └── PerformanceNewReviewPage.jsx
│       │   │
│       │   ├── payroll/
│       │   │   ├── constants/
│       │   │   │   └── payrollMockData.js
│       │   │   └── pages/
│       │   │       ├── PayrollDashboardPage.jsx
│       │   │       ├── PendingPaymentsPage.jsx
│       │   │       ├── RecordPaymentPage.jsx
│       │   │       ├── SalaryStructurePage.jsx
│       │   │       ├── ReimbursementStatusPage.jsx
│       │   │       ├── PayrollSlipsPage.jsx
│       │   │       └── PayrollOverviewPage.jsx
│       │   │
│       │   └── settings/
│       │       └── pages/
│       │           ├── SettingsDashboardPage.jsx
│       │           ├── UserManagementPage.jsx
│       │           ├── CompanyDetailsPage.jsx
│       │           └── PermissionsManagerPage.jsx
│       │
│       ├── routes/
│       │   ├── AppRoutes.jsx                              ✅ Auth + protected split
│       │   ├── AuthRoutes.jsx                             ✅ All 8 auth pages
│       │   └── HomeRoutes.jsx                             ✅ Every route in RoleRoute
│       │                                                      Settings → HR only
│       │                                                      Payroll admin → HR only
│       │
│       ├── assets/
│       │   └── loginPagePic.jpg
│       │
│       ├── App.jsx                                        ✅ Provider stack (clean)
│       └── main.jsx                                       ✅ BrowserRouter lives here ONLY
│                                                              Single QueryClient entry point
│
├── supabase/
│   └── functions/
│       └── create-employee-user/
│           ├── index.ts                               ✅ Edge Function (401 fixed)
│           └── config.toml                            ✅ verify_jwt configured
│
├── .env.local                                         ✅ VITE_SUPABASE_URL
│                                                          VITE_SUPABASE_ANON_KEY
│
├── package.json                                       ✅ vite 5.4.8, react-icons,
│                                                          @tanstack/react-query v5
│
├── vite.config.js                                     ✅ Chakra aliases, HMR overlay off
└── tailwind.config.js
│
├── packages/
│   ├── ui/                                                    ⏳ Shared components (future)
│   └── shared/                                                ⏳ Types + utils (future)
│
└── README.md
```


---

---

## 📅 08-07-2026 — Phase 2: Beekend HRMS Feature Port & Production Hardening

---

### 🎯 Overview

This session ported key business features from the **Beekend HRMS** prototype into **Happy HRMS**, strictly respecting Happy HRMS's existing architecture (Atomic Design, React Query, Supabase, RBAC, Turbo monorepo). No Beekend architecture, folder structure, or component library was copied — only business logic and UX patterns were adapted.

---

### ✅ Features Implemented

#### 1. 💰 Payroll / Salary Management Module

Ported the complete Payroll module from Beekend HRMS into Happy HRMS's existing `features/payroll/` structure.

- **`PayrollOverviewPage.jsx`** — Main payroll run page for HR. Allows generating payroll for a selected month, auto-calculating gross, deductions (TDS, PF, ESI), net pay, and inserting `payslips` records via a `payroll_runs` trigger.
- **`SalaryStructurePage.jsx`** — HR view to set and edit `monthly_ctc`, allowances, and deduction overrides per employee. Persists to `salary_structures` table.
- **`PayrollSlipsPage.jsx`** — Employee view for downloading/viewing their own payslips. HR can look up any employee's payslip history.
- **`PayrollDashboardPage.jsx`** — Overview dashboard with payroll run history, total payout stats, and quick-access cards.
- **`PayrollReimbursementPage.jsx`** — Reimbursement claim submission for employees; HR approval interface.
- **Database**: Uses `payroll_runs`, `payslips`, `salary_structures` tables in Supabase.
- **Bug fixed**: Payroll generation error (`operator does not exist: date ~~ unknown`) — fixed date range query to use `.gte()` / `.lte()` instead of `.like()`.
- **Bug fixed**: `FormControl is not defined` — missing import added to `PayrollOverviewPage.jsx`.
- **Route access**: Added `"manager"` to allowed roles for `/payroll`, `/payroll/payslips`, and `/payroll/reimbursement` in `HomeRoutes.jsx`.

---

#### 2. 🗓️ Attendance — Rename & Role-Split

- **Renamed** all "Schedule Management" labels to **"Attendance"** across `HRMSSidebar.jsx`, page titles, and breadcrumbs.
- **HR/Manager view**: Unchanged full admin dashboard with CSV import/export, date picker, bulk edit, off-day marking, and per-employee log drilldown.
- **Employee & Manager (Employee View)**: New dedicated `EmployeeAttendanceDashboard.jsx` that:
  - Looks up employee record via `auth_user_id` in `employees` table
  - Shows a gradient header banner with name, designation, and today's check-in/out status
  - Displays 4 stat cards: Present, Absent, On Leave, Off Days (for selected month)
  - Month-navigable log table: Date, Day, Check-In, Check-Out, Hours Worked, Status badge
  - Today's row highlighted in purple; weekends in gray; future dates at reduced opacity
  - Graceful empty state if no employee record is linked (no infinite spinner)
- **New API**: `getAttendanceForEmployee(employeeId, startDate, endDate)` in `attendanceApi.js`
- **Bug fixed**: `Cannot access 'loading' before initialization` — moved `isPageLoading` below `useState` declarations (TDZ fix).

---

#### 3. 🌿 Employee / Manager Leave Module

Built the full employee-facing leave experience in `features/leaves/`.

- **`LeavesDashboardPage.jsx`**:
  - Calendar display, leave summary (allotted / available), upcoming approved leaves
  - "Request Leave" toggles inline `LeaveRequestForm` with file attachment support
  - Submission persists to `leave_requests` table; document uploaded to Supabase Storage (`leaves` bucket)
  - HR/Manager actions hidden in employee view

- **`LeaveSubmitStatusPage.jsx`** — Leave history & status tracker:
  - Fetches leave requests for the logged-in employee
  - Stepper timeline cards: Submitted → Under Review → Approved/Rejected

- **`leaveApi.js`**: Added `uploadLeaveDocument(file)` Supabase Storage helper.

- **Database migration** (`20260708172232_expand_leave_and_complaints.sql`):
  - Added `document_url TEXT` to `leave_requests`
  - Created `public.complaints` table with `case_id` (UNIQUE), `subject`, `description`, `status`, timestamps
  - Created `leaves` storage bucket (public) with RLS policies

---

#### 4. 📢 Persistent Anonymous Complaint Center

Rebuilt `ComplaintCenterPage.jsx` from local mock state to a fully Supabase-backed anonymous system.

- **Employee view**: Submit complaint → auto-generated `CASE-XXXXXX` ID → one-click copy → track by Case ID
- **HR/Manager view**: Live active cases dashboard + archived cases with resolve/dismiss actions
- **New service**: `complaintApi.js` — `fetchComplaints()`, `createComplaint()`, `updateComplaintStatus()`
- **New hooks**: `useComplaints.js` — React Query wrappers
- **Bug fixed**: `409 Conflict` on submission — double-click guard via synchronous `submitting` state

---

#### 5. 👤 RBAC Employee Profile Editor

Rebuilt `EmployeeProfilePage.jsx` with role-aware edit controls:

| Role | Editable Fields |
|------|----------------|
| **Employee (own profile)** | Personal info, emergency contact, banking details |
| **HR Admin** | All fields including corporate, salary, compliance |
| **Manager (viewing another employee)** | Read-only |

---

#### 6. 🔐 Bug Fixes — HR Specialist & Manager Profile Lookup

**Root Cause**: HR Specialists and Managers have `profiles` records but no `employees` table entries. Switching to Employee View triggered `useEmployeeProfile(user.id)` → `"Employee profile not found"` crash.

**Fix**: Changed condition from `originalRole !== "hr"` to `originalRole === "employee"` across 5 files:

| File | Fix Applied |
|------|------------|
| `AttendanceDashboardPage.jsx` | `shouldFetchProfile = isEmployeeMode && originalRole === "employee"` |
| `LeavesDashboardPage.jsx` | Same; submit guard also scoped to `originalRole === "employee"` |
| `LeaveSubmitStatusPage.jsx` | Same |
| `PayrollSlipsPage.jsx` | `originalRole === "employee" ? user.id : null` |
| `PayrollDashboardPage.jsx` | Same |

---

### 🐛 All Bugs Fixed This Session

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| `FormControl is not defined` | Missing Chakra import | Added to `PayrollOverviewPage.jsx` |
| `Employee profile not found` | HR/Manager querying `employees` table | Skip fetch when `originalRole !== "employee"` |
| Payroll `date ~~ unknown` error | `.like()` on date column | Replaced with `.gte()` / `.lte()` |
| Attendance: spinner forever in employee view | Manager had no `selectedEmployeeForLogs` | Dedicated `EmployeeAttendanceDashboard` with own `auth_user_id` lookup |
| `Cannot access 'loading' before initialization` | `isPageLoading` used `loading` before `useState` (TDZ) | Moved below `useState` |
| `409 Conflict` on complaint submit | Double-click fired two parallel POSTs | `submitting` guard + button `isLoading` |
| `"Profile not loaded yet. Try again."` | Submit guard blocked Manager | Scoped guard to `originalRole === "employee"` only |

---

### 📦 New Files Added

| File | Purpose |
|------|---------|
| `features/attendance/pages/EmployeeAttendanceDashboard.jsx` | Personal attendance dashboard for employees & managers in employee-view |
| `services/complaintApi.js` | Complaints CRUD API |
| `hooks/useComplaints.js` | React Query wrappers for complaints |
| `supabase/migrations/20260708172232_expand_leave_and_complaints.sql` | Schema: `document_url`, `complaints` table, `leaves` bucket |
| `supabase/migrations/20260708181624_fix_leave_requests_rls.sql` | Schema: Adds INSERT/DELETE RLS policies on leave_requests |
| `supabase/migrations/20260708183614_fix_leave_requests_select_rls.sql` | Schema: Relaxes leave_requests SELECT/INSERT RLS policies for all roles |

---

### 🔨 Build Status

```
✓ 1671 modules transformed — built in 9.1s (Production, zero errors)
```

---

## 📁 Full Updated Monorepo Folder Structure

```txt
hrms-app/
├── apps/
│   └── frontend-ui-monorepo/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   │   ├── atomic/
│       │   │   │   ├── atoms/
│       │   │   │   │   ├── HRMSButton.jsx
│       │   │   │   │   ├── HRMSInput.jsx
│       │   │   │   │   ├── Logo.jsx
│       │   │   │   │   ├── SectionTitle.jsx
│       │   │   │   │   ├── SidebarToggleButton.jsx
│       │   │   │   │   ├── StatusDot.jsx
│       │   │   │   │   └── index.js
│       │   │   │   ├── molecules/
│       │   │   │   │   ├── AttendanceConfigItem.jsx
│       │   │   │   │   ├── BirthdayListItem.jsx
│       │   │   │   │   ├── DepartmentListItem.jsx
│       │   │   │   │   ├── EmployeeConfigItem.jsx
│       │   │   │   │   ├── EmployeeTableRow.jsx
│       │   │   │   │   ├── HRMSCard.jsx
│       │   │   │   │   ├── HRMSTable.jsx
│       │   │   │   │   ├── InfoRow.jsx
│       │   │   │   │   ├── LegendItem.jsx
│       │   │   │   │   ├── LogoutButton.jsx
│       │   │   │   │   └── index.js
│       │   │   │   ├── organisms/
│       │   │   │   │   ├── AttendanceConfigCard.jsx
│       │   │   │   │   ├── BirthdayTrackerCard.jsx
│       │   │   │   │   ├── CalendarCard.jsx
│       │   │   │   │   ├── CompanyEventsCard.jsx
│       │   │   │   │   ├── EmployeeConfigCard.jsx
│       │   │   │   │   ├── EmployeeTable.jsx
│       │   │   │   │   ├── HRMSSidebar.jsx
│       │   │   │   │   ├── HolidaysCard.jsx
│       │   │   │   │   ├── NoticeBoardCard.jsx
│       │   │   │   │   ├── TopBar.jsx
│       │   │   │   │   ├── UserProfileMenu.jsx
│       │   │   │   │   └── index.js
│       │   │   │   ├── templates/
│       │   │   │   │   ├── DashboardLayout.jsx
│       │   │   │   │   └── index.js
│       │   │   │   └── pages/
│       │   │   └── ui/
│       │   │   ├── ProtectedRoute.jsx
│       │   │   └── RoleRoute.jsx
│       │   ├── contexts/
│       │   │   ├── AuthContext.jsx
│       │   │   ├── AuthProvider.jsx
│       │   │   └── useAuthContext.js
│       │   ├── features/
│       │   │   ├── attendance/
│       │   │   │   ├── components/
│       │   │   │   │   ├── molecules/
│       │   │   │   │   │   ├── AttendanceSearchInput.jsx
│       │   │   │   │   │   ├── AttendanceStatusBadge.jsx
│       │   │   │   │   │   ├── EmployeeAvatarName.jsx
│       │   │   │   │   │   ├── RuleField.jsx
│       │   │   │   │   │   ├── RuleListItem.jsx
│       │   │   │   │   │   ├── WeekdaySelector.jsx
│       │   │   │   │   │   ├── WorkingDayItem.jsx
│       │   │   │   │   │   └── WorkingHourItem.jsx
│       │   │   │   │   └── organisms/
│       │   │   │   │       ├── AttendanceTable.jsx
│       │   │   │   │       ├── AttendanceTableRow.jsx
│       │   │   │   │       ├── ExportAttendanceCard.jsx
│       │   │   │   │       ├── RuleEditCard.jsx
│       │   │   │   │       ├── WorkingDaysForm.jsx
│       │   │   │   │       ├── WorkingDaysList.jsx
│       │   │   │   │       ├── WorkingHoursCard.jsx
│       │   │   │   │       └── WorkingRulesList.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── AttendanceDashboardPage.jsx
│       │   │   │       ├── AttendanceExportPage.jsx
│       │   │   │       ├── EditAttendancePage.jsx
│       │   │   │       ├── EditWorkingDaysPage.jsx
│       │   │   │       ├── EditWorkingRulePage.jsx
│       │   │   │       ├── EmployeeAttendanceDashboard.jsx
│       │   │   │       ├── WorkingDaysPage.jsx
│       │   │   │       ├── WorkingHoursPage.jsx
│       │   │   │       └── WorkingRulesPage.jsx
│       │   │   ├── auth/
│       │   │   │   └── pages/
│       │   │   │       ├── ChangePasswordPage.jsx
│       │   │   │       ├── ForgotPasswordPage.jsx
│       │   │   │       ├── LoginPage.jsx
│       │   │   │       ├── MFAEnrollPage.jsx
│       │   │   │       ├── PasswordChangedPage.jsx
│       │   │   │       ├── ResetPasswordPage.jsx
│       │   │   │       ├── TwoFactorPage.jsx
│       │   │   │       └── VerifyEmailPage.jsx
│       │   │   ├── employee/
│       │   │   │   ├── components/
│       │   │   │   │   ├── DeleteEmployeeModal.jsx
│       │   │   │   │   ├── EmployeeBulkImportModal.jsx
│       │   │   │   │   ├── EmployeeMasterForm.jsx
│       │   │   │   │   └── EmployeeProfilePage.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── EmployeeBranchesPage.jsx
│       │   │   │       ├── EmployeeDepartmentsPage.jsx
│       │   │   │       ├── EmployeeDesignationsPage.jsx
│       │   │   │       ├── EmployeeExportPage.jsx
│       │   │   │       ├── EmployeeListPage.jsx
│       │   │   │       ├── EmployeeStatusesPage.jsx
│       │   │   │       └── EmployeeTypesPage.jsx
│       │   │   ├── home/
│       │   │   │   ├── ComplaintCenterPage.jsx
│       │   │   │   ├── ProFeatureGatePage.jsx
│       │   │   │   └── homePage.jsx
│       │   │   ├── leaves/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LeaveRequestForm.jsx
│       │   │   │   │   └── LeaveUploadOverlay.jsx
│       │   │   │   └── pages/
│       │   │   │       ├── LeaveRequestActionPage.jsx
│       │   │   │       ├── LeaveRequestListPage.jsx
│       │   │   │       ├── LeaveRequestUploadPage.jsx
│       │   │   │       ├── LeaveRequiredFormPage.jsx
│       │   │   │       ├── LeaveRulesApprovalFlowPage.jsx
│       │   │   │       ├── LeaveRulesPage.jsx
│       │   │   │       ├── LeaveSubmitStatusPage.jsx
│       │   │   │       ├── LeavesDashboardPage.jsx
│       │   │   │       └── leaveMockData.js
│       │   │   ├── payroll/
│       │   │   │   ├── components/
│       │   │   │   │   ├── PaymentTable.jsx
│       │   │   │   │   ├── ReimbursementForm.jsx
│       │   │   │   │   └── SalaryStructureForm.jsx
│       │   │   │   ├── constants/
│       │   │   │   │   └── payrollMockData.js
│       │   │   │   └── pages/
│       │   │   │       ├── PayrollDashboardPage.jsx
│       │   │   │       ├── PayrollOverviewPage.jsx
│       │   │   │       ├── PayrollSlipsPage.jsx
│       │   │   │       ├── PendingPaymentsPage.jsx
│       │   │   │       ├── RecordPaymentPage.jsx
│       │   │   │       ├── ReimbursementStatusPage.jsx
│       │   │   │       └── SalaryStructurePage.jsx
│       │   │   ├── performance/
│       │   │   │   └── pages/
│       │   │   │       ├── PerformanceDashboardPage.jsx
│       │   │   │       ├── PerformanceHistoryPage.jsx
│       │   │   │       ├── PerformanceNewReviewPage.jsx
│       │   │   │       └── PerformanceReviewDetailPage.jsx
│       │   │   └── settings/
│       │   │       └── pages/
│       │   │           ├── CompanyDetailsPage.jsx
│       │   │           ├── PermissionsManagerPage.jsx
│       │   │           ├── SettingsDashboardPage.jsx
│       │   │           └── UserManagementPage.jsx
│       │   ├── hooks/
│       │   │   ├── index.js
│       │   │   ├── useAuth.js
│       │   │   ├── useComplaints.js
│       │   │   ├── useEmployeeProfile.js
│       │   │   ├── useEmployees.js
│       │   │   ├── useHome.js
│       │   │   ├── useLeaves.js
│       │   │   ├── usePayroll.js
│       │   │   ├── usePerformance.js
│       │   │   └── useRole.js
│       │   ├── lib/
│       │   │   ├── queryClient.js
│       │   │   ├── supabaseClient.js
│       │   │   └── totpUtils.js
│       │   ├── routes/
│       │   │   ├── AppRoutes.jsx
│       │   │   └── HomeRoutes.jsx
│       │   ├── services/
│       │   │   ├── attendanceApi.js
│       │   │   ├── complaintApi.js
│       │   │   ├── employeeApi.js
│       │   │   ├── homeApi.js
│       │   │   ├── leaveApi.js
│       │   │   ├── payrollApi.js
│       │   │   ├── performanceApi.js
│       │   │   ├── profileApi.js
│       │   │   └── useProfile.js
│       │   ├── App.css
│       │   ├── App.jsx
│       │   ├── index.css
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
│
│   ├── shared/
│   │   └── employeeFilters.js
│
├── packages/
│   └── shared/
│       └── employeeFilters.js
│
├── supabase/
│   ├── functions/
│   │   └── create-employee-user/
│   │       ├── index.ts
│   │       └── config.toml
│   └── migrations/
│       ├── 20260708160102_create_payroll_tables.sql
│       ├── 20260708172232_expand_leave_and_complaints.sql
│       ├── 20260708181624_fix_leave_requests_rls.sql
│       └── 20260708183614_fix_leave_requests_select_rls.sql
│
├── .env.local
├── package.json
├── turbo.json
└── README.md
```


