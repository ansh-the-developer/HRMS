import React, { useState } from "react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Textarea,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Flex,
  Divider,
  Spinner,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { useRole } from "@/hooks/useRole";
import {
  useComplaintsList,
  useComplaint,
  useCreateComplaint,
  useUpdateComplaintStatus,
} from "@/hooks/useComplaints";
import { FiSearch, FiInfo, FiClipboard, FiCheckCircle } from "react-icons/fi";

export function ComplaintCenterPage() {
  const { isHR, isManager } = useRole();
  const toast = useToast();
  const isAdmin = isHR || isManager;

  // Employee State
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [generatedCaseId, setGeneratedCaseId] = useState(null);
  
  // Tracker State
  const [trackCaseId, setTrackCaseId] = useState("");
  const [submittedTrackId, setSubmittedTrackId] = useState(null);

  // Queries & Mutations
  const { data: complaintsList, isLoading: loadingList } = useComplaintsList(isAdmin);
  const { data: trackedComplaint, isLoading: loadingTrack } = useComplaint(submittedTrackId);
  const createMutation = useCreateComplaint();
  const updateStatusMutation = useUpdateComplaintStatus();

  // Active & Archived lists from DB
  const activeComplaints = complaintsList?.filter((c) => c.status === "Active") || [];
  const archivedComplaints = complaintsList?.filter((c) => c.status === "Resolved" || c.status === "Dismissed") || [];

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !description || submitting) return;

    try {
      setSubmitting(true);
      const caseId = "CASE-" + Math.floor(100000 + Math.random() * 900000);
      await createMutation.mutateAsync({
        case_id: caseId,
        subject,
        description,
        status: "Active",
      });

      setGeneratedCaseId(caseId);
      setSubject("");
      setDescription("");

      toast({
        title: "Complaint Submitted",
        description: `Anonymous complaint recorded under ID: ${caseId}`,
        status: "success",
        duration: 8000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Complaint Center Submit Error details:", err);
      toast({
        title: "Submission Failed",
        description: err.message || "Conflict occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: "Resolved" });
      toast({
        title: "Complaint Resolved",
        description: "Complaint has been archived.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Action Failed",
        description: err.message,
        status: "error",
      });
    }
  };

  const handleDismiss = async (id) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: "Dismissed" });
      toast({
        title: "Complaint Dismissed",
        description: "Complaint was deleted from active dashboard.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Action Failed",
        description: err.message,
        status: "error",
      });
    }
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackCaseId.trim()) return;
    setSubmittedTrackId(trackCaseId.trim());
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (!isAdmin) {
    // Employee View: Anonymous Submission & Tracker Search
    return (
      <DashboardLayout pageTitle="Complaint Center">
        <Flex direction={{ base: "column", lg: "row" }} gap={8} mt={6} align="stretch">
          
          {/* Submission Form */}
          <Box flex="1" bg="white" p={8} borderRadius="2xl" borderWidth="1px" borderColor="#E2E8F0" shadow="sm">
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" color="#0F172A">
                  Submit Anonymous Complaint
                </Heading>
                <Text fontSize="xs" color="#64748B" mt={1}>
                  Submit feedback or complaints securely. Your identity remains strictly anonymous.
                </Text>
              </Box>

              {generatedCaseId && (
                <Box p={4} bg="purple.50" borderLeftWidth="4px" borderColor="#7152F3" borderRadius="lg">
                  <Text fontSize="10px" fontWeight="semibold" color="#7152F3">
                    SAVE YOUR CASE ID FOR REFERENCE (STAYS VISIBLE HERE)
                  </Text>
                  <HStack justify="space-between" mt={1}>
                    <Text fontSize="sm" fontWeight="bold" color="#0F172A">
                      {generatedCaseId}
                    </Text>
                    <Button
                      size="xs"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCaseId);
                        toast({ title: "Copied!", status: "success", duration: 1000 });
                      }}
                    >
                      Copy
                    </Button>
                  </HStack>
                </Box>
              )}

              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel fontSize="xs" fontWeight="bold" color="#334155">
                      Subject
                    </FormLabel>
                    <Input
                      placeholder="Brief summary of the issue..."
                      borderRadius="xl"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="xs" fontWeight="bold" color="#334155">
                      Description
                    </FormLabel>
                    <Textarea
                      placeholder="Provide details of the problem..."
                      borderRadius="xl"
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    isLoading={createMutation.isPending || submitting}
                    bg="#7152F3"
                    color="white"
                    borderRadius="xl"
                    h="44px"
                    fontWeight="bold"
                    _hover={{ bg: "#5F33E1" }}
                    w="full"
                  >
                    Submit Complaint
                  </Button>
                </VStack>
              </form>
            </VStack>
          </Box>

          {/* Search & Track Section */}
          <Box flex="1" bg="white" p={8} borderRadius="2xl" borderWidth="1px" borderColor="#E2E8F0" shadow="sm">
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" color="#0F172A">
                  Track Complaint Status
                </Heading>
                <Text fontSize="xs" color="#64748B" mt={1}>
                  Enter your CASE-XXXXXX code to check review progress.
                </Text>
              </Box>

              <form onSubmit={handleTrackSubmit}>
                <HStack>
                  <Input
                    placeholder="CASE-XXXXXX"
                    value={trackCaseId}
                    onChange={(e) => setTrackCaseId(e.target.value)}
                    borderRadius="xl"
                  />
                  <Button
                    type="submit"
                    bg="purple.500"
                    color="white"
                    _hover={{ bg: "purple.600" }}
                    borderRadius="xl"
                    leftIcon={<FiSearch />}
                  >
                    Track
                  </Button>
                </HStack>
              </form>

              {loadingTrack && (
                <Flex justify="center" py={6}>
                  <Spinner color="purple.500" />
                </Flex>
              )}

              {submittedTrackId && !loadingTrack && (
                <Box>
                  {trackedComplaint ? (
                    <Box p={5} bg="gray.50" borderRadius="2xl" border="1px solid" borderColor="gray.100">
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <Badge colorScheme="purple">{trackedComplaint.case_id}</Badge>
                          <Badge
                            colorScheme={
                              trackedComplaint.status === "Resolved"
                                ? "green"
                                : trackedComplaint.status === "Dismissed"
                                ? "red"
                                : "yellow"
                            }
                          >
                            {trackedComplaint.status}
                          </Badge>
                        </HStack>
                        <Box>
                          <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase">
                            Subject
                          </Text>
                          <Text fontSize="sm" fontWeight="800" color="gray.800">
                            {trackedComplaint.subject}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase">
                            Details
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {trackedComplaint.description}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase">
                            Created On
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {formatDate(trackedComplaint.created_at)}
                          </Text>
                        </Box>
                        {trackedComplaint.resolved_at && (
                          <Box>
                            <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase">
                              Resolved On
                            </Text>
                            <Text fontSize="xs" color="green.600" fontWeight="bold">
                              {formatDate(trackedComplaint.resolved_at)}
                            </Text>
                          </Box>
                        )}
                      </VStack>
                    </Box>
                  ) : (
                    <Flex py={6} justify="center" align="center" direction="column" gap={2}>
                      <Icon as={FiInfo} color="red.300" boxSize={6} />
                      <Text color="red.500" fontSize="xs" fontWeight="600">
                        No complaint record found for ID: {submittedTrackId}
                      </Text>
                    </Flex>
                  )}
                </Box>
              )}
            </VStack>
          </Box>
        </Flex>
      </DashboardLayout>
    );
  }

  // Admin/HR/Manager View: Complaints Dashboard & Archive
  return (
    <DashboardLayout pageTitle="Complaint Center">
      <Box p={2}>
        <Box mb={6}>
          <Heading size="lg" color="#1E293B">
            Complaint Center
          </Heading>
          <Text fontSize="xs" color="#64748B" mt={1}>
            Manage anonymously submitted feedback and complaints from employees
          </Text>
        </Box>

        {loadingList ? (
          <Flex minH="200px" justify="center" align="center">
            <Spinner color="purple.500" size="lg" />
          </Flex>
        ) : (
          <Tabs variant="enclosed" colorScheme="purple">
            <TabList>
              <Tab fontWeight="semibold">Active ({activeComplaints.length})</Tab>
              <Tab fontWeight="semibold">Archive ({archivedComplaints.length})</Tab>
            </TabList>

            <TabPanels bg="white" borderBottomRadius="2xl" borderLeftWidth="1px" borderRightWidth="1px" borderBottomWidth="1px" borderColor="#E2E8F0" p={6}>
              {/* Active Complaints */}
              <TabPanel p={0}>
                {activeComplaints.length === 0 ? (
                  <Box py={8} textAlign="center">
                    <Text color="#64748B" fontSize="sm">No active complaints found.</Text>
                  </Box>
                ) : (
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th color="gray.500" fontSize="10px">CASE ID</Th>
                          <Th color="gray.500" fontSize="10px">DATE</Th>
                          <Th color="gray.500" fontSize="10px">SUBJECT</Th>
                          <Th color="gray.500" fontSize="10px">DESCRIPTION</Th>
                          <Th color="gray.500" fontSize="10px" textAlign="center">ACTIONS</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {activeComplaints.map((c) => (
                          <Tr key={c.id}>
                            <Td py={4} whiteSpace="nowrap" fontSize="xs">
                              <Badge colorScheme="purple">{c.case_id}</Badge>
                            </Td>
                            <Td py={4} whiteSpace="nowrap" fontSize="xs" color="#64748B">
                              {formatDate(c.created_at)}
                            </Td>
                            <Td py={4} fontWeight="semibold" fontSize="xs" color="#0F172A">
                              {c.subject}
                            </Td>
                            <Td py={4} fontSize="xs" color="#334155" maxW="400px" whiteSpace="normal">
                              {c.description}
                            </Td>
                            <Td py={4} textAlign="center">
                              <HStack justify="center" spacing={2}>
                                <Button size="xs" colorScheme="green" onClick={() => handleResolve(c.id)}>
                                  Resolve (Archive)
                                </Button>
                                <Button size="xs" colorScheme="red" variant="outline" onClick={() => handleDismiss(c.id)}>
                                  Dismiss
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </TabPanel>

              {/* Archived Complaints */}
              <TabPanel p={0}>
                {archivedComplaints.length === 0 ? (
                  <Box py={8} textAlign="center">
                    <Text color="#64748B" fontSize="sm">Archive is empty.</Text>
                  </Box>
                ) : (
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th color="gray.500" fontSize="10px">CASE ID</Th>
                          <Th color="gray.500" fontSize="10px">DATE</Th>
                          <Th color="gray.500" fontSize="10px">SUBJECT</Th>
                          <Th color="gray.500" fontSize="10px">DESCRIPTION</Th>
                          <Th color="gray.500" fontSize="10px">RESOLVED AT</Th>
                          <Th color="gray.500" fontSize="10px">STATUS</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {archivedComplaints.map((c) => (
                          <Tr key={c.id}>
                            <Td py={4} whiteSpace="nowrap" fontSize="xs">
                              <Badge colorScheme="gray">{c.case_id}</Badge>
                            </Td>
                            <Td py={4} whiteSpace="nowrap" fontSize="xs" color="#64748B">
                              {formatDate(c.created_at)}
                            </Td>
                            <Td py={4} fontWeight="semibold" fontSize="xs" color="#0F172A">
                              {c.subject}
                            </Td>
                            <Td py={4} fontSize="xs" color="#334155" maxW="400px" whiteSpace="normal">
                              {c.description}
                            </Td>
                            <Td py={4} fontSize="xs" color="#64748B">
                              {formatDate(c.resolved_at)}
                            </Td>
                            <Td py={4}>
                              <Badge colorScheme={c.status === "Resolved" ? "green" : "red"} px={2} py={0.5} borderRadius="full">
                                {c.status}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default ComplaintCenterPage;
