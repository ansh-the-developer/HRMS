import React, { useState } from "react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import {
  Box,
  Flex,
  Text,
  Avatar,
  VStack,
  HStack,
  Input,
} from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useNavigate } from "react-router-dom";

const mockRequests = [
  {
    id: "1",
    name: "Jaydeep",
    designation: "HR Executive",
    location: "Gurugram",
    leaveOn: "22 July",
  },
];

const LeaveRequestListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = mockRequests.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Approve Leaves">
      <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
        {/* Header row: title + search */}
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              Leave Requests
            </Text>
            <Text fontSize="sm" color="gray.500">
              Review and approve pending leave requests
            </Text>
          </Box>
          <Input
            placeholder="Search"
            maxW="240px"
            size="sm"
            bg="gray.50"
            border="none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Flex>

        {/* Table header */}
        <Flex
          px={4}
          py={2}
          fontSize="xs"
          color="gray.500"
          borderBottomWidth="1px"
        >
          <Box flex="2">Employee Name</Box>
          <Box flex="2">Designation</Box>
          <Box flex="2">Location</Box>
          <Box flex="1">Leave on</Box>
        </Flex>

        {/* Single-row list – click opens action page */}
        <VStack align="stretch" spacing={0}>
          {filtered.map((req) => (
            <Flex
              key={req.id}
              px={4}
              py={3}
              align="center"
              fontSize="sm"
              _hover={{ bg: "gray.50", cursor: "pointer" }}
              onClick={() => navigate(`/leaves/requests/${req.id}`)}
            >
              <Box flex="2">
                <HStack spacing={3}>
                  <Avatar size="sm" name={req.name} />
                  <Text>{req.name}</Text>
                </HStack>
              </Box>
              <Box flex="2">
                <Text>{req.designation}</Text>
              </Box>
              <Box flex="2">
                <Text>{req.location}</Text>
              </Box>
              <Box flex="1">
                <Text>{req.leaveOn}</Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default LeaveRequestListPage;
