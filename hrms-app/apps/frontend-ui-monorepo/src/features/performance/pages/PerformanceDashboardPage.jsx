// src/features/performance/pages/PerformanceDashboardPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import { Box, Flex, Text, VStack, Grid } from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

const latestReview = {
  title: "Performance Review Q1 2025",
  knowledge: [
    { criteria: "Shows ability to learn and apply new skills", rating: "Exceeds expectations" },
    { criteria: "Requires minimal supervision", rating: "Often exceeds expectations" },
    { criteria: "Displays understanding of roles and responsibilities", rating: "Exceeds expectations" },
  ],
  quality: [
    { criteria: "Looks for ways to improve quality", rating: "Needs development" },
    { criteria: "Performs full range of duties", rating: "Exceeds expectations" },
    { criteria: "Meets required deadlines", rating: "Exceeds expectations" },
  ],
  comments:
    "Sally showed initiative this quarter in her new role as content marketing specialist. She was motivated to learn new skills and collaborate with team members on high-priority projects.",
};

const ActionCard = ({ title, subtitle, onProceed }) => (
  <Flex
    align="center"
    justify="space-between"
    borderWidth="1px"
    borderColor="gray.200"
    borderRadius="lg"
    px={6}
    py={4}
  >
    <Box>
      <Text fontWeight="semibold" fontSize="sm">
        {title}
      </Text>
      <Text fontSize="xs" color="gray.500" mt={0.5}>
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

  return (
    <DashboardLayout pageTitle="Performance">
      <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
        <VStack align="stretch" spacing={6}>
          <Text fontSize="lg" fontWeight="bold">
            {latestReview.title}
          </Text>

          {/* Knowledge of job skills */}
          <Box borderRadius="md" overflow="hidden">
            <Grid templateColumns="2fr 1fr">
              <Box bg="#D4A017" color="white" px={4} py={2} fontWeight="semibold">
                Knowledge of job skills
              </Box>
              <Box bg="gray.100" px={4} py={2} fontWeight="semibold" color="gray.700">
                Rating
              </Box>
            </Grid>
            <Grid templateColumns="2fr 1fr">
              {latestReview.knowledge.map((row, i) => (
                <React.Fragment key={i}>
                  <Box
                    px={4}
                    py={2}
                    borderBottomWidth="1px"
                    borderColor="gray.100"
                    bg="white"
                    fontSize="sm"
                  >
                    {row.criteria}
                  </Box>
                  <Box
                    px={4}
                    py={2}
                    borderBottomWidth="1px"
                    borderColor="gray.100"
                    bg="white"
                    fontSize="sm"
                  >
                    {row.rating}
                  </Box>
                </React.Fragment>
              ))}
            </Grid>
          </Box>

          {/* Quality / quantity of work */}
          <Box borderRadius="md" overflow="hidden">
            <Grid templateColumns="2fr 1fr">
              <Box bg="#4CAF50" color="white" px={4} py={2} fontWeight="semibold">
                Quality/quantity of work
              </Box>
              <Box bg="gray.100" px={4} py={2} fontWeight="semibold" color="gray.700" />
            </Grid>
            <Grid templateColumns="2fr 1fr">
              {latestReview.quality.map((row, i) => (
                <React.Fragment key={i}>
                  <Box
                    px={4}
                    py={2}
                    borderBottomWidth="1px"
                    borderColor="gray.100"
                    bg="white"
                    fontSize="sm"
                  >
                    {row.criteria}
                  </Box>
                  <Box
                    px={4}
                    py={2}
                    borderBottomWidth="1px"
                    borderColor="gray.100"
                    bg="white"
                    fontSize="sm"
                  >
                    {row.rating}
                  </Box>
                </React.Fragment>
              ))}
            </Grid>
          </Box>

          {/* Comments */}
          <Box borderRadius="md" overflow="hidden">
            <Box bg="#E07B54" color="white" px={4} py={2} fontWeight="semibold">
              Comments
            </Box>
            <Box bg="white" px={4} py={4} borderWidth="1px" borderColor="gray.100" minH="80px">
              <Text fontSize="sm" color="gray.800">
                {latestReview.comments}
              </Text>
            </Box>
          </Box>

          {/* Action cards */}
          <VStack align="stretch" spacing={3} pt={2}>
            <ActionCard
              title="Check previous reviews"
              subtitle="Check your previous review"
              onProceed={() => navigate("/performance/history")}
            />
            <ActionCard
              title="Initiate Performance Review"
              subtitle="Review and Employee Performance"
              onProceed={() => navigate("/performance/new")}
            />
          </VStack>
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default PerformanceDashboardPage;
