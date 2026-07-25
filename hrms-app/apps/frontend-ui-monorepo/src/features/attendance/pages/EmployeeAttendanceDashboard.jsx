// src/features/attendance/pages/EmployeeAttendanceDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Box, Flex, Text, VStack, HStack, Badge, Spinner, Center,
  SimpleGrid, Avatar, IconButton, Tooltip,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiSun } from "react-icons/fi";
import { MdOutlineBeachAccess } from "react-icons/md";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { getAttendanceForEmployee } from "@/services/attendanceApi";
import { resolveEmployeeRecord } from "@/services/employeeApi";
import { useAuth } from "@/hooks/useAuth";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const calcHours = (inTime, outTime) => {
  if (!inTime || !outTime) return null;
  const parse = (t) => {
    const clean = t.trim().toUpperCase();
    const m12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (m12) {
      let h = parseInt(m12[1]); const min = parseInt(m12[2]); const ap = m12[3];
      if (ap === "PM" && h < 12) h += 12;
      if (ap === "AM" && h === 12) h = 0;
      return h * 60 + min;
    }
    const m24 = clean.match(/^(\d{1,2}):(\d{2})/);
    if (m24) return parseInt(m24[1]) * 60 + parseInt(m24[2]);
    return null;
  };
  const inM = parse(inTime); const outM = parse(outTime);
  if (inM === null || outM === null) return null;
  let diff = outM - inM;
  if (diff < 0) diff += 1440;
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const getDayName = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short" });
};

const STATUS_CONFIG = {
  "Present":         { color: "#34D399", bg: "rgba(16, 185, 129, 0.15)" },
  "Absent":          { color: "#F87171", bg: "rgba(239, 68, 68, 0.15)" },
  "On Leave":        { color: "#818CF8", bg: "rgba(99, 102, 241, 0.15)" },
  "Off Day":         { color: "#FBBF24", bg: "rgba(245, 158, 11, 0.15)" },
  "Not Yet Joined":  { color: "#9CA3AF", bg: "rgba(156, 163, 175, 0.15)" },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Absent"];
  return (
    <Badge px={2.5} py={0.5} borderRadius="full" fontSize="xs" fontWeight="700"
      color={cfg.color} bg={cfg.bg} border="1px solid" borderColor={cfg.color + "40"}>
      {status || "Absent"}
    </Badge>
  );
};

const StatCard = ({ icon, label, value, color, isSelected, onClick }) => (
  <Box
    bg="card-bg"
    borderRadius="xl"
    p={5}
    shadow="sm"
    border="1px solid"
    borderColor={isSelected ? color : "border-color"}
    boxShadow={isSelected ? `0 0 0 2px ${color}` : "none"}
    cursor="pointer"
    _hover={{ transform: "translateY(-1px)", bg: "hover-bg" }}
    transition="all 0.15s ease"
    onClick={onClick}
  >
    <HStack spacing={3} mb={2}>
      <Center w="36px" h="36px" borderRadius="lg" bg={color + "15"}>
        <Box as={icon} fontSize="17px" color={color} />
      </Center>
      <Text fontSize="xs" fontWeight="600" color="text-muted" textTransform="uppercase" letterSpacing="wide">
        {label}
      </Text>
    </HStack>
    <Text fontSize="2xl" fontWeight="800" color="text-primary">{value}</Text>
  </Box>
);

export default function EmployeeAttendanceDashboard() {
  const { user } = useAuth();
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear]   = useState(now.getFullYear());
  const [empRecord, setEmpRecord] = useState(null);
  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [noRecord, setNoRecord]   = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    if (!user?.id && !user?.email) return;
    (async () => {
      try {
        const data = await resolveEmployeeRecord(user?.id, user?.email);
        if (!data) { setNoRecord(true); setLoading(false); return; }
        setEmpRecord(data);
      } catch (e) {
        console.error("EmployeeAttendanceDashboard lookup error:", e.message);
        setNoRecord(true);
        setLoading(false);
      }
    })();
  }, [user?.id, user?.email]);

  useEffect(() => {
    if (!empRecord) return;
    (async () => {
      setLoading(true);
      try {
        const mm = String(viewMonth + 1).padStart(2, "0");
        const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
        const start = `${viewYear}-${mm}-01`;
        const end   = `${viewYear}-${mm}-${String(totalDays).padStart(2, "0")}`;
        const data = await getAttendanceForEmployee(empRecord.id, start, end);
        setLogs(data);
      } catch (e) {
        console.error("Attendance load error:", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [empRecord, viewMonth, viewYear]);

  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];
  const joiningDate = empRecord?.joining_date || empRecord?.created_at?.split("T")[0];

  const calendarRows = Array.from({ length: totalDays }, (_, i) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(i + 1).padStart(2, "0");
    const dateStr = `${viewYear}-${mm}-${dd}`;
    const log = logs.find((l) => l.date === dateStr);
    const dow = new Date(dateStr + "T00:00:00").getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isFuture = dateStr > today;
    const isBeforeJoining = joiningDate && dateStr < joiningDate;

    let computedStatus = log?.status || (isFuture ? "Future" : isWeekend ? "Off Day" : "Absent");
    if (isBeforeJoining) computedStatus = "Not Yet Joined";

    return {
      date: dateStr,
      isWeekend,
      isFuture,
      isBeforeJoining,
      in_time: log?.in_time || null,
      out_time: log?.out_time || null,
      status: computedStatus,
    };
  });

  const displayRows = statusFilter
    ? calendarRows.filter((r) => r.status === statusFilter)
    : calendarRows;

  const presentCount = logs.filter((l) => l.status === "Present").length;
  const absentCount  = calendarRows.filter((r) => !r.isFuture && !r.isWeekend && !r.isBeforeJoining && r.status === "Absent").length;
  const leaveCount   = logs.filter((l) => l.status === "On Leave").length;
  const offCount     = calendarRows.filter((r) => r.isWeekend).length;

  const toggleFilter = (label) => {
    setStatusFilter((prev) => (prev === label ? null : label));
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else { setViewMonth(viewMonth - 1); }
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else { setViewMonth(viewMonth + 1); }
  };
  const isAtCurrentMonth = viewMonth === now.getMonth() && viewYear === now.getFullYear();

  if (noRecord) {
    return (
      <DashboardLayout pageTitle="My Attendance">
        <Center minH="60vh" flexDir="column" gap={3}>
          <Box as={FiClock} fontSize="48px" color="text-muted" />
          <Text fontWeight="700" fontSize="lg" color="text-primary">No Employee Record Found</Text>
          <Text fontSize="sm" color="text-muted" maxW="380px" textAlign="center">
            Your login account is not linked to an active employee profile. Please contact HR.
          </Text>
        </Center>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="My Attendance">
      <Box p={{ base: 4, md: 8 }} maxW="1200px" mx="auto">

        {/* Top Header */}
        <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={3}>
          <VStack align="start" spacing={0}>
            <Text fontWeight="800" fontSize="2xl" color="text-primary">My Attendance</Text>
            {empRecord && (
              <Text fontSize="sm" color="text-muted">
                {empRecord.name} &bull; {empRecord.department || "General"} &bull; {empRecord.emp_code || ""}
              </Text>
            )}
          </VStack>
        </Flex>

        {/* Interactive Filter Stat Cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
          <StatCard
            icon={FiCheckCircle}
            label="Present"
            value={presentCount}
            color="#10B981"
            isSelected={statusFilter === "Present"}
            onClick={() => toggleFilter("Present")}
          />
          <StatCard
            icon={FiXCircle}
            label="Absent"
            value={absentCount}
            color="#EF4444"
            isSelected={statusFilter === "Absent"}
            onClick={() => toggleFilter("Absent")}
          />
          <StatCard
            icon={MdOutlineBeachAccess}
            label="On Leave"
            value={leaveCount}
            color="#6366F1"
            isSelected={statusFilter === "On Leave"}
            onClick={() => toggleFilter("On Leave")}
          />
          <StatCard
            icon={FiSun}
            label="Off Days"
            value={offCount}
            color="#F59E0B"
            isSelected={statusFilter === "Off Day"}
            onClick={() => toggleFilter("Off Day")}
          />
        </SimpleGrid>

        {/* Log Table - Restyled to Japanese Glass Design System */}
        <Box
          bg="card-bg"
          backdropFilter="blur(16px)"
          borderRadius="20px"
          shadow="lg"
          border="1px solid"
          borderColor="border-color"
          overflow="hidden"
        >
          <Flex px={6} py={4} align="center" justify="space-between" borderBottom="1px solid" borderColor="border-color">
            <HStack spacing={2.5}>
              <Box as={FiCalendar} color="accent" fontSize="18px" />
              <Text fontWeight="700" fontSize="md" color="text-primary">Monthly Attendance Log</Text>
            </HStack>
            <HStack spacing={2}>
              <Tooltip label="Previous Month">
                <IconButton icon={<FiChevronLeft />} size="sm" variant="ghost" borderRadius="lg"
                  onClick={prevMonth} aria-label="Previous month" _hover={{ bg: "hover-bg" }} />
              </Tooltip>
              <Box px={4} py={1.5} bg="rgba(99, 102, 241, 0.12)" borderRadius="lg" minW="150px" textAlign="center">
                <Text fontWeight="700" fontSize="sm" color="accent">
                  {MONTHS[viewMonth]} {viewYear}
                </Text>
              </Box>
              <Tooltip label={isAtCurrentMonth ? "Already at current month" : "Next Month"}>
                <IconButton icon={<FiChevronRight />} size="sm" variant="ghost" borderRadius="lg"
                  onClick={nextMonth} isDisabled={isAtCurrentMonth} aria-label="Next month" _hover={{ bg: "hover-bg" }} />
              </Tooltip>
            </HStack>
          </Flex>

          {loading ? (
            <Center py={12}><Spinner color="accent" size="lg" /></Center>
          ) : (
            <TableContainer>
              <Table size="sm" variant="simple">
                <Thead bg="app-bg-secondary">
                  <Tr borderBottom="1px solid" borderColor="border-color">
                    <Th py={3.5} fontSize="10px" color="text-muted" letterSpacing="wider" textTransform="uppercase" fontWeight="600">Date</Th>
                    <Th py={3.5} fontSize="10px" color="text-muted" letterSpacing="wider" textTransform="uppercase" fontWeight="600">Day</Th>
                    <Th py={3.5} fontSize="10px" color="text-muted" letterSpacing="wider" textTransform="uppercase" fontWeight="600">Check In</Th>
                    <Th py={3.5} fontSize="10px" color="text-muted" letterSpacing="wider" textTransform="uppercase" fontWeight="600">Check Out</Th>
                    <Th py={3.5} fontSize="10px" color="text-muted" letterSpacing="wider" textTransform="uppercase" fontWeight="600">Hours</Th>
                    <Th py={3.5} fontSize="10px" color="text-muted" letterSpacing="wider" textTransform="uppercase" fontWeight="600">Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {displayRows.map((row) => {
                    const isToday = row.date === today;
                    const hours = calcHours(row.in_time, row.out_time);
                    return (
                      <Tr
                        key={row.date}
                        bg={isToday ? "rgba(99, 102, 241, 0.08)" : row.isWeekend ? "rgba(255, 255, 255, 0.02)" : "transparent"}
                        _hover={{ bg: "hover-bg" }}
                        borderBottom="1px solid"
                        borderColor="border-color"
                        opacity={row.isFuture ? 0.35 : 1}
                        transition="background 0.15s ease-in-out"
                      >
                        <Td py={3}>
                          <HStack spacing={2}>
                            {isToday && (
                              <Badge colorScheme="purple" fontSize="9px" px={1.5} py={0.5} borderRadius="md" variant="subtle">
                                TODAY
                              </Badge>
                            )}
                            <Text fontSize="xs" fontWeight={isToday ? "700" : "500"} color="text-primary">
                              {formatDate(row.date)}
                            </Text>
                          </HStack>
                        </Td>
                        <Td py={3}>
                          <Text fontSize="xs" color={row.isWeekend ? "amber.400" : "text-muted"} fontWeight="500">
                            {getDayName(row.date)}
                          </Text>
                        </Td>
                        <Td py={3}>
                          <Text fontSize="xs" color={row.in_time ? "text-primary" : "text-muted"} fontWeight="500">
                            {row.in_time || "—"}
                          </Text>
                        </Td>
                        <Td py={3}>
                          <Text fontSize="xs" color={row.out_time ? "text-primary" : "text-muted"} fontWeight="500">
                            {row.out_time || "—"}
                          </Text>
                        </Td>
                        <Td py={3}>
                          <Text fontSize="xs" color={hours ? "accent" : "text-muted"} fontWeight={hours ? "600" : "400"}>
                            {hours || "—"}
                          </Text>
                        </Td>
                        <Td py={3}>
                          {row.isFuture
                            ? <Text fontSize="xs" color="text-muted">—</Text>
                            : <StatusBadge status={row.status || "Absent"} />
                          }
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  );
}
