import React from "react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Circle,
  Divider,
} from "@chakra-ui/react";

// Custom Step Component
const StatusStep = ({ label, status, isLast }) => {
  // Status: 'completed', 'current', 'pending'
  
  let bg = "purple.50";
  let icon = null;
  let labelColor = "gray.400"; // Default pending text color

  if (status === "completed") {
    bg = "purple.100";
    labelColor = "purple.500";
    icon = (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#4A90E2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  } else if (status === "current") {
    bg = "purple.100"; // Active step background
    labelColor = "purple.500";
  } else {
    // pending
    bg = "gray.100"; // Gray circle for future steps
  }

  return (
    <Flex align="center" flex="1">
      <VStack spacing={4}>
        <Circle 
          size="60px" 
          bg={bg} 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          position="relative"
          zIndex={2}
        >
          {icon}
        </Circle>
        <Text fontSize="xs" fontWeight="medium" color={labelColor}>
          {label}
        </Text>
      </VStack>
      
      {/* Connector Line (if not last) */}
      {!isLast && (
        <Box 
          flex="1" 
          h="1px" 
          bg="gray.300" 
          mt="-24px" // Align line with circle center
          mx="-10px" // Slight overlap to connect seamlessly
          position="relative"
          zIndex={1}
        />
      )}
    </Flex>
  );
};

const LeaveSubmitStatusPage = () => {
  // Mock Data: Current status is 'Submitted'
  const steps = [
    { label: "Submitted", status: "completed" },
    { label: "Approval 01", status: "pending" },
    { label: "Approval 02", status: "pending" },
    { label: "Approval 03", status: "pending" },
    { label: "Approval 04", status: "pending" },
    { label: "Verdict", status: "pending" },
  ];

  return (
    <DashboardLayout pageTitle="Leave Approval Status">
      <Box 
        bg="white" 
        p={10} 
        borderRadius="xl" 
        shadow="sm" 
        borderWidth="1px" 
        minH="400px" // Give it height to look spacious like screenshot
      >
        <VStack align="stretch" spacing={2} mb={16}>
          <Text fontSize="lg" fontWeight="bold" color="gray.800">
            Leave Approval Status
          </Text>
          <Text fontSize="sm" color="gray.500">
            Check status of your leave request
          </Text>
        </VStack>

        {/* Timeline Container */}
        <Box px={4}>
          <HStack spacing={0} align="flex-start" w="full">
            {steps.map((step, index) => (
              <StatusStep
                key={index}
                label={step.label}
                status={step.status}
                isLast={index === steps.length - 1}
              />
            ))}
          </HStack>
        </Box>

      </Box>
    </DashboardLayout>
  );
};

export default LeaveSubmitStatusPage;
