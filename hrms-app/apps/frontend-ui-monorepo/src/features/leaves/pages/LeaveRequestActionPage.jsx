import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import {
  Box,
  Flex,
  Text,
  Avatar,
  VStack,
  HStack,
  Input,
  useToast,
} from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeaveRequestById,
  updateLeaveStatus,
} from "@/services/leaveApi";

const LeaveRequestActionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast(); // ← ADD TOAST

  const [status, setStatus] = useState(null); // "approved" | "declined" | null
  const [notes, setNotes] = useState("");

  // 1) Fetch this single leave request
  const {
    data: leaveRequest,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leave-request", id],
    queryFn: () => getLeaveRequestById(id),
  });

  // 2) Mutations for approve / decline WITH TOASTS
  const approveMutation = useMutation({
    mutationFn: () => updateLeaveStatus(id, "Approved"),
    onSuccess: () => {
      toast({
        title: "✅ Leave Approved",
        description: `${leaveRequest?.employees?.name ?? "Employee"}'s leave approved.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      queryClient.invalidateQueries(["leave-requests"]);
      navigate("/leaves/requests");
    },
    onError: (error) => {
      toast({
        title: "❌ Error",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  const declineMutation = useMutation({
    mutationFn: () => updateLeaveStatus(id, "Rejected"),
    onSuccess: () => {
      toast({
        title: "❌ Leave Rejected",
        description: `${leaveRequest?.employees?.name ?? "Employee"}'s leave rejected.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      queryClient.invalidateQueries(["leave-requests"]);
      navigate("/leaves/requests");
    },
    onError: (error) => {
      toast({
        title: "❌ Error",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Approve Leaves">
        <Box p={8} textAlign="center">
          <Text>Loading leave request...</Text>
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Approve Leaves">
        <Box p={8} textAlign="center">
          <Text color="red.500">Error: {error.message}</Text>
        </Box>
      </DashboardLayout>
    );
  }

  if (!leaveRequest) {
    return (
      <DashboardLayout pageTitle="Approve Leaves">
        <Box p={8} textAlign="center">
          <Text color="text-muted">Leave request not found.</Text>
        </Box>
      </DashboardLayout>
    );
  }

  const employeeName = leaveRequest.employees?.name ?? "Unknown";
  const rowBg = status === "approved" ? "#B7FF7A" : "white";

  return (
    <DashboardLayout pageTitle="Approve Leaves">
      <Box bg="card-bg" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
        {/* Header */}
        <VStack align="stretch" spacing={1} mb={6}>
          <Text fontSize="lg" fontWeight="bold">
            {leaveRequest.type} Leave Request
          </Text>
          <Text fontSize="sm" color="text-muted">
            {leaveRequest.start_date} to {leaveRequest.end_date} •{" "}
            {employeeName}
          </Text>
        </VStack>

        {/* Table header */}
        <Flex px={4} py={2} fontSize="xs" color="text-muted">
          <Box flex="2">Employee Details</Box>
          <Box flex="1" textAlign="center">
            Approve
          </Box>
          <Box flex="1" textAlign="center">
            Decline
          </Box>
          <Box flex="2">Notes</Box>
        </Flex>

        {/* Action row */}
        <Flex
          px={4}
          py={3}
          align="center"
          fontSize="sm"
          bg={rowBg}
          borderRadius="md"
        >
          {/* Employee cell */}
          <Box flex="2">
            <HStack spacing={3}>
              <Avatar size="sm" name={employeeName} />
              <VStack align="flex-start" spacing={0}>
                <Text fontSize="sm" fontWeight="medium">
                  {employeeName}
                </Text>
                <Text fontSize="xs" color="text-muted">
                  {leaveRequest.type} — {leaveRequest.start_date} to{" "}
                  {leaveRequest.end_date}
                </Text>
                <Text fontSize="xs" color="text-muted">
                  {leaveRequest.reason || "No reason provided"}
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Approve button */}
          <Box flex="1" textAlign="center">
            <HRMSButton
              size="sm"
              variant={status === "approved" ? "solid" : "outline"}
              colorScheme="green"
              isLoading={approveMutation.isPending}
              onClick={() => {
                setStatus("approved");
                approveMutation.mutate();
              }}
            >
              Approve
            </HRMSButton>
          </Box>

          {/* Decline button */}
          <Box flex="1" textAlign="center">
            <HRMSButton
              size="sm"
              variant={status === "declined" ? "solid" : "outline"}
              colorScheme="red"
              isLoading={declineMutation.isPending}
              onClick={() => {
                setStatus("declined");
                declineMutation.mutate();
              }}
            >
              Decline
            </HRMSButton>
          </Box>

          {/* Notes input */}
          <Box flex="2">
            <Input
              size="sm"
              placeholder="Optional notes..."
              bg="card-bg"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        </Flex>
      </Box>
    </DashboardLayout>
  );
};

export default LeaveRequestActionPage;
