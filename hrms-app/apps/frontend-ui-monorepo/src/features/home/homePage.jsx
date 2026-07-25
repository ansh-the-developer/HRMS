// apps/frontend-ui-monorepo/src/features/home/HomePage.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  SimpleGrid,
  Grid,
  Flex,
  Text,
  Heading,
  HStack,
  VStack,
  Avatar,
  Badge,
  Button,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Select,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputLeftElement,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Checkbox,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiUserCheck,
  FiUserMinus,
  FiClock,
  FiUserPlus,
  FiCalendar,
  FiSend,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiTrendingUp,
  FiTrendingDown,
  FiVolume2,
  FiSearch,
  FiX,
  FiGift,
  FiInfo,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
} from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { useCalendar } from "@/contexts/CalendarContext";
import { useNotices } from "@/hooks/useHome";
import { useEmployees } from "@/hooks";
import { createNotice, updateNotice, deleteNotice } from "@/services/homeApi";

// Dynamic Sparkline SVG Component
const Sparkline = ({ points = [14, 16, 12, 18, 22, 20, 24], color = "#818CF8" }) => {
  const width = 120;
  const height = 24;
  const step = width / Math.max(points.length - 1, 1);
  const maxVal = Math.max(...points, 1);
  const minVal = Math.min(...points, 0);
  const range = maxVal - minVal || 1;

  const pathD = points.reduce((acc, pt, i) => {
    const x = i * step;
    const normalizedY = height - 4 - ((pt - minVal) / range) * (height - 8);
    return i === 0 ? `M ${x} ${normalizedY}` : `${acc} L ${x} ${normalizedY}`;
  }, "");

  return (
    <svg width="100%" height="24" viewBox={`0 0 ${width} ${height}`} fill="none">
      <path
        d={pathD}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const LEAVES_PER_PAGE = 5;

const HomePage = () => {
  const cardBg = "card-bg";
  const borderColor = "border-color";
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { role, isEmployee } = useRole();
  const { user } = useAuth();
  const { calendarMonth, setCalendarMonth, selectedDate, setSelectedDate } = useCalendar();

  // Modals disclosure
  const {
    isOpen: isAnnouncementsOpen,
    onOpen: onOpenAnnouncements,
    onClose: onCloseAnnouncements,
  } = useDisclosure();

  const {
    isOpen: isBirthdaysOpen,
    onOpen: onOpenBirthdays,
    onClose: onCloseBirthdays,
  } = useDisclosure();

  // Announcement CRUD Modals
  const {
    isOpen: isNoticeModalOpen,
    onOpen: onOpenNoticeModal,
    onClose: onCloseNoticeModal,
  } = useDisclosure();

  const {
    isOpen: isDeleteNoticeOpen,
    onOpen: onOpenDeleteNotice,
    onClose: onCloseDeleteNotice,
  } = useDisclosure();

  // Custom Payroll Range Modal
  const {
    isOpen: isCustomRangeOpen,
    onOpen: onOpenCustomRange,
    onClose: onCloseCustomRange,
  } = useDisclosure();

  // Modal search states
  const [announcementSearch, setAnnouncementSearch] = useState("");
  const [birthdaySearch, setBirthdaySearch] = useState("");

  // Leave Table Pagination State
  const [leavePage, setLeavePage] = useState(1);

  // Announcement CRUD State
  const [noticeForm, setNoticeForm] = useState({
    id: null,
    title: "",
    body: "",
    created_at: new Date().toISOString().slice(0, 10),
    expires_at: "",
    priority: "Medium",
    visibility: "All",
    pinned: false,
  });
  const [noticeErrors, setNoticeErrors] = useState({});
  const [deletingNotice, setDeletingNotice] = useState(null);
  const [isNoticeSubmitting, setIsNoticeSubmitting] = useState(false);
  const [isNoticeDeleting, setIsNoticeDeleting] = useState(false);

  // Payroll Selector State
  const [payrollPeriod, setPayrollPeriod] = useState("This Month");
  const [customRange, setCustomRange] = useState({ startDate: "", endDate: "" });
  const [appliedCustomRange, setAppliedCustomRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    setLeavePage(1);
  }, [isEmployee]);

  const currentUserName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "employee001";

  const initialLeaveRequests = [
    { emp: "employee001", code: "#BK-001", type: "Casual Leave", dur: "Jul 9 – Jul 10, 2026 (2 days)", reason: "Personal work", status: "Pending", applied: "Jul 9, 2026 12:10 AM" },
    { emp: "Akash Rai", code: "#BK-002", type: "Casual Leave", dur: "Jul 3 – Jul 4, 2026 (2 days)", reason: "Sick leave recovery", status: "Approved", applied: "Jul 8, 2026 10:16 PM" },
    { emp: "Kungthinliu Newmai", code: "#BK-006", type: "Sick Leave", dur: "Jun 1 – Jun 5, 2026 (5 days)", reason: "Typhoid", status: "Approved", applied: "Jul 3, 2026 04:41 PM" },
    { emp: "suman", code: "#BK-010", type: "Casual Leave", dur: "Jul 12, 2026 (1 day)", reason: "Family event", status: "Pending", applied: "Jul 12, 2026 09:30 AM" },
    { emp: "temp johnny", code: "#BK-012", type: "Casual Leave", dur: "Jul 14 – Jul 15, 2026 (2 days)", reason: "Travel", status: "Pending", applied: "Jul 14, 2026 11:20 AM" },
    { emp: "employee001", code: "#BK-015", type: "Sick Leave", dur: "Jul 22, 2026 (1 day)", reason: "Fever", status: "Approved", applied: "Jul 21, 2026 08:00 AM" },
    { emp: "Rahul Sharma", code: "#BK-018", type: "Casual Leave", dur: "Jul 25 – Jul 26, 2026 (2 days)", reason: "Family Function", status: "Pending", applied: "Jul 23, 2026 11:45 AM" },
  ];

  // Employee sees ONLY their own leave requests
  const displayedLeaveRequests = useMemo(() => {
    if (isEmployee) {
      const userReqs = initialLeaveRequests
        .filter(
          (r) =>
            r.emp.toLowerCase() === currentUserName.toLowerCase() ||
            r.emp === "employee001"
        )
        .map((r) => ({ ...r, emp: currentUserName }));
      return userReqs.length > 0
        ? userReqs
        : [
            {
              emp: currentUserName,
              code: "#BK-001",
              type: "Casual Leave",
              dur: "Jul 9 – Jul 10, 2026 (2 days)",
              reason: "Personal work",
              status: "Pending",
              applied: "Jul 9, 2026 12:10 AM",
            },
          ];
    }
    return initialLeaveRequests;
  }, [isEmployee, currentUserName]);

  const totalLeavePages = Math.ceil(displayedLeaveRequests.length / LEAVES_PER_PAGE) || 1;
  const paginatedLeaveRequests = useMemo(() => {
    const start = (leavePage - 1) * LEAVES_PER_PAGE;
    return displayedLeaveRequests.slice(start, start + LEAVES_PER_PAGE);
  }, [displayedLeaveRequests, leavePage]);

  const leaveStartIdx = displayedLeaveRequests.length === 0 ? 0 : (leavePage - 1) * LEAVES_PER_PAGE + 1;
  const leaveEndIdx = Math.min(leavePage * LEAVES_PER_PAGE, displayedLeaveRequests.length);

  /* ---------- ANNOUNCEMENTS & EVENTS DATA ---------- */
  const { data: noticesData } = useNotices();

  const rawAnnouncements = [
    { id: "a1", title: "Office Closed on July 20", date: "2026-07-20", formattedDate: "Jul 15, 2026", icon: FiVolume2, color: "accent", body: "The office will remain closed on July 20 for regional holiday observance.", priority: "High", visibility: "All", pinned: true },
    { id: "a2", title: "New Performance Cycle", date: "2026-07-10", formattedDate: "Jul 10, 2026", icon: FiTrendingUp, color: "emerald.400", body: "Q3 Performance evaluation forms are now open in the portal.", priority: "Medium", visibility: "All", pinned: false },
    { id: "a3", title: "Quarterly All-Hands Meeting", date: "2026-07-25", formattedDate: "Jul 25, 2026", icon: FiVolume2, color: "purple.400", body: "Join us for the company-wide strategy update at 4:00 PM IST.", priority: "High", visibility: "All", pinned: true },
    { id: "a4", title: "System Maintenance Windows", date: "2026-07-28", formattedDate: "Jul 28, 2026", icon: FiTrendingUp, color: "amber.400", body: "HRMS cloud servers will undergo maintenance between 12 AM - 2 AM.", priority: "Low", visibility: "All", pinned: false },
  ];

  const announcementsList = useMemo(() => {
    if (noticesData && noticesData.length > 0) {
      return noticesData.map((n) => ({
        id: n.id,
        title: n.title,
        date: n.created_at ? n.created_at.slice(0, 10) : "2026-07-20",
        formattedDate: n.created_at
          ? new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "Jul 15, 2026",
        icon: n.pinned ? FiVolume2 : FiTrendingUp,
        color: n.priority === "High" ? "red.400" : n.pinned ? "accent" : "emerald.400",
        body: n.body || n.title,
        priority: n.priority || "Medium",
        visibility: n.visibility || "All",
        pinned: !!n.pinned,
        rawNotice: n,
      }));
    }
    return rawAnnouncements;
  }, [noticesData]);

  // Announcement CRUD Action Handlers
  const openCreateNoticeModal = () => {
    setNoticeForm({
      id: null,
      title: "",
      body: "",
      created_at: new Date().toISOString().slice(0, 10),
      expires_at: "",
      priority: "Medium",
      visibility: "All",
      pinned: false,
    });
    setNoticeErrors({});
    onOpenNoticeModal();
  };

  const openEditNoticeModal = (item) => {
    const raw = item.rawNotice || {};
    setNoticeForm({
      id: item.id,
      title: item.title || "",
      body: item.body || "",
      created_at: item.date || new Date().toISOString().slice(0, 10),
      expires_at: raw.expires_at ? raw.expires_at.slice(0, 10) : "",
      priority: item.priority || "Medium",
      visibility: item.visibility || "All",
      pinned: !!item.pinned,
    });
    setNoticeErrors({});
    onOpenNoticeModal();
  };

  const openDeleteNoticeModal = (item) => {
    setDeletingNotice(item);
    onOpenDeleteNotice();
  };

  const handleSaveNotice = async () => {
    const errors = {};
    if (!noticeForm.title.trim()) errors.title = "Title is required";
    if (!noticeForm.body.trim()) errors.body = "Description / Content is required";
    if (!noticeForm.created_at) errors.created_at = "Date is required";

    if (Object.keys(errors).length > 0) {
      setNoticeErrors(errors);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title, Content, and Date).",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsNoticeSubmitting(true);
    try {
      const payload = {
        title: noticeForm.title.trim(),
        body: noticeForm.body.trim(),
        created_at: new Date(noticeForm.created_at).toISOString(),
        expires_at: noticeForm.expires_at ? new Date(noticeForm.expires_at).toISOString() : null,
        priority: noticeForm.priority,
        visibility: noticeForm.visibility,
        pinned: noticeForm.pinned,
      };

      if (noticeForm.id) {
        await updateNotice(noticeForm.id, payload);
        toast({ title: "Announcement updated", status: "success", duration: 3000, isClosable: true });
      } else {
        await createNotice(payload);
        toast({ title: "Announcement created", status: "success", duration: 3000, isClosable: true });
      }

      queryClient.invalidateQueries({ queryKey: ["notices"] });
      onCloseNoticeModal();
    } catch (err) {
      console.error("Save notice failed:", err);
      toast({
        title: "Failed to save announcement",
        description: err.message || "An unexpected error occurred",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsNoticeSubmitting(false);
    }
  };

  const handleConfirmDeleteNotice = async () => {
    if (!deletingNotice?.id) return;
    setIsNoticeDeleting(true);
    try {
      await deleteNotice(deletingNotice.id);
      toast({ title: "Announcement deleted", status: "info", duration: 3000, isClosable: true });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      onCloseDeleteNotice();
    } catch (err) {
      console.error("Delete notice failed:", err);
      toast({
        title: "Failed to delete announcement",
        description: err.message || "An unexpected error occurred",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsNoticeDeleting(false);
    }
  };

  // Payroll Summary calculation based on period selection
  const payrollSummary = useMemo(() => {
    switch (payrollPeriod) {
      case "This Month":
        return {
          amount: "₹24,58,340",
          growth: "↑ 8.5% from last month",
          isUp: true,
          points: [14, 16, 12, 18, 22, 20, 24],
        };
      case "Last Month":
        return {
          amount: "₹22,65,750",
          growth: "↑ 4.2% from prev month",
          isUp: true,
          points: [12, 15, 14, 16, 18, 19, 21],
        };
      case "Last 3 Months":
        return {
          amount: "₹71,82,430",
          growth: "↑ 6.8% vs prev 3 months",
          isUp: true,
          points: [10, 14, 18, 16, 22, 25, 28],
        };
      case "Last 6 Months":
        return {
          amount: "₹1,42,20,000",
          growth: "↑ 11.4% vs prev 6 months",
          isUp: true,
          points: [8, 12, 15, 20, 24, 28, 32],
        };
      case "This Financial Year":
        return {
          amount: "₹98,40,000",
          growth: "↑ 12.1% YTD growth",
          isUp: true,
          points: [6, 10, 14, 18, 22, 26, 30],
        };
      case "Previous Financial Year":
        return {
          amount: "₹2,68,50,000",
          growth: "↑ 15.0% annual growth",
          isUp: true,
          points: [12, 14, 16, 18, 20, 22, 24],
        };
      case "Custom Range":
        if (appliedCustomRange.startDate && appliedCustomRange.endDate) {
          const d1 = new Date(appliedCustomRange.startDate);
          const d2 = new Date(appliedCustomRange.endDate);
          const diffDays = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
          const total = Math.round(diffDays * 81944);
          return {
            amount: `₹${total.toLocaleString("en-IN")}`,
            growth: `Range: ${appliedCustomRange.startDate} to ${appliedCustomRange.endDate}`,
            isUp: true,
            points: [10, 14, 12, 20, 18, 24, 22],
          };
        }
        return {
          amount: "₹24,58,340",
          growth: "Custom Range (Select Dates)",
          isUp: true,
          points: [14, 16, 12, 18, 22, 20, 24],
        };
      default:
        return {
          amount: "₹24,58,340",
          growth: "↑ 8.5% from last month",
          isUp: true,
          points: [14, 16, 12, 18, 22, 20, 24],
        };
    }
  }, [payrollPeriod, appliedCustomRange]);

  const handlePayrollPeriodChange = (e) => {
    const val = e.target.value;
    setPayrollPeriod(val);
    if (val === "Custom Range") {
      onOpenCustomRange();
    }
  };

  const handleApplyCustomRange = () => {
    if (!customRange.startDate || !customRange.endDate) {
      toast({
        title: "Date Range Required",
        description: "Please select both Start Date and End Date.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setAppliedCustomRange(customRange);
    onCloseCustomRange();
    toast({ title: "Payroll custom range applied", status: "success", duration: 3000, isClosable: true });
  };

  // Filter announcements if selectedDate is active
  const filteredAnnouncements = useMemo(() => {
    if (!selectedDate) return announcementsList;
    return announcementsList.filter((a) => a.date === selectedDate);
  }, [announcementsList, selectedDate]);

  /* ---------- BIRTHDAYS DATA ---------- */
  const { data: employeesData } = useEmployees();

  const rawBirthdays = [
    { id: "b1", name: "Akhilesh", role: "Software Engineer", birthdate: "2026-07-16", date: "Jul 16" },
    { id: "b2", name: "suman", role: "Support Executive", birthdate: "2026-07-20", date: "Jul 20" },
    { id: "b3", name: "Hae Young Park", role: "UI/UX Designer", birthdate: "2026-07-27", date: "Jul 27" },
    { id: "b4", name: "Akash Rai", role: "Product Manager", birthdate: "2026-07-25", date: "Jul 25" },
    { id: "b5", name: "Kungthinliu Newmai", role: "HR Specialist", birthdate: "2026-08-05", date: "Aug 05" },
  ];

  const birthdaysList = useMemo(() => {
    if (employeesData && employeesData.length > 0) {
      return employeesData
        .filter((emp) => emp.birthdate)
        .map((emp) => {
          const bDate = new Date(emp.birthdate);
          const monthStr = bDate.toLocaleDateString("en-US", { month: "short" });
          const dayStr = bDate.getDate();
          return {
            id: emp.id,
            name: emp.name || emp.nickname || "Employee",
            role: emp.designation || emp.department || "Staff Member",
            birthdate: emp.birthdate,
            date: `${monthStr} ${dayStr}`,
            monthNum: bDate.getMonth() + 1,
            dayNum: bDate.getDate(),
          };
        });
    }
    return rawBirthdays.map((b) => {
      const parts = b.birthdate.split("-");
      return {
        ...b,
        monthNum: parseInt(parts[1], 10),
        dayNum: parseInt(parts[2], 10),
      };
    });
  }, [employeesData]);

  // Filter birthdays if selectedDate is active (matching month & day)
  const filteredBirthdays = useMemo(() => {
    if (!selectedDate) return birthdaysList;
    const [_, selM, selD] = selectedDate.split("-").map((v) => parseInt(v, 10));
    return birthdaysList.filter((b) => b.monthNum === selM && b.dayNum === selD);
  }, [birthdaysList, selectedDate]);

  /* ---------- INTERACTIVE CALENDAR MATH ---------- */
  const { year, month } = calendarMonth;

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    const newMonth = month - 1 < 0 ? 11 : month - 1;
    const newYear = month - 1 < 0 ? year - 1 : year;
    setCalendarMonth({ year: newYear, month: newMonth });
  };

  const nextMonth = () => {
    const newMonth = month + 1 > 11 ? 0 : month + 1;
    const newYear = month + 1 > 11 ? year + 1 : year;
    setCalendarMonth({ year: newYear, month: newMonth });
  };

  const goToToday = () => {
    const tYear = now.getFullYear();
    const tMonth = now.getMonth();
    setCalendarMonth({ year: tYear, month: tMonth });
    setSelectedDate(todayStr);
  };

  const handleDateClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (selectedDate === dateStr) {
      setSelectedDate(null); // Toggle off filter
    } else {
      setSelectedDate(dateStr);
    }
  };

  // Check if a calendar day has events or birthdays
  const hasEventOrBirthday = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const targetMonth = month + 1;
    const hasAnnouncement = announcementsList.some((a) => a.date === dateStr);
    const hasBirthday = birthdaysList.some((b) => b.monthNum === targetMonth && b.dayNum === day);
    return hasAnnouncement || hasBirthday;
  };

  return (
    <DashboardLayout>
      {/* Active Date Filter Notice Banner */}
      {selectedDate && (
        <Flex
          mb={4}
          p={3}
          borderRadius="xl"
          bg="rgba(99, 102, 241, 0.12)"
          border="1px solid"
          borderColor="accent"
          align="center"
          justify="space-between"
        >
          <HStack spacing={2}>
            <Icon as={FiCalendar} color="accent" boxSize={4} />
            <Text fontSize="xs" fontWeight="bold" color="text-primary">
              Filtering dashboard widgets for: {selectedDate}
            </Text>
          </HStack>
          <Button
            size="xs"
            colorScheme="indigo"
            variant="ghost"
            leftIcon={<FiX />}
            onClick={() => setSelectedDate(null)}
          >
            Clear Filter (Show All)
          </Button>
        </Flex>
      )}

      {/* 3-Column Main Dashboard Grid */}
      <Grid templateColumns={{ base: "1fr", xl: "1fr 340px" }} gap={6}>
        {/* Left / Center 2 Columns */}
        <VStack spacing={6} align="stretch" minW={0}>
          {/* Top Row: 5 KPI Stat Cards Grid */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={4}>
            {/* KPI 1: Total Employees */}
            <HRMSCard p={4} borderRadius="20px">
              <VStack align="start" spacing={2}>
                <HStack justify="space-between" w="full">
                  <Box p={2.5} borderRadius="14px" bg="rgba(99, 102, 241, 0.15)" color="accent">
                    <FiUsers size={18} />
                  </Box>
                </HStack>
                <VStack align="start" spacing={0}>
                  <Text fontSize="11px" fontWeight="semibold" color="text-muted">
                    Total Employees
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="text-primary">
                    128
                  </Text>
                  <Text fontSize="10px" color="indigo.400" fontWeight="medium">
                    ↑ 12 this month
                  </Text>
                </VStack>
                <Sparkline color="#818CF8" />
              </VStack>
            </HRMSCard>

            {/* KPI 2: Present Today */}
            <HRMSCard p={4} borderRadius="20px">
              <VStack align="start" spacing={2}>
                <HStack justify="space-between" w="full">
                  <Box p={2.5} borderRadius="14px" bg="rgba(16, 185, 129, 0.15)" color="emerald.400">
                    <FiUserCheck size={18} />
                  </Box>
                </HStack>
                <VStack align="start" spacing={0}>
                  <Text fontSize="11px" fontWeight="semibold" color="text-muted">
                    Present Today
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="text-primary">
                    96
                  </Text>
                  <Text fontSize="10px" color="emerald.400" fontWeight="medium">
                    75% attendance
                  </Text>
                </VStack>
                <Sparkline color="#34D399" />
              </VStack>
            </HRMSCard>

            {/* KPI 3: On Leave */}
            <HRMSCard p={4} borderRadius="20px">
              <VStack align="start" spacing={2}>
                <HStack justify="space-between" w="full">
                  <Box p={2.5} borderRadius="14px" bg="rgba(245, 158, 11, 0.15)" color="amber.400">
                    <FiUserMinus size={18} />
                  </Box>
                </HStack>
                <VStack align="start" spacing={0}>
                  <Text fontSize="11px" fontWeight="semibold" color="text-muted">
                    On Leave
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="text-primary">
                    18
                  </Text>
                  <Text fontSize="10px" color="amber.400" fontWeight="medium">
                    14% of staff
                  </Text>
                </VStack>
                <Sparkline color="#FBBF24" />
              </VStack>
            </HRMSCard>

            {/* KPI 4: Absentees */}
            <HRMSCard p={4} borderRadius="20px">
              <VStack align="start" spacing={2}>
                <HStack justify="space-between" w="full">
                  <Box p={2.5} borderRadius="14px" bg="rgba(239, 68, 68, 0.15)" color="rose.400">
                    <FiClock size={18} />
                  </Box>
                </HStack>
                <VStack align="start" spacing={0}>
                  <Text fontSize="11px" fontWeight="semibold" color="text-muted">
                    Absentees
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="text-primary">
                    14
                  </Text>
                  <Text fontSize="10px" color="rose.400" fontWeight="medium">
                    11% today
                  </Text>
                </VStack>
                <Sparkline color="#F87171" />
              </VStack>
            </HRMSCard>

            {/* KPI 5: New Joiners */}
            <HRMSCard p={4} borderRadius="20px">
              <VStack align="start" spacing={2}>
                <HStack justify="space-between" w="full">
                  <Box p={2.5} borderRadius="14px" bg="rgba(168, 85, 247, 0.15)" color="purple.400">
                    <FiUserPlus size={18} />
                  </Box>
                </HStack>
                <VStack align="start" spacing={0}>
                  <Text fontSize="11px" fontWeight="semibold" color="text-muted">
                    New Joiners
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="text-primary">
                    8
                  </Text>
                  <Text fontSize="10px" color="purple.400" fontWeight="medium">
                    This month
                  </Text>
                </VStack>
                <Sparkline color="#C084FC" />
              </VStack>
            </HRMSCard>
          </SimpleGrid>

          {/* Middle Row: Leave Requests Table */}
          <HRMSCard p={5} borderRadius="20px">
            <Flex align="center" justify="space-between" mb={4}>
              <Heading size="sm" fontWeight="bold" color="text-primary">
                {isEmployee ? "My Leave Requests" : "Company Leave Requests"}
              </Heading>
              <Button
                size="xs"
                variant="ghost"
                color="accent"
                fontWeight="semibold"
                onClick={() => navigate(isEmployee ? "/leaves" : "/leaves/requests")}
              >
                View All
              </Button>
            </Flex>

            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr borderBottomWidth="1px" borderColor={borderColor}>
                    <Th fontSize="10px" color="text-muted">EMPLOYEE</Th>
                    <Th fontSize="10px" color="text-muted">LEAVE TYPE</Th>
                    <Th fontSize="10px" color="text-muted">DURATION</Th>
                    <Th fontSize="10px" color="text-muted">REASON</Th>
                    <Th fontSize="10px" color="text-muted">STATUS</Th>
                    <Th fontSize="10px" color="text-muted">APPLIED ON</Th>
                    <Th fontSize="10px" color="text-muted" textAlign="center">ACTION</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedLeaveRequests.map((row, idx) => (
                    <Tr key={idx} _hover={{ bg: "hover-bg" }} borderBottomWidth="1px" borderColor={borderColor}>
                      <Td py={3}>
                        <HStack spacing={3}>
                          <Avatar size="xs" name={row.emp} />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" fontWeight="bold" color="text-primary">{row.emp}</Text>
                            <Text fontSize="10px" color="text-muted">{row.code}</Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td py={3}>
                        <Badge fontSize="9px" px={2} py={0.5} borderRadius="full" variant="subtle" colorScheme={row.type.includes("Sick") ? "red" : "purple"}>
                          {row.type}
                        </Badge>
                      </Td>
                      <Td py={3} fontSize="xs" color="text-secondary">{row.dur}</Td>
                      <Td py={3} fontSize="xs" color="text-secondary">{row.reason}</Td>
                      <Td py={3}>
                        <Badge
                          fontSize="9px"
                          px={2.5}
                          py={0.5}
                          borderRadius="full"
                          variant="subtle"
                          colorScheme={row.status === "Approved" ? "green" : "amber"}
                        >
                          {row.status}
                        </Badge>
                      </Td>
                      <Td py={3} fontSize="10px" color="text-muted">{row.applied}</Td>
                      <Td py={3} textAlign="center">
                        <HStack spacing={1} justify="center">
                          <Button size="xs" variant="ghost" color="accent" fontSize="10px" h="24px" px={2} onClick={() => navigate(isEmployee ? "/leaves" : "/leaves/requests")}>View</Button>
                          <IconButton aria-label="More" icon={<FiMoreVertical size={12} />} size="xs" variant="ghost" h="24px" w="24px" />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {/* Fully Functional Pagination Controls */}
            <Flex align="center" justify="space-between" mt={4} pt={2}>
              <Text fontSize="xs" color="text-muted">
                Showing {leaveStartIdx} to {leaveEndIdx} of {displayedLeaveRequests.length} requests
              </Text>
              <HStack spacing={1}>
                <IconButton
                  aria-label="Prev page"
                  icon={<FiChevronLeft size={14} />}
                  size="xs"
                  variant="ghost"
                  isDisabled={leavePage === 1}
                  onClick={() => setLeavePage((prev) => Math.max(prev - 1, 1))}
                />
                {Array.from({ length: totalLeavePages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    size="xs"
                    h="24px"
                    w="24px"
                    variant={p === leavePage ? "solid" : "ghost"}
                    bg={p === leavePage ? "accent" : "transparent"}
                    color={p === leavePage ? "white" : "text-secondary"}
                    onClick={() => setLeavePage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <IconButton
                  aria-label="Next page"
                  icon={<FiChevronRight size={14} />}
                  size="xs"
                  variant="ghost"
                  isDisabled={leavePage === totalLeavePages}
                  onClick={() => setLeavePage((prev) => Math.min(prev + 1, totalLeavePages))}
                />
              </HStack>
            </Flex>
          </HRMSCard>

          {/* Bottom Grid: Attendance Overview, Payroll Summary, Announcements */}
          <Grid templateColumns={{ base: "1fr", lg: isEmployee ? "1fr 1fr" : "1fr 1fr 1fr" }} gap={4}>
            {/* Attendance Overview (Donut Graphic) */}
            <HRMSCard p={4} borderRadius="20px">
              <Text fontSize="xs" fontWeight="bold" color="text-primary" mb={3}>
                {isEmployee ? "My Attendance Overview" : "Attendance Overview"}
              </Text>
              <VStack spacing={3}>
                <Box
                  w="100px"
                  h="100px"
                  borderRadius="full"
                  border="10px solid"
                  borderColor="accent"
                  borderTopColor="emerald.400"
                  borderRightColor="amber.400"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="xs" fontWeight="bold" color="text-primary">
                    {isEmployee ? "87%" : "75%"}
                  </Text>
                </Box>
                <VStack align="start" spacing={1} w="full" fontSize="10px">
                  <HStack justify="space-between" w="full">
                    <HStack spacing={1.5}>
                      <Box w="8px" h="8px" borderRadius="full" bg="emerald.400" />
                      <Text color="text-secondary">Present</Text>
                    </HStack>
                    <Text fontWeight="bold" color="text-primary">
                      {isEmployee ? "20 days (87%)" : "96 (75%)"}
                    </Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <HStack spacing={1.5}>
                      <Box w="8px" h="8px" borderRadius="full" bg="amber.400" />
                      <Text color="text-secondary">On Leave</Text>
                    </HStack>
                    <Text fontWeight="bold" color="text-primary">
                      {isEmployee ? "2 days (9%)" : "18 (14%)"}
                    </Text>
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <HStack spacing={1.5}>
                      <Box w="8px" h="8px" borderRadius="full" bg="rose.400" />
                      <Text color="text-secondary">Absent</Text>
                    </HStack>
                    <Text fontWeight="bold" color="text-primary">
                      {isEmployee ? "1 day (4%)" : "14 (11%)"}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </HRMSCard>

            {/* Payroll Summary Card - Hidden for Employee */}
            {!isEmployee && (
              <HRMSCard p={4} borderRadius="20px">
                <Flex align="center" justify="space-between" mb={2}>
                  <Text fontSize="xs" fontWeight="bold" color="text-primary">Payroll Summary</Text>
                  <Select
                    size="xs"
                    w="110px"
                    borderRadius="lg"
                    bg="app-bg-secondary"
                    fontSize="10px"
                    value={payrollPeriod}
                    onChange={handlePayrollPeriodChange}
                  >
                    <option value="This Month">This Month</option>
                    <option value="Last Month">Last Month</option>
                    <option value="Last 3 Months">Last 3 Months</option>
                    <option value="Last 6 Months">Last 6 Months</option>
                    <option value="This Financial Year">This FY</option>
                    <option value="Previous Financial Year">Prev FY</option>
                    <option value="Custom Range">Custom Range</option>
                  </Select>
                </Flex>
                <VStack align="start" spacing={1} mt={2}>
                  <Text fontSize="10px" color="text-muted">Total Payroll</Text>
                  <Heading size="md" color="text-primary">{payrollSummary.amount}</Heading>
                  <Text fontSize="10px" color={payrollSummary.isUp ? "emerald.400" : "rose.400"} fontWeight="medium">
                    {payrollSummary.growth}
                  </Text>
                  <Box w="full" mt={2}>
                    <Sparkline points={payrollSummary.points} color="#6366F1" />
                  </Box>
                </VStack>
              </HRMSCard>
            )}

            {/* Synchronized Announcements Card */}
            <HRMSCard p={4} borderRadius="20px">
              <Flex align="center" justify="space-between" mb={3}>
                <HStack spacing={1.5}>
                  <Text fontSize="xs" fontWeight="bold" color="text-primary">Announcements</Text>
                  {selectedDate && (
                    <Badge colorScheme="indigo" fontSize="9px" borderRadius="md">
                      Filtered
                    </Badge>
                  )}
                </HStack>
                <HStack spacing={1}>
                  {!isEmployee && (
                    <Button
                      size="xs"
                      leftIcon={<FiPlus size={10} />}
                      bg="accent"
                      color="white"
                      _hover={{ bg: "accent-hover" }}
                      fontSize="10px"
                      h="24px"
                      px={2}
                      borderRadius="lg"
                      onClick={openCreateNoticeModal}
                    >
                      Add
                    </Button>
                  )}
                  <Button size="xs" variant="ghost" color="accent" fontSize="10px" h="24px" onClick={onOpenAnnouncements}>
                    View All
                  </Button>
                </HStack>
              </Flex>
              {filteredAnnouncements.length === 0 ? (
                <VStack py={6} justify="center" spacing={1}>
                  <Icon as={FiInfo} color="text-muted" boxSize={5} />
                  <Text fontSize="xs" color="text-muted">
                    No announcements for selected date
                  </Text>
                </VStack>
              ) : (
                <VStack align="stretch" spacing={2.5}>
                  {filteredAnnouncements.slice(0, 3).map((item) => (
                    <HStack key={item.id} spacing={2.5} p={2} borderRadius="xl" bg="app-bg-secondary" justify="space-between">
                      <HStack spacing={2.5} flex={1} overflow="hidden">
                        <Icon as={item.icon || FiVolume2} color={item.color || "accent"} flexShrink={0} />
                        <VStack align="start" spacing={0} flex={1} overflow="hidden">
                          <Text fontSize="xs" fontWeight="bold" color="text-primary" noOfLines={1}>
                            {item.title}
                          </Text>
                          <Text fontSize="10px" color="text-muted">
                            {item.formattedDate}
                          </Text>
                        </VStack>
                      </HStack>
                      {!isEmployee && (
                        <HStack spacing={1} flexShrink={0}>
                          <IconButton
                            aria-label="Edit announcement"
                            icon={<FiEdit2 size={11} />}
                            size="xs"
                            variant="ghost"
                            h="22px"
                            w="22px"
                            color="text-secondary"
                            _hover={{ color: "accent", bg: "hover-bg" }}
                            onClick={() => openEditNoticeModal(item)}
                          />
                          <IconButton
                            aria-label="Delete announcement"
                            icon={<FiTrash2 size={11} />}
                            size="xs"
                            variant="ghost"
                            h="22px"
                            w="22px"
                            color="text-secondary"
                            _hover={{ color: "red.400", bg: "hover-bg" }}
                            onClick={() => openDeleteNoticeModal(item)}
                          />
                        </HStack>
                      )}
                    </HStack>
                  ))}
                </VStack>
              )}
            </HRMSCard>
          </Grid>
        </VStack>

        {/* Right Sidebar Column */}
        <VStack spacing={6} align="stretch">
          {/* Fully Interactive Synchronized Calendar Widget */}
          <HRMSCard p={4} borderRadius="20px">
            <Flex align="center" justify="space-between" mb={3}>
              <Text fontSize="xs" fontWeight="bold" color="text-primary">Calendar</Text>
              <Button
                size="xs"
                variant="subtle"
                borderRadius="lg"
                fontSize="10px"
                onClick={goToToday}
              >
                Today
              </Button>
            </Flex>
            <VStack spacing={2}>
              <HStack justify="space-between" w="full" px={1}>
                <IconButton
                  aria-label="Prev month"
                  icon={<FiChevronLeft size={14} />}
                  size="xs"
                  variant="ghost"
                  onClick={prevMonth}
                />
                <Text fontSize="xs" fontWeight="bold" color="text-primary">
                  {monthName}
                </Text>
                <IconButton
                  aria-label="Next month"
                  icon={<FiChevronRight size={14} />}
                  size="xs"
                  variant="ghost"
                  onClick={nextMonth}
                />
              </HStack>

              {/* Dynamic Calendar Days Grid */}
              <SimpleGrid columns={7} spacing={1} w="full" textAlign="center" fontSize="10px">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <Text key={d} color="text-muted" fontWeight="bold">
                    {d}
                  </Text>
                ))}
                {/* Empty cells for starting day offset */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <Box key={`offset-${i}`} h="24px" />
                ))}
                {/* Days of current month */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isToday = dateStr === todayStr;
                  const isSelected = selectedDate === dateStr;
                  const hasDot = hasEventOrBirthday(day);

                  return (
                    <VStack key={day} spacing={0} justify="center">
                      <Flex
                        h="24px"
                        w="24px"
                        align="center"
                        justify="center"
                        borderRadius="full"
                        bg={
                          isSelected
                            ? "accent"
                            : isToday
                            ? "rgba(99, 102, 241, 0.2)"
                            : "transparent"
                        }
                        color={
                          isSelected
                            ? "white"
                            : isToday
                            ? "accent"
                            : "text-secondary"
                        }
                        fontWeight={isSelected || isToday ? "bold" : "normal"}
                        cursor="pointer"
                        _hover={{
                          bg: isSelected ? "accent" : "hover-bg",
                          transform: "scale(1.05)",
                        }}
                        transition="all 0.15s ease"
                        onClick={() => handleDateClick(day)}
                      >
                        {day}
                      </Flex>
                      {hasDot && !isSelected && (
                        <Box w="3px" h="3px" borderRadius="full" bg="accent" mt="-2px" />
                      )}
                    </VStack>
                  );
                })}
              </SimpleGrid>
            </VStack>
          </HRMSCard>

          {/* Synchronized Upcoming Birthdays Card */}
          <HRMSCard p={4} borderRadius="20px">
            <Flex align="center" justify="space-between" mb={3}>
              <HStack spacing={1.5}>
                <Text fontSize="xs" fontWeight="bold" color="text-primary">Upcoming Birthdays</Text>
                {selectedDate && (
                  <Badge colorScheme="indigo" fontSize="9px" borderRadius="md">
                    Filtered
                  </Badge>
                )}
              </HStack>
              <Button size="xs" variant="ghost" color="accent" fontSize="10px" onClick={onOpenBirthdays}>
                View All
              </Button>
            </Flex>
            {filteredBirthdays.length === 0 ? (
              <VStack py={6} justify="center" spacing={1}>
                <Icon as={FiGift} color="text-muted" boxSize={5} />
                <Text fontSize="xs" color="text-muted">
                  No birthdays on selected date
                </Text>
              </VStack>
            ) : (
              <VStack align="stretch" spacing={3}>
                {filteredBirthdays.slice(0, 3).map((b) => (
                  <Flex key={b.id} align="center" justify="space-between">
                    <HStack spacing={2.5}>
                      <Avatar size="xs" name={b.name} />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" fontWeight="bold" color="text-primary">
                          {b.name}
                        </Text>
                        <Text fontSize="10px" color="text-muted">
                          {b.role}
                        </Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="10px" fontWeight="semibold" color="accent">
                      {b.date}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            )}
          </HRMSCard>

          {/* Quick Actions 4-Grid Card */}
          <HRMSCard p={4} borderRadius="20px">
            <Text fontSize="xs" fontWeight="bold" color="text-primary" mb={3}>Quick Actions</Text>
            <SimpleGrid columns={2} spacing={3}>
              {!isEmployee && (
                <VStack p={3} bg="app-bg-secondary" borderRadius="16px" cursor="pointer" onClick={() => navigate("/employees")} _hover={{ bg: "hover-bg", transform: "translateY(-1px)" }} transition="all 0.15s">
                  <Icon as={FiUserPlus} boxSize={5} color="accent" />
                  <Text fontSize="10px" fontWeight="semibold" color="text-primary">Add Employee</Text>
                </VStack>
              )}
              {!isEmployee && (
                <VStack p={3} bg="app-bg-secondary" borderRadius="16px" cursor="pointer" onClick={() => navigate("/attendance")} _hover={{ bg: "hover-bg", transform: "translateY(-1px)" }} transition="all 0.15s">
                  <Icon as={FiCalendar} boxSize={5} color="emerald.400" />
                  <Text fontSize="10px" fontWeight="semibold" color="text-primary">Mark Attendance</Text>
                </VStack>
              )}
              <VStack p={3} bg="app-bg-secondary" borderRadius="16px" cursor="pointer" onClick={() => navigate("/leaves")} _hover={{ bg: "hover-bg", transform: "translateY(-1px)" }} transition="all 0.15s">
                <Icon as={FiSend} boxSize={5} color="purple.400" />
                <Text fontSize="10px" fontWeight="semibold" color="text-primary">Apply Leave</Text>
              </VStack>
              <VStack p={3} bg="app-bg-secondary" borderRadius="16px" cursor="pointer" onClick={() => navigate(isEmployee ? "/payroll/payslips" : "/payroll")} _hover={{ bg: "hover-bg", transform: "translateY(-1px)" }} transition="all 0.15s">
                <Icon as={FiFileText} boxSize={5} color="amber.400" />
                <Text fontSize="10px" fontWeight="semibold" color="text-primary">Generate Payslip</Text>
              </VStack>
            </SimpleGrid>
          </HRMSCard>
        </VStack>
      </Grid>

      {/* ---------- ANNOUNCEMENTS MODAL (VIEW ALL) ---------- */}
      <Modal isOpen={isAnnouncementsOpen} onClose={onCloseAnnouncements} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent borderRadius="24px" bg="card-bg" borderColor="border-color" border="1px solid">
          <ModalHeader color="text-primary" fontSize="md" fontWeight="bold">
            <Flex align="center" justify="space-between" pr={6}>
              <Text>Company Announcements & Notices</Text>
              {!isEmployee && (
                <Button
                  size="xs"
                  leftIcon={<FiPlus size={12} />}
                  bg="accent"
                  color="white"
                  _hover={{ bg: "accent-hover" }}
                  borderRadius="xl"
                  px={3}
                  onClick={() => {
                    onCloseAnnouncements();
                    openCreateNoticeModal();
                  }}
                >
                  Create
                </Button>
              )}
            </Flex>
          </ModalHeader>
          <ModalCloseButton boxSize="32px" borderRadius="full" />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none" color="text-muted">
                  <FiSearch />
                </InputLeftElement>
                <Input
                  placeholder="Search by title or content..."
                  borderRadius="xl"
                  bg="app-bg-secondary"
                  value={announcementSearch}
                  onChange={(e) => setAnnouncementSearch(e.target.value)}
                />
              </InputGroup>

              <VStack spacing={3} align="stretch" maxH="380px" overflowY="auto">
                {(() => {
                  const query = announcementSearch.trim().toLowerCase();
                  const results = announcementsList.filter((a) => {
                    if (!query) return true;
                    return (
                      (a.title && a.title.toLowerCase().includes(query)) ||
                      (a.body && a.body.toLowerCase().includes(query))
                    );
                  });

                  if (results.length === 0) {
                    return (
                      <VStack py={8} justify="center" spacing={1}>
                        <Icon as={FiInfo} color="text-muted" boxSize={6} />
                        <Text fontSize="xs" color="text-muted">
                          No announcements match your search query
                        </Text>
                      </VStack>
                    );
                  }

                  return results.map((item) => (
                    <Box key={item.id} p={3.5} borderRadius="xl" bg="app-bg-secondary" border="1px solid" borderColor="border-color">
                      <Flex align="start" gap={3}>
                        <Box p={2} borderRadius="lg" bg="rgba(99, 102, 241, 0.12)" flexShrink={0}>
                          <Icon as={item.icon || FiVolume2} color={item.color || "accent"} boxSize={4} />
                        </Box>
                        <VStack align="start" spacing={1} flex={1}>
                          <HStack justify="space-between" w="full">
                            <HStack spacing={2}>
                              <Text fontSize="sm" fontWeight="bold" color="text-primary">
                                {item.title}
                              </Text>
                              {item.pinned && (
                                <Badge colorScheme="purple" fontSize="9px" borderRadius="md">
                                  Pinned
                                </Badge>
                              )}
                              {item.priority === "High" && (
                                <Badge colorScheme="red" fontSize="9px" borderRadius="md">
                                  High Priority
                                </Badge>
                              )}
                            </HStack>
                            <HStack spacing={2}>
                              <Text fontSize="10px" color="text-muted">
                                {item.formattedDate}
                              </Text>
                              {!isEmployee && (
                                <HStack spacing={1}>
                                  <IconButton
                                    aria-label="Edit announcement"
                                    icon={<FiEdit2 size={12} />}
                                    size="xs"
                                    variant="ghost"
                                    h="24px"
                                    w="24px"
                                    color="text-secondary"
                                    _hover={{ color: "accent", bg: "hover-bg" }}
                                    onClick={() => {
                                      onCloseAnnouncements();
                                      openEditNoticeModal(item);
                                    }}
                                  />
                                  <IconButton
                                    aria-label="Delete announcement"
                                    icon={<FiTrash2 size={12} />}
                                    size="xs"
                                    variant="ghost"
                                    h="24px"
                                    w="24px"
                                    color="text-secondary"
                                    _hover={{ color: "red.400", bg: "hover-bg" }}
                                    onClick={() => {
                                      onCloseAnnouncements();
                                      openDeleteNoticeModal(item);
                                    }}
                                  />
                                </HStack>
                              )}
                            </HStack>
                          </HStack>
                          <Text fontSize="xs" color="text-secondary" lineHeight="relaxed">
                            {item.body}
                          </Text>
                        </VStack>
                      </Flex>
                    </Box>
                  ));
                })()}
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* ---------- CREATE / EDIT ANNOUNCEMENT MODAL ---------- */}
      <Modal isOpen={isNoticeModalOpen} onClose={onCloseNoticeModal} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent borderRadius="24px" bg="card-bg" borderColor="border-color" border="1px solid">
          <ModalHeader color="text-primary" fontSize="md" fontWeight="bold">
            {noticeForm.id ? "Edit Announcement" : "Create New Announcement"}
          </ModalHeader>
          <ModalCloseButton boxSize="32px" borderRadius="full" />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired isInvalid={!!noticeErrors.title}>
                <FormLabel fontSize="xs" fontWeight="bold" color="text-primary">
                  Title
                </FormLabel>
                <Input
                  size="sm"
                  borderRadius="xl"
                  bg="app-bg-secondary"
                  placeholder="e.g. Annual Town Hall Meeting"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                />
                {noticeErrors.title && <FormErrorMessage fontSize="10px">{noticeErrors.title}</FormErrorMessage>}
              </FormControl>

              <FormControl isRequired isInvalid={!!noticeErrors.body}>
                <FormLabel fontSize="xs" fontWeight="bold" color="text-primary">
                  Description / Content
                </FormLabel>
                <Textarea
                  size="sm"
                  borderRadius="xl"
                  bg="app-bg-secondary"
                  rows={4}
                  placeholder="Write announcement details here..."
                  value={noticeForm.body}
                  onChange={(e) => setNoticeForm({ ...noticeForm, body: e.target.value })}
                />
                {noticeErrors.body && <FormErrorMessage fontSize="10px">{noticeErrors.body}</FormErrorMessage>}
              </FormControl>

              <HStack spacing={4}>
                <FormControl isRequired isInvalid={!!noticeErrors.created_at}>
                  <FormLabel fontSize="xs" fontWeight="bold" color="text-primary">
                    Date
                  </FormLabel>
                  <Input
                    type="date"
                    size="sm"
                    borderRadius="xl"
                    bg="app-bg-secondary"
                    value={noticeForm.created_at}
                    onChange={(e) => setNoticeForm({ ...noticeForm, created_at: e.target.value })}
                  />
                  {noticeErrors.created_at && <FormErrorMessage fontSize="10px">{noticeErrors.created_at}</FormErrorMessage>}
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold" color="text-primary">
                    Expiry Date (Optional)
                  </FormLabel>
                  <Input
                    type="date"
                    size="sm"
                    borderRadius="xl"
                    bg="app-bg-secondary"
                    value={noticeForm.expires_at}
                    onChange={(e) => setNoticeForm({ ...noticeForm, expires_at: e.target.value })}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold" color="text-primary">
                    Priority
                  </FormLabel>
                  <Select
                    size="sm"
                    borderRadius="xl"
                    bg="app-bg-secondary"
                    value={noticeForm.priority}
                    onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold" color="text-primary">
                    Visibility
                  </FormLabel>
                  <Select
                    size="sm"
                    borderRadius="xl"
                    bg="app-bg-secondary"
                    value={noticeForm.visibility}
                    onChange={(e) => setNoticeForm({ ...noticeForm, visibility: e.target.value })}
                  >
                    <option value="All">All</option>
                    <option value="HR Only">HR Only</option>
                    <option value="Employees Only">Employees Only</option>
                  </Select>
                </FormControl>
              </HStack>

              <Checkbox
                colorScheme="indigo"
                isChecked={noticeForm.pinned}
                onChange={(e) => setNoticeForm({ ...noticeForm, pinned: e.target.checked })}
              >
                <Text fontSize="xs" fontWeight="medium" color="text-primary">
                  Pin Announcement to Top
                </Text>
              </Checkbox>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button size="sm" variant="ghost" borderRadius="xl" onClick={onCloseNoticeModal}>
              Cancel
            </Button>
            <Button
              size="sm"
              bg="accent"
              color="white"
              _hover={{ bg: "accent-hover" }}
              borderRadius="xl"
              isLoading={isNoticeSubmitting}
              onClick={handleSaveNotice}
            >
              {noticeForm.id ? "Save Changes" : "Create Announcement"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ---------- DELETE ANNOUNCEMENT CONFIRMATION MODAL ---------- */}
      <Modal isOpen={isDeleteNoticeOpen} onClose={onCloseDeleteNotice} size="md" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent borderRadius="24px" bg="card-bg" borderColor="border-color" border="1px solid">
          <ModalHeader color="text-primary" fontSize="md" fontWeight="bold" display="flex" alignItems="center" gap={2}>
            <Icon as={FiAlertCircle} color="red.400" />
            Delete Announcement
          </ModalHeader>
          <ModalCloseButton boxSize="32px" borderRadius="full" />
          <ModalBody pb={4}>
            <VStack spacing={3} align="start">
              <Text fontSize="sm" color="text-secondary">
                Are you sure you want to delete this announcement?
              </Text>
              {deletingNotice && (
                <Box p={3} borderRadius="xl" bg="app-bg-secondary" w="full" border="1px solid" borderColor="border-color">
                  <Text fontSize="xs" fontWeight="bold" color="text-primary">
                    {deletingNotice.title}
                  </Text>
                  {deletingNotice.body && (
                    <Text fontSize="10px" color="text-muted" noOfLines={2} mt={1}>
                      {deletingNotice.body}
                    </Text>
                  )}
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button size="sm" variant="ghost" borderRadius="xl" onClick={onCloseDeleteNotice}>
              Cancel
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              borderRadius="xl"
              isLoading={isNoticeDeleting}
              onClick={handleConfirmDeleteNotice}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ---------- CUSTOM PAYROLL DATE RANGE PICKER MODAL ---------- */}
      <Modal isOpen={isCustomRangeOpen} onClose={onCloseCustomRange} size="sm" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent borderRadius="24px" bg="card-bg" borderColor="border-color" border="1px solid">
          <ModalHeader color="text-primary" fontSize="md" fontWeight="bold">
            Select Custom Date Range
          </ModalHeader>
          <ModalCloseButton boxSize="32px" borderRadius="full" />
          <ModalBody pb={4}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="bold" color="text-primary">
                  Start Date
                </FormLabel>
                <Input
                  type="date"
                  size="sm"
                  borderRadius="xl"
                  bg="app-bg-secondary"
                  value={customRange.startDate}
                  onChange={(e) => setCustomRange({ ...customRange, startDate: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="xs" fontWeight="bold" color="text-primary">
                  End Date
                </FormLabel>
                <Input
                  type="date"
                  size="sm"
                  borderRadius="xl"
                  bg="app-bg-secondary"
                  value={customRange.endDate}
                  onChange={(e) => setCustomRange({ ...customRange, endDate: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button size="sm" variant="ghost" borderRadius="xl" onClick={onCloseCustomRange}>
              Cancel
            </Button>
            <Button
              size="sm"
              bg="accent"
              color="white"
              _hover={{ bg: "accent-hover" }}
              borderRadius="xl"
              onClick={handleApplyCustomRange}
            >
              Apply Range
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ---------- BIRTHDAYS DIRECTORY MODAL (VIEW ALL) ---------- */}
      <Modal isOpen={isBirthdaysOpen} onClose={onCloseBirthdays} size="md" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent borderRadius="24px" bg="card-bg" borderColor="border-color" border="1px solid">
          <ModalHeader color="text-primary" fontSize="md" fontWeight="bold">
            Employee Birthdays 🎂
          </ModalHeader>
          <ModalCloseButton boxSize="32px" borderRadius="full" />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none" color="text-muted">
                  <FiSearch />
                </InputLeftElement>
                <Input
                  placeholder="Search employee birthdays..."
                  borderRadius="xl"
                  bg="app-bg-secondary"
                  value={birthdaySearch}
                  onChange={(e) => setBirthdaySearch(e.target.value)}
                />
              </InputGroup>

              <VStack spacing={2.5} align="stretch" maxH="380px" overflowY="auto">
                {birthdaysList
                  .filter((b) =>
                    b.name.toLowerCase().includes(birthdaySearch.toLowerCase()) ||
                    b.role.toLowerCase().includes(birthdaySearch.toLowerCase())
                  )
                  .map((b) => (
                    <Flex key={b.id} align="center" justify="space-between" p={2.5} borderRadius="xl" bg="app-bg-secondary">
                      <HStack spacing={3}>
                        <Avatar size="sm" name={b.name} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" fontWeight="bold" color="text-primary">
                            {b.name}
                          </Text>
                          <Text fontSize="10px" color="text-muted">
                            {b.role}
                          </Text>
                        </VStack>
                      </HStack>
                      <Badge colorScheme="indigo" borderRadius="full" px={2.5} py={0.5} fontSize="10px">
                        {b.date}
                      </Badge>
                    </Flex>
                  ))}
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
};

export default HomePage;
