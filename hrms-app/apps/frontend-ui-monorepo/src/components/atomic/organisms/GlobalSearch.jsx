import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  VStack,
  HStack,
  Badge,
  Kbd,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiUser,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiAlertCircle,
  FiBriefcase,
  FiMapPin,
  FiSmile,
  FiPackage,
  FiBookOpen,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

// Navigation index & predefined searchable routes / features
const STATIC_SEARCH_TARGETS = [
  { id: "nav-emp", title: "Employee Directory & Management", subtitle: "View and manage employee master records", category: "Employee Management", route: "/employees", icon: FiUser },
  { id: "nav-att", title: "Attendance Dashboard & Marking", subtitle: "Daily logs, check-ins, attendance history", category: "Attendance", route: "/attendance", icon: FiClock },
  { id: "nav-leave", title: "Leave Requests & Approvals", subtitle: "Apply leave, manage requests and balances", category: "Leaves", route: "/leaves", icon: FiCalendar },
  { id: "nav-pay", title: "Salary & Payroll Dashboard", subtitle: "Monthly payroll processing, slips & payouts", category: "Payroll", route: "/payroll", icon: FiDollarSign },
  { id: "nav-sal-struct", title: "Salary Structure Configuration", subtitle: "Configure earnings, allowances and deductions", category: "Salary Structures", route: "/payroll/structure", icon: FiFileText },
  { id: "nav-holidays", title: "Company Holidays & Calendar", subtitle: "Public holidays and optional leave calendar", category: "Holidays", route: "/home", icon: FiSmile },
  { id: "nav-events", title: "Company Events & Celebrations", subtitle: "Town halls, team meets and upcoming events", category: "Company Events", route: "/home", icon: FiCalendar },
  { id: "nav-notices", title: "Announcements & Notice Board", subtitle: "Company policies, notices and updates", category: "Announcements", route: "/home", icon: FiBookOpen },
  { id: "nav-complaints", title: "Complaint Center & Grievances", subtitle: "Anonymous complaints and resolution status", category: "Complaints", route: "/complaints", icon: FiAlertCircle },
  { id: "nav-branches", title: "Company Details & Branches", subtitle: "Branch office locations and department heads", category: "Branches", route: "/settings", icon: FiMapPin },
  { id: "nav-assets", title: "Asset Management Console", subtitle: "Laptops, equipment and office asset assignments", category: "Assets", route: "/settings", icon: FiPackage },
  { id: "nav-reports", title: "Reports & Executive Analytics", subtitle: "Download compliance, attendance and payroll reports", category: "Reports", route: "/payroll/overview", icon: FiBriefcase },
];

export default function GlobalSearch({ isOpen, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [dbResults, setDbResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Debounce input ~300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Query Supabase for dynamic data (Employees, Leaves, Complaints)
  useEffect(() => {
    if (!debouncedQuery) {
      setDbResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const fetchResults = async () => {
      try {
        const q = `%${debouncedQuery}%`;

        // Search employees
        const { data: emps } = await supabase
          .from("employees")
          .select("id, name, emp_code, email, department, designation, work_location")
          .or(`name.ilike.${q},emp_code.ilike.${q},email.ilike.${q},department.ilike.${q},designation.ilike.${q}`)
          .limit(5);

        // Search leave requests
        const { data: leaves } = await supabase
          .from("leave_requests")
          .select("id, type, reason, status")
          .or(`type.ilike.${q},reason.ilike.${q}`)
          .limit(3);

        // Search complaints
        const { data: complaints } = await supabase
          .from("complaints")
          .select("id, case_id, subject, status")
          .or(`case_id.ilike.${q},subject.ilike.${q}`)
          .limit(3);

        if (!isMounted) return;

        const dynamicItems = [];

        if (emps && emps.length > 0) {
          emps.forEach((e) => {
            dynamicItems.push({
              id: `emp-${e.id}`,
              title: e.name,
              subtitle: `${e.emp_code ? `#${e.emp_code} • ` : ""}${e.designation || e.department || "Employee"}`,
              category: "Employees",
              route: `/employees/${e.id}`,
              icon: FiUser,
            });
          });
        }

        if (leaves && leaves.length > 0) {
          leaves.forEach((l) => {
            dynamicItems.push({
              id: `leave-${l.id}`,
              title: `Leave: ${l.type}`,
              subtitle: `Status: ${l.status} • ${l.reason || "No description"}`,
              category: "Leave Requests",
              route: "/leaves",
              icon: FiCalendar,
            });
          });
        }

        if (complaints && complaints.length > 0) {
          complaints.forEach((c) => {
            dynamicItems.push({
              id: `comp-${c.id}`,
              title: `Case ${c.case_id}: ${c.subject}`,
              subtitle: `Status: ${c.status}`,
              category: "Complaints",
              route: "/complaints",
              icon: FiAlertCircle,
            });
          });
        }

        setDbResults(dynamicItems);
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Combine static targets matching query with DB results
  const allResults = useMemo(() => {
    if (!debouncedQuery) {
      return STATIC_SEARCH_TARGETS.slice(0, 6);
    }

    const qLower = debouncedQuery.toLowerCase();
    const staticMatches = STATIC_SEARCH_TARGETS.filter(
      (item) =>
        item.title.toLowerCase().includes(qLower) ||
        item.subtitle.toLowerCase().includes(qLower) ||
        item.category.toLowerCase().includes(qLower)
    );

    return [...dbResults, ...staticMatches];
  }, [debouncedQuery, dbResults]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [allResults]);

  // Keyboard navigation handler (Up / Down / Enter / Esc)
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allResults.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % (allResults.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        handleSelect(allResults[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleSelect = (item) => {
    onClose();
    setQuery("");
    navigate(item.route);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(8px)" />
      <ModalContent
        bg="card-bg"
        borderRadius="2xl"
        border="1px solid"
        borderColor="border-color"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.35)"
        overflow="hidden"
        mx={4}
      >
        {/* Search Input Box */}
        <Flex p={4} borderBottom="1px solid" borderColor="border-color" align="center">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none" color="accent" h="full">
              <FiSearch size={20} />
            </InputLeftElement>
            <Input
              ref={inputRef}
              placeholder="Search employees, attendance, payroll, leaves, announcements..."
              variant="unstyled"
              fontSize="md"
              fontWeight="medium"
              color="text-primary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              pl={10}
              pr={12}
            />
            <InputRightElement h="full">
              <Kbd fontSize="10px" borderRadius="md" px={2} py={0.5} bg="app-bg-secondary" color="text-muted">
                ESC
              </Kbd>
            </InputRightElement>
          </InputGroup>
        </Flex>

        {/* Results List */}
        <Box maxH="400px" overflowY="auto" p={3}>
          {!debouncedQuery && (
            <Text px={3} pt={1} pb={2} fontSize="2xs" fontWeight="bold" color="text-muted" letterSpacing="wider" textTransform="uppercase">
              Quick Shortcuts
            </Text>
          )}

          {isSearching ? (
            <Flex py={8} justify="center" align="center">
              <Text fontSize="sm" color="text-muted">
                Searching HRMS repository...
              </Text>
            </Flex>
          ) : allResults.length === 0 ? (
            <VStack py={10} spacing={2} textAlign="center">
              <Box p={3} borderRadius="full" bg="rgba(239, 68, 68, 0.1)" color="red.400">
                <FiSearch size={24} />
              </Box>
              <Text fontSize="md" fontWeight="bold" color="text-primary">
                No results found
              </Text>
              <Text fontSize="xs" color="text-muted" maxW="280px">
                We couldn't find anything matching "{debouncedQuery}". Try another search term.
              </Text>
            </VStack>
          ) : (
            <VStack spacing={1} align="stretch">
              {allResults.map((item, idx) => {
                const isFocused = idx === selectedIndex;
                const IconComp = item.icon || FiSearch;

                return (
                  <Flex
                    key={item.id}
                    p={3}
                    borderRadius="xl"
                    align="center"
                    justify="space-between"
                    cursor="pointer"
                    bg={isFocused ? "rgba(99, 102, 241, 0.12)" : "transparent"}
                    border="1px solid"
                    borderColor={isFocused ? "accent" : "transparent"}
                    _hover={{ bg: "hover-bg" }}
                    transition="all 0.12s ease"
                    onClick={() => handleSelect(item)}
                  >
                    <HStack spacing={3} flex={1} minW={0}>
                      <Flex
                        w="36px"
                        h="36px"
                        borderRadius="lg"
                        align="center"
                        justify="center"
                        bg={isFocused ? "accent" : "app-bg-secondary"}
                        color={isFocused ? "white" : "text-secondary"}
                        flexShrink={0}
                      >
                        <IconComp size={18} />
                      </Flex>
                      <VStack align="start" spacing={0} flex={1} minW={0}>
                        <Text fontSize="sm" fontWeight="bold" color="text-primary" noOfLines={1}>
                          {item.title}
                        </Text>
                        <Text fontSize="xs" color="text-muted" noOfLines={1}>
                          {item.subtitle}
                        </Text>
                      </VStack>
                    </HStack>

                    <Badge
                      ml={3}
                      colorScheme="purple"
                      variant="subtle"
                      borderRadius="full"
                      px={2.5}
                      py={0.5}
                      fontSize="9px"
                      fontWeight="bold"
                      flexShrink={0}
                    >
                      {item.category}
                    </Badge>
                  </Flex>
                );
              })}
            </VStack>
          )}
        </Box>

        {/* Footer Hint */}
        <Flex px={4} py={2.5} bg="app-bg-secondary" borderTop="1px solid" borderColor="border-color" justify="space-between" align="center">
          <HStack spacing={4} fontSize="xs" color="text-muted">
            <HStack spacing={1}>
              <Kbd fontSize="9px">↑</Kbd>
              <Kbd fontSize="9px">↓</Kbd>
              <Text fontSize="10px">Navigate</Text>
            </HStack>
            <HStack spacing={1}>
              <Kbd fontSize="9px">↵</Kbd>
              <Text fontSize="10px">Select</Text>
            </HStack>
          </HStack>
          <Text fontSize="10px" color="accent" fontWeight="semibold">
            HappyHRMS Global Search
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
