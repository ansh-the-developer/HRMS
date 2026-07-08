// src/features/attendance/pages/AttendanceDashboardPage.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Select,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Button,
  Icon,
  Spinner,
  Center,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import {
  FiUpload,
  FiDownload,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiArrowLeft,
} from "react-icons/fi";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import HRMSTable from "@/components/atomic/molecules/HRMSTable";
import AttendanceTable from "../components/organisms/AttendanceTable";
import AttendanceStatusBadge from "../components/molecules/AttendanceStatusBadge";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import EmployeeAttendanceDashboard from "./EmployeeAttendanceDashboard";
import { getEmployees } from "@/services/employeeApi";
import {
  getAttendanceForDate,
  upsertAttendanceRecord,
  bulkUpsertAttendance,
  deleteAttendanceForDate,
  getAttendanceForRange,
  deleteEmployeeAttendanceRecord,
  deleteEmployeeAttendanceForRange,
} from "@/services/attendanceApi";

// Helper to calculate work hours
const calculateWorkHours = (inTime, outTime) => {
  if (!inTime || !outTime) return "";

  const parseTimeToMinutes = (t) => {
    const clean = t.trim().toUpperCase();
    // Handle AM/PM format (e.g., 08:57 AM, 12:01 PM)
    const match12 = clean.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/);
    if (match12) {
      let hrs = parseInt(match12[1], 10);
      const mins = parseInt(match12[2], 10);
      const ampm = match12[3];
      if (ampm === "PM" && hrs < 12) hrs += 12;
      if (ampm === "AM" && hrs === 12) hrs = 0;
      return hrs * 60 + mins;
    }
    // Handle HH:MM:SS format
    const match24 = clean.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
    if (match24) {
      const hrs = parseInt(match24[1], 10);
      const mins = parseInt(match24[2], 10);
      return hrs * 60 + mins;
    }
    // Handle simple HH:MM format
    const matchSimple = clean.match(/^(\d{1,2}):(\d{2})$/);
    if (matchSimple) {
      const hrs = parseInt(matchSimple[1], 10);
      const mins = parseInt(matchSimple[2], 10);
      return hrs * 60 + mins;
    }
    return null;
  };

  const inMins = parseTimeToMinutes(inTime);
  const outMins = parseTimeToMinutes(outTime);
  if (inMins === null || outMins === null) return "";

  let diff = outMins - inMins;
  if (diff < 0) diff += 24 * 60; // Handle overnight

  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h}h ${m}m`;
};

// 12-hour AM/PM to 24-hour HH:MM conversion
const convert12to24 = (time12) => {
  if (!time12) return "";
  const match = time12.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return time12;
  let hrs = parseInt(match[1], 10);
  const mins = match[2];
  const ampm = match[3];
  if (ampm === "PM" && hrs < 12) hrs += 12;
  if (ampm === "AM" && hrs === 12) hrs = 0;
  return `${String(hrs).padStart(2, "0")}:${mins}`;
};

// 24-hour HH:MM to 12-hour AM/PM conversion
const convert24to12 = (time24) => {
  if (!time24) return "";
  const parts = time24.split(":");
  if (parts.length < 2) return time24;
  let hrs = parseInt(parts[0], 10);
  const mins = parts[1];
  const ampm = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12;
  if (hrs === 0) hrs = 12;
  return `${String(hrs).padStart(2, "0")}:${mins} ${ampm}`;
};

// Check if date belongs to fiscal year
const isDateInFY = (dateStr, fyStr) => {
  const parts = fyStr.split("-");
  if (parts.length < 2) return false;
  const startYear = parseInt(parts[0], 10);
  const endYear = startYear + 1;

  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return false;

  const startTime = new Date(`${startYear}-04-01`).getTime();
  const endTime = new Date(`${endYear}-03-31T23:59:59`).getTime();
  const dateTime = dateObj.getTime();

  return dateTime >= startTime && dateTime <= endTime;
};

// Check if date is in selected month/year
const isDateInMonth = (dateStr, monthName, yearStr) => {
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return false;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const targetMonth = months.indexOf(monthName);
  const targetYear = parseInt(yearStr, 10);

  return dateObj.getMonth() === targetMonth && dateObj.getFullYear() === targetYear;
};

// Generate calendar dates in descending order for viewed month
const generateDatesForMonth = (monthName, yearVal, currentDateStr) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIdx = months.indexOf(monthName);
  const totalDays = new Date(yearVal, monthIdx + 1, 0).getDate();

  const curDateObj = new Date(currentDateStr);
  const curYear = curDateObj.getFullYear();
  const curMonth = curDateObj.getMonth();
  const curDay = curDateObj.getDate();

  let startDay = totalDays;

  if (yearVal === curYear && monthIdx === curMonth) {
    // limit current month to viewed date
    startDay = Math.min(totalDays, curDay);
  } else if (yearVal > curYear || (yearVal === curYear && monthIdx > curMonth)) {
    // future month
    return [];
  }

  const list = [];
  for (let d = startDay; d >= 1; d--) {
    const mm = String(monthIdx + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    list.push(`${yearVal}-${mm}-${dd}`);
  }
  return list;
};

// Format date display (e.g. Jul 6, 2026)
const formatDateDisplay = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const mStr = fullMonths[d.getMonth()].slice(0, 3);
  return `${mStr} ${d.getDate()}, ${d.getFullYear()}`;
};

const AttendanceDashboardPage = () => {
  const toast = useToast();
  const fileInputRef = useRef(null);

  const { role, originalRole } = useRole();
  const { user } = useAuth();
  const isEmployeeMode = role === "employee";
  const shouldFetchProfile = isEmployeeMode && originalRole === "employee";
  const { data: empProfile, isLoading: loadingProfile } = useEmployeeProfile(shouldFetchProfile ? user?.id : null);

  // Core Data States
  const [dbEmployees, setDbEmployees] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // isPageLoading must be after loading useState to avoid TDZ
  const isPageLoading = loading || (shouldFetchProfile && loadingProfile);

  // Global filters
  const [selectedDate, setSelectedDate] = useState("2026-07-06");
  const [selectedFY, setSelectedFY] = useState("2026-27");
  const [selectedMonth, setSelectedMonth] = useState("Jul");
  const [selectedYear, setSelectedYear] = useState("2026");

  // Selected Employee for Detail Logs View
  const [selectedEmployeeForLogs, setSelectedEmployeeForLogs] = useState(null);

  // Employee details view specific filters
  const [empSelectedMonth, setEmpSelectedMonth] = useState("Jul");
  const [empSelectedYear, setEmpSelectedYear] = useState("2026");
  const [empSelectedFY, setEmpSelectedFY] = useState("2026-27");

  // Specific employee's month logs state
  const [employeeMonthLogs, setEmployeeMonthLogs] = useState([]);

  // Active Metric Filter on main dashboard
  const [cardFilter, setCardFilter] = useState(null); // 'Present', 'Absent', 'On Leave', 'Off Day', or null

  // Import Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [importedLogsToConfirm, setImportedLogsToConfirm] = useState(null);
  const [importedFileName, setImportedFileName] = useState("");

  // Edit Log Modal state (For manual checkin edits)
  const [isEditLogOpen, setIsEditLogOpen] = useState(false);
  const [editingLogTarget, setEditingLogTarget] = useState(null); // { date, emp_id, in_time, out_time }
  const [editInTime, setEditInTime] = useState(""); // HH:MM 24h
  const [editOutTime, setEditOutTime] = useState(""); // HH:MM 24h

  // Fetch employees and attendance logs from Supabase for main dashboard
  const loadData = async () => {
    try {
      setLoading(true);
      const emps = await getEmployees();
      setDbEmployees(emps || []);
      const logs = await getAttendanceForDate(selectedDate);
      setAttendanceLogs(logs || []);
    } catch (err) {
      toast({
        title: "Error loading attendance data",
        description: err.message,
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  useEffect(() => {
    if (isEmployeeMode && empProfile) {
      setSelectedEmployeeForLogs(empProfile);
    }
  }, [isEmployeeMode, empProfile]);

  // Fetch selected employee's log entries for the viewed month/year range
  const loadEmployeeMonthLogs = async () => {
    if (!selectedEmployeeForLogs) return;
    try {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIdx = months.indexOf(empSelectedMonth);
      const year = parseInt(empSelectedYear, 10);
      const totalDays = new Date(year, monthIdx + 1, 0).getDate();

      const startDate = `${year}-${String(monthIdx + 1).padStart(2, "0")}-01`;
      const endDate = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;

      const logs = await getAttendanceForRange(startDate, endDate);
      const empLogs = logs.filter((l) => l.employee_id === selectedEmployeeForLogs.id);
      setEmployeeMonthLogs(empLogs || []);
    } catch (err) {
      console.error("Error loading employee logs range:", err.message);
    }
  };

  useEffect(() => {
    loadEmployeeMonthLogs();
  }, [selectedEmployeeForLogs, empSelectedMonth, empSelectedYear]);

  // Synchronise employee filters when main selectedDate changes
  useEffect(() => {
    const d = new Date(selectedDate);
    if (!isNaN(d.getTime())) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      setEmpSelectedMonth(months[d.getMonth()]);
      setEmpSelectedYear(String(d.getFullYear()));
    }
  }, [selectedDate]);

  // Merge database employees with attendance logs (Outer Join) for main dashboard
  const currentDayLogs = dbEmployees.map((emp) => {
    const log = attendanceLogs.find((l) => l.employee_id === emp.id);
    return {
      emp_id: emp.id,
      date: selectedDate,
      in_time: log ? log.in_time : "",
      out_time: log ? log.out_time : "",
      status: log ? log.status : "Absent",
    };
  });

  // Main Dashboard counts
  const presentCount = currentDayLogs.filter((l) => l.status === "Present").length;
  const absentCount = currentDayLogs.filter((l) => l.status === "Absent").length;
  const leaveCount = currentDayLogs.filter((l) => l.status === "On Leave").length;
  const offDayCount = currentDayLogs.filter((l) => l.status === "Off Day").length;

  // Table rows for main dashboard
  const tableDataFiltered = currentDayLogs.filter((log) => {
    if (!cardFilter) return true;
    return log.status.toLowerCase() === cardFilter.toLowerCase();
  });

  // Action: Mark Off / Remove Off on main board or employee log table
  const handleMarkOff = async (empId, actionType, customDate = null) => {
    const targetDate = customDate || selectedDate;
    try {
      if (actionType === "mark_off") {
        const payload = {
          employee_id: empId,
          date: targetDate,
          status: "Off Day",
          in_time: "",
          out_time: "",
        };
        await upsertAttendanceRecord(payload);

        // Reload data sources
        const updatedLogs = await getAttendanceForDate(selectedDate);
        setAttendanceLogs(updatedLogs || []);
        if (selectedEmployeeForLogs) {
          await loadEmployeeMonthLogs();
        }

        toast({
          title: "Employee marked as Off Day",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        // Revert to Absent
        await deleteEmployeeAttendanceRecord(empId, targetDate);

        // Reload data sources
        const updatedLogs = await getAttendanceForDate(selectedDate);
        setAttendanceLogs(updatedLogs || []);
        if (selectedEmployeeForLogs) {
          await loadEmployeeMonthLogs();
        }

        toast({
          title: "Off Day removed",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Action failed",
        description: err.message,
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    }
  };

  // Delete All logs for currently selected date
  const handleDeleteAll = async () => {
    if (window.confirm(`Are you sure you want to delete all attendance records for ${selectedDate}?`)) {
      try {
        await deleteAttendanceForDate(selectedDate);
        setAttendanceLogs((prev) => prev.filter((l) => l.date !== selectedDate));
        toast({
          title: "All records for this date deleted",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Delete all failed",
          description: err.message,
          status: "error",
          duration: 3500,
          isClosable: true,
        });
      }
    }
  };

  // Helper to trigger download of CSV
  const triggerCSVDownload = (filename, formattedRows) => {
    const headers = [
      "emp_id",
      "date",
      "in_time",
      "out_time",
      "name",
      "department",
      "location",
      "work_hour",
      "status",
    ];

    const rows = formattedRows.map((row) => {
      return [
        row.emp_code,
        row.date,
        row.in_time || "",
        row.out_time || "",
        `"${row.name || ""}"`,
        `"${row.department || ""}"`,
        `"${row.work_location || ""}"`,
        row.work_hour || "",
        row.status,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Main Dashboard Downloads
  const handleDownloadView = () => {
    const rows = currentDayLogs.map((log) => {
      const emp = dbEmployees.find((e) => e.id === log.emp_id) || {};
      const workHour = calculateWorkHours(log.in_time, log.out_time);
      return {
        emp_code: emp.emp_code || emp.id?.slice(0, 8) || "",
        date: log.date,
        in_time: log.in_time || "",
        out_time: log.out_time || "",
        name: emp.name || "",
        department: emp.department || "",
        work_location: emp.work_location || "",
        work_hour: workHour,
        status: log.status,
      };
    });
    triggerCSVDownload(`attendance_view_${selectedDate}.csv`, rows);
  };

  const handleDownloadFY = async () => {
    try {
      const parts = selectedFY.split("-");
      if (parts.length < 2) return;
      const startYear = parseInt(parts[0], 10);
      const endYear = startYear + 1;
      const startDate = `${startYear}-04-01`;
      const endDate = `${endYear}-03-31`;

      const logs = await getAttendanceForRange(startDate, endDate);
      const joined = logs.map((log) => {
        const emp = dbEmployees.find((e) => e.id === log.employee_id) || {};
        const workHour = calculateWorkHours(log.in_time, log.out_time);
        return {
          emp_code: emp.emp_code || emp.id?.slice(0, 8) || "",
          date: log.date,
          in_time: log.in_time || "",
          out_time: log.out_time || "",
          name: emp.name || "",
          department: emp.department || "",
          work_location: emp.work_location || "",
          work_hour: workHour,
          status: log.status,
        };
      });
      triggerCSVDownload(`attendance_fy_${selectedFY}.csv`, joined);
    } catch (err) {
      toast({
        title: "Download FY failed",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownloadMonth = async () => {
    try {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIdx = months.indexOf(selectedMonth);
      const year = parseInt(selectedYear, 10);

      const firstDay = new Date(year, monthIdx, 1);
      const lastDay = new Date(year, monthIdx + 1, 0);

      const formatLocalISO = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };

      const startDate = formatLocalISO(firstDay);
      const endDate = formatLocalISO(lastDay);

      const logs = await getAttendanceForRange(startDate, endDate);
      const joined = logs.map((log) => {
        const emp = dbEmployees.find((e) => e.id === log.employee_id) || {};
        const workHour = calculateWorkHours(log.in_time, log.out_time);
        return {
          emp_code: emp.emp_code || emp.id?.slice(0, 8) || "",
          date: log.date,
          in_time: log.in_time || "",
          out_time: log.out_time || "",
          name: emp.name || "",
          department: emp.department || "",
          work_location: emp.work_location || "",
          work_hour: workHour,
          status: log.status,
        };
      });
      triggerCSVDownload(`attendance_month_${selectedMonth}_${selectedYear}.csv`, joined);
    } catch (err) {
      toast({
        title: "Download Month failed",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // CSV downloads for a SINGLE employee in details view
  const handleDownloadEmpMonth = async () => {
    if (!selectedEmployeeForLogs) return;
    try {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIdx = months.indexOf(empSelectedMonth);
      const year = parseInt(empSelectedYear, 10);

      const firstDay = new Date(year, monthIdx, 1);
      const lastDay = new Date(year, monthIdx + 1, 0);

      const formatLocalISO = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };

      const startDate = formatLocalISO(firstDay);
      const endDate = formatLocalISO(lastDay);

      const logs = await getAttendanceForRange(startDate, endDate);
      const empLogs = logs.filter((l) => l.employee_id === selectedEmployeeForLogs.id);

      const joined = empLogs.map((log) => {
        const workHour = calculateWorkHours(log.in_time, log.out_time);
        return {
          emp_code: selectedEmployeeForLogs.emp_code || selectedEmployeeForLogs.id?.slice(0, 8) || "",
          date: log.date,
          in_time: log.in_time || "",
          out_time: log.out_time || "",
          name: selectedEmployeeForLogs.name || "",
          department: selectedEmployeeForLogs.department || "",
          work_location: selectedEmployeeForLogs.work_location || "",
          work_hour: workHour,
          status: log.status,
        };
      });

      triggerCSVDownload(`attendance_${selectedEmployeeForLogs.name}_${empSelectedMonth}_${empSelectedYear}.csv`, joined);
    } catch (err) {
      toast({
        title: "Download failed",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownloadEmpFY = async () => {
    if (!selectedEmployeeForLogs) return;
    try {
      const parts = empSelectedFY.split("-");
      if (parts.length < 2) return;
      const startYear = parseInt(parts[0], 10);
      const endYear = startYear + 1;
      const startDate = `${startYear}-04-01`;
      const endDate = `${endYear}-03-31`;

      const logs = await getAttendanceForRange(startDate, endDate);
      const empLogs = logs.filter((l) => l.employee_id === selectedEmployeeForLogs.id);

      const joined = empLogs.map((log) => {
        const workHour = calculateWorkHours(log.in_time, log.out_time);
        return {
          emp_code: selectedEmployeeForLogs.emp_code || selectedEmployeeForLogs.id?.slice(0, 8) || "",
          date: log.date,
          in_time: log.in_time || "",
          out_time: log.out_time || "",
          name: selectedEmployeeForLogs.name || "",
          department: selectedEmployeeForLogs.department || "",
          work_location: selectedEmployeeForLogs.work_location || "",
          work_hour: workHour,
          status: log.status,
        };
      });

      triggerCSVDownload(`attendance_${selectedEmployeeForLogs.name}_fy_${empSelectedFY}.csv`, joined);
    } catch (err) {
      toast({
        title: "Download failed",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Nuke Logs for viewed month for selected employee
  const handleNukeEmpLogs = async () => {
    if (!selectedEmployeeForLogs) return;
    if (
      window.confirm(
        `Are you sure you want to nuke all logs for ${selectedEmployeeForLogs.name} in ${empSelectedMonth} ${empSelectedYear}?`
      )
    ) {
      try {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIdx = months.indexOf(empSelectedMonth);
        const year = parseInt(empSelectedYear, 10);

        const firstDay = new Date(year, monthIdx, 1);
        const lastDay = new Date(year, monthIdx + 1, 0);

        const formatLocalISO = (d) => {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd}`;
        };

        const startDate = formatLocalISO(firstDay);
        const endDate = formatLocalISO(lastDay);

        await deleteEmployeeAttendanceForRange(selectedEmployeeForLogs.id, startDate, endDate);

        // Reload data
        const updatedLogs = await getAttendanceForDate(selectedDate);
        setAttendanceLogs(updatedLogs || []);
        await loadEmployeeMonthLogs();

        toast({
          title: "Logs Nuked Successfully",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Nuke logs failed",
          description: err.message,
          status: "error",
          duration: 3500,
          isClosable: true,
        });
      }
    }
  };

  // Download Import Template
  const handleDownloadTemplate = () => {
    const headers = ["emp_id", "date", "in_time", "out_time"];
    const sampleEmp1 = dbEmployees[0]?.emp_code || dbEmployees[0]?.id || "BK-001";
    const sampleEmp2 = dbEmployees[1]?.emp_code || dbEmployees[1]?.id || "BK-002";

    const rows = [
      [sampleEmp1, "2026-07-06", "08:55 AM", "05:30 PM"],
      [sampleEmp2, "2026-07-06", "09:20 AM", "06:00 PM"],
    ];
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "attendance_import_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Drag and Drop & Parsing
  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleCSVFileSelect(file);
  };

  const handleFileBrowse = (e) => {
    const file = e.target.files[0];
    if (file) handleCSVFileSelect(file);
  };

  const handleCSVFileSelect = (file) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file format",
        description: "Please upload a valid CSV file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setImportedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      try {
        const parsed = parseCSVText(text);
        setImportedLogsToConfirm(parsed);
      } catch (err) {
        toast({
          title: "Failed to parse CSV",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    reader.readAsText(file);
  };

  const parseCSVText = (text) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
    if (lines.length < 2) throw new Error("CSV has no data rows.");

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const empIdIdx = headers.indexOf("emp_id");
    const dateIdx = headers.indexOf("date");
    const inTimeIdx = headers.indexOf("in_time");
    const outTimeIdx = headers.indexOf("out_time");

    if (empIdIdx === -1 || dateIdx === -1) {
      throw new Error("CSV headers must include 'emp_id' and 'date'.");
    }

    const parsedRows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
      if (cols.length < 2) continue;

      const csvEmpId = cols[empIdIdx];
      const date = cols[dateIdx];
      const in_time = inTimeIdx !== -1 ? cols[inTimeIdx] : "";
      const out_time = outTimeIdx !== -1 ? cols[outTimeIdx] : "";

      if (!csvEmpId || !date) continue;

      // Find the employee in dbEmployees by emp_code or id or short id
      const employee = dbEmployees.find(
        (e) =>
          e.emp_code === csvEmpId ||
          e.id === csvEmpId ||
          e.id?.slice(0, 8) === csvEmpId
      );

      if (!employee) continue; // skip unknown employee

      let status = "Absent";
      if (in_time) {
        status = "Present";
      }

      parsedRows.push({
        employee_id: employee.id,
        date,
        in_time,
        out_time,
        status,
      });
    }
    return parsedRows;
  };

  const handleConfirmImport = async () => {
    if (!importedLogsToConfirm) return;

    try {
      await bulkUpsertAttendance(importedLogsToConfirm);

      // Reload logs for the current selected date
      const logs = await getAttendanceForDate(selectedDate);
      setAttendanceLogs(logs || []);

      toast({
        title: "CSV Imported Successfully",
        description: `Loaded ${importedLogsToConfirm.length} records to Supabase.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsImportModalOpen(false);
      setImportedLogsToConfirm(null);
      setImportedFileName("");
    } catch (err) {
      toast({
        title: "Import failed",
        description: err.message,
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    }
  };

  // Toggle card filters
  const toggleCardFilter = (status) => {
    if (cardFilter === status) {
      setCardFilter(null);
    } else {
      setCardFilter(status);
    }
  };

  // Edit log modal actions
  const handleOpenEditModal = (dayLog) => {
    setEditingLogTarget(dayLog);
    setEditInTime(convert12to24(dayLog.in_time));
    setEditOutTime(convert12to24(dayLog.out_time));
    setIsEditLogOpen(true);
  };

  const handleSaveEditedLog = async () => {
    if (!editingLogTarget || !selectedEmployeeForLogs) return;

    try {
      const payload = {
        employee_id: selectedEmployeeForLogs.id,
        date: editingLogTarget.date,
        in_time: editInTime ? convert24to12(editInTime) : "",
        out_time: editOutTime ? convert24to12(editOutTime) : "",
        status: editInTime ? "Present" : "Absent",
      };

      await upsertAttendanceRecord(payload);

      // Reload data sources
      const updatedLogs = await getAttendanceForDate(selectedDate);
      setAttendanceLogs(updatedLogs || []);
      await loadEmployeeMonthLogs();

      toast({
        title: "Log updated successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setIsEditLogOpen(false);
      setEditingLogTarget(null);
    } catch (err) {
      toast({
        title: "Failed to save log",
        description: err.message,
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    }
  };

  const handleDeleteSingleLog = async (date) => {
    if (!selectedEmployeeForLogs) return;
    if (window.confirm(`Are you sure you want to clear punch records for ${date}?`)) {
      try {
        await deleteEmployeeAttendanceRecord(selectedEmployeeForLogs.id, date);

        // Reload data sources
        const updatedLogs = await getAttendanceForDate(selectedDate);
        setAttendanceLogs(updatedLogs || []);
        await loadEmployeeMonthLogs();

        toast({
          title: "Punch log cleared successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Clear log failed",
          description: err.message,
          status: "error",
          duration: 3500,
          isClosable: true,
        });
      }
    }
  };

  // Logic for employee calendar view (Employee logs view)
  const employeeCalendarDates = selectedEmployeeForLogs
    ? generateDatesForMonth(empSelectedMonth, empSelectedYear, selectedDate)
    : [];

  const employeeCalendarRows = employeeCalendarDates.map((dateStr) => {
    // Find log in state
    const log = employeeMonthLogs.find(
      (l) => l.employee_id === selectedEmployeeForLogs?.id && l.date === dateStr
    );
    return {
      date: dateStr,
      in_time: log ? log.in_time : "",
      out_time: log ? log.out_time : "",
      status: log ? log.status : "Absent",
    };
  });

  // Calculate stats cards values in employee logs view
  const empPresentCount = employeeCalendarRows.filter((r) => r.status === "Present").length;
  const empAbsentCount = employeeCalendarRows.filter((r) => r.status === "Absent").length;
  const empLeaveCount = employeeCalendarRows.filter((r) => r.status === "On Leave").length;
  const empOffCount = employeeCalendarRows.filter((r) => r.status === "Off Day").length;

  // Determine Today's Status for selected employee
  const todayLog = attendanceLogs.find(
    (l) => l.employee_id === selectedEmployeeForLogs?.id && l.date === selectedDate
  );
  const todayStatusLabel = todayLog ? todayLog.status : "Not Checked In";
  const todayDotColor =
    todayStatusLabel === "Present"
      ? "green.400"
      : todayStatusLabel === "Off Day"
      ? "purple.400"
      : todayStatusLabel === "On Leave"
      ? "blue.400"
      : "gray.400";

  // ── Employee & Manager (employee-view) → dedicated personal attendance page
  if (isEmployeeMode) {
    return <EmployeeAttendanceDashboard />;
  }

  return (
    <DashboardLayout>
      {isPageLoading ? (
        <Center minH="400px">
          <Spinner size="xl" thickness="4px" color="#6366F1" />
        </Center>
      ) : selectedEmployeeForLogs ? (
        /* ==================== EMPLOYEE LOGS DETAILED VIEW ==================== */
        <VStack spacing={6} align="stretch" w="100%" px={2}>
          {/* HEADER BAR AND NAVIGATION */}
          <Flex direction="column" gap={2}>
            {/* Back Button */}
            {!isEmployeeMode && (
              <Button
                variant="link"
                leftIcon={<FiArrowLeft />}
                color="#6366F1"
                fontSize="sm"
                fontWeight="700"
                onClick={() => setSelectedEmployeeForLogs(null)}
                w="fit-content"
                _hover={{ textDecoration: "none", opacity: 0.8 }}
              >
                Back to Attendance Board
              </Button>
            )}

            <Flex
              direction={{ base: "column", xl: "row" }}
              justify="space-between"
              align={{ base: "stretch", xl: "center" }}
              gap={4}
              mt={2}
            >
              {/* Profile Card */}
              <HStack spacing={4}>
                <Avatar size="md" name={selectedEmployeeForLogs.name} />
                <VStack align="start" spacing={0}>
                  <Heading as="h1" size="md" fontWeight="800" color="#0F172A">
                    {selectedEmployeeForLogs.name}
                  </Heading>
                  <Text fontSize="xs" color="gray.400" fontWeight="600">
                    {selectedEmployeeForLogs.department || "—"} · {selectedEmployeeForLogs.designation || "—"}
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    Check attendance logs for {selectedEmployeeForLogs.name}
                  </Text>
                </VStack>
              </HStack>

              {/* Action row */}
              <Flex wrap="wrap" align="center" gap={3} justify={{ base: "stretch", xl: "flex-end" }}>
                {/* Today's Status */}
                <HStack bg="white" px={3} py={1.5} borderRadius="xl" border="1px solid" borderColor="gray.100" shadow="sm">
                  <VStack align="start" spacing={0} pr={3}>
                    <Text fontSize="9px" fontWeight="800" color="gray.400">
                      Today's Status
                    </Text>
                    <HStack spacing={1}>
                      <Box w="6px" h="6px" borderRadius="full" bg={todayDotColor} />
                      <Text fontSize="xs" fontWeight="700" color="gray.500">
                        {todayStatusLabel}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>

                {/* VIEW filter */}
                <HStack bg="white" px={3} py={1.5} borderRadius="xl" border="1px solid" borderColor="gray.100" shadow="sm">
                  <Text fontSize="xs" fontWeight="700" color="gray.400">
                    VIEW
                  </Text>
                  <Select
                    size="sm"
                    variant="unstyled"
                    value={empSelectedMonth}
                    onChange={(e) => setEmpSelectedMonth(e.target.value)}
                    fontWeight="700"
                    color="#4F46E5"
                    w="70px"
                  >
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                      (m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      )
                    )}
                  </Select>
                  <Select
                    size="sm"
                    variant="unstyled"
                    value={empSelectedYear}
                    onChange={(e) => setEmpSelectedYear(e.target.value)}
                    fontWeight="700"
                    color="#4F46E5"
                    w="70px"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </Select>
                  <IconButton
                    aria-label="Download Employee Month CSV"
                    icon={<FiDownload />}
                    size="xs"
                    bg="#4F46E5"
                    color="white"
                    borderRadius="full"
                    onClick={handleDownloadEmpMonth}
                    _hover={{ bg: "#4338CA" }}
                  />
                </HStack>

                {/* FY filter */}
                <HStack bg="white" px={3} py={1.5} borderRadius="xl" border="1px solid" borderColor="gray.100" shadow="sm">
                  <Text fontSize="xs" fontWeight="700" color="gray.400">
                    FY
                  </Text>
                  <Select
                    size="sm"
                    variant="unstyled"
                    value={empSelectedFY}
                    onChange={(e) => setEmpSelectedFY(e.target.value)}
                    fontWeight="700"
                    color="#4F46E5"
                    w="90px"
                  >
                    <option value="2026-27">2026-27</option>
                    <option value="2025-26">2025-26</option>
                    <option value="2024-25">2024-25</option>
                  </Select>
                  <IconButton
                    aria-label="Download Employee FY CSV"
                    icon={<FiDownload />}
                    size="xs"
                    bg="#4F46E5"
                    color="white"
                    borderRadius="full"
                    onClick={handleDownloadEmpFY}
                    _hover={{ bg: "#4338CA" }}
                  />
                </HStack>

                {/* NUKE LOGS */}
                <Button
                  bg="#FEF2F2"
                  color="#EF4444"
                  border="1px solid"
                  borderColor="#FCA5A5"
                  borderRadius="xl"
                  size="sm"
                  fontWeight="700"
                  px={4}
                  py={5}
                  _hover={{ bg: "#FEE2E2" }}
                  onClick={handleNukeEmpLogs}
                  leftIcon={<FiTrash2 />}
                >
                  Nuke Logs
                </Button>
              </Flex>
            </Flex>
          </Flex>

          {/* STATS CARDS (DAYS) */}
          <Flex direction={{ base: "column", md: "row" }} gap={4} w="100%">
            {/* PRESENT */}
            <HRMSCard flex={1} _hover={{ shadow: "md" }} transition="all 0.2s">
              <Flex direction="column" align="center" justify="center" py={2}>
                <Text fontSize="xs" fontWeight="700" color="gray.400" mb={1}>
                  Present
                </Text>
                <Text fontSize="4xl" fontWeight="800" color="#10B981" mb={2}>
                  {empPresentCount}
                </Text>
                <Box bg="#E8F8F0" px={3} py={0.5} borderRadius="md" fontSize="9px" fontWeight="800" color="#10B981">
                  DAYS
                </Box>
              </Flex>
            </HRMSCard>

            {/* ABSENT */}
            <HRMSCard flex={1} _hover={{ shadow: "md" }} transition="all 0.2s">
              <Flex direction="column" align="center" justify="center" py={2}>
                <Text fontSize="xs" fontWeight="700" color="gray.400" mb={1}>
                  Absent
                </Text>
                <Text fontSize="4xl" fontWeight="800" color="#F59E0B" mb={2}>
                  {empAbsentCount}
                </Text>
                <Box bg="#FFF3E0" px={3} py={0.5} borderRadius="md" fontSize="9px" fontWeight="800" color="#F59E0B">
                  DAYS
                </Box>
              </Flex>
            </HRMSCard>

            {/* ON LEAVE */}
            <HRMSCard flex={1} _hover={{ shadow: "md" }} transition="all 0.2s">
              <Flex direction="column" align="center" justify="center" py={2}>
                <Text fontSize="xs" fontWeight="700" color="gray.400" mb={1}>
                  On Leave
                </Text>
                <Text fontSize="4xl" fontWeight="800" color="#6366F1" mb={2}>
                  {empLeaveCount}
                </Text>
                <Box bg="#EEF2F6" px={3} py={0.5} borderRadius="md" fontSize="9px" fontWeight="800" color="#6366F1">
                  DAYS
                </Box>
              </Flex>
            </HRMSCard>

            {/* OFF DAY */}
            <HRMSCard flex={1} _hover={{ shadow: "md" }} transition="all 0.2s">
              <Flex direction="column" align="center" justify="center" py={2}>
                <Text fontSize="xs" fontWeight="700" color="gray.400" mb={1}>
                  Off Day
                </Text>
                <Text fontSize="4xl" fontWeight="800" color="#8B5CF6" mb={2}>
                  {empOffCount}
                </Text>
                <Box bg="#F3E8FF" px={3} py={0.5} borderRadius="md" fontSize="9px" fontWeight="800" color="#8B5CF6">
                  DAYS
                </Box>
              </Flex>
            </HRMSCard>
          </Flex>

          {/* DAILY PUNCH RECORDS TABLE */}
          <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" shadow="sm" p={6}>
            <VStack align="start" spacing={1} mb={6}>
              <Text fontSize="md" fontWeight="800" color="#1E293B">
                Daily Punch Records
              </Text>
              <Text fontSize="xs" color="gray.400">
                Showing records for {empSelectedMonth} {empSelectedYear}
              </Text>
            </VStack>

            <HRMSTable>
              <Thead>
                <Tr borderBottomWidth="1.5px" borderColor="gray.100">
                  <Th fontSize="10px" fontWeight="700" color="#64748B" py={4}>
                    DATE
                  </Th>
                  <Th fontSize="10px" fontWeight="700" color="#64748B" py={4}>
                    IN TIME
                  </Th>
                  <Th fontSize="10px" fontWeight="700" color="#64748B" py={4}>
                    OUT TIME
                  </Th>
                  <Th fontSize="10px" fontWeight="700" color="#64748B" py={4}>
                    WORK HOURS
                  </Th>
                  <Th fontSize="10px" fontWeight="700" color="#64748B" py={4}>
                    STATUS
                  </Th>
                  <Th fontSize="10px" fontWeight="700" color="#64748B" py={4}>
                    ACTION
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {employeeCalendarRows.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={12} color="gray.400">
                      No records to display.
                    </Td>
                  </Tr>
                ) : (
                  employeeCalendarRows.map((row) => {
                    const hasLogRecord = row.in_time || row.status !== "Absent";
                    return (
                      <Tr key={row.date} borderBottomWidth="1px" borderColor="gray.50">
                        {/* DATE */}
                        <Td py={3}>
                          <Text fontSize="sm" fontWeight="600" color="#1E293B">
                            {formatDateDisplay(row.date)}
                          </Text>
                        </Td>

                        {/* IN TIME */}
                        <Td py={3}>
                          <Text fontSize="sm" color="gray.600" fontWeight="500">
                            {row.in_time || "--:--"}
                          </Text>
                        </Td>

                        {/* OUT TIME */}
                        <Td py={3}>
                          <Text fontSize="sm" color="gray.600" fontWeight="500">
                            {row.out_time || "--:--"}
                          </Text>
                        </Td>

                        {/* WORK HOURS */}
                        <Td py={3}>
                          <Text fontSize="sm" color="gray.600" fontWeight="500">
                            {calculateWorkHours(row.in_time, row.out_time) || "—"}
                          </Text>
                        </Td>

                        {/* STATUS (Clickable badge) */}
                        <Td py={3}>
                          <Box cursor="pointer" display="inline-block" onClick={() => handleOpenEditModal(row)}>
                            <AttendanceStatusBadge status={row.status} />
                          </Box>
                        </Td>

                        {/* ACTION */}
                        <Td py={3}>
                          <HStack spacing={3}>
                            <HRMSButton
                              size="xs"
                              bg="#4F46E5"
                              color="white"
                              borderRadius="md"
                              px={3}
                              py={1.5}
                              fontSize="11px"
                              fontWeight="700"
                              _hover={{ bg: "#4338CA" }}
                              onClick={() =>
                                handleMarkOff(
                                  selectedEmployeeForLogs.id,
                                  row.status === "Off Day" ? "remove_off" : "mark_off",
                                  row.date
                                )
                              }
                            >
                              {row.status === "Off Day" ? "Remove Off" : "Mark Off"}
                            </HRMSButton>

                            {/* Reset Trash Can Icon */}
                            {hasLogRecord && (
                              <IconButton
                                aria-label="Reset punch log"
                                icon={<FiTrash2 />}
                                size="xs"
                                bg="red.50"
                                color="red.500"
                                borderRadius="full"
                                _hover={{ bg: "red.100" }}
                                onClick={() => handleDeleteSingleLog(row.date)}
                              />
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    );
                  })
                )}
              </Tbody>
            </HRMSTable>
          </Box>
        </VStack>
      ) : (
        /* ==================== MAIN DASHBOARD VIEW ==================== */
        <VStack spacing={6} align="stretch" w="100%" px={2}>
          {/* HEADER BAR AND FILTERS */}
          <Flex
            direction={{ base: "column", xl: "row" }}
            justify="space-between"
            align={{ base: "stretch", xl: "center" }}
            gap={4}
            pb={2}
          >
            <Heading as="h1" size="lg" fontWeight="800" color="#0F172A">
              Attendance Board
            </Heading>

            <Flex
              wrap="wrap"
              align="center"
              gap={3}
              justify={{ base: "stretch", xl: "flex-end" }}
            >
              {/* IMPORT CSV */}
              <HRMSButton
                bg="#6366F1"
                color="white"
                borderRadius="xl"
                px={4}
                py={5}
                _hover={{ bg: "#4F46E5" }}
                onClick={() => setIsImportModalOpen(true)}
              >
                <HStack spacing={2}>
                  <Icon as={FiUpload} />
                  <Text fontWeight="700">Import CSV</Text>
                </HStack>
              </HRMSButton>

              {/* VIEW (Date filter) */}
              <HStack bg="white" px={3} py={1.5} borderRadius="xl" border="1px solid" borderColor="gray.100" shadow="sm">
                <Text fontSize="xs" fontWeight="700" color="gray.400">
                  VIEW
                </Text>
                <Input
                  type="date"
                  size="sm"
                  variant="unstyled"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fontWeight="700"
                  color="#4F46E5"
                  w="125px"
                  textAlign="center"
                  cursor="pointer"
                />
                <IconButton
                  aria-label="Download VIEW CSV"
                  icon={<FiDownload />}
                  size="xs"
                  bg="#4F46E5"
                  color="white"
                  borderRadius="full"
                  onClick={handleDownloadView}
                  _hover={{ bg: "#4338CA" }}
                />
              </HStack>

              {/* FY (Fiscal Year filter) */}
              <HStack bg="white" px={3} py={1.5} borderRadius="xl" border="1px solid" borderColor="gray.100" shadow="sm">
                <Text fontSize="xs" fontWeight="700" color="gray.400">
                  FY
                </Text>
                <Select
                  size="sm"
                  variant="unstyled"
                  value={selectedFY}
                  onChange={(e) => setSelectedFY(e.target.value)}
                  fontWeight="700"
                  color="#4F46E5"
                  w="90px"
                >
                  <option value="2026-27">2026-27</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                </Select>
                <IconButton
                  aria-label="Download FY CSV"
                  icon={<FiDownload />}
                  size="xs"
                  bg="#4F46E5"
                  color="white"
                  borderRadius="full"
                  onClick={handleDownloadFY}
                  _hover={{ bg: "#4338CA" }}
                />
              </HStack>

              {/* MONTH filter */}
              <HStack bg="white" px={3} py={1.5} borderRadius="xl" border="1px solid" borderColor="gray.100" shadow="sm">
                <Text fontSize="xs" fontWeight="700" color="gray.400">
                  MONTH
                </Text>
                <Select
                  size="sm"
                  variant="unstyled"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  fontWeight="700"
                  color="#4F46E5"
                  w="60px"
                >
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                    (m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    )
                  )}
                </Select>
                <Select
                  size="sm"
                  variant="unstyled"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  fontWeight="700"
                  color="#4F46E5"
                  w="70px"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </Select>
                <IconButton
                  aria-label="Download Month CSV"
                  icon={<FiDownload />}
                  size="xs"
                  bg="#4F46E5"
                  color="white"
                  borderRadius="full"
                  onClick={handleDownloadMonth}
                  _hover={{ bg: "#4338CA" }}
                />
              </HStack>

              {/* DELETE ALL */}
              <Button
                bg="#FEF2F2"
                color="#EF4444"
                border="1px solid"
                borderColor="#FCA5A5"
                borderRadius="xl"
                size="sm"
                fontWeight="700"
                px={4}
                py={5}
                _hover={{ bg: "#FEE2E2" }}
                onClick={handleDeleteAll}
                leftIcon={<FiTrash2 />}
              >
                Delete All
              </Button>
            </Flex>
          </Flex>

          {/* 4 STATS CARDS WITH PREMIUM SVG SPARKLINES */}
          <Flex direction={{ base: "column", md: "row" }} gap={4} w="100%">
            {/* CARD 1: PRESENT */}
            <HRMSCard
              flex={1}
              cursor="pointer"
              onClick={() => toggleCardFilter("Present")}
              border="2px solid"
              borderColor={cardFilter === "Present" ? "#10B981" : "transparent"}
              boxShadow={cardFilter === "Present" ? "md" : "sm"}
              _hover={{ shadow: "md" }}
              transition="all 0.2s"
            >
              <Flex direction="column" h="100%" justify="space-between">
                <Flex justify="space-between" align="flex-start" w="100%">
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <Box bg="#E8F8F0" p={2} borderRadius="full">
                        <Icon as={FiCheckCircle} color="#10B981" boxSize={4} />
                      </Box>
                      <Text fontSize="2xs" fontWeight="800" color="gray.400" letterSpacing="widest">
                        PRESENT
                      </Text>
                    </HStack>
                    <Text fontSize="4xl" fontWeight="800" color="#1E293B">
                      {presentCount}
                    </Text>
                  </VStack>
                  {/* SVG Sparkline Present */}
                  <Box pt={4} w="120px" h="40px">
                    <svg width="100%" height="100%" viewBox="0 0 120 40">
                      <path
                        d="M 0 30 Q 30 10, 60 25 T 120 15"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Box>
                </Flex>
                <HStack mt={6} spacing={2} borderLeft="3px solid" borderColor="#10B981" pl={2}>
                  <Text fontSize="xs" color="gray.400" fontStyle="italic" fontWeight="500">
                    Employees checked in today.
                  </Text>
                </HStack>
              </Flex>
            </HRMSCard>

            {/* CARD 2: ABSENCES */}
            <HRMSCard
              flex={1}
              cursor="pointer"
              onClick={() => toggleCardFilter("Absent")}
              border="2px solid"
              borderColor={cardFilter === "Absent" ? "#F59E0B" : "transparent"}
              boxShadow={cardFilter === "Absent" ? "md" : "sm"}
              _hover={{ shadow: "md" }}
              transition="all 0.2s"
            >
              <Flex direction="column" h="100%" justify="space-between">
                <Flex justify="space-between" align="flex-start" w="100%">
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <Box bg="#FFF3E0" p={2} borderRadius="full">
                        <Icon as={FiAlertTriangle} color="#F59E0B" boxSize={4} />
                      </Box>
                      <Text fontSize="2xs" fontWeight="800" color="gray.400" letterSpacing="widest">
                        ABSENCES
                      </Text>
                    </HStack>
                    <Text fontSize="4xl" fontWeight="800" color="#1E293B">
                      {absentCount}
                    </Text>
                  </VStack>
                  {/* SVG Sparkline Absences */}
                  <Box pt={4} w="120px" h="40px">
                    <svg width="100%" height="100%" viewBox="0 0 120 40">
                      <path
                        d="M 0 25 Q 40 30, 80 18 T 120 10"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Box>
                </Flex>
                <HStack mt={6} spacing={2} borderLeft="3px solid" borderColor="#F59E0B" pl={2}>
                  <Text fontSize="xs" color="gray.400" fontStyle="italic" fontWeight="500">
                    Employees with no check-in.
                  </Text>
                </HStack>
              </Flex>
            </HRMSCard>

            {/* CARD 3: ON LEAVE */}
            <HRMSCard
              flex={1}
              cursor="pointer"
              onClick={() => toggleCardFilter("On Leave")}
              border="2px solid"
              borderColor={cardFilter === "On Leave" ? "#6366F1" : "transparent"}
              boxShadow={cardFilter === "On Leave" ? "md" : "sm"}
              _hover={{ shadow: "md" }}
              transition="all 0.2s"
            >
              <Flex direction="column" h="100%" justify="space-between">
                <Flex justify="space-between" align="flex-start" w="100%">
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <Box bg="#EEF2F6" p={2} borderRadius="full">
                        <Icon as={FiClock} color="#6366F1" boxSize={4} />
                      </Box>
                      <Text fontSize="2xs" fontWeight="800" color="gray.400" letterSpacing="widest">
                        ON LEAVE
                      </Text>
                    </HStack>
                    <Text fontSize="4xl" fontWeight="800" color="#1E293B">
                      {leaveCount}
                    </Text>
                  </VStack>
                  {/* SVG Sparkline On Leave */}
                  <Box pt={4} w="120px" h="40px">
                    <svg width="100%" height="100%" viewBox="0 0 120 40">
                      <line
                        x1="0"
                        y1="20"
                        x2="120"
                        y2="20"
                        stroke="#6366F1"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Box>
                </Flex>
                <HStack mt={6} spacing={2} borderLeft="3px solid" borderColor="#6366F1" pl={2}>
                  <Text fontSize="xs" color="gray.400" fontStyle="italic" fontWeight="500">
                    Employees with approved leave request.
                  </Text>
                </HStack>
              </Flex>
            </HRMSCard>

            {/* CARD 4: OFF DAY */}
            <HRMSCard
              flex={1}
              cursor="pointer"
              onClick={() => toggleCardFilter("Off Day")}
              border="2px solid"
              borderColor={cardFilter === "Off Day" ? "#8B5CF6" : "transparent"}
              boxShadow={cardFilter === "Off Day" ? "md" : "sm"}
              _hover={{ shadow: "md" }}
              transition="all 0.2s"
            >
              <Flex direction="column" h="100%" justify="space-between">
                <Flex justify="space-between" align="flex-start" w="100%">
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <Box bg="#F3E8FF" p={2} borderRadius="full">
                        <Icon as={FiCalendar} color="#8B5CF6" boxSize={4} />
                      </Box>
                      <Text fontSize="2xs" fontWeight="800" color="gray.400" letterSpacing="widest">
                        OFF DAY
                      </Text>
                    </HStack>
                    <Text fontSize="4xl" fontWeight="800" color="#1E293B">
                      {offDayCount}
                    </Text>
                  </VStack>
                  {/* SVG Sparkline Off Day */}
                  <Box pt={4} w="120px" h="40px">
                    <svg width="100%" height="100%" viewBox="0 0 120 40">
                      <path
                        d="M 0 22 Q 40 28, 80 18 T 120 21"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Box>
                </Flex>
                <HStack mt={6} spacing={2} borderLeft="3px solid" borderColor="#8B5CF6" pl={2}>
                  <Text fontSize="xs" color="gray.400" fontStyle="italic" fontWeight="500">
                    Employees marked as off today.
                  </Text>
                </HStack>
              </Flex>
            </HRMSCard>
          </Flex>

          {/* ATTENDANCE TABLE */}
          <Box w="100%">
            <AttendanceTable
              data={tableDataFiltered}
              employees={dbEmployees}
              onAction={handleMarkOff}
              onRowClick={(employee) => setSelectedEmployeeForLogs(employee)}
            />
          </Box>
        </VStack>
      )}

      {/* IMPORT CSV MODAL */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} isCentered size="md">
        <ModalOverlay />
        <ModalContent borderRadius="2xl" p={4}>
          <ModalHeader pb={0}>
            <Text fontSize="lg" fontWeight="800" color="#1E293B">
              Import Attendance CSV
            </Text>
            <Text fontSize="10px" fontWeight="800" color="#6366F1" letterSpacing="widest" mt={1}>
              BULK UPLOAD ATTENDANCE LOGS
            </Text>
          </ModalHeader>
          <ModalCloseButton borderRadius="full" m={2} />
          <ModalBody pt={4}>
            <VStack spacing={4} align="stretch">
              {/* CSV Instructions Box */}
              <Box bg="#F8FAFC" border="1px solid" borderColor="gray.100" borderRadius="xl" p={4}>
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xs" fontWeight="700" color="#1E293B">
                      CSV Format
                    </Text>
                    <Text fontSize="10px" color="gray.400">
                      emp_id, date (YYYY-MM-DD), in_time (HH:MM), out_time (HH:MM)
                    </Text>
                  </VStack>
                  <Button
                    size="sm"
                    bg="#6366F1"
                    color="white"
                    borderRadius="lg"
                    _hover={{ bg: "#4F46E5" }}
                    onClick={handleDownloadTemplate}
                    leftIcon={<FiDownload />}
                  >
                    Template
                  </Button>
                </Flex>
              </Box>

              {/* Drag and Drop Zone */}
              <Box
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                border="2px dashed"
                borderColor={dragOver ? "#6366F1" : "gray.200"}
                bg={dragOver ? "#F5F3FF" : "white"}
                borderRadius="xl"
                py={10}
                textAlign="center"
                cursor="pointer"
                onClick={() => fileInputRef.current.click()}
                transition="all 0.2s"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept=".csv"
                  onChange={handleFileBrowse}
                />
                <VStack spacing={2}>
                  <Icon as={FiUpload} color="#6366F1" boxSize={6} />
                  {importedFileName ? (
                    <Text fontSize="sm" fontWeight="700" color="#1E293B">
                      {importedFileName}
                    </Text>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      Drag & drop your CSV here, or <span style={{ color: "#6366F1", fontWeight: "700" }}>browse file</span>
                    </Text>
                  )}
                </VStack>
              </Box>

              {importedLogsToConfirm && (
                <Text fontSize="xs" color="green.500" fontWeight="600" textAlign="center">
                  ✅ Successfully parsed {importedLogsToConfirm.length} rows. Ready to import!
                </Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="ghost"
              size="md"
              fontWeight="700"
              color="gray.400"
              onClick={() => {
                setIsImportModalOpen(false);
                setImportedLogsToConfirm(null);
                setImportedFileName("");
              }}
            >
              Cancel
            </Button>
            <Button
              bg="#C7D2FE"
              _hover={{ bg: "#A5B4FC" }}
              color="#4F46E5"
              fontWeight="800"
              size="md"
              borderRadius="xl"
              onClick={handleConfirmImport}
              isDisabled={!importedLogsToConfirm}
            >
              Confirm Import
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* EDIT LOG MODAL */}
      <Modal isOpen={isEditLogOpen} onClose={() => {
        setIsEditLogOpen(false);
        setEditingLogTarget(null);
      }} isCentered size="sm">
        <ModalOverlay />
        <ModalContent borderRadius="2xl" p={4}>
          <ModalHeader pb={0}>
            <Text fontSize="lg" fontWeight="800" color="#1E293B">
              Edit Log
            </Text>
            <Text fontSize="10px" fontWeight="800" color="#6366F1" letterSpacing="widest" mt={1}>
              CHANGES SAVE DIRECTLY TO SUPABASE
            </Text>
          </ModalHeader>
          <ModalCloseButton borderRadius="full" m={2} />
          <ModalBody pt={6}>
            <VStack spacing={4} align="stretch">
              <VStack align="start" spacing={1}>
                <Text fontSize="xs" fontWeight="700" color="gray.400">
                  IN TIME (HH:MM)
                </Text>
                <Input
                  type="time"
                  size="md"
                  borderRadius="xl"
                  bg="#F8FAFC"
                  value={editInTime}
                  onChange={(e) => setEditInTime(e.target.value)}
                  fontWeight="700"
                  color="#1E293B"
                />
              </VStack>

              <VStack align="start" spacing={1}>
                <Text fontSize="xs" fontWeight="700" color="gray.400">
                  OUT TIME (HH:MM)
                </Text>
                <Input
                  type="time"
                  size="md"
                  borderRadius="xl"
                  bg="#F8FAFC"
                  value={editOutTime}
                  onChange={(e) => setEditOutTime(e.target.value)}
                  fontWeight="700"
                  color="#1E293B"
                />
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3} pt={6}>
            <Button
              variant="ghost"
              size="md"
              fontWeight="700"
              color="gray.400"
              onClick={() => {
                setIsEditLogOpen(false);
                setEditingLogTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button
              bg="#3B82F6"
              _hover={{ bg: "#2563EB" }}
              color="white"
              fontWeight="800"
              size="md"
              borderRadius="xl"
              onClick={handleSaveEditedLog}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
};

export default AttendanceDashboardPage;
