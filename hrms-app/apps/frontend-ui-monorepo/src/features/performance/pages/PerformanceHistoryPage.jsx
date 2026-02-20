import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import { Box, VStack, Text, Flex } from "@chakra-ui/react";

const mockHistory = [
  { id: "q1-2025", label: "Performance Review Q1 2025" },
  { id: "q4-2024", label: "Performance Review Q4 2024" },
  { id: "q3-2024", label: "Performance Review Q3 2024" },
  { id: "q2-2024", label: "Performance Review Q2 2024" },
  { id: "q1-2024", label: "Performance Review Q1 2024" },
];

const PerformanceHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout pageTitle="Performance">
      <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
        <VStack align="stretch" spacing={4}>
          <Text fontSize="lg" fontWeight="bold">
            Performance history
          </Text>

          {mockHistory.map((item) => (
            <Flex
              key={item.id}
              fontSize="md"
              color="gray.800"
              py={1}
              cursor="pointer"
              _hover={{ color: "blue.500" }}
              onClick={() => navigate(`/performance/review/${item.id}`)}
            >
              {item.label}
            </Flex>
          ))}
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default PerformanceHistoryPage;
