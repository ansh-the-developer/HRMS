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
  "Present":  { color: "#10B981", bg: "#D1FAE5" },
  "Absent":   { color: "#EF4444", bg: "#FEE2E2" },
  "On Leave": { color: "#6366F1", bg: "#EDE9FE" },
  "Off Day":  { color: "#F59E0B", bg: "#FEF3C7" },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Absent"];
  return (
    <Badge px={2} py={0.5} borderRadius="full" fontSize="xs" fontWeight="700"
      color={cfg.color} bg={cfg.bg} border="1px solid" borderColor={cfg.color + "40"}>
      {status || "Absent"}
    </Badge>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <Box bg="card-bg" borderRadius="xl" p={5} shadow="sm" border="1px solid" borderColor="border-color">
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

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("employees")
          .select("id, name, email, department, designation, emp_code, auth_user_id")
          .eq("auth_user_id", user.id)
          .maybeSingle();
        if (error) throw error;
        if (!data) { setNoRecord(true); setLoading(false); return; }
        setEmpRecord(data);
      } catch (e) {
        console.error("EmployeeAttendanceDashboard lookup error:", e.message);
        setNoRecord(true);
        setLoading(false);
      }
    })();
  }, [user?.id]);

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

  const calendarRows = Array.from({ length: totalDays }, (_, i) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(i + 1).padStart(2, "0");
    const dateStr = `${viewYear}-${mm}-${dd}`;
    const log = logs.find((l) => l.date === dateStr);
    const dow = new Date(dateStr + "T00:00:00").getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isFuture = dateStr > today;
    return {
      date: dateStr,
      in_time:  log?.in_time  || "",
      out_time: log?.out_time || "",
      status: log?.status || (isWeekend ? "Off Day" : isFuture ? null : "Absent"),
      isWeekend,
      isFuture,
    };
  }).reverse();

  const pastRows = calendarRows.filter((r) => !r.isFuture);
  const presentCount = pastRows.filter((r) => r.status === "Present").length;
  const absentCount  = pastRows.filter((r) => r.status === "Absent").length;
  const leaveCount   = pastRows.filter((r) => r.status === "On Leave").length;
  const offCount     = pastRows.filter((r) => r.status === "Off Day").length;

  const todayLog = logs.find((l) => l.date === today);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth >= now.getMonth())) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };
  const isAtCurrentMonth = viewMonth === now.getMonth() && viewYear === now.getFullYear();

  if (loading && !empRecord) {
    return (
      <DashboardLayout pageTitle="Attendance">
        <Center minH="400px"><Spinner size="xl" color="#6366F1" thickness="4px" /></Center>
      </DashboardLayout>
    );
  }

  if (noRecord) {
    return (
      <DashboardLayout pageTitle="Attendance">
        <Center minH="400px" flexDir="column" gap={4}>
          <Center w="72px" h="72px" borderRadius="full" bg="rgba(99, 102, 241, 0.12)">
            <Box as={FiCalendar} fontSize="32px" color="#6366F1" />
          </Center>
          <VStack spacing={1}>
            <Text fontSize="lg" fontWeight="700" color="text-secondary">No Attendance Record Found</Text>
            <Text fontSize="sm" color="text-muted" textAlign="center" maxW="340px">
              Your account does not have a linked employee profile yet. Please contact HR to set up your attendance tracking.
            </Text>
          </VStack>
        </Center>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Attendance">
      <VStack spacing={6} align="stretch">
        {/* Header Banner */}
        <Flex
          bgGradient="linear(to-r, #6366F1, #8B5CF6)"
          borderRadius="2xl" p={6} align="center" justify="space-between" shadow="lg"
        >
          <HStack spacing={4}>
            <Avatar name={empRecord?.name} size="md" bg="whiteAlpha.300" color="white" fontWeight="700" />
            <VStack align="start" spacing={0}>
              <Text color="white" fontWeight="800" fontSize="lg">{empRecord?.name}</Text>
              <Text color="whiteAlpha.800" fontSize="sm">
                {empRecord?.designation} &middot; {empRecord?.department}
              </Text>
            </VStack>
          </HStack>
          <Box bg="whiteAlpha.200" borderRadius="xl" px={5} py={3} textAlign="center">
            <Text fontSize="10px" fontWeight="700" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="wider" mb={1}>
              Today
            </Text>
            {todayLog ? (
              <VStack spacing={0.5}>
                <StatusBadge status={todayLog.status} />
                {todayLog.in_time && (
                  <Text fontSize="11px" color="whiteAlpha.800" mt={1}>
                    {todayLog.in_time}{todayLog.out_time ? ` ? ${todayLog.out_time}` : ""}
                  </Text>
                )}
              </VStack>
            ) : (
              <Text fontSize="sm" fontWeight="600" color="whiteAlpha.600">Not Logged</Text>
            )}
          </Box>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <StatCard icon={FiCheckCircle}        label="Present"  value={presentCount} color="#10B981" />
          <StatCard icon={FiXCircle}            label="Absent"   value={absentCount}  color="#EF4444" />
          <StatCard icon={MdOutlineBeachAccess} label="On Leave" value={leaveCount}   color="#6366F1" />
          <StatCard icon={FiSun}                label="Off Days" value={offCount}     color="#F59E0B" />
        </SimpleGrid>

        {/* Log Table */}
        <Box bg="card-bg" borderRadius="2xl" shadow="sm" border="1px solid" borderColor="border-color" overflow="hidden">
          <Flex px={6} py={4} align="center" justify="space-between" borderBottom="1px solid" borderColor="border-color">
            <HStack spacing={2}>
              <Box as={FiCalendar} color="#6366F1" fontSize="18px" />
              <Text fontWeight="700" fontSize="md" color="text-primary">Monthly Attendance Log</Text>
            </HStack>
            <HStack spacing={2}>
              <Tooltip label="Previous Month">
                <IconButton icon={<FiChevronLeft />} size="sm" variant="ghost" borderRadius="lg"
                  onClick={prevMonth} aria-label="Previous month" />
              </Tooltip>
              <Box px={4} py={1.5} bg="rgba(99, 102, 241, 0.12)" borderRadius="lg" minW="150px" textAlign="center">
                <Text fontWeight="700" fontSize="sm" color="#6366F1">
                  {MONTHS[viewMonth]} {viewYear}
                </Text>
              </Box>
              <Tooltip label={isAtCurrentMonth ? "Already at current month" : "Next Month"}>
                <IconButton icon={<FiChevronRight />} size="sm" variant="ghost" borderRadius="lg"
                  onClick={nextMonth} isDisabled={isAtCurrentMonth} aria-label="Next month" />
              </Tooltip>
            </HStack>
          </Flex>

          {loading ? (
            <Center py={12}><Spinner color="#6366F1" size="lg" /></Center>
          ) : (
            <TableContainer>
              <Table size="sm" variant="simple">
                <Thead bg="app-bg-secondary">
                  <Tr>
                    <Th py={3} fontSize="11px">Date</Th>
                    <Th py={3} fontSize="11px">Day</Th>
                    <Th py={3} fontSize="11px">Check In</Th>
                    <Th py={3} fontSize="11px">Check Out</Th>
                    <Th py={3} fontSize="11px">Hours</Th>
                    <Th py={3} fontSize="11px">Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {calendarRows.map((row) => {
                    const isToday = row.date === today;
                    const hours = calcHours(row.in_time, row.out_time);
                    return (
                      <Tr key={row.date}
                        bg={isToday ? "purple.50" : row.isWeekend ? "gray.50" : "white"}
                        _hover={{ bg: "hover-bg" }}
                        opacity={row.isFuture ? 0.35 : 1}
                        transition="background 0.15s"
                      >
                        <Td py={3}>
                          <HStack spacing={1}>
                            {isToday && <Badge colorScheme="purple" fontSize="9px" px={1.5} borderRadius="md">TODAY</Badge>}
                            <Text fontSize="sm" fontWeight={isToday ? "700" : "500"} color="text-secondary">
                              {formatDate(row.date)}
                            </Text>
                          </HStack>
                        </Td>
                        <Td py={3}>
                          <Text fontSize="sm" color={row.isWeekend ? "warning" : "text-muted"} fontWeight="500">
                            {getDayName(row.date)}
                          </Text>
                        </Td>
                        <Td py={3}>
                          <Text fontSize="sm" color={row.in_time ? "text-primary" : "text-muted"} fontWeight="500">
                            {row.in_time || "—"}
                          </Text>
                        </Td>
                        <Td py={3}>
                          <Text fontSize="sm" color={row.out_time ? "text-primary" : "text-muted"} fontWeight="500">
                            {row.out_time || "—"}
                          </Text>
                        </Td>
                        <Td py={3}>
                          {(() => {
                            const hours = calcWorkingHours(row.in_time, row.out_time);
                            return (
                              <Text fontSize="sm" color={hours ? "accent" : "text-muted"} fontWeight={hours ? "600" : "400"}>
                                {hours ? `${hours} hrs` : "—"}
                              </Text>
                            );
                          })()}
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

          {!loading && (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mt={6} pt={4} borderTop="1px solid" borderColor="border-color">
              {[
                { label: "Working Days", value: pastRows.filter(r => !r.isWeekend).length, color: "text-primary" },
                { label: "Present",      value: presentCount, color: "success" },
                { label: "Absent",       value: absentCount,  color: "error" },
              ].map(({ label, value, color }) => (
                <VStack key={label} spacing={0} align="center">
                  <Text fontSize="xs" color="text-muted" fontWeight="600" textTransform="uppercase" letterSpacing="wide">
                    {label}
                  </Text>
                  <Text fontSize="lg" fontWeight="800" color={color}>{value}</Text>
                </VStack>
              ))}
              </SimpleGrid>
          )}
        </Box>
      </VStack>
    </DashboardLayout>
  );
}
