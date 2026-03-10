import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import { Box, VStack, Text, Flex, Spinner, Badge } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getPerformanceReviews } from "@/services/performanceApi";

const PerformanceHistoryPage = () => {
  const navigate = useNavigate();

  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["performance-reviews"],
    queryFn: getPerformanceReviews,
  });

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Performance">
        <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
          <Flex justify="center" py={12}>
            <Spinner size="lg" />
          </Flex>
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Performance">
        <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
          <Text color="red.500">Error loading reviews: {error.message}</Text>
        </Box>
      </DashboardLayout>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <DashboardLayout pageTitle="Performance">
        <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
          <VStack spacing={4} py={12}>
            <Text fontSize="lg" color="gray.500">
              No performance reviews yet
            </Text>
            <Text fontSize="sm" color="gray.400">
              Reviews will appear here once created
            </Text>
          </VStack>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Performance">
      <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
        <VStack align="stretch" spacing={4}>
          <Text fontSize="lg" fontWeight="bold">
            Performance history ({reviews.length})
          </Text>

          {reviews.map((review) => (
            <Flex
              key={review.id}
              fontSize="md"
              color="gray.800"
              py={3}
              px={4}
              bg="gray.50"
              borderRadius="md"
              cursor="pointer"
              _hover={{ bg: "blue.50", color: "blue.600" }}
              transition="all 0.2s"
              align="center"
              justify="space-between"
              onClick={() => navigate(`/performance/review/${review.id}`)}
            >
              <Box>
                <Text fontWeight="medium">
                  {review.employees?.name ?? "Unknown"} — {review.period}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {review.status} • {review.created_at.split("T")[0]}
                </Text>
              </Box>
              <Badge
                colorScheme={
                  review.status === "Completed"
                    ? "green"
                    : review.status === "Submitted"
                    ? "yellow"
                    : "gray"
                }
              >
                {review.status}
              </Badge>
            </Flex>
          ))}
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default PerformanceHistoryPage;
