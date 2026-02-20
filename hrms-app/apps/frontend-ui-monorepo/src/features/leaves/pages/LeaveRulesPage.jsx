import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

const LeaveRulesPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout pageTitle="Leave Rules">
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        shadow="sm"
        borderWidth="1px"
        maxW="420px"
      >
        <VStack align="stretch" spacing={0}>
          {/* Notice Period row */}
          <Flex
            align="center"
            justify="space-between"
            py={4}
            px={4}
            borderBottomWidth="1px"
            borderColor="gray.100"
          >
            <Text fontSize="sm" fontWeight="medium">
              Notice Period
            </Text>
            <Box
              as="button"
              fontSize="xs"
              color="gray.500"
              _hover={{ color: "gray.700" }}
            >
              ✎
            </Box>
          </Flex>

          {/* Approval Flow row */}
          <Flex
            align="center"
            justify="space-between"
            py={4}
            px={4}
            borderBottomWidth="1px"
            borderColor="gray.100"
          >
            <Text fontSize="sm" fontWeight="medium">
              Approval Flow
            </Text>
            <Box
              as="button"
              fontSize="xs"
              color="gray.500"
              _hover={{ color: "gray.700" }}
              onClick={() => navigate("/leaves/rules/approval-flow")}
            >
              ✎
            </Box>
          </Flex>

          {/* New Rule row */}
          <Flex align="center" justify="space-between" py={4} px={4}>
            <Text fontSize="sm" fontWeight="medium">
              New Rule
            </Text>
            <HRMSButton
              size="sm"
              colorScheme="blue"
              bgGradient="linear(to-r, #4A90E2, #B0B0B0)"
              _hover={{ opacity: 0.95 }}
            >
              Add
            </HRMSButton>
          </Flex>
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default LeaveRulesPage;
