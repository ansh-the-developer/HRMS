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
  Badge,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeaveRequests, updateLeaveStatus } from "@/services/leaveApi";

function LeaveRequestListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [globalLoading, setGlobalLoading] = useState(false); // ← overlay flag

  const {
    data: leaveRequests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leave-requests"],
    queryFn: getLeaveRequests,
  });

  const approveMutation = useMutation({
    mutationFn: (id) => updateLeaveStatus(id, "Approved"),
    onMutate: () => setGlobalLoading(true),   // ← show overlay
    onSettled: () => setGlobalLoading(false), // ← hide overlay always
    onSuccess: () => {
      toast({
        title: "✅ Leave Approved",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      queryClient.invalidateQueries(["leave-requests"]);
    },
    onError: (error) => {
      toast({
        title: "❌ Failed to approve",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => updateLeaveStatus(id, "Rejected"),
    onMutate: () => setGlobalLoading(true),
    onSettled: () => setGlobalLoading(false),
    onSuccess: () => {
      toast({
        title: "🚫 Leave Rejected",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      queryClient.invalidateQueries(["leave-requests"]);
    },
    onError: (error) => {
      toast({
        title: "❌ Failed to reject",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Approve Leaves">
        <Box p={8} display="flex" alignItems="center" gap={3}>
          <Spinner size="sm" />
          <Text>Loading leave requests...</Text>
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Approve Leaves">
        <Box p={8}>
          <Text color="red.500">Error: {error.message}</Text>
        </Box>
      </DashboardLayout>
    );
  }

  if (!leaveRequests || leaveRequests.length === 0) {
    return (
      <DashboardLayout pageTitle="Approve Leaves">
        <Box p={8} textAlign="center" py={16}>
          <Text fontSize="lg" color="gray.500" mb={2}>
            No leave requests found
          </Text>
          <Text fontSize="sm" color="gray.400">
            All leave requests are up to date
          </Text>
        </Box>
      </DashboardLayout>
    );
  }

  // Map Supabase data → include reason
  const mapped = leaveRequests.map((r) => ({
    id: r.id,
    name: r.employees?.name ?? "Unknown",
    designation: r.employees?.designation ?? "-",
    location: r.employees?.department ?? "-",
    leaveOn: r.start_date,
    status: r.status,
    type: r.type,
    reason: r.reason ?? "-", // ← NEW
  }));

  const filtered = mapped.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Approve Leaves">
      {/* ← OVERLAY LOADER */}
      {globalLoading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(255,255,255,0.75)"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
          gap={3}
        >
          <Spinner size="xl" color="purple.500" thickness="4px" />
          <Text fontSize="md" fontWeight="medium" color="gray.600">
            Processing request...
          </Text>
        </Box>
      )}

      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        shadow="sm"
        borderWidth="1px"
        position="relative"
      >
        {/* Header row: title + search */}
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              Leave Requests ({filtered.length})
            </Text>
            <Text fontSize="sm" color="gray.500">
              Review and approve pending leave requests
            </Text>
          </Box>
          <Input
            placeholder="Search employees..."
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
          fontWeight="medium"
        >
          <Box flex="2">Employee</Box>
          <Box flex="1.5">Designation</Box>
          <Box flex="1.5">Department</Box>
          <Box flex="1.2">Leave Date</Box>
          <Box flex="2">Reason</Box>      {/* ← NEW */}
          <Box flex="1">Status</Box>
          <Box flex="1.5">Actions</Box>
        </Flex>

        {/* List */}
        <VStack align="stretch" spacing={0}>
          {filtered.map((req) => (
            <Flex
              key={req.id}
              px={4}
              py={3}
              align="center"
              fontSize="sm"
              _hover={{ bg: "gray.50" }}
              borderBottom="1px solid"
              borderColor="gray.100"
              opacity={globalLoading ? 0.5 : 1} // ← dim rows during load
              transition="opacity 0.2s"
            >
              {/* Employee */}
              <Box flex="2">
                <HStack spacing={3}>
                  <Avatar size="sm" name={req.name} />
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      {req.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {req.type} leave
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {/* Designation */}
              <Box flex="1.5">
                <Text fontSize="sm">{req.designation}</Text>
              </Box>

              {/* Department */}
              <Box flex="1.5">
                <Text fontSize="sm">{req.location}</Text>
              </Box>

              {/* Dates */}
              <Box flex="1.2">
                <Text fontSize="sm">{req.leaveOn}</Text>
              </Box>

              {/* Reason ← NEW */}
              <Box flex="2">
                <Text
                  fontSize="sm"
                  color="gray.600"
                  noOfLines={1}
                  title={req.reason} // full text on hover
                >
                  {req.reason}
                </Text>
              </Box>

              {/* Status Badge */}
              <Box flex="1">
                <Badge
                  colorScheme={
                    req.status === "Approved"
                      ? "green"
                      : req.status === "Pending"
                      ? "yellow"
                      : "red"
                  }
                  fontSize="xs"
                  px={2}
                  py={1}
                >
                  {req.status}
                </Badge>
              </Box>

              {/* Quick Actions */}
              <HStack flex="1.5" spacing={1}>
                <Button
                  size="xs"
                  colorScheme="green"
                  isDisabled={globalLoading} // ← disable during loading
                  onClick={(e) => {
                    e.stopPropagation();
                    approveMutation.mutate(req.id);
                  }}
                >
                  ✓ Approve
                </Button>
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="outline"
                  isDisabled={globalLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    rejectMutation.mutate(req.id);
                  }}
                >
                  ✗ Reject
                </Button>
              </HStack>
            </Flex>
          ))}
        </VStack>
      </Box>
    </DashboardLayout>
  );
}

export default LeaveRequestListPage;
