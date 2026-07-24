import React, { useState } from "react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Input,
} from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

const initialApprovers = ["Rahul", "Aman", "Taein", "Kwanjin"];

const LeaveRulesApprovalFlowPage = () => {
  const [approvers, setApprovers] = useState(initialApprovers);
  const [newApprover, setNewApprover] = useState("");

  const handleAdd = () => {
    const trimmed = newApprover.trim();
    if (!trimmed) return;
    setApprovers((prev) => [...prev, trimmed]);
    setNewApprover("");
  };

  const handleDelete = (name) => {
    setApprovers((prev) => prev.filter((a) => a !== name));
  };

  return (
    <DashboardLayout pageTitle="Leave Rules - Approval Flow">
      <Flex
        bg="transparent"
        align="flex-start"
        justify="space-between"
        gap={10}
        flexWrap="wrap"
      >
        {/* Left: Add Approver */}
        <Box
          bg="card-bg"
          p={8}
          borderRadius="xl"
          shadow="sm"
          borderWidth="1px"
          flex="1"
          minW="260px"
        >
          <VStack align="stretch" spacing={4}>
            <Text fontSize="sm" fontWeight="semibold">
              Add Approver
            </Text>
            <Input
              placeholder="Name of Approver"
              bg="app-bg-secondary"
              border="none"
              size="sm"
              value={newApprover}
              onChange={(e) => setNewApprover(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <HRMSButton
              size="sm"
              colorScheme="blue"
              alignSelf="flex-start"
              bgGradient="linear(to-r, #4A90E2, #B0B0B0)"
              _hover={{ opacity: 0.95 }}
              onClick={handleAdd}
            >
              Add
            </HRMSButton>
          </VStack>
        </Box>

        {/* Right: Approver List */}
        <Box
          bg="card-bg"
          p={4}
          borderRadius="xl"
          shadow="sm"
          borderWidth="1px"
          flex="1"
          minW="260px"
          maxW="320px"
        >
          <VStack align="stretch" spacing={0}>
            {approvers.map((name, index) => (
              <Flex
                key={name + index}
                align="center"
                justify="space-between"
                py={3}
                px={4}
                borderBottomWidth={index === approvers.length - 1 ? "0" : "1px"}
                borderColor="border-color"
              >
                <Text fontSize="sm" color="text-primary">
                  {name}
                </Text>
                <HStack spacing={4}>
                  {/* Eye icon placeholder */}
                  <Box
                    as="button"
                    fontSize="sm"
                    color="text-muted"
                    _hover={{ color: "text-primary" }}
                  >
                    👁
                  </Box>
                  {/* Trash icon placeholder */}
                  <Box
                    as="button"
                    fontSize="sm"
                    color="text-muted"
                    _hover={{ color: "red.500" }}
                    onClick={() => handleDelete(name)}
                  >
                    🗑
                  </Box>
                </HStack>
              </Flex>
            ))}
          </VStack>
        </Box>
      </Flex>
    </DashboardLayout>
  );
};

export default LeaveRulesApprovalFlowPage;
