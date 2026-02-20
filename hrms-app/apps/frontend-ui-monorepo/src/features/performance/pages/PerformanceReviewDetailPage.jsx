import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import { Box, Flex, Text, VStack, Grid } from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

const reviewData = {
  "q1-2025": {
    title: "Performance Review Q1 2025",
    knowledge: [
      { criteria: "Shows ability to learn and apply new skills", rating: "Exceeds expectations" },
      { criteria: "Displays understanding of roles and responsibilities", rating: "Exceeds expectations" },
    ],
    quality: [
      { criteria: "Looks for ways to improve quality", rating: "Needs development" },
      { criteria: "Meets required deadlines", rating: "Exceeds expectations" },
    ],
    comments:
      "Sally showed initiative this quarter in her new role as content marketing specialist. She was motivated to learn new skills and collaborate with team members on high-priority projects.",
  },
  "q4-2024": {
    title: "Performance Review Q4 2024",
    knowledge: [
      { criteria: "Shows ability to learn and apply new skills", rating: "Meets expectations" },
      { criteria: "Displays understanding of roles and responsibilities", rating: "Meets expectations" },
    ],
    quality: [
      { criteria: "Looks for ways to improve quality", rating: "Meets expectations" },
      { criteria: "Meets required deadlines", rating: "Meets expectations" },
    ],
    comments: "Consistent performance throughout the quarter with steady improvement in quality of deliverables.",
  },
};

const PerformanceReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const review = reviewData[id] || reviewData["q1-2025"];

  return (
    <DashboardLayout pageTitle="Performance">
      <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
        <VStack align="stretch" spacing={6}>
          <Text fontSize="lg" fontWeight="bold">
            {review.title}
          </Text>

          {/* Knowledge of job skills */}
          <Box borderRadius="md" overflow="hidden">
            <Box bg="#F5A623" color="white" px={4} py={2} fontWeight="semibold">
              Knowledge of job skills
            </Box>
            <Grid templateColumns="2fr 1fr" bg="gray.50">
              {review.knowledge.map((row, i) => (
                <React.Fragment key={i}>
                  <Box
                    px={4}
                    py={2}
                    borderBottomWidth={i < review.knowledge.length - 1 ? "1px" : "0"}
                    borderColor="gray.200"
                  >
                    {row.criteria}
                  </Box>
                  <Box
                    px={4}
                    py={2}
                    borderBottomWidth={i < review.knowledge.length - 1 ? "1px" : "0"}
                    borderColor="gray.200"
                  >
                    {row.rating}
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
            <Grid templateColumns="2fr 1fr" bg="gray.50">
              {review.quality.map((row, i) => (
                <React.Fragment key={i}>
                  <Box
                    px={4}
                    py={2}
                    borderBottomWidth={i < review.quality.length - 1 ? "1px" : "0"}
                    borderColor="gray.200"
                  >
                    {row.criteria}
                  </Box>
                  <Box
                    px={4}
                    py={2}
                    borderBottomWidth={i < review.quality.length - 1 ? "1px" : "0"}
                    borderColor="gray.200"
                  >
                    {row.rating}
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
            <Box bg="gray.50" px={4} py={4} minH="80px">
              <Text fontSize="sm" color="gray.800">
                {review.comments}
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
              Back
            </HRMSButton>
            <HRMSButton
              colorScheme="blue"
              bgGradient="linear(to-r, #4A90E2, #B0B0B0)"
            >
              Download
            </HRMSButton>
          </Flex>
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default PerformanceReviewDetailPage;
