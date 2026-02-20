import React, { useState } from "react";
import { useParams } from "react-router-dom";
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

const LeaveRequestActionPage = () => {
  const { id } = useParams();
  const [status, setStatus] = useState(null); // "approved" | "declined" | null
  const [notes, setNotes] = useState("");

  const rowBg = status === "approved" ? "#B7FF7A" : "white";

  return (
    <DashboardLayout pageTitle="Approve Leaves">
      <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
        {/* Header */}
        <VStack align="stretch" spacing={1} mb={6}>
          <Text fontSize="lg" fontWeight="bold">
            Leave Request Action
          </Text>
          <Text fontSize="sm" color="gray.500">
            Approve or decline the selected leave request
          </Text>
        </VStack>

        {/* Table header (Approve / Decline / Notes) */}
        <Flex px={4} py={2} fontSize="xs" color="gray.500">
          <Box flex="2">Employee Name</Box>
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
              <Avatar size="sm" name="Jaydeep" />
              <Text>Jaydeep</Text>
            </HStack>
          </Box>

          {/* Approve button */}
          <Box flex="1" textAlign="center">
            <HRMSButton
              size="sm"
              variant={status === "approved" ? "solid" : "outline"}
              colorScheme="green"
              onClick={() => setStatus("approved")}
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
              onClick={() => setStatus("declined")}
            >
              Decline
            </HRMSButton>
          </Box>

          {/* Notes input */}
          <Box flex="2">
            <Input
              size="sm"
              placeholder="Notes"
              bg="white"
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
