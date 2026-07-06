// src/features/attendance/constants/attendanceMockData.js

export const baseEmployees = [
  {
    id: "BK-001",
    name: "Biren Manger",
    email: "biren@beekend.com",
    department: "Kitchen",
    location: "M3M 65 Avenue, Gurugram",
    avatar: ""
  },
  {
    id: "BK-002",
    name: "Akash Rai",
    email: "akash@beekend.com",
    department: "Kitchen",
    location: "ROF PORTICO, Sushant Lok",
    avatar: ""
  },
  {
    id: "BK-003",
    name: "Prakash Rai",
    email: "prakash@beekend.com",
    department: "Kitchen",
    location: "ROF PORTICO, Sushant Lok",
    avatar: ""
  },
  {
    id: "BK-004",
    name: "Muskan",
    email: "muskan@beekend.com",
    department: "Hospitality",
    location: "ROF PORTICO, Sushant Lok",
    avatar: ""
  },
  {
    id: "BK-005",
    name: "Thonbamliu Newmai",
    email: "thonbamliu@beekend.com",
    department: "HR",
    location: "M3M 65 Avenue, Gurugram",
    avatar: ""
  },
  {
    id: "BK-006",
    name: "Kungthinliu Newmai",
    email: "kungthinliu@beekend.com",
    department: "—",
    location: "ROF PORTICO, Sushant Lok",
    avatar: ""
  },
  {
    id: "BK-007",
    name: "Priya Khulal",
    email: "priya@beekend.com",
    department: "Hospitality",
    location: "M3M 65 Avenue, Gurugram",
    avatar: ""
  },
  {
    id: "BK-008",
    name: "Ipungleibe",
    email: "ipungleibe@beekend.com",
    department: "Hospitality",
    location: "M3M 65 Avenue, Gurugram",
    avatar: ""
  },
  {
    id: "BK-009",
    name: "Shankar",
    email: "shankar@beekend.com",
    department: "Kitchen",
    location: "M3M 65 Avenue, Gurugram",
    avatar: ""
  },
  {
    id: "BK-010",
    name: "Suman",
    email: "suman@beekend.com",
    department: "Kitchen",
    location: "M3M 65 Avenue, Gurugram",
    avatar: ""
  },
  {
    id: "BK-011",
    name: "Sushil",
    email: "sushil@beekend.com",
    department: "Kitchen",
    location: "M3M 65 Avenue, Gurugram",
    avatar: ""
  },
  {
    id: "BK-014",
    name: "Mallika Tripura",
    email: "mallika@beekend.com",
    department: "Admin",
    location: "ROF PORTICO, Sushant Lok",
    avatar: ""
  },
  {
    id: "BK-015",
    name: "Deep",
    email: "deep@beekend.com",
    department: "Kitchen",
    location: "ROF PORTICO, Sushant Lok",
    avatar: ""
  },
  {
    id: "BK-016",
    name: "Lok Maya",
    email: "lokmaya@beekend.com",
    department: "Hospitality",
    location: "M3M 65 Avenue, Gurugram",
    avatar: ""
  }
];

export const defaultAttendanceLogs = [
  // --- 2026-07-06 (Matches Screenshot 1 exactly) ---
  { emp_id: "BK-006", date: "2026-07-06", in_time: "12:01 PM", out_time: "", status: "Present" },
  { emp_id: "BK-003", date: "2026-07-06", in_time: "11:56 AM", out_time: "", status: "Present" },
  { emp_id: "BK-015", date: "2026-07-06", in_time: "11:00 AM", out_time: "", status: "Present" },
  { emp_id: "BK-014", date: "2026-07-06", in_time: "10:10 AM", out_time: "", status: "Present" },
  { emp_id: "BK-002", date: "2026-07-06", in_time: "08:57 AM", out_time: "", status: "Present" },
  { emp_id: "BK-001", date: "2026-07-06", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-004", date: "2026-07-06", in_time: "", out_time: "", status: "Off Day" },
  { emp_id: "BK-005", date: "2026-07-06", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-008", date: "2026-07-06", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-009", date: "2026-07-06", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-010", date: "2026-07-06", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-011", date: "2026-07-06", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-016", date: "2026-07-06", in_time: "", out_time: "", status: "Absent" },

  // --- 2026-07-05 ---
  { emp_id: "BK-001", date: "2026-07-05", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-004", date: "2026-07-05", in_time: "12:00 PM", out_time: "10:28 PM", status: "Present" },
  { emp_id: "BK-006", date: "2026-07-05", in_time: "", out_time: "", status: "On Leave" },
  { emp_id: "BK-003", date: "2026-07-05", in_time: "12:00 PM", out_time: "10:28 PM", status: "Present" },
  { emp_id: "BK-002", date: "2026-07-05", in_time: "08:58 AM", out_time: "07:12 PM", status: "Present" },
  { emp_id: "BK-007", date: "2026-07-05", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-009", date: "2026-07-05", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-005", date: "2026-07-05", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-010", date: "2026-07-05", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-008", date: "2026-07-05", in_time: "", out_time: "", status: "Absent" },

  // --- 2026-07-04 ---
  { emp_id: "BK-010", date: "2026-07-04", in_time: "09:54 AM", out_time: "08:20 PM", status: "Present" },
  { emp_id: "BK-008", date: "2026-07-04", in_time: "10:00 AM", out_time: "08:00 PM", status: "Present" },
  { emp_id: "BK-004", date: "2026-07-04", in_time: "12:00 PM", out_time: "10:47 PM", status: "Present" },
  { emp_id: "BK-002", date: "2026-07-04", in_time: "08:57 AM", out_time: "07:11 PM", status: "Present" },
  { emp_id: "BK-003", date: "2026-07-04", in_time: "11:58 AM", out_time: "10:49 PM", status: "Present" },
  { emp_id: "BK-006", date: "2026-07-04", in_time: "", out_time: "", status: "On Leave" },
  { emp_id: "BK-005", date: "2026-07-04", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-001", date: "2026-07-04", in_time: "", out_time: "", status: "Absent" },
  { emp_id: "BK-009", date: "2026-07-04", in_time: "10:10 AM", out_time: "08:20 PM", status: "Present" },
  { emp_id: "BK-007", date: "2026-07-04", in_time: "09:52 AM", out_time: "08:20 PM", status: "Present" }
];

export function getOrCreateLogsForDate(dateStr, existingLogs) {
  const logsForDate = existingLogs.filter((log) => log.date === dateStr);
  if (logsForDate.length > 0) {
    return logsForDate;
  }
  // Generate defaults for this date: all base employees are Absent by default
  return baseEmployees.map((emp) => ({
    emp_id: emp.id,
    date: dateStr,
    in_time: "",
    out_time: "",
    status: "Absent"
  }));
}
