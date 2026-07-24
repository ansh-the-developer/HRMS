import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import { Box, Flex, Text, VStack, Grid, Spinner, Badge } from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useQuery } from "@tanstack/react-query";
import { getPerformanceReviews } from "@/services/performanceApi";

const ActionCard = ({ title, subtitle, onProceed }) => (
  <Flex
    align="center"
    justify="space-between"
    borderWidth="1px"
    borderColor="border-color"
    borderRadius="lg"
    px={6}
    py={4}
    _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
    transition="all 0.2s"
  >
    <Box>
      <Text fontWeight="semibold" fontSize="sm">
        {title}
      </Text>
      <Text fontSize="xs" color="text-muted" mt={0.5}>
        {subtitle}
      </Text>
    </Box>
    <HRMSButton
      size="sm"
      bgGradient="linear(to-r, #4A90E2, #B0B0B0)"
      color="white"
      px={6}
      onClick={onProceed}
    >
      Proceed
    </HRMSButton>
  </Flex>
);

const PerformanceDashboardPage = () => {
  const navigate = useNavigate();

  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["performance-reviews"],
    queryFn: getPerformanceReviews,
  });

  // Get latest review (most recent by created_at)
  const latestReview = reviews?.[0];

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
            Error loading reviews: {error.message}
          </Text>
        </Box>
      </DashboardLayout>
    );
  }

  // Map Supabase data to UI shape
  const reviewData = latestReview
    ? {
        title: `${latestReview.employees?.name ?? "Employee"} — ${latestReview.period}`,
        knowledge: [
          { criteria: "Shows ability to learn and apply new skills", rating: getRatingText(latestReview.knowledge_score) },
          { criteria: "Requires minimal supervision", rating: getRatingText(latestReview.knowledge_score) },
          { criteria: "Displays understanding of roles and responsibilities", rating: getRatingText(latestReview.knowledge_score) },
        ],
        quality: [
          { criteria: "Looks for ways to improve quality", rating: getRatingText(latestReview.quality_score) },
          { criteria: "Performs full range of duties", rating: getRatingText(latestReview.quality_score) },
          { criteria: "Meets required deadlines", rating: getRatingText(latestReview.quality_score) },
        ],
        comments: latestReview.comments || "No comments provided.",
      }
    : null;

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
          {latestReview ? (
            <>
              <Flex align="center" gap={3}>
                <Text fontSize="lg" fontWeight="bold">
                  {reviewData.title}
                </Text>
                <Badge colorScheme="green" fontSize="xs">
                  {latestReview.status}
                </Badge>
              </Flex>

              {/* Knowledge of job skills */}
              <Box borderRadius="md" overflow="hidden" shadow="sm">
                <Grid templateColumns="2fr 1fr">
                  <Box bg="#D4A017" color="white" px={4} py={2} fontWeight="semibold">
                    Knowledge of job skills
                  </Box>
                  <Box bg="app-bg-secondary" px={4} py={2} fontWeight="semibold" color="text-secondary">
                    Rating
                  </Box>
                </Grid>
                <Grid templateColumns="2fr 1fr">
                  {reviewData.knowledge.map((row, i) => (
                    <React.Fragment key={i}>
                      <Box
                        px={4}
                        py={3}
                        borderBottomWidth="1px"
                        borderColor="border-color"
                        bg="card-bg"
                        fontSize="sm"
                      >
                        {row.criteria}
                      </Box>
                      <Box
                        px={4}
                        py={3}
                        borderBottomWidth="1px"
                        borderColor="border-color"
                        bg="card-bg"
                        fontSize="sm"
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
              <Box borderRadius="md" overflow="hidden" shadow="sm">
                <Grid templateColumns="2fr 1fr">
                  <Box bg="#4CAF50" color="white" px={4} py={2} fontWeight="semibold">
                    Quality/quantity of work
                  </Box>
                  <Box bg="app-bg-secondary" px={4} py={2} fontWeight="semibold" color="text-secondary">
                    Rating
                  </Box>
                </Grid>
                <Grid templateColumns="2fr 1fr">
                  {reviewData.quality.map((row, i) => (
                    <React.Fragment key={i}>
                      <Box
                        px={4}
                        py={3}
                        borderBottomWidth="1px"
                        borderColor="border-color"
                        bg="card-bg"
                        fontSize="sm"
                      >
                        {row.criteria}
                      </Box>
                      <Box
                        px={4}
                        py={3}
                        borderBottomWidth="1px"
                        borderColor="border-color"
                        bg="card-bg"
                        fontSize="sm"
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
              <Box borderRadius="md" overflow="hidden" shadow="sm">
                <Box bg="#E07B54" color="white" px={4} py={2} fontWeight="semibold">
                  Comments
                </Box>
                <Box bg="card-bg" px={4} py={4} borderWidth="1px" borderColor="border-color" minH="80px">
                  <Text fontSize="sm" color="text-primary" lineHeight="tall">
                    {reviewData.comments}
                  </Text>
                </Box>
              </Box>
            </>
          ) : (
            <Box textAlign="center" py={16} color="text-muted">
              <Text fontSize="lg" fontWeight="medium" mb={2}>
                No performance reviews yet
              </Text>
              <Text fontSize="sm">
                Your first review will appear here once created
              </Text>
            </Box>
          )}

          {/* Action cards */}
          <VStack align="stretch" spacing={3} pt={4}>
            <ActionCard
              title="Check previous reviews"
              subtitle="View your performance history"
              onProceed={() => navigate("/performance/history")}
            />
            <ActionCard
              title="Initiate Performance Review"
              subtitle="Start new review process"
              onProceed={() => navigate("/performance/new")}
            />
          </VStack>
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default PerformanceDashboardPage;
