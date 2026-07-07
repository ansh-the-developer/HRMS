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
} from "@chakra-ui/react";
import { useRole } from "@/hooks/useRole";

const INITIAL_COMPLAINTS = [
  { id: 1, subject: "AC not working in block B", description: "The AC in Block B room 203 has been leaking and not cooling for 3 days.", date: "2026-07-06", status: "Active" },
  { id: 2, subject: "Delay in cafeteria lunch supply", description: "Food is regularly getting delayed beyond 1:30 PM causing schedules to slip.", date: "2026-07-07", status: "Active" },
];

export function ComplaintCenterPage() {
  const { isHR, isManager } = useRole();
  const toast = useToast();
  const isAdmin = isHR || isManager;

  // Employee State
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [generatedCaseId, setGeneratedCaseId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin State
  const [activeComplaints, setActiveComplaints] = useState(INITIAL_COMPLAINTS);
  const [archivedComplaints, setArchivedComplaints] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !description) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const caseId = "CASE-" + Math.floor(100000 + Math.random() * 900000);
      setGeneratedCaseId(caseId);
      setIsSubmitting(false);
      setSubject("");
      setDescription("");

      toast({
        title: "Complaint Submitted",
        description: `Anonymous complaint recorded under ID: ${caseId}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Clear case ID after 8 seconds (displays momentarily)
      setTimeout(() => {
        setGeneratedCaseId(null);
      }, 8000);
    }, 800);
  };

  const handleDismiss = (id) => {
    setActiveComplaints((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: "Complaint Dismissed",
      description: "Complaint was deleted instantly.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleResolve = (id) => {
    const target = activeComplaints.find((c) => c.id === id);
    if (!target) return;

    setActiveComplaints((prev) => prev.filter((c) => c.id !== id));
    setArchivedComplaints((prev) => [...prev, { ...target, status: "Resolved", resolvedAt: new Date().toLocaleDateString() }]);

    toast({
      title: "Complaint Resolved",
      description: "Complaint has been archived.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEmptyArchive = () => {
    setArchivedComplaints([]);
    toast({
      title: "Archive Cleared",
      description: "All resolved complaints deleted from archive.",
      status: "warning",
      duration: 2000,
      isClosable: true,
    });
  };

  if (!isAdmin) {
    // Employee View: Anonymous Complaint Submission
    return (
      <DashboardLayout pageTitle="Complaint Center">
        <Box maxW="560px" mx="auto" mt={8} bg="white" p={8} borderRadius="2xl" borderWidth="1px" borderColor="#E2E8F0" shadow="sm">
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="#0F172A">
                Submit Anonymous Complaint
              </Text>
              <Text fontSize="sm" color="#64748B" mt={1}>
                Submit feedback or complaints securely. Your identity remains strictly anonymous.
              </Text>
            </Box>

            {generatedCaseId && (
              <Box p={4} bg="purple.50" borderLeftWidth="4px" borderColor="#7152F3" borderRadius="lg">
                <Text fontSize="xs" fontWeight="semibold" color="#7152F3">
                  SAVE YOUR CASE ID FOR REFERENCE (DISAPPEARS IN 8 SECONDS)
                </Text>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="md" fontWeight="bold" color="#0F172A">
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
                  <FormLabel fontSize="sm" fontWeight="bold" color="#334155">
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
                  <FormLabel fontSize="sm" fontWeight="bold" color="#334155">
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
                  isLoading={isSubmitting}
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
      </DashboardLayout>
    );
  }

  // Admin/HR/Manager View: Complaints Dashboard & Archive
  return (
    <DashboardLayout pageTitle="Complaint Center">
      <Box p={2}>
        <Box mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color="#1E293B">
            Complaint Center
          </Text>
          <Text fontSize="sm" color="#64748B" fontStyle="italic">
            Manage anonymously submitted feedback and complaints
          </Text>
        </Box>

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
                  <Text color="#64748B">No active complaints found.</Text>
                </Box>
              ) : (
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>DATE</Th>
                      <Th>SUBJECT</Th>
                      <Th>DESCRIPTION</Th>
                      <Th textAlign="center">ACTIONS</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {activeComplaints.map((c) => (
                      <Tr key={c.id}>
                        <Td py={4} whiteSpace="nowrap" fontSize="xs" color="#64748B">{c.date}</Td>
                        <Td py={4} fontWeight="semibold" fontSize="sm" color="#0F172A">{c.subject}</Td>
                        <Td py={4} fontSize="xs" color="#334155" maxW="400px">{c.description}</Td>
                        <Td py={4} textAlign="center">
                          <HStack justify="center" spacing={2}>
                            <Button size="xs" colorScheme="green" onClick={() => handleResolve(c.id)}>Resolve (Archive)</Button>
                            <Button size="xs" colorScheme="red" variant="outline" onClick={() => handleDismiss(c.id)}>Dismiss (Delete)</Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>

            {/* Archived Complaints */}
            <TabPanel p={0}>
              <Flex justify="flex-end" mb={4}>
                {archivedComplaints.length > 0 && (
                  <Button size="sm" colorScheme="red" onClick={handleEmptyArchive}>
                    Empty Complaints Archive
                  </Button>
                )}
              </Flex>
              {archivedComplaints.length === 0 ? (
                <Box py={8} textAlign="center">
                  <Text color="#64748B">Archive is empty.</Text>
                </Box>
              ) : (
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>DATE</Th>
                      <Th>SUBJECT</Th>
                      <Th>DESCRIPTION</Th>
                      <Th>RESOLVED AT</Th>
                      <Th>STATUS</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {archivedComplaints.map((c) => (
                      <Tr key={c.id}>
                        <Td py={4} whiteSpace="nowrap" fontSize="xs" color="#64748B">{c.date}</Td>
                        <Td py={4} fontWeight="semibold" fontSize="sm" color="#0F172A">{c.subject}</Td>
                        <Td py={4} fontSize="xs" color="#334155" maxW="400px">{c.description}</Td>
                        <Td py={4} fontSize="xs" color="#64748B">{c.resolvedAt}</Td>
                        <Td py={4}>
                          <Badge colorScheme="green" px={2} py={0.5} borderRadius="full">RESOLVED</Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </DashboardLayout>
  );
}

export default ComplaintCenterPage;
