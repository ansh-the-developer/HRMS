// apps/frontend-ui-monorepo/src/features/home/HomePage.jsx
import React from "react";
import {
  Box,
  SimpleGrid,
  Grid,
  GridItem,
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
  FiEye,
  FiTrendingUp,
  FiVolume2,
} from "react-icons/fi";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import { designTokens } from "@/theme/designTokens";

// Sparkline SVG Component
const Sparkline = ({ color = "#818CF8" }) => (
  <svg width="100%" height="24" viewBox="0 0 120 24" fill="none">
    <path
      d="M0 18 Q 20 12, 40 16 T 80 8 T 120 14"
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const HomePage = () => {
  const cardBg = "card-bg";
  const borderColor = "border-color";

  return (
    <DashboardLayout>
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

          {/* Middle Row: Leave Requests Floating Glass Sheet Table */}
          <HRMSCard p={5} borderRadius="20px">
            <Flex align="center" justify="space-between" mb={4}>
              <Heading size="sm" fontWeight="bold" color="text-primary">
                Leave Requests
              </Heading>
              <Button size="xs" variant="ghost" color="accent" fontWeight="semibold">
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
                  {[
                    { emp: "employee001", code: "#BK-001", type: "Casual Leave", dur: "Jul 9 – Jul 10, 2026 (2 days)", reason: "Personal work", status: "Pending", applied: "Jul 9, 2026 12:10 AM" },
                    { emp: "Akash Rai", code: "#BK-002", type: "Casual Leave", dur: "Jul 3 – Jul 4, 2026 (2 days)", reason: "Sick leave recovery", status: "Approved", applied: "Jul 8, 2026 10:16 PM" },
                    { emp: "Kungthinliu Newmai", code: "#BK-006", type: "Sick Leave", dur: "Jun 1 – Jun 5, 2026 (5 days)", reason: "Typhoid", status: "Approved", applied: "Jul 3, 2026 04:41 PM" },
                    { emp: "suman", code: "#BK-010", type: "Casual Leave", dur: "Jul 12, 2026 (1 day)", reason: "Family event", status: "Pending", applied: "Jul 12, 2026 09:30 AM" },
                    { emp: "temp johnny", code: "#BK-012", type: "Casual Leave", dur: "Jul 14 – Jul 15, 2026 (2 days)", reason: "Travel", status: "Pending", applied: "Jul 14, 2026 11:20 AM" },
                  ].map((row, idx) => (
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
                          <Button size="xs" variant="ghost" color="accent" fontSize="10px" h="24px" px={2}>View</Button>
                          <IconButton aria-label="More" icon={<FiMoreVertical size={12} />} size="xs" variant="ghost" h="24px" w="24px" />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {/* Pagination Controls */}
            <Flex align="center" justify="space-between" mt={4} pt={2}>
              <Text fontSize="xs" color="text-muted">Showing 1 to 5 of 20 requests</Text>
              <HStack spacing={1}>
                <IconButton aria-label="Prev" icon={<FiChevronLeft size={14} />} size="xs" variant="ghost" />
                {["1", "2", "3", "4", "5"].map((p) => (
                  <Button
                    key={p}
                    size="xs"
                    h="24px"
                    w="24px"
                    variant={p === "1" ? "solid" : "ghost"}
                    bg={p === "1" ? "accent" : "transparent"}
                    color={p === "1" ? "white" : "text-secondary"}
                  >
                    {p}
                  </Button>
                ))}
                <IconButton aria-label="Next" icon={<FiChevronRight size={14} />} size="xs" variant="ghost" />
              </HStack>
            </Flex>
          </HRMSCard>

          {/* Bottom Grid: Attendance Overview, Payroll Summary, Announcements */}
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }} gap={4}>
            {/* Attendance Overview (Donut Graphic) */}
            <HRMSCard p={4} borderRadius="20px">
              <Text fontSize="xs" fontWeight="bold" color="text-primary" mb={3}>
                Attendance Overview
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
                  <Text fontSize="xs" fontWeight="bold" color="text-primary">75%</Text>
                </Box>
                <VStack align="start" spacing={1} w="full" fontSize="10px">
                  <HStack justify="space-between" w="full"><HStack spacing={1.5}><Box w="8px" h="8px" borderRadius="full" bg="emerald.400" /><Text color="text-secondary">Present</Text></HStack><Text fontWeight="bold" color="text-primary">96 (75%)</Text></HStack>
                  <HStack justify="space-between" w="full"><HStack spacing={1.5}><Box w="8px" h="8px" borderRadius="full" bg="amber.400" /><Text color="text-secondary">On Leave</Text></HStack><Text fontWeight="bold" color="text-primary">18 (14%)</Text></HStack>
                  <HStack justify="space-between" w="full"><HStack spacing={1.5}><Box w="8px" h="8px" borderRadius="full" bg="rose.400" /><Text color="text-secondary">Absent</Text></HStack><Text fontWeight="bold" color="text-primary">14 (11%)</Text></HStack>
                </VStack>
              </VStack>
            </HRMSCard>

            {/* Payroll Summary Card */}
            <HRMSCard p={4} borderRadius="20px">
              <Flex align="center" justify="space-between" mb={2}>
                <Text fontSize="xs" fontWeight="bold" color="text-primary">Payroll Summary</Text>
                <Select size="xs" w="90px" borderRadius="lg" bg="app-bg-secondary" fontSize="10px">
                  <option>This Month</option>
                </Select>
              </Flex>
              <VStack align="start" spacing={1} mt={2}>
                <Text fontSize="10px" color="text-muted">Total Payroll</Text>
                <Heading size="md" color="text-primary">₹24,58,340</Heading>
                <Text fontSize="10px" color="emerald.400" fontWeight="medium">↑ 8.5% from last month</Text>
                <Box w="full" mt={2}><Sparkline color="#6366F1" /></Box>
              </VStack>
            </HRMSCard>

            {/* Announcements Card */}
            <HRMSCard p={4} borderRadius="20px">
              <Flex align="center" justify="space-between" mb={3}>
                <Text fontSize="xs" fontWeight="bold" color="text-primary">Announcements</Text>
                <Button size="xs" variant="ghost" color="accent" fontSize="10px">View All</Button>
              </Flex>
              <VStack align="stretch" spacing={2.5}>
                <HStack spacing={2.5} p={2} borderRadius="xl" bg="app-bg-secondary">
                  <Icon as={FiVolume2} color="accent" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" fontWeight="bold" color="text-primary">Office Closed on July 20</Text>
                    <Text fontSize="10px" color="text-muted">Jul 15, 2026</Text>
                  </VStack>
                </HStack>
                <HStack spacing={2.5} p={2} borderRadius="xl" bg="app-bg-secondary">
                  <Icon as={FiTrendingUp} color="emerald.400" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" fontWeight="bold" color="text-primary">New Performance Cycle</Text>
                    <Text fontSize="10px" color="text-muted">Jul 10, 2026</Text>
                  </VStack>
                </HStack>
              </VStack>
            </HRMSCard>
          </Grid>
        </VStack>

        {/* Right Sidebar Column */}
        <VStack spacing={6} align="stretch">
          {/* Calendar Glass Widget */}
          <HRMSCard p={4} borderRadius="20px">
            <Flex align="center" justify="space-between" mb={3}>
              <Text fontSize="xs" fontWeight="bold" color="text-primary">Calendar</Text>
              <Button size="xs" variant="subtle" borderRadius="lg" fontSize="10px">Today</Button>
            </Flex>
            <VStack spacing={2}>
              <HStack justify="space-between" w="full" px={1}>
                <IconButton aria-label="Prev month" icon={<FiChevronLeft size={14} />} size="xs" variant="ghost" />
                <Text fontSize="xs" fontWeight="bold" color="text-primary">July 2026</Text>
                <IconButton aria-label="Next month" icon={<FiChevronRight size={14} />} size="xs" variant="ghost" />
              </HStack>

              {/* Mini Calendar Days Grid */}
              <SimpleGrid columns={7} spacing={1} w="full" textAlign="center" fontSize="10px">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <Text key={d} color="text-muted" fontWeight="bold">{d}</Text>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <Flex
                    key={day}
                    h="24px"
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg={day === 25 ? "accent" : "transparent"}
                    color={day === 25 ? "white" : "text-secondary"}
                    fontWeight={day === 25 ? "bold" : "normal"}
                    cursor="pointer"
                    _hover={{ bg: day === 25 ? "accent" : "hover-bg" }}
                  >
                    {day}
                  </Flex>
                ))}
              </SimpleGrid>
            </VStack>
          </HRMSCard>

          {/* Upcoming Birthdays Card */}
          <HRMSCard p={4} borderRadius="20px">
            <Flex align="center" justify="space-between" mb={3}>
              <Text fontSize="xs" fontWeight="bold" color="text-primary">Upcoming Birthdays</Text>
              <Button size="xs" variant="ghost" color="accent" fontSize="10px">View All</Button>
            </Flex>
            <VStack align="stretch" spacing={3}>
              {[
                { name: "Akhilesh", role: "Software Engineer", date: "Jul 16" },
                { name: "suman", role: "Support Executive", date: "Jul 20" },
                { name: "Hae Young Park", role: "UI/UX Designer", date: "Jul 27" },
              ].map((b, i) => (
                <Flex key={i} align="center" justify="space-between">
                  <HStack spacing={2.5}>
                    <Avatar size="xs" name={b.name} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" fontWeight="bold" color="text-primary">{b.name}</Text>
                      <Text fontSize="10px" color="text-muted">{b.role}</Text>
                    </VStack>
                  </HStack>
                  <Text fontSize="10px" fontWeight="semibold" color="accent">{b.date}</Text>
                </Flex>
              ))}
            </VStack>
          </HRMSCard>

          {/* Quick Actions 4-Grid Card */}
          <HRMSCard p={4} borderRadius="20px">
            <Text fontSize="xs" fontWeight="bold" color="text-primary" mb={3}>Quick Actions</Text>
            <SimpleGrid columns={2} spacing={3}>
              <VStack p={3} bg="app-bg-secondary" borderRadius="16px" cursor="pointer" _hover={{ bg: "hover-bg", transform: "translateY(-1px)" }} transition="all 0.15s">
                <Icon as={FiUserPlus} boxSize={5} color="accent" />
                <Text fontSize="10px" fontWeight="semibold" color="text-primary">Add Employee</Text>
              </VStack>
              <VStack p={3} bg="app-bg-secondary" borderRadius="16px" cursor="pointer" _hover={{ bg: "hover-bg", transform: "translateY(-1px)" }} transition="all 0.15s">
                <Icon as={FiCalendar} boxSize={5} color="emerald.400" />
                <Text fontSize="10px" fontWeight="semibold" color="text-primary">Mark Attendance</Text>
              </VStack>
              <VStack p={3} bg="app-bg-secondary" borderRadius="16px" cursor="pointer" _hover={{ bg: "hover-bg", transform: "translateY(-1px)" }} transition="all 0.15s">
                <Icon as={FiSend} boxSize={5} color="purple.400" />
                <Text fontSize="10px" fontWeight="semibold" color="text-primary">Apply Leave</Text>
              </VStack>
              <VStack p={3} bg="app-bg-secondary" borderRadius="16px" cursor="pointer" _hover={{ bg: "hover-bg", transform: "translateY(-1px)" }} transition="all 0.15s">
                <Icon as={FiFileText} boxSize={5} color="amber.400" />
                <Text fontSize="10px" fontWeight="semibold" color="text-primary">Generate Payslip</Text>
              </VStack>
            </SimpleGrid>
          </HRMSCard>
        </VStack>
      </Grid>
    </DashboardLayout>
  );
};

export default HomePage;
