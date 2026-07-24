import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import { Box, Flex, Text, VStack, Grid, Spinner, Badge } from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useQuery } from "@tanstack/react-query";
import { getPerformanceReviewById } from "@/services/performanceApi";

const PerformanceReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: review,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["performance-review", id],
    queryFn: () => getPerformanceReviewById(id),
  });

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Performance">
        <Box bg="card-bg" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
          <Flex justify="center" py={16}>
            <Spinner size="lg" />
          </Flex>
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Performance">
        <Box bg="card-bg" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
          <Text color="red.500" textAlign="center" py={12}>
            Error loading review: {error.message}
          </Text>
        </Box>
      </DashboardLayout>
    );
  }

  if (!review) {
    return (
      <DashboardLayout pageTitle="Performance">
        <Box bg="card-bg" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
          <Text color="text-muted" textAlign="center" py={12}>
            Performance review not found
          </Text>
        </Box>
      </DashboardLayout>
    );
  }

  // Map Supabase data to UI shape
  const reviewData = {
    title: `${review.employees?.name ?? "Employee"} — ${review.period}`,
    knowledge: [
      {
        criteria: "Shows ability to learn and apply new skills",
        rating: getRatingText(review.knowledge_score),
      },
      {
        criteria: "Displays understanding of roles and responsibilities",
        rating: getRatingText(review.knowledge_score),
      },
    ],
    quality: [
      {
        criteria: "Looks for ways to improve quality",
        rating: getRatingText(review.quality_score),
      },
      {
        criteria: "Meets required deadlines",
        rating: getRatingText(review.quality_score),
      },
    ],
    comments: review.comments || "No comments provided.",
  };

  // Helper to convert score to text
  function getRatingText(score) {
    if (score >= 4) return "Exceeds expectations";
    if (score === 3) return "Meets expectations";
    return "Needs development";
  }

  return (
    <DashboardLayout pageTitle="Performance">
      <Box bg="card-bg" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
        <VStack align="stretch" spacing={6}>
          <Text fontSize="lg" fontWeight="bold">
            {reviewData.title}
          </Text>

          {/* Employee info */}
          <Box p={4} bg="app-bg-secondary" borderRadius="md">
            <Text fontSize="sm" color="text-secondary" mb={1}>
              Employee: {review.employees?.name}
            </Text>
            <Text fontSize="sm" color="text-muted">
              {review.employees?.department} • {review.employees?.designation}
            </Text>
            <Text fontSize="xs" color="text-muted">
              Review Period: {review.period} • Status: {review.status}
            </Text>
          </Box>

          {/* Knowledge of job skills */}
          <Box borderRadius="md" overflow="hidden">
            <Box bg="#F5A623" color="white" px={4} py={2} fontWeight="semibold">
              Knowledge of job skills
            </Box>
            <Grid templateColumns="2fr 1fr" bg="app-bg-secondary">
              {reviewData.knowledge.map((row, i) => (
                <React.Fragment key={i}>
                  <Box
                    px={4}
                    py={3}
                    borderBottomWidth={i < reviewData.knowledge.length - 1 ? "1px" : "0"}
                    borderColor="border-color"
                  >
                    {row.criteria}
                  </Box>
                  <Box
                    px={4}
                    py={3}
                    borderBottomWidth={i < reviewData.knowledge.length - 1 ? "1px" : "0"}
                    borderColor="border-color"
                  >
                    <Badge
                      colorScheme={
                        row.rating.includes("Exceeds") ? "green" :
                        row.rating.includes("Meets") ? "blue" :
                        "orange"
                      }
                    >
                      {row.rating}
                    </Badge>
                  </Box>
                </React.Fragment>
              ))}
            </Grid>
          </Box>

          {/* Quality / quantity of work */}
          <Box borderRadius="md" overflow="hidden">
            <Box bg="#7ED321" color="white" px={4} py={2} fontWeight="semibold">
              Quality/quantity of work
            </Box>
            <Grid templateColumns="2fr 1fr" bg="app-bg-secondary">
              {reviewData.quality.map((row, i) => (
                <React.Fragment key={i}>
                  <Box
                    px={4}
                    py={3}
                    borderBottomWidth={i < reviewData.quality.length - 1 ? "1px" : "0"}
                    borderColor="border-color"
                  >
                    {row.criteria}
                  </Box>
                  <Box
                    px={4}
                    py={3}
                    borderBottomWidth={i < reviewData.quality.length - 1 ? "1px" : "0"}
                    borderColor="border-color"
                  >
                    <Badge
                      colorScheme={
                        row.rating.includes("Exceeds") ? "green" :
                        row.rating.includes("Meets") ? "blue" :
                        "orange"
                      }
                    >
                      {row.rating}
                    </Badge>
                  </Box>
                </React.Fragment>
              ))}
            </Grid>
          </Box>

          {/* Comments */}
          <Box borderRadius="md" overflow="hidden">
            <Box bg="#F5A623" color="white" px={4} py={2} fontWeight="semibold">
              Comments
            </Box>
            <Box bg="app-bg-secondary" px={4} py={4} minH="80px">
              <Text fontSize="sm" color="text-primary" lineHeight="tall">
                {reviewData.comments}
              </Text>
            </Box>
          </Box>

          {/* Actions */}
          <Flex justify="flex-end" gap={4}>
            <HRMSButton
              variant="outline"
              colorScheme="blue"
              onClick={() => navigate("/performance")}
            >
              ← Back to Performance
            </HRMSButton>
            <HRMSButton
              colorScheme="blue"
              bgGradient="linear(to-r, #4A90E2, #B0B0B0)"
            >
              Download PDF
            </HRMSButton>
          </Flex>
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default PerformanceReviewDetailPage;
