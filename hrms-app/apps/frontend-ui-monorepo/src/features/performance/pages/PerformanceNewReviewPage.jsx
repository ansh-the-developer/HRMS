import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import {
  Box,
  Flex,
  Text,
  VStack,
  Grid,
  Input,
  Select,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEmployees, createPerformanceReview } from "@/services/performanceApi";

const PerformanceNewReviewPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [period, setPeriod] = useState("Q1 2026");
  const [employeeId, setEmployeeId] = useState("");
  const [knowledgeScore, setKnowledgeScore] = useState("");
  const [qualityScore, setQualityScore] = useState("");
  const [comments, setComments] = useState("");

  // Fetch employees for dropdown
  const {
    data: employees,
    isLoading: employeesLoading,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  // Submit mutation
  const createMutation = useMutation({
    mutationFn: createPerformanceReview,
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Performance review created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["performance-reviews"] });
      navigate("/performance");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!employeeId || !knowledgeScore || !qualityScore) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    const payload = {
      employee_id: employeeId,
      period,
      knowledge_score: parseInt(knowledgeScore),
      quality_score: parseInt(qualityScore),
      comments,
      status: "Submitted",
    };

    createMutation.mutate(payload);
  };

  if (employeesLoading) {
    return (
      <DashboardLayout pageTitle="Performance">
        <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
          <Flex justify="center" py={16}>
            <Spinner size="lg" />
          </Flex>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Performance">
      <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
        <form onSubmit={handleSubmit}>
          <VStack align="stretch" spacing={8}>
            <VStack align="flex-start" spacing={4}>
              <Flex align="center" gap={4}>
                <Text fontSize="sm" fontWeight="semibold">
                  Quarter:
                </Text>
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  size="sm"
                  maxW="220px"
                  bg="gray.50"
                  border="none"
                >
                  <option>Q1 2026</option>
                  <option>Q2 2026</option>
                  <option>Q3 2026</option>
                  <option>Q4 2026</option>
                  <option>Annual 2026</option>
                </Select>
              </Flex>

              <Flex align="center" gap={4}>
                <Text fontSize="sm" fontWeight="semibold">
                  Employee:
                </Text>
                <Select
                  placeholder="Choose employee"
                  size="sm"
                  maxW="220px"
                  bg="gray.50"
                  border="none"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                >
                  {employees?.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.email})
                    </option>
                  ))}
                </Select>
              </Flex>
            </VStack>

            {/* Knowledge Section */}
            <Box borderRadius="md" overflow="hidden" shadow="sm">
              <Grid templateColumns="2fr 1fr">
                <Box
                  bg="#4A90E2"
                  color="white"
                  px={4}
                  py={2}
                  fontWeight="semibold"
                  borderRightWidth="1px"
                  borderColor="whiteAlpha.400"
                >
                  Knowledge of job skills
                </Box>
                <Box
                  bg="#4A90E2"
                  color="white"
                  px={4}
                  py={2}
                  fontWeight="semibold"
                >
                  Overall Score (1-5)
                </Box>
              </Grid>
              <Grid templateColumns="2fr 1fr" bg="#E2E5EA">
                <Box px={4} py={4} fontSize="sm">
                  Overall knowledge rating for the period
                </Box>
                <Box px={4} py={4}>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    size="sm"
                    bg="white"
                    placeholder="1-5"
                    value={knowledgeScore}
                    onChange={(e) => setKnowledgeScore(e.target.value)}
                    required
                  />
                </Box>
              </Grid>
            </Box>

            {/* Quality Section */}
            <Box borderRadius="md" overflow="hidden" shadow="sm">
              <Grid templateColumns="2fr 1fr">
                <Box
                  bg="#4A90E2"
                  color="white"
                  px={4}
                  py={2}
                  fontWeight="semibold"
                  borderRightWidth="1px"
                  borderColor="whiteAlpha.400"
                >
                  Quality / quantity of work
                </Box>
                <Box
                  bg="#4A90E2"
                  color="white"
                  px={4}
                  py={2}
                  fontWeight="semibold"
                >
                  Overall Score (1-5)
                </Box>
              </Grid>
              <Grid templateColumns="2fr 1fr" bg="#E2E5EA">
                <Box px={4} py={4} fontSize="sm">
                  Overall quality rating for the period
                </Box>
                <Box px={4} py={4}>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    size="sm"
                    bg="white"
                    placeholder="1-5"
                    value={qualityScore}
                    onChange={(e) => setQualityScore(e.target.value)}
                    required
                  />
                </Box>
              </Grid>
            </Box>

            {/* Comments */}
            <Box borderRadius="md" overflow="hidden" shadow="sm">
              <Grid templateColumns="2fr 1fr">
                <Box
                  bg="#4A90E2"
                  color="white"
                  px={4}
                  py={2}
                  fontWeight="semibold"
                >
                  Comments
                </Box>
                <Box bg="#4A90E2" />
              </Grid>
              <Box bg="#E2E5EA" px={4} py={3}>
                <Input
                  as="textarea"
                  rows={4}
                  size="sm"
                  bg="white"
                  placeholder="Write overall comments about performance..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </Box>
            </Box>

            {/* Submit Button */}
            <Flex justify="flex-end" gap={4}>
              <HRMSButton
                variant="outline"
                onClick={() => navigate("/performance")}
              >
                Cancel
              </HRMSButton>
              <HRMSButton
                type="submit"
                colorScheme="blue"
                bgGradient="linear(to-r, #4A90E2, #B0B0B0)"
                isLoading={createMutation.isPending}
                isDisabled={!employeeId || !knowledgeScore || !qualityScore}
              >
                Submit Review
              </HRMSButton>
            </Flex>
          </VStack>
        </form>
      </Box>
    </DashboardLayout>
  );
};

export default PerformanceNewReviewPage;
