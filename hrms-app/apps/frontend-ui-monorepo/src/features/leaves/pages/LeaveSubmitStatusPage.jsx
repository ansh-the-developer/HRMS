import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Circle,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Button,
  Icon,
  Link,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";
import { FiArrowLeft, FiPaperclip, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { useLeaveRequests } from "@/hooks/useLeaves";

// Custom Step Component
const StatusStep = ({ label, status, isLast }) => {
  // Status: 'completed', 'current', 'pending', 'failed'
  let bg = "app-bg-secondary";
  let icon = null;
  let labelColor = "text-muted";

  if (status === "completed") {
    bg = "purple.100";
    labelColor = "purple.500";
    icon = (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  } else if (status === "current") {
    bg = "purple.500";
    labelColor = "purple.600";
    icon = <Box w="8px" h="8px" borderRadius="full" bg="card-bg" />;
  } else if (status === "failed") {
    bg = "red.100";
    labelColor = "red.500";
    icon = (
      <Text fontSize="xs" fontWeight="bold" color="red.500">
        ✕
      </Text>
    );
  }

  return (
    <Flex align="center" flex="1">
      <VStack spacing={2} align="center" w="100%">
        <Circle 
          size="40px" 
          bg={bg} 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          position="relative"
          zIndex={2}
          border={status === "current" ? "2px solid" : "none"}
          borderColor="purple.200"
        >
          {icon}
        </Circle>
        <Text fontSize="10px" fontWeight="700" color={labelColor} textAlign="center" maxW="80px">
          {label}
        </Text>
      </VStack>
      
      {!isLast && (
        <Box 
          flex="1" 
          h="2px" 
          bg={status === "completed" ? "purple.300" : "border-color"}
          mt="-20px" 
          mx="-15px" 
          position="relative"
          zIndex={1}
        />
      )}
    </Flex>
  );
};

const LeaveSubmitStatusPage = () => {
  const navigate = useNavigate();
  const { role, originalRole } = useRole();
  const { user } = useAuth();
  const isEmployeeMode = role === "employee";
  const shouldFetchProfile = isEmployeeMode && originalRole === "employee";

  const { data: empProfile, isLoading: loadingProfile } = useEmployeeProfile(shouldFetchProfile ? user?.id : null);
  const { data: leaveRequests, isLoading: loadingLeaves } = useLeaveRequests();
  
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filter requests for the current employee
  const myRequests = leaveRequests?.filter((r) => {
    // If admin/HR, they can view all, but for employees restrict to their profile ID
    if (isEmployeeMode) {
      return r.employee_id === empProfile?.id;
    }
    return true;
  }) || [];

  // Automatically select the first request as default once loaded
  useEffect(() => {
    if (myRequests.length > 0 && !selectedRequest) {
      setSelectedRequest(myRequests[0]);
    }
  }, [myRequests, selectedRequest]);

  const isLoading = loadingProfile || loadingLeaves;

  // Build the approval stepper steps dynamically based on request status
  const getSteps = (status) => {
    if (status === "Approved") {
      return [
        { label: "Submitted", status: "completed" },
        { label: "Level 1 Approval", status: "completed" },
        { label: "Level 2 Approval", status: "completed" },
        { label: "Approved", status: "completed" },
      ];
    } else if (status === "Rejected") {
      return [
        { label: "Submitted", status: "completed" },
        { label: "Review", status: "completed" },
        { label: "Verdict", status: "failed" },
      ];
    } else {
      // Pending
      return [
        { label: "Submitted", status: "completed" },
        { label: "Level 1 Approval", status: "current" },
        { label: "Level 2 Approval", status: "pending" },
        { label: "Verdict", status: "pending" },
      ];
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <DashboardLayout pageTitle="Leave Request History">
      <VStack spacing={6} align="stretch" w="100%">
        {/* Back navigation */}
        <Button
          variant="ghost"
          leftIcon={<FiArrowLeft />}
          color="text-secondary"
          w="fit-content"
          onClick={() => navigate("/leaves")}
          _hover={{ bg: "hover-bg" }}
        >
          Back to Leaves
        </Button>

        {isLoading ? (
          <Flex minH="300px" justify="center" align="center">
            <Spinner size="lg" color="purple.500" />
          </Flex>
        ) : (
          <Flex direction={{ base: "column", xl: "row" }} gap={6} align="stretch">
            {/* Left Box: History Table */}
            <Box bg="card-bg" p={6} borderRadius="2xl" shadow="sm" borderWidth="1px" flex="1.5">
              <VStack align="stretch" spacing={4}>
                <Heading size="sm" color="text-primary">
                  Request Logs
                </Heading>
                {myRequests.length === 0 ? (
                  <Flex py={10} justify="center" align="center" direction="column" gap={2}>
                    <Icon as={FiInfo} color="text-muted" boxSize={8} />
                    <Text color="text-muted" fontSize="sm">
                      No leave requests found.
                    </Text>
                  </Flex>
                ) : (
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead bg="app-bg-secondary">
                        <Tr>
                          <Th color="text-muted" fontSize="10px">Leave Duration</Th>
                          <Th color="text-muted" fontSize="10px">Type</Th>
                          <Th color="text-muted" fontSize="10px">Reason</Th>
                          <Th color="text-muted" fontSize="10px">Status</Th>
                          <Th color="text-muted" fontSize="10px">Doc</Th>
                          <Th color="text-muted" fontSize="10px" textAlign="right">Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {myRequests.map((req) => {
                          const isSelected = selectedRequest?.id === req.id;
                          return (
                            <Tr 
                              key={req.id} 
                              bg={isSelected ? "purple.50" : "transparent"} 
                              _hover={{ bg: "hover-bg", cursor: "pointer" }}
                              onClick={() => setSelectedRequest(req)}
                            >
                              <Td py={3} fontWeight="600" color="text-secondary" fontSize="xs">
                                {formatDate(req.start_date)} – {formatDate(req.end_date)}
                              </Td>
                              <Td py={3} fontSize="xs">
                                <Badge colorScheme={req.type === "Sick" ? "red" : "blue"} variant="subtle" borderRadius="md" px={2} py={0.5}>
                                  {req.type}
                                </Badge>
                              </Td>
                              <Td py={3} color="text-secondary" fontSize="xs" maxW="200px" isTruncated>
                                {req.reason || "—"}
                              </Td>
                              <Td py={3}>
                                <Badge
                                  colorScheme={
                                    req.status === "Approved"
                                      ? "green"
                                      : req.status === "Rejected"
                                      ? "red"
                                      : "yellow"
                                  }
                                  px={2.5}
                                  py={0.5}
                                  borderRadius="md"
                                  fontSize="10px"
                                  fontWeight="bold"
                                >
                                  {req.status}
                                </Badge>
                              </Td>
                              <Td py={3}>
                                {req.document_url ? (
                                  <Link href={req.document_url} isExternal>
                                    <Icon as={FiPaperclip} color="purple.500" />
                                  </Link>
                                ) : (
                                  "—"
                                )}
                              </Td>
                              <Td py={3} textAlign="right">
                                <Button 
                                  size="xs" 
                                  colorScheme="purple" 
                                  variant={isSelected ? "solid" : "outline"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRequest(req);
                                  }}
                                >
                                  Track
                                </Button>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </VStack>
            </Box>

            {/* Right Box: Timeline Details Panel */}
            <Box bg="card-bg" p={6} borderRadius="2xl" shadow="sm" borderWidth="1px" flex="1">
              {selectedRequest ? (
                <VStack align="stretch" spacing={6}>
                  <Box pb={4} borderBottom="1px solid" borderColor="border-color">
                    <Text fontSize="xs" fontWeight="800" color="purple.500" letterSpacing="wider" mb={1}>
                      SELECTED REQUEST STATUS
                    </Text>
                    <Heading size="md" color="text-primary">
                      {selectedRequest.type} Leave
                    </Heading>
                    <Text fontSize="xs" color="text-muted" mt={1}>
                      Period: {formatDate(selectedRequest.start_date)} to {formatDate(selectedRequest.end_date)}
                    </Text>
                  </Box>

                  {/* Visual Timeline Stepper */}
                  <Box py={4}>
                    <Text fontSize="xs" fontWeight="bold" color="text-muted" mb={4}>
                      Approval Timeline
                    </Text>
                    <HStack spacing={0} justify="space-between" align="flex-start">
                      {getSteps(selectedRequest.status).map((step, idx, arr) => (
                        <StatusStep
                          key={idx}
                          label={step.label}
                          status={step.status}
                          isLast={idx === arr.length - 1}
                        />
                      ))}
                    </HStack>
                  </Box>

                  {/* Summary Block */}
                  <Card variant="unstyled" bg="app-bg-secondary" borderRadius="xl">
                    <CardBody p={4}>
                      <VStack align="stretch" spacing={3}>
                        <Box>
                          <Text fontSize="9px" fontWeight="800" color="text-muted" textTransform="uppercase">
                            Submission Date
                          </Text>
                          <Text fontSize="xs" fontWeight="700" color="text-secondary">
                            {selectedRequest.created_at ? formatDate(selectedRequest.created_at) : "—"}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="9px" fontWeight="800" color="text-muted" textTransform="uppercase">
                            Reason / Statement
                          </Text>
                          <Text fontSize="xs" color="text-secondary">
                            {selectedRequest.reason || "No statement provided."}
                          </Text>
                        </Box>
                        {selectedRequest.document_url && (
                          <Box>
                            <Text fontSize="9px" fontWeight="800" color="text-muted" textTransform="uppercase" mb={1}>
                              Supporting Evidence
                            </Text>
                            <Button
                              as={Link}
                              href={selectedRequest.document_url}
                              isExternal
                              size="xs"
                              colorScheme="purple"
                              leftIcon={<FiPaperclip />}
                              variant="outline"
                            >
                              Download Evidence Document
                            </Button>
                          </Box>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              ) : (
                <Flex h="full" minH="300px" justify="center" align="center" direction="column" gap={2}>
                  <Icon as={FiInfo} color="text-muted" boxSize={10} />
                  <Text color="text-muted" fontSize="sm" textAlign="center">
                    Select a request from the list to view its approval stepper timeline.
                  </Text>
                </Flex>
              )}
            </Box>
          </Flex>
        )}
      </VStack>
    </DashboardLayout>
  );
};

export default LeaveSubmitStatusPage;
