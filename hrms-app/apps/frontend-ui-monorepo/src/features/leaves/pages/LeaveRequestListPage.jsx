import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import {
  Box,
  Flex,
  Text,
  Avatar,
  VStack,
  HStack,
  Button,
  Spinner,
  useToast,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLeaveRequests, updateLeaveStatus } from "@/services/leaveApi";
import { FiDownload, FiPaperclip, FiRotateCcw, FiAlertTriangle } from "react-icons/fi";

const MOCK_REQUESTS = [
  {
    id: "mock-1",
    emp_code: "BK-006",
    name: "Kungthinliu Newmai",
    designation: "Software Engineer",
    location: "Beverage",
    type: "Sick Leave",
    start_date: "2026-06-01",
    end_date: "2026-06-05",
    leaveOn: "Jun 1, 2026 – Jun 5, 2026",
    days: 5,
    reason: "Typhoid",
    submitted_date: "Jul 3, 2026",
    submitted_time: "04:41 PM",
    submitted_raw: "2026-07-03T16:41:00Z",
    evidence: "View Doc",
    status: "Approved",
    admin_note: ""
  },
  {
    id: "mock-2",
    emp_code: "BK-006",
    name: "Kungthinliu Newmai",
    designation: "Software Engineer",
    location: "Beverage",
    type: "Sick Leave",
    start_date: "2026-06-27",
    end_date: "2026-07-02",
    leaveOn: "Jun 27, 2026 – Jul 2, 2026",
    days: 6,
    reason: "Typhoid",
    submitted_date: "Jul 3, 2026",
    submitted_time: "04:22 PM",
    submitted_raw: "2026-07-03T16:22:00Z",
    evidence: "View Doc",
    status: "Approved",
    admin_note: ""
  },
  {
    id: "mock-3",
    emp_code: "BK-006",
    name: "Kungthinliu Newmai",
    designation: "Software Engineer",
    location: "Beverage",
    type: "Sick Leave",
    start_date: "2026-06-25",
    end_date: "2026-06-25",
    leaveOn: "Jun 25, 2026 – Jun 25, 2026",
    days: 1,
    reason: "High fever",
    submitted_date: "Jun 26, 2026",
    submitted_time: "09:47 AM",
    submitted_raw: "2026-06-26T09:47:00Z",
    evidence: "View Doc",
    status: "Approved",
    admin_note: ""
  }
];

function LeaveRequestListPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("All");
  const [requestsList, setRequestsList] = useState([]);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  // Reset Modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetId, setResetId] = useState(null);

  // Document Modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const {
    data: leaveRequests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leave-requests"],
    queryFn: getLeaveRequests,
  });

  useEffect(() => {
    if (leaveRequests) {
      const dbMapped = leaveRequests.map((r) => {
        const start = new Date(r.start_date);
        const end = new Date(r.end_date);
        const diffTime = Math.abs(end - start);
        const diffDays = isNaN(diffTime) ? 1 : Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const formatDate = (dateStr) => {
          if (!dateStr) return "-";
          const d = new Date(dateStr);
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        };

        const formatSubmitDate = (dateStr) => {
          if (!dateStr) return "-";
          const d = new Date(dateStr);
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        };

        const formatSubmitTime = (dateStr) => {
          if (!dateStr) return "-";
          const d = new Date(dateStr);
          return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        };

        return {
          id: r.id,
          emp_code: r.employees?.emp_code ?? "BK-001",
          name: r.employees?.name ?? "Unknown",
          designation: r.employees?.designation ?? "-",
          location: r.employees?.department ?? "-",
          type: r.type === "Sick" ? "Sick Leave" : r.type === "Casual" ? "Casual Leave" : r.type,
          start_date: r.start_date,
          end_date: r.end_date,
          leaveOn: `${formatDate(r.start_date)} – ${formatDate(r.end_date)}`,
          days: diffDays,
          reason: r.reason ?? "-",
          submitted_date: formatSubmitDate(r.created_at || r.start_date),
          submitted_time: formatSubmitTime(r.created_at || r.start_date),
          submitted_raw: r.created_at || r.start_date,
          status: r.status,
          evidence: "View Doc",
          document_url: r.document_url || r.evidence_url || null,
          admin_note: r.admin_note ?? ""
        };
      });

      const merged = [...dbMapped];
      MOCK_REQUESTS.forEach((mock) => {
        if (!merged.some((r) => r.emp_code === mock.emp_code && r.start_date === mock.start_date)) {
          merged.push(mock);
        }
      });

      // Sort by submission date (newest first)
      merged.sort((a, b) => new Date(b.submitted_raw || b.start_date) - new Date(a.submitted_raw || a.start_date));
      setRequestsList(merged);
    }
  }, [leaveRequests]);

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Leaves">
        <Box p={8} display="flex" alignItems="center" gap={3}>
          <Spinner size="sm" />
          <Text>Loading leave requests...</Text>
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Leaves">
        <Box p={8}>
          <Text color="red.500">Error: {error.message}</Text>
        </Box>
      </DashboardLayout>
    );
  }

  // Calculate status counts
  const pendingCount = requestsList.filter((r) => r.status === "Pending").length;
  const approvedCount = requestsList.filter((r) => r.status === "Approved").length;
  const rejectedCount = requestsList.filter((r) => r.status === "Rejected").length;

  // Filter list by selected tab
  const filteredRequests = requestsList.filter((r) => {
    if (activeTab === "All") return true;
    return r.status === activeTab;
  });

  // Paginated requests
  const paginatedRequests = filteredRequests.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRequests.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleOpenResetModal = (id) => {
    setResetId(id);
    setIsResetModalOpen(true);
  };

  const handleCloseResetModal = () => {
    setResetId(null);
    setIsResetModalOpen(false);
  };

  const handleViewDoc = (req) => {
    if (req.document_url) {
      window.open(req.document_url, "_blank");
    } else {
      setIsDocModalOpen(true);
    }
  };

  const handleConfirmReset = async () => {
    if (!resetId) return;
    setIsGlobalLoading(true);

    try {
      if (!resetId.toString().startsWith("mock-")) {
        await updateLeaveStatus(resetId, "Pending");
      }

      setRequestsList((prev) =>
        prev.map((r) =>
          r.id === resetId ? { ...r, status: "Pending", admin_note: "" } : r
        )
      );

      toast({
        title: "🔄 Reset to Pending",
        description: "Leave decision was reset back to Pending.",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });

      queryClient.invalidateQueries(["leave-requests"]);
      queryClient.invalidateQueries(["leaveRequests"]);
    } catch (err) {
      toast({
        title: "❌ Failed to reset status",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsGlobalLoading(false);
      setIsResetModalOpen(false);
      setResetId(null);
    }
  };

  const handleAction = async (id, status) => {
    setIsGlobalLoading(true);

    try {
      if (!id.toString().startsWith("mock-")) {
        await updateLeaveStatus(id, status);
      }

      setRequestsList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );

      toast({
        title: status === "Approved" ? "✅ Leave Approved" : "🚫 Leave Rejected",
        status: status === "Approved" ? "success" : "warning",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });

      queryClient.invalidateQueries(["leave-requests"]);
      queryClient.invalidateQueries(["leaveRequests"]);
    } catch (err) {
      toast({
        title: `❌ Failed to ${status.toLowerCase()}`,
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Emp ID", "Name", "Leave Type", "Start", "End", "Days", "Status", "Submitted", "Admin Note"];

    const csvRows = [
      headers.join(","),
      ...filteredRequests.map((r) => {
        const empId = r.emp_code || "";
        const name = r.name || "";
        const type = r.type || "";
        const start = r.start_date || "";
        const end = r.end_date || "";
        const days = r.days || 1;
        const status = r.status || "";
        const submitted = `${r.submitted_date} ${r.submitted_time}`;
        const adminNote = r.admin_note || "";

        return [
          `"${empId}"`,
          `"${name}"`,
          `"${type}"`,
          `"${start}"`,
          `"${end}"`,
          days,
          `"${status}"`,
          `"${submitted}"`,
          `"${adminNote}"`,
        ].join(",");
      }),
    ];

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    const today = new Date().toISOString().split("T")[0];
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leave_requests_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout pageTitle="Leaves">
      {isGlobalLoading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255,255,255,0.7)"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
          gap={3}
        >
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text fontSize="md" fontWeight="medium" color="text-secondary">
            Processing request...
          </Text>
        </Box>
      )}

      <VStack spacing={6} align="stretch" w="full" px={1}>
        {/* Page Header (Plain, no box) */}
        <Box mb={2}>
          <Text fontSize="2xl" fontWeight="bold" color="text-primary">
            Leave Requests
          </Text>
          <Text fontSize="sm" color="text-secondary" fontStyle="italic">
            Leave Verification & Management
          </Text>
        </Box>

        {/* Leaves Summary Card */}
        <Box
          bg="card-bg"
          p={6}
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="border-color"
          shadow="sm"
        >
          <Text fontSize="md" fontWeight="bold" color="text-primary" mb={1}>
            Leaves Summary
          </Text>
          <Text fontSize="xs" color="text-secondary" mb={6}>
            Overview of request statuses
          </Text>

          <Flex direction="row" align="center" justify="space-around" py={2}>
            {/* Pending Segment */}
            <VStack spacing={1} flex="1" align="center">
              <Text fontSize="xs" fontWeight="semibold" color="text-muted" letterSpacing="wider">
                PENDING
              </Text>
              <HStack spacing={2} align="center">
                <Box w="8px" h="8px" borderRadius="full" bg="#E28743" />
                <Text fontSize="2xl" fontWeight="bold" color="text-primary">
                  {pendingCount.toString().padStart(2, "0")}
                </Text>
              </HStack>
            </VStack>

            <Box w="1px" h="40px" bg="border-color" />

            {/* Approved Segment */}
            <VStack spacing={1} flex="1" align="center">
              <Text fontSize="xs" fontWeight="semibold" color="text-muted" letterSpacing="wider">
                APPROVED
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="#38A169">
                {approvedCount}
              </Text>
            </VStack>

            <Box w="1px" h="40px" bg="border-color" />

            {/* Rejected Segment */}
            <VStack spacing={1} flex="1" align="center">
              <Text fontSize="xs" fontWeight="semibold" color="text-muted" letterSpacing="wider">
                REJECTED
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="#E53E3E">
                {rejectedCount}
              </Text>
            </VStack>
          </Flex>
        </Box>

        {/* Application Workspace Card */}
        <Box
          bg="card-bg"
          p={6}
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="border-color"
          shadow="sm"
        >
          {/* Workspace Header */}
          <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
            <Text fontSize="lg" fontWeight="bold" color="text-primary">
              Application Workspace
            </Text>

            <HStack spacing={3}>
              {/* Status Filters Segmented Control */}
              <HStack spacing={1} bg="app-bg-secondary" border="1px solid" borderColor="border-color" p={1} borderRadius="xl">
                {["All", "Pending", "Approved", "Rejected"].map((tab) => {
                  const isSelected = activeTab === tab;
                  return (
                    <Button
                      key={tab}
                      size="sm"
                      variant="ghost"
                      borderRadius="lg"
                      px={4}
                      h="32px"
                      fontSize="xs"
                      fontWeight="semibold"
                      bg={isSelected ? "accent" : "transparent"}
                      color={isSelected ? "white" : "text-secondary"}
                      _hover={isSelected ? { bg: "accent-hover" } : { bg: "hover-bg", color: "text-primary" }}
                      onClick={() => {
                        setActiveTab(tab);
                        setVisibleCount(3); // Reset page count on filter switch
                      }}
                    >
                      {tab}
                    </Button>
                  );
                })}
              </HStack>

              {/* Export CSV Button */}
              <Button
                size="sm"
                variant="outline"
                leftIcon={<FiDownload />}
                borderColor="border-color"
                color="text-secondary"
                borderRadius="lg"
                h="34px"
                fontSize="xs"
                fontWeight="semibold"
                _hover={{ bg: "hover-bg", color: "text-primary" }}
                onClick={handleExportCSV}
              >
                Export CSV
              </Button>
            </HStack>
          </Flex>

          {/* Table Container */}
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr borderBottomWidth="1px" borderColor="border-color">
                  <Th fontSize="10px" color="text-muted" fontWeight="bold" letterSpacing="wider" py={4}>
                    EMPLOYEE
                  </Th>
                  <Th fontSize="10px" color="text-muted" fontWeight="bold" letterSpacing="wider" py={4}>
                    TYPE & DURATION
                  </Th>
                  <Th fontSize="10px" color="text-muted" fontWeight="bold" letterSpacing="wider" py={4}>
                    REASON
                  </Th>
                  <Th fontSize="10px" color="text-muted" fontWeight="bold" letterSpacing="wider" py={4}>
                    SUBMITTED ON
                  </Th>
                  <Th fontSize="10px" color="text-muted" fontWeight="bold" letterSpacing="wider" py={4}>
                    EVIDENCE
                  </Th>
                  <Th fontSize="10px" color="text-muted" fontWeight="bold" letterSpacing="wider" py={4} textAlign="center">
                    ACTION
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {paginatedRequests.map((req) => (
                  <Tr
                    key={req.id}
                    _hover={{ bg: "hover-bg" }}
                    transition="background-color 0.2s"
                    borderBottomWidth="1px"
                    borderColor="border-color"
                  >
                    {/* Employee Info */}
                    <Td py={4}>
                      <HStack spacing={3}>
                        <Avatar size="sm" name={req.name} />
                        <VStack align="flex-start" spacing={0.5}>
                          <Text fontSize="sm" fontWeight="bold" color="text-primary">
                            {req.name}
                          </Text>
                          <Text fontSize="xs" color="text-muted">
                            #{req.emp_code}
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>

                    {/* Type & Duration */}
                    <Td py={4}>
                      <VStack align="flex-start" spacing={1}>
                        <Badge
                          fontSize="9px"
                          fontWeight="bold"
                          px={2.5}
                          py={0.5}
                          borderRadius="full"
                          colorScheme={req.type.toLowerCase().includes("sick") ? "red" : "orange"}
                          variant="subtle"
                        >
                          {req.type.toUpperCase()}
                        </Badge>
                        <Text fontSize="xs" fontWeight="semibold" color="text-primary">
                          {req.leaveOn}
                        </Text>
                        <Text fontSize="10px" color="text-muted" fontStyle="italic">
                          {req.days} {req.days === 1 ? "Day" : "Days"} total
                        </Text>
                      </VStack>
                    </Td>

                    {/* Reason */}
                    <Td py={4}>
                      <Text fontSize="xs" color="text-secondary">
                        {req.reason}
                      </Text>
                    </Td>

                    {/* Submitted On */}
                    <Td py={4}>
                      <VStack align="flex-start" spacing={0.5}>
                        <Text fontSize="xs" color="text-primary">
                          {req.submitted_date}
                        </Text>
                        <Text fontSize="10px" color="text-muted">
                          {req.submitted_time}
                        </Text>
                      </VStack>
                    </Td>

                    {/* Evidence */}
                    <Td py={4}>
                      <HStack
                        spacing={1}
                        color="accent"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => handleViewDoc(req)}
                      >
                        <FiPaperclip size={12} />
                        <Text fontSize="xs" fontWeight="medium">
                          View Doc
                        </Text>
                      </HStack>
                    </Td>

                    {/* Action */}
                    <Td py={4} textAlign="center">
                      <VStack spacing={1} align="center">
                        {req.status === "Approved" && (
                          <>
                            <Badge
                              fontSize="9px"
                              fontWeight="bold"
                              px={2.5}
                              py={0.5}
                              borderRadius="full"
                              colorScheme="green"
                              variant="subtle"
                            >
                              APPROVED
                            </Badge>
                            <Button
                              size="xs"
                              variant="link"
                              leftIcon={<FiRotateCcw size={10} />}
                              color="text-muted"
                              fontSize="10px"
                              fontWeight="medium"
                              onClick={() => handleOpenResetModal(req.id)}
                              _hover={{ color: "text-primary" }}
                              py={1}
                            >
                              Reset to Pending
                            </Button>
                          </>
                        )}

                        {req.status === "Rejected" && (
                          <>
                            <Badge
                              fontSize="9px"
                              fontWeight="bold"
                              px={2}
                              py={1}
                              borderRadius="full"
                              bg="#FED7D7"
                              color="#C53030"
                            >
                              REJECTED
                            </Badge>
                            <Button
                              size="xs"
                              variant="link"
                              leftIcon={<FiRotateCcw size={10} />}
                              color="#718096"
                              fontSize="10px"
                              fontWeight="medium"
                              onClick={() => handleOpenResetModal(req.id)}
                              _hover={{ color: "#4A5568" }}
                              py={1}
                            >
                              Reset to Pending
                            </Button>
                          </>
                        )}

                        {req.status === "Pending" && (
                          <HStack spacing={1}>
                            <Button
                              size="xs"
                              colorScheme="green"
                              borderRadius="md"
                              fontSize="10px"
                              onClick={() => handleAction(req.id, "Approved")}
                            >
                              ✓ Approve
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="red"
                              variant="outline"
                              borderRadius="md"
                              fontSize="10px"
                              onClick={() => handleAction(req.id, "Rejected")}
                            >
                              ✗ Reject
                            </Button>
                          </HStack>
                        )}
                      </VStack>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>

        {/* Load Older Requests Button */}
        {hasMore && (
          <Flex justify="center" mt={8}>
            <Button
              bg="accent"
              color="white"
              borderRadius="full"
              px={8}
              py={2}
              h="36px"
              fontSize="xs"
              fontWeight="bold"
              _hover={{ bg: "#5F33E1" }}
              onClick={handleLoadMore}
            >
              Load Older Requests
            </Button>
          </Flex>
        )}
      </Box>
    </VStack>

      {/* Reset Warning Modal */}
      <Modal isOpen={isResetModalOpen} onClose={handleCloseResetModal} isCentered size="xs">
        <ModalOverlay />
        <ModalContent borderRadius="3xl" p={4} maxW="360px">
          <ModalBody>
            <Flex direction="row" align="start" gap={3} py={2}>
              {/* Warning Icon Box */}
              <Box
                p={2.5}
                borderRadius="xl"
                borderWidth="1.5px"
                borderColor="#FEEBC8"
                bg="#FFFDF5"
                color="#DD6B20"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FiAlertTriangle size={24} />
              </Box>

              <VStack align="flex-start" spacing={1}>
                <Text fontSize="md" fontWeight="bold" color="text-primary">
                  Confirm Action
                </Text>
                <Text fontSize="xs" color="text-secondary" lineHeight="tall">
                  Reset this decision back to Pending? Admin note will be cleared.
                </Text>
              </VStack>
            </Flex>
          </ModalBody>

          <ModalFooter justifyContent="flex-end" gap={2} pt={4}>
            <Button
              size="sm"
              variant="outline"
              borderRadius="xl"
              fontSize="xs"
              fontWeight="semibold"
              borderColor="border-color"
              color="text-secondary"
              onClick={handleCloseResetModal}
              h="36px"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              borderRadius="xl"
              fontSize="xs"
              fontWeight="semibold"
              bg="#E53E3E"
              _hover={{ bg: "#C53030" }}
              onClick={handleConfirmReset}
              h="36px"
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* No Document Modal */}
      <Modal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} isCentered size="xs">
        <ModalOverlay />
        <ModalContent borderRadius="3xl" p={4} maxW="340px">
          <ModalBody>
            <Flex direction="row" align="start" gap={3} py={2}>
              {/* Warning Icon Box */}
              <Box
                p={2.5}
                borderRadius="xl"
                borderWidth="1.5px"
                borderColor="#FED7D7"
                bg="#FFF5F5"
                color="#E53E3E"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FiAlertTriangle size={24} />
              </Box>

              <VStack align="flex-start" spacing={1}>
                <Text fontSize="md" fontWeight="bold" color="text-primary">
                  No Document
                </Text>
                <Text fontSize="xs" color="text-secondary" lineHeight="tall">
                  No document uploaded.
                </Text>
              </VStack>
            </Flex>
          </ModalBody>

          <ModalFooter justifyContent="flex-end" pt={4}>
            <Button
              size="sm"
              colorScheme="purple"
              bg="accent"
              borderRadius="xl"
              fontSize="xs"
              fontWeight="semibold"
              onClick={() => setIsDocModalOpen(false)}
              h="36px"
              px={6}
              _hover={{ bg: "#5F33E1" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}

export default LeaveRequestListPage;
